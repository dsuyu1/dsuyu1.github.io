---
layout: post
title:  "Simplified Security Visibility: CloudWatch Unified Data Store"
date:   2026-07-27 00:00:00 +0000
categories: [aws]
---

## Overview
In this project, the goal is to learn how to centralize, query, and act on security telemetry using CloudWatch's Unified Data Store. I'll be walking through some hands-on labs that cover CloudTrail ingestion, interactive security analytics with Logs Insights, anomaly detection, and cross-source investigation scenarios.

This project was built as part of AWS's Security Visibility and Analytics Activation Day. Security Visibility and Analytics Activation Day provides hands-on experience with AWS CloudTrail Events in the Amazon CloudWatch unified data store. Learn to capture account activity and resource operations for auditing, compliance, and troubleshooting.
**Topics**: Analytics, Cloud Operations, Security, Identity, and Compliance
**AWS Services**: Amazon CloudWatch Logs, Amazon CloudWatch, AWS CloudTrail

## Introduction
**Amazon CloudWatch unified data store (UDS)** ingests security log sources from AWS Cloudtrail, S3, VPC Flow Logs, AWS WAF,a nd DNS in Route 53.

### Reviewing telemetry collection
Telemetry **enablement rules**