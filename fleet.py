"""
NeuTrace Enterprise Fleet (Google ADK)
Registers the specialized multi-agent network for autonomous DevSecOps.
"""

import os
from dotenv import load_dotenv

from google.adk.agents import Agent

load_dotenv()

# We route the heavy code synthesis to the newest 3.7 model, 
# and use 3.6 as a highly efficient proxy for Triage and Arbitration.
TRIAGE_MODEL = "gemini-3.6-flash" 
REMEDIATION_MODEL = "gemini-3.7-flash"

# 1. The Triage Agent (Fast Log Classification)
triage_agent = Agent(
    name="TriageAgent",
    model=TRIAGE_MODEL,
    instruction=(
        "You are a specialized DevSecOps Triage Agent. "
        "Analyze the provided Python crash log or AST violation. "
        "Classify the error into a strict category (e.g., SYNTAX, TIMEOUT, RESOURCE_EXHAUSTION, LOGIC) "
        "and extract the exact line of failure. Keep your response concise and structured."
    ),
    description="Instantly categorizes execution failures."
)

# 2. The Remediation Agent (Deep Code Synthesis)
remediation_agent = Agent(
    name="RemediationAgent",
    model=REMEDIATION_MODEL,
    instruction=(
        "You are an elite autonomous DevSecOps Remediation Agent. "
        "You receive broken Python code and a classified error report. "
        "You must rewrite the code to fix the vulnerability completely. "
        "Return ONLY the patched Python code. Do not include markdown blocks. Do not include explanations."
    ),
    description="Autonomously rewrites and patches vulnerable code."
)

# 3. The Arbiter Agent (Zero-Trust Consensus Gate)
arbiter_agent = Agent(
    name="ArbiterAgent",
    model=TRIAGE_MODEL,
    instruction=(
        "You are the Zero-Trust Arbiter Agent. "
        "Review the original code, the generated patch, and the sandbox test results. "
        "If the patch introduces side effects or fails regression, output 'REJECTED' and explain why. "
        "If the code is safe and fixes the issue, output 'APPROVED'."
    ),
    description="Cross-verifies patches before production."
)

if __name__ == "__main__":
    print("NeuTrace ADK Fleet initialized successfully.")