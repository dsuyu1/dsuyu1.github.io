---
layout: post
title:  "Building in AWS: Helping Subcontractors Bid on Bigger Contracts"
date:   2026-07-22 01:09:00 +0000
categories: [aws]
---

## Introduction

Construction in the Rio Grande Valley (RGV) is becoming a bigger and bigger market to keep our eyes on, whether you're looking to pivot into a profitable market, looking for employment, or finding leads for your business. As an RGV native, it's hard not to notice the construction happening left and right as our once-small community rushes to modernize and take advantage of our unique geolocality.

I would be lying if I said I didn't want a piece of the pie before the party got too busy. However, more than just financial motivations, I want to help the place I grew up grow to be the powerhouse of the south, and maybe one day, we can reach the levels of bigger cities like Austin or Houston. Elon Musk and SpaceX inspired many to begin the race to the top, and I want to help our construction and manufacturing communities get there. I don't want us to be left out of the game.

### Problem Statement

Small and mid-sized RGV subcontractors and specialty trades, like electrical, mechanical, HVAC, civil, and insulation, can't bid on GC or industrial work unless they're **prequalified** on platforms like ISNetworld, Avetta, or Veriforce. Therefore, (let's pretend) we've been tasked to create a system that keeps subcontractor paperwork current, up-to-date, and compliant with industry standards and regulations.

#### Our Solution
We're going to build a sinlge place for subcontractors to upload their compliance documents, see exactly where they stand against a given platform's requirements (like the aforementioned ISNetworld, Avetta, Veriforce, etc.), and get warned before anything expires. This solution will reduce the money spent on consultants and save time on keeping track of spreadsheets.

#### Target Users
Our primary target users are small trade contractors (electrical, mechanical, HVAC, insulation, civil) in the 5-50 employee range in our region (South Texas). We expect our users to be making $500k-$10M/year in revenue and looking or already bidding on GC or industrial work. We want to help owners or office managers by taking compliance paperwork off their hands. This will allow these stakeholders to focus their efforts elsewhere and offload the cognitive overhead of keeping track of compliance to our system.

#### User Stories
1. As a sub(contractor), I upload my [Certificate of Insurance](https://www.thehartford.com/business-insurance/certificate-of-insurance-coi) (COI), [OSHA 300](https://obis.osha.gov/recordkeeping/RKforms.html) log, and safety program, and the system tells me what's missing or non-compliant against a specific platform's checklist (e.g., ISNetworld).
2. As a sub, I get an email/SMS alert 30/14/7 days before a COI, license, or certification expires.
3. As a sub, I can ask in plain language, "Am I ready to bid on [hiring clients]'s program?" and get a clear yes/no plus a gap list.
4. As a sub, if I'm missing a written safety program or similar document, the system drafts a starting template I can review and customize rather than starting from a blank page.
5. As the founder, I can onboard a new sub in under 30 minutes and demo value in the first session. _(This is for us!)_

## MVP
[A minimum viable product (MVP) is the simplest version of a product that allows teams to validate ideas and gather feedback with minimal effort.](https://www.atlassian.com/agile/product-management/minimum-viable-product) MVPs reduce risk, inform future development, and will allow us to test the core features of the application with real users _(whom we will get to later! very exciting)._

### Functional Requirements
We will start with a handful of functional requirements. The requirements are in descending order from most priority to least priority. 

| # | Requirement                                                                                                  | Priority |
|---|--------------------------------------------------------------------------------------------------------------|----------|
 | 1 | Document uploads (PDFs or images) for COI, licenses, OSHA logs, safety programs.                             | P0       |
| 2 | Automated field extraction (Textract) for policy numbers, expiration dates, coverage limits, license numbers | P0       |
| 3 | Requirement-matching engine. We need to be able to compare extracted data against one hiring-platform's checklist (start with ISNetworld only) | P0 |
| 4 | Gap reporting, or a clear list of what's missing, expired, or insufficient | P0 |
| 5| Expiration alerts (email, SMS, all the time) | P0 |
| 6 | Conversational Q&A chat interface | P1 |
| 7 | Safety-program draft generation from a template or from a sub's own data | P1 |
| 8 | Multi-platform support (Avetta, Veriforce) | P2 | 
| 9 | GC-side view to vet a sub's compliance status (like a viewer mode) | P2 | 
| 10 | Direct submission/auto-fill to ISNetworld/Avetta/Veriforce | P2 |

### Building in AWS

Praesent at pellentesque augue. Nunc sed ullamcorper in justo sed, volutpat cursus orci. Etiam vitae sodales massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nibh quam, egestas eu eros molestie, eleifend viverra augue. Suspendisse potenti. Quisque commodo consectetur quam, non pretium orci viverra at. Maecenas eget iaculis nunc.

Praesent dui nibh, ullamcorper in justo sed, volutpat cursus orci. Etiam vitae sodales massa.

consectetur condimentum. Suspendisse pharetra purus urna, ac pretium mi elementum et. Praesent dui nibh, ullamcorper in justo sed, volutpat cursus orci. Etiam vitae sodales massa.

Praesent at pellentesque augue. Nunc sed ullamcorper risus. Duis tincidunt consectetur condimentum. Suspendisse pharetra purus urna, ac pretium mi elementum et. Praesent dui nibh, ullamcorper in justo sed, volutpat cursus orci. Etiam vitae sodales massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

Mi elementum et. Praesent dui nibh, ullamcorper in justo sed, volutpat cursus orci. Etiam vitae sodales massa. Cum sociis natoque penatibus et magnis dis parturient montes,

consectetur condimentum. Suspendisse pharetra purus urna, ac pretium mi elementum et. Praesent dui nibh, ullamcorper in justo sed, volutpat cursus orci. Etiam vitae sodales massa.

Praesent at pellentesque augue. Nunc sed ullamcorper risus. Duis tincidunt consectetur condimentum. Suspendisse pharetra purus urna, ac pretium mi elementum et. Praesent dui nibh, ullamcorper in justo sed, volutpat cursus orci. Etiam vitae sodales massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

Mi elementum et. Praesent dui nibh, ullamcorper in justo sed, volutpat cursus orci. Etiam vitae sodales massa. Cum sociis natoque penatibus et magnis dis parturient montes,
