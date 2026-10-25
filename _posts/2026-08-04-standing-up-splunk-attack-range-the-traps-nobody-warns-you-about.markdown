---
layout: post
title:  "Using Splunk's Attack Range for Research"
date:   2026-08-04 15:00:00 +0000
tags: [security, splunk, homelab, logs, notes]
---

## Why I was doing this at all

I'm building a research project this summer that needs security *logs*, which are the raw machine exhaust that a Security Operations Center actually stares at. Endpoint process trees from Sysmon, Windows security events, cloud audit trails. The catch is that I need two kinds: **malicious** logs (an attack is happening) and **benign** logs (a normal, boring Tuesday). The malicious side is easy — Splunk publishes a big public dataset of attack captures. The benign side is where it gets interesting, and it's why I ended up spending an afternoon fighting **Splunk Attack Range**.

Attack Range is a project that stands up a small, throwaway lab — a Windows box, a Splunk server, some plumbing — lets you either sit there and generate *normal* activity or *run real attacks against it*, and forwards everything into Splunk so you can export the logs. It's a fantastic idea. It's also a gauntlet of small, undocumented failures, and this post is a map of every landmine I stepped on so you don't have to.

Fair warning: this is a build log, not a "look how clean this was" tutorial. I got the range running and I'm still pulling data out of it. But every trap below is one I actually hit, with the actual fix.

## The trap that matters most (read this even if you skip the rest)

Before any of the plumbing, here's the conceptual landmine, because it's the one that will quietly ruin your results while everything *looks* fine.

If your **benign** logs come from your clean home lab, and your **malicious** logs come from someone else's public dataset, a machine-learning model doesn't have to learn "attack vs. normal." It can just learn to tell the two *environments* apart — different hostnames, different org IDs, different timestamp formats, different Splunk quirks. Your accuracy looks great. It's a mirage. You built an environment detector, not an attack detector, and a reviewer will find it in about four seconds.

The fix is annoying but non-negotiable: **get both classes from the same environment.** That's the whole reason I'm using Attack Range instead of just grabbing a public benign dataset. Build one range, capture a benign window, then run attacks *against that same range* and capture a malicious window. Now the only thing that differs between your two classes is the thing you actually care about.

Okay. On to the plumbing.

## Where it actually breaks

### Docker Compose isn't installed (even though Docker is)

Attack Range v5 runs as a set of Docker containers. So step one is `docker compose up`, and step one immediately fails because the Compose *plugin* isn't there even though Docker is. Modern Docker split Compose into a plugin; on some setups you get the engine without it. Install the Compose plugin (or Docker Desktop, which bundles it) before you do anything else.

### The Docker daemon isn't running

The next error looks scary and network-y, but it just means the Docker engine isn't up. On Windows that means Docker Desktop literally isn't launched. Start it, wait for the whale icon to stop animating, then retry. Embarrassingly simple, cost me more time than it should have because the error message points you at everything *except* "the app isn't open."

### `$HOME` isn't a thing on Windows

Attack Range assumes a Unix-y world and reaches for `$HOME`. On Windows PowerShell there's no `$HOME` the way the tooling expects, so config lookups quietly point at nowhere. The fix:

```powershell
$env:HOME = $env:USERPROFILE
```

Set that in the same shell you're running everything from. Half the "file not found / can't find credentials" weirdness after this point traces back to this one missing variable.

### The credential helper that doesn't exist

This one's a gem. Docker's config tries to use a credential *helper* to store login credentials securely — mine was set to `credsStore: "desktop"`, pointing at a helper binary that wasn't actually on my machine. Every Docker operation that touches credentials then dies with an opaque `docker-credential-desktop not found` error.

Two fixes: either put the helper on your `PATH`, or just open `~/.docker/config.json` and delete the `credsStore` line entirely. I deleted it. For a throwaway lab you do not need the secure credential store, and it unblocks everything downstream instantly.

### The range boots, but you can't connect to anything

This is the one that nearly broke me. I got the whole range built and running in AWS — instances up, green, healthy — and then tried to reach the machines through **Guacamole** (the web-based remote-desktop gateway it ships with) and got nothing but connection errors on both the Splunk box and the Windows host.

I burned a lot of time assuming the range was broken. It wasn't. **Guacamole was the problem, not the instances.** The moment I stopped trying to route through Guacamole and just hit the Splunk web UI *directly* at its own address (`http://<splunk-ip>:8000`), everything worked. I could search, I could see events, I could export. If your instances are running but Guacamole won't connect, skip Guacamole and go straight to the service's native port. Don't debug the gateway when you can just walk around it.

## Pulling the logs out

Once you're in the Splunk UI, the logs from every host get forwarded into one place, and you export by searching a time window and dumping raw events. Capture a *benign* window (leave the box alone, or better, do some normal work on it), note the start and end times, then search that window and export raw:

```
index=* sourcetype=XmlWinEventLog earliest=<benign_start> latest=<benign_end>
| table _raw
```

One thing that tripped me: the search view paginates, so a result set can *look* capped when it isn't. If you want the honest count, ask for it directly — `... | stats count` — instead of trusting the number of rows you can scroll through. And don't capture from a totally idle machine; an untouched box just emits the same background heartbeat over and over, and "benign = boring" is too easy a pattern. Generate some real activity first so your normal class looks like actual work.

Then do it again for a *malicious* window: run an attack simulation against the same range (Atomic Red Team techniques like PowerShell execution or credential dumping light up the logs nicely), note *that* window, and export it too. Matched pairs, same environment, problem solved.

## The honest takeaway

Attack Range is the "right" way to do this, and when it works it's genuinely great — matched benign and malicious telemetry from one clean environment is exactly what the science needs. But it is a *cloud* tool with a *cloud* bill and a long tail of small failures, and I want to be honest that I spent an afternoon yak-shaving Docker before I got a single log out of it.

So here's the thing I wrote into my own project docs, and I'll say it here too: sometimes the proper path is a rabbit hole. If all you need is benign *endpoint* data and you don't need the cloud or network domains, a plain Windows VM with **Sysmon** installed, doing normal activity for an hour, gets you maybe 80% of the value with none of the setup pain and none of the AWS charges. Reach for the full range when you specifically need matched attack-and-benign pairs from one environment — which, in my case, I do. For everything else, the boring local option is often the smart one.

I'll update this once I've fully pulled my matched dataset out and fed it into the project. If you're standing up Attack Range yourself and hit a wall I didn't list here, tell me — I'll add it to the map.
