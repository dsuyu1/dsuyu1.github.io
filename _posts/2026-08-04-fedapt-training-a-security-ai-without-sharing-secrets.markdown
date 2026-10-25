---
layout: post
title:  "FeDAPT: Can Rival Security Teams Train One AI Without Sharing Their Secrets?"
date:   2026-08-04 12:00:00 +0000
tags: [ongoing, project, security, ai, federated-learning, llm]
---

## The problem I keep running into

Security Operations Centers (SOCs) are drowning. Analysts have to make sense of a firehose of telemetry that spans wildly different worlds — endpoint process trees from Sysmon, network traffic from Zeek, cloud audit logs from AWS CloudTrail — and they have to do it fast, at 2 AM, while three other alerts are screaming for attention.

Large Language Models look like a natural fit here: an assistant that can read a nasty log snippet and explain, in plain English, "here's what's happening and why it's suspicious." But if you try to actually build one, you smack into two walls almost immediately.

**Wall one: specialization vs. privacy.** No single organization has enough variety in its own logs to train a well-rounded security assistant. The obvious fix — pool everyone's telemetry into one big training set — is a non-starter. That data is some of the most sensitive stuff an org owns. GDPR, HIPAA, customer contracts, and plain competitive paranoia all say *no, you cannot ship your raw logs to a shared training server.*

**Wall two: logs aren't language.** A raw Sysmon XML blob or a CloudTrail JSON event has no natural-language explanation attached to it. A good assistant has to bridge the gap between the machine artifact and the human sentence.

So I've been building a research project this summer to chip away at exactly this. I'm calling it **FeDAPT** — Federated Domain-Adaptive Pre-Training. The question at the center of it is simple to state and annoyingly hard to answer:

> *Can a network of security organizations collaboratively train a better security-assistant LLM without any of them sharing their private data?*

This post is a build log, not a victory lap. The framework and the whole data-and-evaluation pipeline are built and tested; the big training experiments are still ahead of me. I want to walk through the design decisions I'm proud of, and — because this blog is about what I *build and break* — the things that broke along the way.

## The core idea: split knowledge from grounding

The trick that makes FeDAPT work is a clean split between two kinds of data.

- **Shared knowledge is prose.** Public, natural-language security text — MITRE ATT&CK write-ups, Sigma detection-rule descriptions, CVE summaries, CISA advisories, vendor threat reports. This teaches the model security *language and reasoning*. It's public, so it's safe to pool.
- **Private grounding is logs.** Each organization's raw telemetry. This is the sensitive stuff, and it *never leaves the building.*

Once you see the data that way, the architecture falls out of it naturally. FeDAPT runs in two stages:

**Stage 1 — Federated pre-training on prose (the collaboration).** Every participating org trains on the shared prose corpus, but instead of sending their data anywhere, they only send tiny model *updates* to a coordinating server, which averages them into one shared adapter. The raw text stays put; only the learned weights travel. This is the only stage where anything crosses an organization's boundary.

**Stage 2 — Local tuning on logs (the private part).** Each org takes that shared adapter and fine-tunes it *locally* on its own log-to-explanation examples. The logs stay home. The org ends up with an assistant that knows general security reasoning *and* is grounded in its own environment.

To keep this cheap enough to actually run, the model only ever trains small LoRA adapters on top of a frozen 7-billion-parameter base — so we're moving megabytes of adapter weights around, not gigabytes of full models.

## How do you prove the collaboration was worth it?

This is the part I care about most, because it's easy to hand-wave. If FeDAPT just "seems better," that's worthless. So the whole study is built around one controlled comparison. I train the *exact same* final task-tuning step from four different starting points:

- **A — no pre-training at all.**
- **B — the org pre-trained *alone* on its own slice of prose.**
- **C — the org used the *federated* shared adapter.**
- **D — a fantasy world where everyone pooled data into one central model (the ceiling if privacy were free).**

Only the starting point changes, so any difference in the final assistant is attributable to it. The number I'm chasing is **C minus B**: the gap between using the federated model and going it alone. That single number *is* the value of joining the network — the whole premise of the project stands or falls on it.

## Making it trustworthy (this is where it gets fun)

A federated system that only works when everyone is honest and nothing leaks isn't a security system. So a big chunk of the work is the adversarial and privacy machinery:

- **Differential privacy.** Before an org's update is shared, it gets clipped and dosed with calibrated noise, and a proper accountant (Opacus's RDP) tracks the exact privacy budget spent. So even the *weight updates* can't be reverse-engineered back into someone's data.
- **Byzantine robustness.** What if one of the "organizations" is malicious — sending poisoned updates to wreck the shared model? I simulate that (sign-flipping, blowing up the update magnitude, random noise, and data poisoning) and pit plain averaging against robust aggregators like Krum and trimmed-mean. The story I expect: plain averaging collapses under attack; the robust ones hold.

And then there's the honesty tax — the stuff that's tempting to sweep under the rug:

- **The labels are messier than they look.** My attack telemetry (from Splunk's public `attack_data`) is labeled at the *whole-capture* level, not per line. A single capture is mostly normal background noise with an attack buried in it somewhere. So I reframed the "is this bad?" task honestly: *does this activity contain evidence of an attack?* — not "is this exact line malicious," which the labels can't actually support.
- **Grading free-form answers is hard.** You can't score "explain this log" with a simple string match. So the primary metric is an **LLM-as-a-judge** (following a method called CLEV): a separate, independent model reads the answer against a reference and votes correct/incorrect. But — and this is the part people skip — *you have to validate the judge against a human first.* I built the tooling to hand-label ~50 examples and measure whether the judge actually agrees with me (Cohen's κ and macro-F1) before trusting a single number it produces.

## What broke

Per the theme of this blog. A few of my favorites:

**The silent bug that quietly poisoned my data.** I use a strong "teacher" model to synthesize the training targets. One long run generated beautiful outputs for three of my four tasks — and then, when I inspected the fourth, *every single one of the 400 examples* was a useless one-line template. The teacher had hit an API rate limit partway through, every call errored, and my code was **silently swallowing the errors and falling back to a placeholder.** I only found it because I audited the data by hand. Lesson burned in: never let a failure fall back silently. I added retry-with-backoff *and* a loud "X of Y targets fell back!" warning so a future run can't hide this from me.

**The git-LFS pointer trap.** My attack data lives in a ~9 GB git-LFS repo, so I only pulled a subset. Problem: the files I *didn't* pull still exist on disk — as tiny "pointer" stub files. My loader happily read those stubs and turned `version https://git-lfs.github.com/...` into fake "log records." So I nearly trained on git plumbing text labeled as security telemetry. Now the loader detects and skips LFS pointers.

**The Attack Range yak-shave.** I still needed *benign* logs (the "this is normal" class) to balance the malicious ones, and the clean way to get them is to stand up a lab with Splunk's Attack Range. That turned into an afternoon of: Docker Compose plugin missing → Docker daemon not running → a credential-helper that didn't exist → Windows `$HOME` isn't a thing → cloud instances that boot but won't accept connections. I got the range running in AWS and I'm still fighting to pull the logs out of it. The honest takeaway I wrote into my own docs: sometimes the "proper" path is a rabbit hole, and a local Sysmon capture on one machine gets you 80% of the value with none of the cloud bill.

## Where it's at, and what's next

Right now: the full pipeline exists as a clean, tested Python package — data collection, the non-IID split across six simulated organizations, the four tasks, the federated training loop, differential privacy, the Byzantine attacks, and the judge. Roughly 35,000 documents of security prose and a few hundred labeled log examples are built and audited. There's a one-command "smoke test" that runs the entire thing end-to-end on a tiny config so I can catch integration bugs before spending real GPU hours.

What's left is the actual research: getting the benign logs in, running the full experiment matrix on a GPU across multiple seeds, and reading off that C−B number. If federated pre-training recovers most of the centralized ceiling while every org's logs stay home, that's the result. If it doesn't, that's *also* a result — an honest, still-interesting one.

I'm planning to open-source the whole thing soon. If the idea of "rival organizations pooling knowledge without pooling secrets" is interesting to you, I'd love to hear it — and I'll post the repo and the numbers here once the runs are done.
