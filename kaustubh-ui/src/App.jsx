import { useState } from 'react';
import { Bug, Database, Zap, Cpu, Shield, Trash2 } from 'lucide-react';
import './App.css';

const SCENARIOS = {
  secrets: {
    id: "secrets",
    title: "Hardcoded Secrets",
    subtitle: "Cloud API Key Exposure",
    threatLevel: "CRITICAL",
    diagnosticGoal: "Detect exposed AWS credentials and implement environment variables.",
    code: "import boto3\n\n# LIVE CREDENTIALS EXPOSED IN SCRIPT\nAWS_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE'\nAWS_SECRET_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'\n\ndef connect_s3():\n    client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)\n    return client",
    icon: Database
  },
  rce: {
    id: "rce",
    title: "Remote Code Execution",
    subtitle: "Unsanitized Eval Injection",
    threatLevel: "CRITICAL",
    diagnosticGoal: "Identify execution of unsanitized user inputs via eval().",
    code: "def process_math(equation_string):\n    # Vulnerable to OS command injection\n    # e.g. equation_string = \"__import__('os').system('clear')\"\n    result = eval(equation_string)\n    return result",
    icon: Zap
  },
  lfi: {
    id: "lfi",
    title: "Path Traversal",
    subtitle: "Local File Inclusion",
    threatLevel: "HIGH",
    diagnosticGoal: "Detect arbitrary file read vulnerabilities in filepath construction.",
    code: "def read_user_document(filename):\n    # Vulnerable to ../../../etc/passwd traversal\n    base_dir = '/var/www/docs/'\n    target_file = base_dir + filename\n    \n    with open(target_file, 'r') as file:\n        return file.read()",
    icon: Bug
  }
};

function App() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [editorCode, setEditorCode] = useState('');
  const [telemetry, setTelemetry] = useState('>> System initialized.\n>> Awaiting telemetry...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadScenario = (scenarioKey) => {
    const scenario = SCENARIOS[scenarioKey];
    setActiveScenario(scenario);
    setEditorCode(scenario.code);
    setTelemetry(`>> [ THREAT VECTOR LOCKED: ${scenario.threatLevel} ]\n>> Target payload loaded. Ready for engagement.`);
  };

  const clearBuffer = () => {
    setActiveScenario(null);
    setEditorCode('');
    setTelemetry('>> Buffer cleared.\n>> System standing by for new payload.');
  };

  const triggerAnalysis = async () => {
    if (!editorCode.trim()) return;
    
    setIsAnalyzing(true);
    setTelemetry('>> INITIALIZING NEUTRACE...\n>> Compiling Threat Analysis Event DTO...\n>> Establishing secure uplink to Port 8000...');

    const payload = {
      event_id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `evt-${Date.now()}`,
      timestamp: Date.now(),
      file_name: activeScenario ? `${activeScenario.id}_target` : "custom_payload",
      scenario_id: activeScenario ? activeScenario.id : "custom_input",
      scenario_title: activeScenario ? activeScenario.title : "Manual Code Audit",
      threat_level: activeScenario ? activeScenario.threatLevel : "UNKNOWN",
      diagnostic_goal: activeScenario ? activeScenario.diagnosticGoal : "Perform autonomous vulnerability sweep.",
      code: editorCode
    };

    try {
      const response = await fetch('http://localhost:8000/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Internal Server Error');

      setTelemetry(`>> [ THREAT NEUTRALIZED ]\n>> EVENT ID: ${payload.event_id}\n\n[ DIAGNOSTICS ]\n${data.analysis || 'Analysis complete.'}\n\n[ SECURE CODE ]\n${data.remediation || data.fixed_code || JSON.stringify(data, null, 2)}`);
      
    } catch (error) {
      setTelemetry(`>> [ FATAL UPLINK ERROR ]\n>> Connection to NeuTrace API Gateway severed.\n>> Trace: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="ambient-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="ui-layer">
        <header className="top-nav glass-panel">
          <div className="brand-lockup">
            <div className="brand-icon-wrapper"><Shield size={28} strokeWidth={2} /></div>
            <h1 className="coded-brand-text">NEUTRACE</h1>
          </div>
          <div className={`status-pill ${isAnalyzing ? 'analyzing' : 'ready'}`}>
            <Cpu size={16} className={isAnalyzing ? 'icon-spin' : ''} />
            {isAnalyzing ? 'NEUTRACE ACTIVE' : 'SYSTEM STANDBY'}
          </div>
        </header>

        <main className="main-workspace">
          <section className="scenario-section">
            <span className="section-label">SELECT THREAT VECTOR</span>
            <div className="cards-container">
              {Object.keys(SCENARIOS).map((key) => {
                const ScenarioIcon = SCENARIOS[key].icon;
                const isActive = activeScenario?.id === SCENARIOS[key].id;
                
                return (
                  <button key={key} className={`scenario-card ${isActive ? 'active' : ''}`} onClick={() => loadScenario(key)}>
                    <div className="card-icon-wrapper"><ScenarioIcon size={22} strokeWidth={1.5} /></div>
                    <div className="card-text">
                      <span className="card-title">{SCENARIOS[key].title}</span>
                      <span className="card-subtitle">{SCENARIOS[key].subtitle}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <div className="workspace-grid">
            <div className="glass-panel panel editor-panel">
              <div className="panel-header">
                <span className="tab-text">Target Source Buffer</span>
                <div className="header-actions">
                  <button className="icon-btn" onClick={clearBuffer} title="Clear Buffer">
                    <Trash2 size={16} />
                  </button>
                  <button 
                    className="engage-btn" 
                    onClick={triggerAnalysis}
                    disabled={!editorCode.trim() || isAnalyzing}
                  >
                    {isAnalyzing ? 'PROCESSING...' : 'ENGAGE NEUTRACE'}
                  </button>
                </div>
              </div>
              <div className="panel-content code-bg">
                <textarea 
                  className="code-editor"
                  value={editorCode}
                  onChange={(e) => {
                    setEditorCode(e.target.value);
                    setActiveScenario(null); 
                  }}
                  placeholder="Type your code here"
                  spellCheck="false"
                />
              </div>
            </div>

            <div className="glass-panel panel telemetry-panel">
              <div className="panel-header">
                <span className="tab-text">NeuTrace Diagnostic Console</span>
              </div>
              <div className="panel-content console-bg">
                <pre className={`telemetry-text ${isAnalyzing ? 'text-active' : 'text-idle'}`}>
                  {telemetry}
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;