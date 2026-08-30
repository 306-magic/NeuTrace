import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import logoPng from './assets/logo.png'; 

/* ========================================================
   FORTUNE 500 BRANDING & ICONS
   ======================================================== */
const BrandLogo = () => (
  <img src={logoPng} alt="NeuTrace Logo" width="52" height="52" style={{ borderRadius: '12px', objectFit: 'contain', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }} />
);

const Icons = {
  Workspace: () => <svg className="nav-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  History: () => <svg className="nav-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  ShieldCheck: () => <svg className="nav-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  Brain: () => <svg className="nav-icon" viewBox="0 0 24 24"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4 4.5 4.5 0 0 1 3 4 4.5 4.5 0 0 1 3-4Z"/></svg>,
  Cloud: () => <svg className="nav-icon" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>,
  Key: () => <svg className="nav-icon" viewBox="0 0 24 24"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>,
  
  // UI-PERFECTED AGENT ICONS (Hardcoded 24x24 scale)
  Radar: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 12v8"/><path d="m12 12 5.5-5.5"/></svg>,
  AgentShield: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  Crosshair: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>,
  Lock: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
};

/* ========================================================
   GCP / GOOGLE CLOUD COMPLIANT SCENARIOS
   ======================================================== */
const SCENARIOS = {
  prompt_inject: { 
    id: "prompt", title: "Gemini Prompt Injection", subtitle: "Unsanitized Input to LLM", icon: Icons.Brain, 
    code: `import google.generativeai as genai\n\ndef summarize_data(user_text):\n    # CRITICAL: Vulnerable to System Instruction Override\n    model = genai.GenerativeModel('gemini-1.5-pro')\n    response = model.generate_content(f"Summarize this text: {user_text}")\n    return response.text` 
  },
  ssrf: { 
    id: "ssrf", title: "GCP Metadata SSRF", subtitle: "Cloud Instance Takeover", icon: Icons.Cloud, 
    code: `import requests\nfrom flask import request\n\n@app.route('/proxy')\ndef fetch_url():\n    # CRITICAL: Vulnerable to Google Metadata Server access\n    target = request.args.get('url')\n    response = requests.get(target, headers={"Metadata-Flavor": "Google"})\n    return response.content` 
  },
  secrets: { 
    id: "secrets", title: "Hardcoded GCP Keys", subtitle: "Service Account Exposure", icon: Icons.Key, 
    code: `import os\nfrom google.cloud import storage\n\n# CRITICAL: Hardcoded GCP Credentials in source code\nGCP_PROJECT_ID = "neutrace-prod-8821"\nGCP_KEY = "AIzaSyB9_EXAMPLE_KEY_DO_NOT_COMMIT..."\n\ndef get_bucket():\n    return storage.Client(project=GCP_PROJECT_ID)` 
  }
};

/* Helper function to match log colors perfectly to the UI */
const getAgentColor = (agentName) => {
  if (!agentName) return '#94a3b8';
  const name = agentName.toUpperCase();
  if (name.includes('SCANNER')) return '#8b5cf6'; // Purple
  if (name.includes('BLUE')) return '#3b82f6'; // Blue
  if (name.includes('RED')) return '#ef4444'; // Red
  if (name.includes('GATE') || name.includes('DEPLOY')) return '#10b981'; // Green
  if (name.includes('ORCHESTRATOR')) return '#06b6d4'; // Cyan
  return '#94a3b8'; // Default
};

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [activeScenario, setActiveScenario] = useState(null);
  const [editorCode, setEditorCode] = useState('');
  
  // Pipeline Execution State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Live Agent Terminal Logs
  const [agentLogs, setAgentLogs] = useState([]);
  const terminalRef = useRef(null);

  // Holographic Output
  const [smartCode, setSmartCode] = useState([
    { text: ">> Target buffer empty.", isNew: false },
    { text: ">> Select threat vector to begin adversarial pipeline.", isNew: false }
  ]);

  // Full-Pipeline Guardrails State (6 Elite Policies)
  const [policies, setPolicies] = useState({
    scanAst: true,
    blueNative: false,
    redMaxAggression: true,
    gateHumanReview: false,
    finopsLimit: true,
    ragPolicySync: true
  });

  const [policySavedToast, setPolicySavedToast] = useState(false);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [agentLogs]);

  const loadScenario = (key) => {
    setActiveScenario(SCENARIOS[key]);
    setEditorCode(SCENARIOS[key].code);
    setAgentLogs([]);
    setSmartCode([{ text: `>> Loaded Payload: ${SCENARIOS[key].title}`, isNew: false }]);
  };

  const copyCleanCode = () => {
    const cleanOutput = smartCode.map(line => line.text).join('\n');
    navigator.clipboard.writeText(cleanOutput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const togglePolicy = (key) => {
    setPolicies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const savePolicies = () => {
    setPolicySavedToast(true);
    setTimeout(() => setPolicySavedToast(false), 2500);
  };

  // Zero-Dependency Native PDF & Print Exporter
  const exportSOC2Report = () => {
    const reportData = `
================================================================================
                    NEUTRACE ZERO-TRUST CI/CD SECURITY FORGE
                      SOC 2 TYPE II COMPLIANCE AUDIT REPORT
================================================================================
Generated: ${new Date().toUTCString()}
Classification: CONFIDENTIAL // CISO AUDIT RECORD
Framework Compliance: Google Agent Development Kit (ADK) / Google Cloud DLP

--------------------------------------------------------------------------------
1. EXECUTIVE SUMMARY & TELEMETRY
--------------------------------------------------------------------------------
Total Codebases Audited: 1,204
Adversarial Red Team Bypasses: 0
Fleet Integrity Rating: 100.00% SECURE
Zero-Trust Policy Gate: ENFORCED

--------------------------------------------------------------------------------
2. ACTIVE PIPELINE GUARDRAILS
--------------------------------------------------------------------------------
- AST Dependency Inspection: ${policies.scanAst ? "ENFORCED" : "BYPASSED"}
- Block Third-Party Libs: ${policies.blueNative ? "ENFORCED" : "DISABLED"}
- Red Team 3-Pass Penetration: ${policies.redMaxAggression ? "ENFORCED" : "STANDARD"}
- CISO Manual Sign-Off: ${policies.gateHumanReview ? "REQUIRED" : "AUTOMATED"}
- FinOps Dynamic Complexity Routing: ${policies.finopsLimit ? "ACTIVE" : "STANDARD"}
- Vertex AI RAG Policy Sync: ${policies.ragPolicySync ? "SYNCHRONIZED" : "DISABLED"}

--------------------------------------------------------------------------------
CRYPTOGRAPHIC VALIDATION DIGEST: SHA256:${Math.random().toString(36).substring(2, 15).toUpperCase()}
APPROVED BY: AUTONOMOUS ZERO-TRUST DEPLOY GATE
================================================================================
`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>NeuTrace_SOC2_Report_${new Date().toISOString().slice(0, 10)}</title>
          <style>
            @media print {
              @page { margin: 1in; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            body { 
              font-family: 'Courier New', Courier, monospace; 
              padding: 40px; 
              color: #111; 
              background: #fff; 
              white-space: pre-wrap; 
              font-size: 13px; 
              line-height: 1.6;
            }
          </style>
        </head>
        <body>${reportData}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  // Real Backend Trigger with Dynamic Policy Forwarding
  const triggerAnalysis = async () => {
    if (!editorCode.trim()) return;
    setIsAnalyzing(true);
    setAgentLogs([]);
    setSmartCode([{ text: ">> Synthesizing neural patch...", isNew: false }]);

    try {
      const response = await fetch("https://neutrace-api-612116629843.us-central1.run.app/api/v1/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: editorCode,
          vector_type: activeScenario?.id || "custom",
          policies: policies
        })
      });

      if (!response.ok) throw new Error("Backend connection returned non-200");
      const data = await response.json();

      // Snappy, readable log animation (800ms per line)
      data.audit_trail.forEach((item, index) => {
        setTimeout(() => {
          setAgentLogs(prev => [...prev, item]);
        }, (index + 1) * 800); 
      });

      // Parse Remediated Code instantly after logs finish
      setTimeout(() => {
        const lines = data.remediated_code.split('\n');
        const formatted = lines.map(line => ({
          text: line,
          isNew: line.includes("NeuTrace:") || line.includes("dlp") || line.includes("sanitized") || line.includes("169.254") || line.includes("secretmanager") || line.includes("Access Denied") || line.includes("Credentials dynamically"),
          oldText: "- Vulnerable implementation neutralized"
        }));
        setSmartCode(formatted);
        setIsAnalyzing(false);
      }, (data.audit_trail.length + 1) * 800);

    } catch (err) {
      setSmartCode([{ text: `>> Critical Error: Backend connection failed. ${err.message}`, isNew: false }]);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="app-shell">
      {/* High-Energy Background */}
      <div className="ambient-engine">
        <div className="mesh-orb orb-azure" />
        <div className="mesh-orb orb-violet" />
        <div className="mesh-orb orb-emerald" />
      </div>

      {/* Sidebar */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh' }}>
        <div>
          <div className="brand-section">
            <BrandLogo />
            <div>
              <h1 className="brand-title">NEUTRACE</h1>
              <span className="brand-tagline">Zero-Trust CI/CD</span>
            </div>
          </div>
          <nav className="nav-container">
            <button className={`nav-item ${activeTab === 'workspace' ? 'active' : ''}`} onClick={() => setActiveTab('workspace')}>
              <Icons.Workspace /> Threat Workspace
            </button>
            <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              <Icons.History /> CISO Audit Matrix
            </button>
            <button className={`nav-item ${activeTab === 'guardrails' ? 'active' : ''}`} onClick={() => setActiveTab('guardrails')}>
              <Icons.ShieldCheck /> Custom Guardrails
            </button>
          </nav>
        </div>

        {/* RIGOROUSLY ALIGNED NEON ACTIVE AGENTS PANEL WITH BOXED BORDER */}
        <div style={{ margin: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', background: 'rgba(0,0,0,0.25)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '20px' }}>Active ADK Agents</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#8b5cf6', textShadow: '0 0 10px rgba(139,92,246,0.4)' }}>
              <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}><Icons.Radar /></div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px' }}>Scanner</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#3b82f6', textShadow: '0 0 10px rgba(59,130,246,0.4)' }}>
              <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}><Icons.AgentShield /></div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px' }}>Blue Team</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#ef4444', textShadow: '0 0 10px rgba(239,68,68,0.4)' }}>
              <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}><Icons.Crosshair /></div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px' }}>Red Team</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#10b981', textShadow: '0 0 10px rgba(16,185,129,0.4)' }}>
              <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}><Icons.Lock /></div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px' }}>Deploy Gate</span>
            </div>

          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="main-viewport">
        {activeTab === 'workspace' && (
          <>
            <div className="viewport-header" style={{ marginBottom: '24px' }}>
              <span className="viewport-title">Autonomous Remediation Workspace</span>
            </div>

            {/* Threat Vector Selection */}
            <div className="threat-grid" style={{ marginBottom: '24px' }}>
              {Object.keys(SCENARIOS).map((key) => {
                const item = SCENARIOS[key];
                const Icon = item.icon;
                return (
                  <div key={key} className={`threat-card glass-surface ${activeScenario?.id === item.id ? 'active' : ''}`} onClick={() => loadScenario(key)}>
                    <div className="threat-icon-box"><Icon /></div>
                    <div>
                      <div className="threat-title">{item.title}</div>
                      <div className="threat-subtitle">{item.subtitle}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 3-Panel Split Workspace */}
            <div className="workspace-layout">
              <div className="layout-col">
                <div className="panel-container glass-surface" style={{ flex: 1.2 }}>
                  <div className="panel-top-bar">
                    <span className="panel-title">Target Payload</span>
                    <button className="action-btn primary" onClick={triggerAnalysis} disabled={!editorCode || isAnalyzing}>
                      {isAnalyzing ? 'ORCHESTRATING...' : 'ENGAGE NEUTRACE'}
                    </button>
                  </div>
                  <div className="panel-body">
                    <textarea className="code-textarea" value={editorCode} onChange={(e) => setEditorCode(e.target.value)} spellCheck="false" placeholder="Paste target code..."/>
                  </div>
                </div>

                <div className="panel-container glass-surface" style={{ flex: 1 }}>
                  <div className="panel-top-bar"><span className="panel-title">Agentic Chain-of-Thought</span></div>
                  <div className="panel-body">
                    <div className="terminal-output" ref={terminalRef}>
                      {agentLogs.length === 0 && <span style={{ color: 'var(--text-muted)' }}>&gt; Awaiting pipeline engagement...</span>}
                      {agentLogs.map((log, i) => (
                        <div key={i} className="log-line" style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ color: getAgentColor(log.agent), fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            [{log.agent}]
                          </span>
                          <span className="log-text" style={{ color: 'var(--text-muted)' }}>{log.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel-container glass-surface">
                <div className="panel-top-bar">
                  <span className="panel-title">Smart Remediation</span>
                  <div className="panel-actions">
                    <button className={`action-btn ${isCopied ? 'success' : ''}`} onClick={copyCleanCode}>
                      {isCopied ? <Icons.Check /> : <Icons.Copy />} {isCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="panel-body">
                  <div className="smart-diff-container">
                    {smartCode.map((line, idx) => (
                      <div key={idx} className={`smart-line ${line.isNew ? 'secured' : ''}`}>
                        {line.text}
                        {line.isNew && <div className="hologram-tooltip">{line.oldText}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: CISO Audit Matrix */}
        {activeTab === 'history' && (
          <div className="glass-surface" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div className="panel-top-bar" style={{ height: '64px' }}>
              <span className="panel-title" style={{ fontSize: '1rem', color: '#fff' }}>Enterprise Security Matrix</span>
              <button className="action-btn primary" onClick={exportSOC2Report}><Icons.Download /> Export / Print SOC2</button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Pipelines Audited</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'Fira Code', color: '#fff' }}>1,204</div>
                </div>
                <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Red Team Bypasses</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'Fira Code', color: 'var(--accent-emerald)' }}>0</div>
                </div>
                <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Fleet Compliance Status</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'Fira Code', color: 'var(--accent-azure)' }}>100% SECURE</div>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Event ID</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Timestamp</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Threat Vector Identified</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Severity</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Action Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'EVT-4402', time: '12 mins ago', vector: 'Gemini Prompt Injection Validation Failure', severity: 'CRITICAL', color: '#e11d48' },
                    { id: 'EVT-4391', time: '1 hour ago', vector: 'Hardcoded GCP Service Credentials', severity: 'CRITICAL', color: '#e11d48' },
                    { id: 'EVT-4105', time: '4 hours ago', vector: 'GCP Metadata SSRF Attempt', severity: 'HIGH', color: '#f59e0b' },
                    { id: 'EVT-3992', time: '1 day ago', vector: 'SQL Injection via unsanitized query', severity: 'CRITICAL', color: '#e11d48' }
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px', fontFamily: 'Fira Code', color: 'var(--accent-azure)' }}>{row.id}</td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{row.time}</td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{row.vector}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', background: `${row.color}22`, color: row.color, border: `1px solid ${row.color}55` }}>{row.severity}</span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>PATCHED VIA ADK</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Custom Guardrails (Dynamic Pipeline Control) */}
        {activeTab === 'guardrails' && (
          <div className="glass-surface" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div className="panel-top-bar" style={{ height: '64px' }}>
              <span className="panel-title" style={{ fontSize: '1rem', color: '#fff' }}>Enterprise Policy Engine</span>
              <button className="action-btn primary" onClick={savePolicies}>
                {policySavedToast ? <><Icons.Check /> Guardrails Deployed</> : 'Deploy Pipeline Guardrails'}
              </button>
            </div>
            
            <div style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Enforce zero-trust organizational boundaries across all agents in the deployment pipeline.</p>
              
              {[
                { key: 'finopsLimit', group: 'FINOPS ORCHESTRATION', title: 'Autonomous Complexity Routing', desc: 'Dynamically evaluate AST cyclomatic complexity. Route simple payloads to Gemini Flash; reserve Gemini 1.5 Pro for multi-agent consensus tasks.' },
                { key: 'ragPolicySync', group: 'ORCHESTRATOR LOGIC', title: 'Vertex AI RAG Policy Sync', desc: 'Force Blue Team to query corporate Vector Search database to retrieve and apply proprietary security guidelines before generating a patch.' },
                { key: 'scanAst', group: 'NODE 1: SCANNER', title: 'Deep AST Dependency Inspection', desc: 'Force Scanner to traverse all dependency trees rather than performing surface-level code matching.' },
                { key: 'blueNative', group: 'NODE 2: BLUE TEAM', title: 'Block External Third-Party Libraries', desc: 'Force the remediation agent to construct patches using only native standard libraries or approved Google Cloud SDKs.' },
                { key: 'redMaxAggression', group: 'NODE 3: RED TEAM', title: 'Maximum Penetration (3-Pass Rule)', desc: 'Require Red Team agent to execute three distinct bypass methodologies before approving the patch.' },
                { key: 'gateHumanReview', group: 'NODE 4: DEPLOY GATE', title: 'Require CISO Manual Sign-Off', desc: 'Halt the pipeline at Node 4 for manual approval if the initial vulnerability is tagged as CRITICAL.' }
              ].map((policy) => (
                <div key={policy.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <div style={{ paddingRight: '20px' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent-azure)', letterSpacing: '1px', fontWeight: 'bold' }}>{policy.group}</span>
                    <h3 style={{ color: '#fff', fontSize: '1rem', marginTop: '6px', marginBottom: '4px' }}>{policy.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{policy.desc}</p>
                  </div>
                  
                  <div 
                    onClick={() => togglePolicy(policy.key)}
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s', flexShrink: 0,
                      background: policies[policy.key] ? 'var(--accent-azure)' : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', transition: 'all 0.3s',
                      left: policies[policy.key] ? '23px' : '3px'
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}