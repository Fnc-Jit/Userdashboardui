import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Network, ZoomIn, ZoomOut, Maximize2, Info, X } from 'lucide-react';
import { devices, riskColors, RiskLevel } from '../data/mockData';

interface NodePos {
  id: string;
  x: number;
  y: number;
  label: string;
  risk: RiskLevel;
  vendor: string;
  trust: number;
}

interface Edge {
  from: string;
  to: string;
  suspicious: boolean;
  label?: string;
  type?: 'normal' | 'trusted' | 'monitored'; // Add type for different line styles
}

// Pre-defined layout
const nodePositions: NodePos[] = [
  { id: 'GATEWAY', x: 400, y: 260, label: 'Gateway', risk: 'trusted', vendor: 'Core', trust: 100 },
  { id: 'DEV-001', x: 180, y: 130, label: 'Thermostat', risk: 'trusted', vendor: 'Nest', trust: 94 },
  { id: 'DEV-002', x: 300, y: 90, label: 'IP Camera', risk: 'low', vendor: 'Hikvision', trust: 71 },
  { id: 'DEV-003', x: 580, y: 120, label: 'PLC #1', risk: 'medium', vendor: 'Siemens', trust: 55 },
  { id: 'DEV-004', x: 650, y: 280, label: 'Med Monitor', risk: 'high', vendor: 'Philips', trust: 28 },
  { id: 'DEV-005', x: 550, y: 420, label: 'Smart Lock', risk: 'critical', vendor: 'Schlage', trust: 11 },
  { id: 'DEV-006', x: 200, y: 310, label: 'Display', risk: 'trusted', vendor: 'Samsung', trust: 88 },
  { id: 'DEV-007', x: 710, y: 170, label: 'PLC #2', risk: 'medium', vendor: 'Rockwell', trust: 47 },
  { id: 'DEV-008', x: 130, y: 240, label: 'HVAC Ctrl', risk: 'low', vendor: 'Honeywell', trust: 79 },
  { id: 'DEV-009', x: 290, y: 390, label: 'Printer', risk: 'low', vendor: 'HP', trust: 63 },
  { id: 'DEV-010', x: 450, y: 420, label: 'Elevator', risk: 'high', vendor: 'KONE', trust: 38 },
  { id: 'DEV-011', x: 100, y: 370, label: 'VoIP GW', risk: 'trusted', vendor: 'Cisco', trust: 85 },
  { id: 'DEV-012', x: 720, y: 360, label: 'Infusion Pump', risk: 'critical', vendor: 'Baxter', trust: 22 },
];

const edges: Edge[] = [
  { from: 'GATEWAY', to: 'DEV-001', suspicious: false, type: 'trusted' },
  { from: 'GATEWAY', to: 'DEV-002', suspicious: false, type: 'monitored' },
  { from: 'GATEWAY', to: 'DEV-003', suspicious: false },
  { from: 'GATEWAY', to: 'DEV-004', suspicious: false },
  { from: 'GATEWAY', to: 'DEV-006', suspicious: false, type: 'trusted' },
  { from: 'GATEWAY', to: 'DEV-008', suspicious: false, type: 'monitored' },
  { from: 'GATEWAY', to: 'DEV-009', suspicious: false },
  { from: 'GATEWAY', to: 'DEV-011', suspicious: false, type: 'trusted' },
  { from: 'DEV-003', to: 'DEV-007', suspicious: false, type: 'monitored' },
  { from: 'DEV-004', to: 'DEV-012', suspicious: true, label: 'Lateral Move' },
  { from: 'DEV-005', to: 'DEV-010', suspicious: true, label: 'Unauthorized' },
  { from: 'DEV-004', to: 'DEV-003', suspicious: true, label: 'Port Scan' },
  { from: 'DEV-012', to: 'DEV-007', suspicious: true, label: 'Anomaly' },
  { from: 'DEV-001', to: 'DEV-006', suspicious: false, type: 'trusted' },
  { from: 'DEV-009', to: 'DEV-005', suspicious: false },
  { from: 'GATEWAY', to: 'DEV-005', suspicious: false },
  { from: 'GATEWAY', to: 'DEV-010', suspicious: false },
  { from: 'GATEWAY', to: 'DEV-007', suspicious: false, type: 'monitored' },
  { from: 'GATEWAY', to: 'DEV-012', suspicious: false },
];

function getRiskColor(risk: RiskLevel): string {
  return riskColors[risk];
}

export default function TopologyPage() {
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<NodePos | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [dashOffset, setDashOffset] = useState(0);
  const animRef = useRef<number>();

  // Animate suspicious edges
  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame++;
      setDashOffset(frame * 0.5);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const getNode = (id: string) => nodePositions.find(n => n.id === id)!;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as SVGElement).closest('.node')) return;
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => Math.max(0.4, Math.min(2.5, s - e.deltaY * 0.001)));
  };

  const nodeRadius = (node: NodePos) => node.id === 'GATEWAY' ? 26 : 20;

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--splunk-bg)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--splunk-border)' }}>
        <div>
          <span className="splunk-subheader block mb-1" style={{ color: 'var(--splunk-orange)' }}>Network Visualization</span>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--splunk-text)' }}>Network Topology</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--splunk-muted)' }}>{nodePositions.length - 1} devices · {edges.filter(e => e.suspicious).length} suspicious connections</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-xs mr-4">
            {[
              { color: 'var(--splunk-green)', label: 'Trusted' },
              { color: '#3B82F6', label: 'Low Risk' },
              { color: 'var(--splunk-gold)', label: 'Medium' },
              { color: 'var(--splunk-orange)', label: 'High' },
              { color: 'var(--splunk-red)', label: 'Critical' },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                <span style={{ color: 'var(--splunk-muted)' }}>{l.label}</span>
              </span>
            ))}
          </div>
          <button onClick={() => setScale(s => Math.min(2.5, s + 0.2))} className="p-2 rounded-lg border hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--splunk-border)', color: 'var(--splunk-muted)' }}>
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setScale(s => Math.max(0.4, s - 0.2))} className="p-2 rounded-lg border hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--splunk-border)', color: 'var(--splunk-muted)' }}>
            <ZoomOut size={16} />
          </button>
          <button onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }} className="p-2 rounded-lg border hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--splunk-border)', color: 'var(--splunk-muted)' }}>
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          ref={svgRef}
          className="w-full h-full select-none"
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <defs>
            {nodePositions.map(n => (
              <radialGradient key={n.id} id={`glow-${n.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={getRiskColor(n.risk)} stopOpacity="0.4" />
                <stop offset="100%" stopColor={getRiskColor(n.risk)} stopOpacity="0" />
              </radialGradient>
            ))}
            {/* Glow filters for edges */}
            <filter id="edge-glow-red" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="edge-glow-green" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="edge-glow-blue" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="edge-glow-gray" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
            {/* Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x="-500" y="-500" width="1800" height="1200" fill="url(#grid)" />

            {/* Edges */}
            {edges.map((edge, i) => {
              const from = getNode(edge.from);
              const to = getNode(edge.to);
              if (!from || !to) return null;
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              
              // Determine edge color and style based on type
              let edgeColor = 'rgba(255,255,255,0.08)';
              let strokeWidth = 1;
              let dashArray: string | undefined = undefined;
              let dashOffsetValue: number | undefined = undefined;
              let isClickable = false;
              let glowFilter = '';
              
              if (edge.suspicious) {
                edgeColor = '#FF4C4C';
                strokeWidth = 2;
                dashArray = '6 4';
                dashOffsetValue = -dashOffset;
                isClickable = true;
                glowFilter = 'url(#edge-glow-red)';
              } else if (edge.type === 'trusted') {
                edgeColor = '#4BDE80';
                strokeWidth = 1.5;
                dashArray = '4 3';
                dashOffsetValue = -dashOffset;
                glowFilter = 'url(#edge-glow-green)';
              } else if (edge.type === 'monitored') {
                edgeColor = '#3B82F6';
                strokeWidth = 1.5;
                dashArray = '4 3';
                dashOffsetValue = -dashOffset;
                glowFilter = 'url(#edge-glow-blue)';
              } else {
                // Normal connections - also dotted
                edgeColor = 'rgba(255,255,255,0.15)';
                dashArray = '3 2';
                dashOffsetValue = -dashOffset;
                glowFilter = 'url(#edge-glow-gray)';
              }
              
              return (
                <g key={`edge-${edge.from}-${edge.to}-${i}`}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={edgeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    {...(dashOffsetValue !== undefined && { strokeDashoffset: dashOffsetValue })}
                    className={isClickable ? 'cursor-pointer' : ''}
                    onClick={isClickable ? (e) => { e.stopPropagation(); setSelectedEdge(edge); setSelectedNode(null); } : undefined}
                    filter={glowFilter}
                  />
                  {edge.suspicious && edge.label && (
                    <text x={midX} y={midY - 8} textAnchor="middle" fill="#FF4C4C" fontSize="9" opacity="0.8">
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodePositions.map(node => {
              const color = getRiskColor(node.risk);
              const r = nodeRadius(node);
              const isSelected = selectedNode?.id === node.id;
              return (
                <g
                  key={node.id}
                  className="node cursor-pointer"
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                    setSelectedEdge(null);
                  }}
                >
                  {/* Glow */}
                  <circle r={r + 16} fill={`url(#glow-${node.id})`} opacity={node.risk === 'critical' || node.risk === 'high' ? 1 : 0.5} />
                  {/* Pulse ring for critical */}
                  {(node.risk === 'critical' || node.risk === 'high') && (
                    <circle r={r + 8} fill="none" stroke={color} strokeWidth="1" opacity="0.3">
                      <animate attributeName="r" values={`${r+6};${r+14};${r+6}`} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Node circle */}
                  <circle
                    r={r}
                    fill="#111111"
                    stroke={color}
                    strokeWidth={isSelected ? 3 : node.risk === 'critical' ? 2.5 : 1.5}
                    style={{ filter: isSelected ? `drop-shadow(0 0 8px ${color})` : undefined }}
                  />
                  {/* Inner fill */}
                  <circle r={r - 4} fill={color} opacity="0.15" />
                  {/* Trust score text */}
                  <text textAnchor="middle" dominantBaseline="central" fill={color} fontSize={node.id === 'GATEWAY' ? '11' : '10'} fontWeight="600">
                    {node.id === 'GATEWAY' ? 'GW' : node.trust}
                  </text>
                  {/* Label */}
                  <text x="0" y={r + 14} textAnchor="middle" fill="#8B8FA3" fontSize="9">
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Info panel - selected node */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-64 rounded-2xl border p-4 backdrop-blur-md" style={{ background: 'var(--splunk-card)', borderColor: 'var(--splunk-border)' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="splunk-subheader" style={{ color: 'var(--splunk-orange)' }}>Device Info</span>
              <button onClick={() => setSelectedNode(null)} style={{ color: 'var(--splunk-muted)' }}><X size={14} /></button>
            </div>
            <div className="space-y-2 mb-4">
              {[
                { label: 'ID', value: selectedNode.id },
                { label: 'Name', value: selectedNode.label },
                { label: 'Vendor', value: selectedNode.vendor },
                { label: 'Trust Score', value: String(selectedNode.trust) },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-xs">
                  <span style={{ color: 'var(--splunk-muted)' }}>{item.label}</span>
                  <span style={{ color: 'var(--splunk-text)' }}>{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--splunk-muted)' }}>Risk Level</span>
                <span className="capitalize" style={{ color: getRiskColor(selectedNode.risk) }}>{selectedNode.risk}</span>
              </div>
            </div>
            {selectedNode.id !== 'GATEWAY' && (
              <button
                onClick={() => navigate(`/dashboard/devices/${selectedNode.id}`)}
                className="w-full py-2 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
                style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--splunk-orange)', border: '1px solid rgba(255,107,53,0.3)' }}
              >
                View Device Details →
              </button>
            )}
          </div>
        )}

        {/* Info panel - selected edge */}
        {selectedEdge && (
          <div className="absolute top-4 right-4 w-64 rounded-2xl border p-4 backdrop-blur-md" style={{ background: 'var(--splunk-card)', borderColor: 'rgba(255,76,76,0.25)' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="splunk-subheader" style={{ color: 'var(--splunk-red)' }}>Threat Detection</span>
              <button onClick={() => setSelectedEdge(null)} style={{ color: 'var(--splunk-muted)' }}><X size={14} /></button>
            </div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--splunk-red)' }}>Suspicious Connection</h3>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--splunk-muted)' }}>From</span>
                <span style={{ color: 'var(--splunk-red)' }}>{selectedEdge.from}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--splunk-muted)' }}>To</span>
                <span style={{ color: 'var(--splunk-red)' }}>{selectedEdge.to}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--splunk-muted)' }}>Type</span>
                <span style={{ color: 'var(--splunk-orange)' }}>{selectedEdge.label || 'Anomalous'}</span>
              </div>
            </div>
            <p className="text-xs" style={{ color: 'var(--splunk-muted)' }}>
              Unauthorized network communication detected between these devices. Investigate for lateral movement.
            </p>
          </div>
        )}

        {/* Help hint */}
        {!selectedNode && !selectedEdge && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs px-3 py-2 rounded-xl border" style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'var(--splunk-border)', color: 'var(--splunk-muted)' }}>
            <Info size={12} />
            Click device or red edge · Scroll to zoom · Drag to pan
          </div>
        )}
      </div>
    </div>
  );
}