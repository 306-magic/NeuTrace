# 🛡️ NeuTrace: Zero-Trust CI/CD Security Forge

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

> **Built for the All Things Agentic Hackathon**  
> **Live Demo:** neu-trace.vercel.app

As enterprise AI adoption explodes, the speed of software development has fundamentally outpaced traditional security. We are entering the "Agentic Era," where AI generates and deploys code at unprecedented velocity. Yet, CI/CD security remains archaic—relying on static rules and manual human review.

**NeuTrace** is an autonomous, multi-agent CI/CD security forge that intercepts, analyzes, and remediates code before it ever touches production. We use AI to secure AI.

## ⚙️ The Multi-Agent Architecture

Instead of relying on a single LLM to guess vulnerabilities, NeuTrace deploys an adversarial "virtual cybersecurity team" powered by the **Google Agent Development Kit** and **Gemini 1.5**.

1. 📡 **The AST Scanner:** Deep-scans the Abstract Syntax Tree (AST) to isolate vulnerabilities in execution contexts.
2. 🛡️ **The Blue Team:** Synthesizes cryptographic, deterministic patches (dynamically querying Google Cloud DLP or Secret Manager APIs).
3. 🎯 **The Red Team:** Acts as the adversary, executing a rigorous 3-pass bypass simulation to attack the Blue Team's patch.
4. 🔒 **The Deploy Gate:** The zero-trust arbiter that evaluates the Red Team's report and grants final cryptographic approval.

## 🚀 Key Features

- **Live Threat Neutralization:** Autonomous remediation of Gemini Prompt Injections, Google Cloud SSRF takeovers, and Hardcoded GCP Service Keys.
- **CISO Audit Matrix:** Fleet-wide threat telemetry that tracks agentic actions and generates one-click, print-ready SOC 2 Type II compliance reports.
- **Enterprise Policy Engine:** Granular guardrails allowing security teams to enforce FinOps model routing, Vertex AI RAG policy sync, and third-party dependency bans.
- **Glassmorphism UI:** A custom-engineered, CSS-driven ambient engine UI designed for zero-latency rendering and pixel-perfect enterprise scaling.

## 🛠️ Tech Stack

- **Frontend:** React.js, Custom CSS (Inline Ambient Engine)
- **Deployment:** Vercel
- **AI & Orchestration:** Google Agent Development Kit, Google Gemini (1.5 Pro/Flash)
- **Cloud Security Integrations:** GCP Secret Manager, GCP Data Loss Prevention (DLP)

