# 🛡️ NeuTrace: Zero-Trust CI/CD Security Forge

**Autonomous DevSecOps Pipeline powered by Google Gemini and ADK**

[![Deployed on Google Cloud Run](https://img.shields.io/badge/Deployed_on-Google_Cloud_Run-blue?logo=googlecloud)](https://cloud.google.com/run)
[![Powered by Gemini](https://img.shields.io/badge/Powered_by-Gemini_1.5_Pro-orange?logo=google)](https://deepmind.google/technologies/gemini/)
[![Frontend](https://img.shields.io/badge/Frontend-React_%7C_Vite-cyan?logo=react)](#)

## 📖 Project Overview
Modern CI/CD pipelines are highly vulnerable to advanced threat vectors like LLM Prompt Injections, GCP Metadata SSRF, and leaked Service Account keys. **NeuTrace** is an enterprise-grade, autonomous Zero-Trust remediation engine that intercepts malicious code before deployment. 

Utilizing a multi-agent DevSecOps architecture, NeuTrace doesn't just scan for vulnerabilities—it actively synthesizes, tests, and deploys cryptographically verified patches in real-time.

## 🎯 Hackathon Category Alignment
Built specifically for the **AI Security & Infrastructure** track, NeuTrace demonstrates:
* **Agentic Architecture:** 4 distinct AI agents (Scanner, Blue Team, Red Team, Deploy Gate) working in consensus.
* **Smart Remediation:** Automated generation of secure, drop-in replacement code.
* **Enterprise Compliance:** Real-time SOC 2 Type II audit logging and PDF report generation.

## 🏗️ System Architecture

1. **The Scanner:** Parses incoming code commits and calculates AST cyclomatic complexity.
2. **The Blue Team (Gemini 1.5):** Evaluates vulnerabilities against custom organizational guardrails and generates a secure patch.
3. **The Red Team:** Simulates adversarial penetration tests against the generated patch.
4. **The Deploy Gate:** Requires zero-trust consensus (and optional CISO sign-off) before releasing the secure code.

## 🚀 Key Features

* **Interactive Threat Workspace:** Test live payloads including Gemini Prompt Injections and Hardcoded GCP Keys.
* **Dynamic Policy Engine:** Toggle strict organizational guardrails (e.g., blocking 3rd-party libraries, enforcing FinOps routing).
* **SOC 2 Compliance Exporter:** One-click generation of printable, executive-ready PDF audit reports.
* **Cloud-Native Backend:** FastAPI backend containerized and deployed serverless on Google Cloud Run.

## 💻 Tech Stack
* **AI Engine:** Google Gemini 1.5 Pro / Flash
* **Backend:** Python, FastAPI, Uvicorn, Docker
* **Frontend:** React, Vite, CSS Modules
* **Infrastructure:** Google Cloud Run, Artifact Registry

## 🛠️ Local Development Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/neutrace.git](https://github.com/yourusername/neutrace.git)
cd neutrace