import React from 'react';

export default function AgentTopology({ isProcessing }) {
  return (
    <div style={{ width: '100%', height: '160px', position: 'relative' }}>
      <svg 
        viewBox="0 0 800 160" 
        style={{ width: '100%', height: '100%', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyber-Organic Gradients */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#ff007f" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.2" />
          </linearGradient>

          {/* Premium Neon Glow Filters */}
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="magentaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Static Base Connection Line */}
        <path 
          d="M 160 80 L 400 80 L 640 80" 
          stroke="rgba(255, 255, 255, 0.05)" 
          strokeWidth="2" 
          fill="none" 
        />

        {/* Animated Data Telemetry Beam (Only moves when isProcessing is true) */}
        <path 
          d="M 160 80 L 400 80 L 640 80" 
          stroke="url(#lineGradient)" 
          strokeWidth="3" 
          fill="none"
          strokeDasharray="150 800"
          strokeDashoffset="0"
          style={{
            animation: isProcessing ? 'telemetryFlow 2s linear infinite' : 'none',
            opacity: isProcessing ? 1 : 0
          }}
        >
          {isProcessing && (
            <animate 
              attributeName="stroke-dashoffset" 
              from="950" 
              to="-150" 
              dur="2s" 
              repeatCount="indefinite" 
            />
          )}
        </path>

        {/* NODE 1: Pre-Flight Scanner (Diamond) */}
        <g transform="translate(160, 80)">
          <polygon 
            points="0,-30 30,0 0,30 -30,0" 
            fill="rgba(0, 0, 0, 0.8)" 
            stroke={isProcessing ? "#00f0ff" : "rgba(255,255,255,0.2)"} 
            strokeWidth="2"
            filter={isProcessing ? "url(#cyanGlow)" : "none"}
            style={{ transition: 'all 0.5s ease' }}
          />
          <text x="0" y="55" fill="#a1a1aa" fontSize="11" textAnchor="middle" letterSpacing="1.5" fontFamily="system-ui, sans-serif">
            SCANNER
          </text>
        </g>

        {/* NODE 2: Gemma-2 Analyzer (Hexagon) */}
        <g transform="translate(400, 80)">
          <polygon 
            points="-25,-40 25,-40 45,0 25,40 -25,40 -45,0" 
            fill="rgba(0, 0, 0, 0.9)" 
            stroke={isProcessing ? "#ff007f" : "rgba(255,255,255,0.2)"} 
            strokeWidth="2"
            filter={isProcessing ? "url(#magentaGlow)" : "none"}
            style={{ transition: 'all 0.5s ease' }}
          />
          <text x="0" y="5" fill={isProcessing ? "#fff" : "#a1a1aa"} fontSize="14" fontWeight="600" textAnchor="middle" letterSpacing="2" fontFamily="system-ui, sans-serif">
            GEMMA
          </text>
          <text x="0" y="65" fill="#a1a1aa" fontSize="11" textAnchor="middle" letterSpacing="1.5" fontFamily="system-ui, sans-serif">
            ANALYZER
          </text>
        </g>

        {/* NODE 3: ADK Remediator (Square with rounded corners) */}
        <g transform="translate(640, 80)">
          <rect 
            x="-28" y="-28" width="56" height="56" rx="12"
            fill="rgba(0, 0, 0, 0.8)" 
            stroke={isProcessing ? "#00f0ff" : "rgba(255,255,255,0.2)"} 
            strokeWidth="2"
            filter={isProcessing ? "url(#cyanGlow)" : "none"}
            style={{ transition: 'all 0.5s ease' }}
          />
          <text x="0" y="55" fill="#a1a1aa" fontSize="11" textAnchor="middle" letterSpacing="1.5" fontFamily="system-ui, sans-serif">
            REMEDIATOR
          </text>
        </g>
      </svg>
    </div>
  );
}