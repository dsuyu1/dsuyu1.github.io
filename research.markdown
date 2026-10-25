---
layout: page
title: Research
permalink: /research/
description: Damian Villarreal's research on federated learning for network detection and response.
---

I work on federated learning for network detection and response with Dr. Sergei
Chuprov at UTRGV.

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
