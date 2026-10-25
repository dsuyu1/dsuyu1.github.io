---
layout: page
title: Research
permalink: /research/
description: Damian Villarreal's research on network detection and response.
---

I work on network detection and response (NDR) research at UTRGV.

## Benign-behavior transfer in federated network detection
Organizations want to train network anomaly detectors together without handing
over raw traffic. Federated learning allows that, but sharing a model also
shares each site's idea of what normal traffic looks like. My current work
measures when that shared benign behavior helps a detector and when it quietly
hurts one, the failure mode known as negative transfer.

The study uses a three-organization testbed with verified traffic labels and
compares federated training against local-only and shared-encoder baselines,
scoring each on detection recall against false alerts per host-day.

- Live progress: [flndr.damianvillarreal.com](https://flndr.damianvillarreal.com)
- Advisor: Dr. Sergei Chuprov
- Target: conference submission, December 2026

## Does filling sensor gaps help intrusion detection?
Network sensors sometimes stop reporting, which leaves gaps in the data an
intrusion detector depends on. I tested whether an AI model that fills those
gaps (CSDI, a diffusion model) helps catch attacks better than simpler fixes.

So far the answer is no. A detector trained to expect gaps does as well or
better at a fraction of the cost, and the gap filler ran about 200 times slower
at inference while still losing on the sealed test. The useful takeaway is a
negative one: teach the detector about missing data instead of repairing the
data first.

- Course research project, CSCI 6379
- Tested on sealed CTU-13 scenarios under rules fixed before scoring
