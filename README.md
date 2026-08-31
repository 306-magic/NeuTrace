# 🛡️ NeuTrace: Zero-Trust CI/CD Security Forge

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

> **Official Submission for the All Things Agentic Hackathon**  
> **Live Enterprise Demo:** [https://neu-trace.vercel.app](https://neu-trace.vercel.app)

---

## 📌 The Agentic Security Crisis
As enterprise AI adoption accelerates, software development velocity has fundamentally outpaced traditional security. We are entering the "Agentic Era," where AI generates and deploys code at scale. Yet, CI/CD security remains archaic—relying on static rules and manual human review.

**NeuTrace** is an autonomous, multi-agent CI/CD security forge that intercepts, analyzes, and remediates code before it ever touches production. To survive the generative coding era, we must use AI to secure AI.

---

## ⚙️ Multi-Agent Architecture

Instead of relying on a single LLM to guess vulnerabilities (which leads to hallucinations), NeuTrace deploys an adversarial virtual cybersecurity team powered by the **Google Agent Development Kit** and **Gemini 3.5**.

![NeuTrace Architecture Diagram](https://quickchart.io/graphviz?graph=digraph%20G%20%7B%0A%20%20rankdir%3DTB%3B%0A%20%20node%20%5Bshape%3Dbox%2C%20style%3Dfilled%2C%20color%3D%22%234285F4%22%2C%20fontcolor%3Dwhite%2C%20fontname%3D%22Helvetica%22%2C%20penwidth%3D0%5D%3B%0A%20%20edge%20%5Bfontname%3D%22Helvetica%22%2C%20fontsize%3D10%5D%3B%0A%0A%20%20%22CI%2FCD%20Trigger%22%20-%3E%20%22Google%20Pub%2FSub%22%3B%0A%20%20%22Google%20Pub%2FSub%22%20-%3E%20%22Cloud%20Run%20%28NeuTrace%29%22%3B%0A%0A%20%20node%20%5Bcolor%3D%22%230F9D58%22%5D%3B%0A%20%20%22Cloud%20Run%20%28NeuTrace%29%22%20-%3E%20%22AST%20Scanner%20Agent%22%3B%0A%20%20%22AST%20Scanner%20Agent%22%20-%3E%20%22Blue%20Team%20Agent%22%3B%0A%20%20%22Blue%20Team%20Agent%22%20-%3E%20%22GCP%20Secret%20Manager%20%26%20DLP%22%20%5Bdir%3Dboth%5D%3B%0A%20%20%22Blue%20Team%20Agent%22%20-%3E%20%22Red%20Team%20Agent%22%20%5Blabel%3D%22Proposes%20Patch%22%5D%3B%0A%20%20%22Red%20Team%20Agent%22%20-%3E%20%22Blue%20Team%20Agent%22%20%5Bstyle%3Ddashed%2C%20label%3D%22%203-Pass%20Bypass%20Loop%22%5D%3B%0A%20%20%22Red%20Team%20Agent%22%20-%3E%20%22Deploy%20Gate%20Agent%22%20%5Blabel%3D%22%20Approved%22%5D%3B%0A%0A%20%20node%20%5Bcolor%3D%22%23202124%22%5D%3B%0A%20%20%22Deploy%20Gate%20Agent%22%20-%3E%20%22Secure%20Production%20Merge%22%3B%0A%20%20%22Deploy%20Gate%20Agent%22%20-%3E%20%22SOC%202%20Audit%20Log%22%3B%0A%7D)

### The Agentic Roster
* 📡 **AST Scanner Agent (Gemini 3.5 Flash):** Deep-scans the Abstract Syntax Tree (AST) for ultra-low latency isolation of execution vulnerabilities.
* 🛡️ **Blue Team Agent (Gemini 3.5 Pro):** The core reasoning engine. Synthesizes cryptographic, deterministic patches (dynamically integrating with GCP Secret Manager and DLP APIs).
* 🎯 **Red Team Agent (Gemini 3.5 Pro):** Acts as the adversary, executing a rigorous 3-pass bypass simulation against the Blue Team's patch to prevent LLM hallucinations.
* 🔒 **Deploy Gate Agent:** The zero-trust arbiter that evaluates the Red Team validation report and authorizes production deployment.

---

## 🚀 Key Features

* **Live Threat Neutralization:** Real-time remediation of LLM Prompt Injections, Google Cloud SSRF takeovers, and hardcoded GCP service keys.
* **CISO Audit Matrix:** Fleet-wide threat telemetry tracking agentic actions and generating deterministic, print-ready SOC 2 Type II compliance audit reports.
* **Enterprise Policy Engine:** Granular guardrails enabling security teams to enforce FinOps model routing and third-party dependency rules.
* **Glassmorphism UI Engine:** Custom ambient frontend engineered for zero-latency rendering and high-contrast telemetry visualization.

---

## 🛠️ The Tech Stack

* **Google AI:** Gemini 3.5 Pro, Gemini 3.5 Flash, Veo (Cinematic generation), Gemma (Local FinOps routing)
* **Google Cloud & SDKs:** Google GenAI SDK, Agent Development Kit (ADK), Cloud Run, Cloud Pub/Sub, GCP Secret Manager, GCP Data Loss Prevention (DLP)
* **Frontend:** React.js, Tailwind CSS, Custom Ambient CSS
* **Backend:** Python 3.10+, FastAPI / Uvicorn
* **Deployment & Containerization:** Vercel, Docker

---

## 💻 Spin-Up & Reproducibility Instructions

Follow these step-by-step instructions to clone, configure, and reproduce the NeuTrace environment locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/306-magic/NeuTrace.git](https://github.com/306-magic/NeuTrace.git)
cd NeuTrace