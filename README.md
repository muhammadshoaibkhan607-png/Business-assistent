# OmniPulse AI — Autonomous Business & Customer Support Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React%2019-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google GenAI SDK](https://img.shields.io/badge/Google%20GenAI-Gemini%203.8%20Flash-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![Express.js](https://img.shields.io/badge/Node.js%20Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

> A production-ready AI Business Assistant platform architected for businesses seeking to automate customer support, eliminate repetitive inquiry overhead, and qualify inbound sales leads with strict anti-hallucination knowledge base grounding.

---

## 📌 Project Overview

OmniPulse AI demonstrates a commercial-grade, multi-tenant AI automation architecture designed for B2B SaaS, e-commerce, and professional service companies. 

Unlike basic generic chatbot wrappers, OmniPulse AI connects customer-facing communication channels with a centralized **Business Knowledge Base (Profile, Products & Pricing, FAQs, Policies & SLAs)**. Every customer inquiry is processed through an automated semantic triage pipeline that determines intent, calculates urgency, cites exact source documents, and provides human agents with one-click strategic replies.

---

## 💼 The Business Problem

Modern businesses face critical operational bottlenecks:
1. **High Tier-1 Support Costs**: 60% to 75% of customer support tickets represent repetitive questions regarding pricing tiers, refund terms, office hours, and technical SLAs.
2. **Slow Response Times & Lost Revenue**: Inbound leads requesting quotes or compliance details frequently wait 3 to 12 hours for an initial human response, significantly decreasing deal velocity.
3. **Chatbot Hallucination Liabilities**: Standard LLM chat widgets frequently hallucinate incorrect discounts, unlisted product specs, or non-existent warranties, introducing legal and commercial liability.
4. **Agent Burnout**: Human support teams spend hours manually re-typing similar responses and writing manual incident summaries into CRM records.

---

## ⚡ The AI Solution

OmniPulse AI solves these problems through an autonomous 5-part architecture:
* **Strict Ground Truth Enforcement**: Inquiries are answered exclusively from the verified business knowledge repository. If information is not explicitly documented, the assistant admits it cannot verify the detail and provides direct email escalation.
* **Instant Grounded Customer Support**: Under 1-second response times for multi-turn customer dialogues with verified source citations and confidence scores.
* **AI Smart Reply Studio**: Equips human agents with 3 contextual response options (Empathetic & Rapport-Building, Direct & Action-Oriented, Sales & Value-Driven) complete with strategic intent explanations.
* **Automated Conversation Summarization**: Transforms lengthy multi-turn chat and email logs into Executive Summaries, bulleted Action Items, and Customer Sentiment tags.
* **Semantic Intent & Urgency Classifier**: Auto-triage incoming queries into categories (`Technical Support`, `Pricing Inquiry`, `Complaint / Retention`, `General Inquiry`) and routes them to the correct department with SLA priority ratings (`Low`, `Medium`, `High`, `Critical`).
* **BANT Lead Qualification Engine**: Automatically evaluates inbound prospect criteria (Budget, Authority, Need, Timeline) to score leads 0–100, classify them as Hot/Warm/Cold, and suggest the ideal sales pitch.

---

## 🛠️ Tech Stack & Architecture

### **System Architecture Diagram**

```text
[ Web Chat / Email / Mobile UI ]
              │
              ▼
   [ React 19 Frontend SPA ]
              │
              ▼ REST API (Port 3000)
   [ Express.js Backend Server ]
              │
              ├──────► [ Business Knowledge Base Engine ]
              │           ├── Company Profile & Operating Hours
              │           ├── Products & Services Pricing Catalog
              │           ├── Verified FAQs Database
              │           └── Policies & 99.99% Uptime SLAs
              │
              ▼ @google/genai SDK (User-Agent: aistudio-build)
   [ Gemini 3.8 Flash LLM ]
              │
              ▼
   [ Structured Grounded Response with Citations & Intent Tags ]
```

### **Frontend**
* **React 19 (SPA)**: Modern component architecture, functional hooks, responsive layout.
* **TypeScript**: Strict type definitions for knowledge base entities, conversations, and automation schemas.
* **Tailwind CSS v4**: Theme styling, glassmorphism, responsive navigation drawers, and custom keyframe animations.
* **Lucide React**: Clean iconography for SaaS dashboards.

### **Backend & AI**
* **Node.js + Express**: Full-stack API proxy routes serving `/api/chat`, `/api/smart-reply`, `/api/summarize`, `/api/classify-intent`, `/api/generate-email`, `/api/qualify-lead`, and `/api/health`.
* **Google GenAI SDK (`@google/genai`)**: Server-side initialization utilizing `gemini-3.8-flash` for low-latency reasoning and structured JSON output schemas.
* **Zero Client-Side Secret Exposure**: All AI API credentials stay strictly on the server; the client bundle never has access to private keys.
* **Persistence & State**: Instant LocalStorage caching with one-click "Reset to Presets" functionality.

---

## 🚀 Key Features

### 1. Business Dashboard & Overview
* Real-time operational benchmark KPIs: Automated Resolution Rate (88.4%), Median First Response (0.8s), Active Support Queue, and Qualified Pipeline Value.
* Interactive Assistant live tester with instant prompt chips.
* Incoming inquiry triage feed with one-click automation triggers.

### 2. AI Customer Support Simulator
* Multi-turn customer experience simulator with contextual memory.
* Verified source citation pills (e.g. `Product Catalog`, `Operating Hours`, `Policies & SLA`).
* Anti-hallucination test: Ask about unlisted products (e.g., "$15 shared hosting"), and observe how the AI strictly respects business knowledge boundaries without inventing facts.
* Confidence meters, sentiment detection, copy-to-clipboard, and feedback logging.

### 3. Omnichannel Support Inbox
* Multi-channel thread management (`Web Chat`, `Email`, `WhatsApp`, `Portal`).
* Status filtering (`Open`, `In Progress`, `Resolved`) and priority indicators (`Urgent`, `High`, `Medium`).
* In-thread Smart Reply, Summarization, Intent Classification, and Email Draft drawers.

### 4. 5-in-1 Dedicated Automation Studio
1. **Smart Reply Studio**: Paste customer message -> generate 3 distinct response tones with strategic intent rationale.
2. **Conversation Summarizer**: Convert dialogues into Executive Summaries, Action Items, Sentiment, and Resolution Status.
3. **Intent & Urgency Classifier**: Auto-categorize inquiries, detect urgency tier, sentiment, and routed queue.
4. **Email Response Generator**: Select email scenarios, recipient details, and tone -> generate clean formatted emails.
5. **Lead Qualification Engine**: Evaluate prospects against BANT rules to calculate 0–100 score, tier, and next action.

### 5. Interactive Knowledge Base Manager
* Dynamic editor for Business Profile, Operating Hours, SLAs, Products/Services, and Verified FAQs.
* 1-Click Preset Switcher: Toggle between **ApexCloud Solutions** (B2B SaaS / DevOps) and **Lumina Nutrition** (D2C HealthTech) to see the AI immediately adapt its persona and knowledge base!

---

## 📦 Setup & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **yarn**
* **Google Gemini API Key** (obtainable from [Google AI Studio](https://aistudio.google.com/))

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/omnipulse-ai.git
   cd omnipulse-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   # GEMINI_API_KEY: Required for Gemini AI API calls on the server
   GEMINI_API_KEY="your-gemini-api-key-here"

   # PORT: Server port (defaults to 3000)
   PORT=3000
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Security & Data Privacy

* **Zero Client-Side API Keys**: AI calls execute solely on the Node.js backend.
* **Strict Grounding Prompt Engineering**: Prevents prompt injection and jailbreaks by sandwiching verified knowledge base context with strict negative constraints.
* **Auditability**: Every AI response cites which knowledge base section was utilized.

---

## 📄 License & Attribution

This project is licensed under the Apache 2.0 License. Designed and developed as a client portfolio project showcasing production AI automation capabilities.
