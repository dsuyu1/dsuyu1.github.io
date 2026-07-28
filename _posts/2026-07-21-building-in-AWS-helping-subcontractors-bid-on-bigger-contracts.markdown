---
layout: post
title:  "Building in AWS: Helping Subcontractors Bid on Bigger Contracts"
date:   2026-07-22 01:09:00 +0000
categories: [aws]
---

## Introduction

Construction in the Rio Grande Valley (RGV) is becoming a bigger and bigger market to keep our eyes on, whether you're looking to pivot into a profitable market, looking for employment, or finding leads for your business. As an RGV native, it's hard not to notice the construction happening left and right as our once-small community rushes to modernize and take advantage of our unique geo locality.

I would be lying if I said I didn't want a piece of the pie before the party got too busy. However, more than just financial motivations, I want to help the place I grew up grow to be the powerhouse of the south, and maybe one day, we can reach the levels of bigger cities like Austin or Houston. Elon Musk and SpaceX inspired many to begin the race to the top, and I want to help our construction and manufacturing communities get there. I don't want us to be left out of the game.

### Defining the hierarchy
Before we tackle our problem, it's important to learn a bit more about how the industry works - specifically, the relationship between owners, general contractors, and subcontractors.
- Owners are those who fund the big project, like a new hospital, bank, power plant, sports facility, etc.
- General contractors (GCs) are a rung below them and are brought onto the project to manage it all. GCs **subcontract** out specific pieces of work, like electrical or plumbing, to specialized trade companies - **subcontractors**.
- Subcontractors (subs) are businesses that usually specialize in a trade, like roofing, tiling, welding, electrical, etc. They are hired by the GC to complete a specific scope of work.

### Deciding who gets subcontracts
The GC and owners decide who gets subcontracts. Because liability and risk fall upon the shoulders of the aforementioned stakeholders, they set strict rules as to who is able to receive subcontracts. This is where **compliance checklists come in**. Owners and GCs outsource the compliance vetting to third-party compliance platforms like ISNetworld, Avetta, or Veriforce. These platforms act as keepers to the gate. 
- If the sub is in good standing and fulfills all the points on the list, they pass!
- Otherwise, they'll get kicked off the job site or their bid will be blocked. Womp womp!

To be clear, again, these checklists come from the third-party compliance platforms. 

#### A note worth mentioning
For small residential jobs, you can probably get away with not having to go through all these loops. However, for bigger contracts, which so happens to be the title of this post, YES. You will absolutely need to go through some sort of vetting process to be able to bid and participate on bigger pieces of pie. 

### The idea and some questions
Given the context at hand, we can begin to imagine a gap between the checklists that third-party platforms provide and the subcontractor. This gap is: who will take charge of dealing with the checklists? The owner of the small business? What if they are busy with other operations? Do small businesses have dedicated risk management departments? How about all the confusing terminology and legal jargon included in these contracts; will small business owners be able to keep up? Can small businesses outsource and pay high prices for consultants?


### Problem statement

Small and mid-sized RGV subcontractors and specialty trades, like electrical, mechanical, HVAC, civil, and insulation, can't bid on GC or industrial work unless they're **prequalified** on platforms like ISNetworld, Avetta, or Veriforce. Therefore, (let's pretend) we've been tasked to create a system that keeps subcontractor paperwork current, up-to-date, and compliant with industry standards and regulations.

#### Our solution
We're going to build a single place for subcontractors to upload their compliance documents, see exactly where they stand against a given platform's requirements (like the aforementioned ISNetworld, Avetta, Veriforce, etc.), and get warned before anything expires. This solution will reduce the money spent on consultants and save time on keeping track of spreadsheets.

#### Target users
Our primary target users are small trade contractors (electrical, mechanical, HVAC, insulation, civil) in the 5-50 employee range in our region (South Texas). We expect our users to be making $500k-$10M/year in revenue and looking or already bidding on GC or industrial work. We want to help owners or office managers by taking compliance paperwork off their hands. This will allow these stakeholders to focus their efforts elsewhere and offload the cognitive overhead of keeping track of compliance to our system.

#### User stories
1. As a sub(contractor), I upload my [Certificate of Insurance](https://www.thehartford.com/business-insurance/certificate-of-insurance-coi) (COI), [OSHA 300](https://obis.osha.gov/recordkeeping/RKforms.html) log, and safety program, and the system tells me what's missing or non-compliant against a specific platform's checklist (e.g., ISNetworld).
2. As a sub, I get an email/SMS alert 30/14/7 days before a COI, license, or certification expires.
3. As a sub, I can ask in plain language, "Am I ready to bid on [hiring clients]'s program?" and get a clear yes/no plus a gap list.
4. As a sub, if I'm missing a written safety program or similar document, the system drafts a starting template I can review and customize rather than starting from a blank page.
5. As the founder, I can onboard a new sub in under 30 minutes and demo value in the first session. _(This is for us!)_

## MVP
[A minimum viable product (MVP) is the simplest version of a product that allows teams to validate ideas and gather feedback with minimal effort.](https://www.atlassian.com/agile/product-management/minimum-viable-product) MVPs reduce risk, inform future development, and will allow us to test the core features of the application with real users _(whom we will get to later! very exciting)._

### Functional requirements
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

### The plan
Using our user stories and highest priority requirements as a base, we can begin to identify some of the key services we'll need to make this project work:

#### 1. Uploading documents & storage
We'll use S3 for document storage, at rest and in transit (S3 & SSE-KMS + TLS 1.3 via HTTPS/API Gateway), and Aurora Postgres as our relational database.

#### 2. Field extraction
We need to extract fields, so we'll use a ML model for that (Textract).
- Specifically, we'll use Textract's Queries API or Analyze Document (Forms/Expense API)

#### 3. Document conversions
To compare documents values against hiring client checklists (like the aforementioned ISNetworld compliance rules), we can send the raw JSON from Textract into a normalization LLM call. Then, once the data is normalized, we can do math against our uploaded (now normalized) documents and the checklists (which will also be in JSON format). Finally, we'll have an explainer LLM call to explain the gaps to our user.

When a sub uploads a PDF (to S3), an S3 Event Notification will kick off an AWS Step Functions workflow that orchestrates Textract extraction → the normalization LLM call → the compliance comparison logic, in sequence. 

##### Explainer LLM
When users manually upload documents and click a "Compare now" button, the explainer will run. Users should also have the option to upload all their documents at once to some sort of storage repository and have the option to run Textract on all, some, or none automatically/on upload. 

In summary, the explainer runs on demand when a sub opens their gap report or hits some button. These design choices are up for debate, and once we get real users in front of the app, we can see where UI/UX can be improved.

#### 4. Notification system
We'll use Amazon EventBridge Scheduler to run cron jobs that query Aurora for upcoming expiration dates and publishes alerts via Amazon SNS/SES. This way, we can fulfill the requirement of getting the 30/14/7 day remaining notificaitons.

#### 5. User chat interface
We'll build a chat UI with Amplify backed by an API gateway and Lambda. Lambda will call Bedrock, and that will start the agentsth4e  off pulling context from our stores.

### Other features
#### 6. Authentication & multi-tenancy.
We'll use Cognito for auth/identity. To isolate our users from each other, we'll probably need to use something like S3 prefix-per-tenant with IAM. SSE-KMS + TLS will only cover data at rest and in transit but won't deliver on preventing data leakage.

And we'll stop at there for now. The goal for the project right now is just to have a working demo.

I'll build the MVP in 4 steps:

1. Storage and database setup
2. Textract + normalization pipeline
3. Automated expiration cron jobs
4. Chat interface

Let's begin!

---

## Building in AWS
