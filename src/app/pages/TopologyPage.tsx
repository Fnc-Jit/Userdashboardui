import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Network, ZoomIn, ZoomOut, Maximize2, Info, X, Download, Layers, Clock, Shield } from 'lucide-react';
import { devices, riskColors, RiskLevel, killChains, uebaEntities, attackHeatmap, ATTACKTactic } from '../data/mockData';

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
  type?: 'normal' | 'trusted' | 'monitored';
  killChainTactic?: ATTACKTactic;
  uebaRelated?: boolean;
}

type LayerView = 'network' | 'killchain' | 'ueba';

// ATT&CK tactic colors
const tacticColors: Partial<Record<ATTACKTactic, string>> = {
  'Reconnaissance': '#3B82F6',
  'Initial Access': '#F59E0B',
  'Execution': '#EF4444',
  'Persistence': '#8B5CF6',
  'Credential Access': '#EC4899',
  'Lateral Movement': '#EC4899',
  'Command & Control': '#DC2626',
  'Exfiltration': '#DC2626',
  'Impact': '#991B1B',
  'Discovery': '#06B6D4',
  'Defense Evasion': '#6B7280',
  'Collection': '#F97316',
  'Privilege Escalation': '#7C3AED',
};

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

const baseEdges: Edge[] = [
  { from: 'GATEWAY', to: 'DEV-001', suspicious: false, type: 'trusted' },
  { from: 'GATEWAY', to: 'DEV-002', suspicious: false, type: 'monitored' },
  { from: 'GATEWAY', to: 'DEV-003', suspicious: false },
  { from: 'GATEWAY', to: 'DEV-004', suspicious: false },
  { from: 'GATEWAY', to: 'DEV-006', suspicious: false, type: 'trusted' },
  { from: 'GATEWAY', to: 'DEV-008', suspicious: false, type: 'monitored' },
  { from: 'GATEWAY', to: 'DEV-009', suspicious: false },
  { from: 'GATEWAY', to: 'DEV-011', suspicious: false, type: 'trusted' },
  { from: 'DEV-003', to: 'DEV-007', suspicious: false, type: 'monitored' },
  { from: 'DEV-004', to: 'DEV-012', suspicious: true, label: 'Lateral Move', killChainTactic: 'Lateral Movement' },
  { from: 'DEV-005', to: 'DEV-010', suspicious: true, label: 'Unauthorized', killChainTactic: 'Lateral Movement' },
  { from: 'DEV-004', to: 'DEV-003', suspicious: true, label: 'Port Scan', killChainTactic: 'Reconnaissance' },
  { from: 'DEV-012', to: 'DEV-007', suspicious: true, label: 'Anomaly', killChainTactic: 'Execution' },
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

// Devices involved in UEBA entities
const uebaDeviceIds = new Set(uebaEntities.map(e => e.deviceId));
// Devices involved in kill chains
const killChainDeviceIds = new Set(killChains.flatMap(kc => kc.devices));

// Timeline hours for scrubber
const timelineHours = Array.from({ length: 25 }, (_, i) => {
  const h = i;
  return `${String(h).padStart(2, '0')}:00`;
});

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
  const animRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // SIEM layer states
  const [activeLayer, setActiveLayer] = useState<LayerView>('network');
  const [attackOverlay, setAttackOverlay] = useState(false);
  const [timelineValue, setTimelineValue] = useState(24); // 0-24 hours (24 = now)

  // Calculate graph bounding box
  const graphBounds = (() => {
    const padding = 50;
    const minX = nodePositions.reduce((m, n) => Math.min(m, n.x), Infinity) - padding;
    const maxX = nodePositions.reduce((m, n) => Math.max(m, n.x), -Infinity) + padding;
    const minY = nodePositions.reduce((m, n) => Math.min(m, n.y), Infinity) - padding;
    const maxY = nodePositions.reduce((m, n) => Math.max(m, n.y), -Infinity) + padding;
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
  })();

  // Center graph in container
  const centerGraph = useCallback((containerEl?: HTMLDivElement | null, newScale?: number) => {
    const el = containerEl || containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = newScale ?? scale;
    setOffset({
      x: rect.width / 2 - graphBounds.cx * s,
      y: rect.height / 2 - graphBounds.cy * s,
    });
  }, [graphBounds.cx, graphBounds.cy, scale]);

  // Center on mount and window resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scaleX = rect.width / graphBounds.width;
    const scaleY = rect.height / graphBounds.height;
    const fitScale = Math.min(scaleX, scaleY, 1.2) * 0.85;
    setScale(fitScale);
    setOffset({
      x: rect.width / 2 - graphBounds.cx * fitScale,
      y: rect.height / 2 - graphBounds.cy * fitScale,
    });

    const observer = new ResizeObserver(() => centerGraph(el));
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Filter nodes/edges based on active layer
  const getVisibleNodes = () => {
    if (activeLayer === 'killchain') {
      return nodePositions.filter(n => killChainDeviceIds.has(n.id) || n.id === 'GATEWAY');
    }
    if (activeLayer === 'ueba') {
      return nodePositions.filter(n => uebaDeviceIds.has(n.id) || n.id === 'GATEWAY');
    }
    return nodePositions;
  };

  const getVisibleEdges = () => {
    const visibleNodeIds = new Set(getVisibleNodes().map(n => n.id));
    let edges = baseEdges.filter(e => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to));

    if (activeLayer === 'killchain') {
      // Show only suspicious edges with kill chain tactics + gateway connections
      edges = edges.filter(e => e.suspicious || e.from === 'GATEWAY' || e.to === 'GATEWAY');
    }

    // Timeline filter — simulate fewer edges at earlier times
    if (timelineValue < 24) {
      const fraction = timelineValue / 24;
      const edgeCount = Math.max(Math.floor(edges.length * fraction), edges.filter(e => !e.suspicious).length);
      // Keep normal edges, but only show suspicious edges based on timeline
      const normalEdges = edges.filter(e => !e.suspicious);
      const suspiciousEdges = edges.filter(e => e.suspicious);
      const visibleSuspicious = suspiciousEdges.slice(0, Math.floor(suspiciousEdges.length * fraction));
      edges = [...normalEdges, ...visibleSuspicious];
    }

    return edges;
  };

  const visibleNodes = getVisibleNodes();
  const visibleEdges = getVisibleEdges();

  // Export SVG
  const handleExport = (format: 'svg' | 'png') => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    if (format === 'svg') {
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iot-sentinel-topology-${activeLayer}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#0C0C0C';
        ctx.fillRect(0, 0, 1920, 1080);
        ctx.drawImage(img, 0, 0, 1920, 1080);
        canvas.toBlob(blob => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `iot-sentinel-topology-${activeLayer}.png`;
          a.click();
          URL.revokeObjectURL(url);
        });
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const layerTabs: { id: LayerView; label: string; icon: string; color: string }[] = [
    { id: 'network', label: 'Network Flows', icon: '🕸️', color: '#1A56DB' },
    { id: 'killchain', label: 'Kill Chain Paths', icon: '⛓️', color: '#E02424' },
    { id: 'ueba', label: 'UEBA Graph', icon: '🧠', color: '#7E3AF2' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--splunk-bg)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b shrink-0" style={{ borderColor: 'var(--splunk-border)' }}>
        <div>
          <span className="splunk-subheader block mb-0.5" style={{ color: 'var(--splunk-orange)' }}>Network Visualization</span>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--splunk-text)' }}>Network Topology</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--splunk-muted)' }}>{visibleNodes.length - 1} devices · {visibleEdges.filter(e => e.suspicious).length} suspicious connections</p>
        </div>
        <div className="flex items-center gap-2">
          {/* ATT&CK Overlay */}
          <button
            onClick={() => setAttackOverlay(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all hover:opacity-80"
            style={{
              background: attackOverlay ? 'rgba(224,36,36,0.12)' : 'transparent',
              borderColor: attackOverlay ? 'rgba(224,36,36,0.3)' : 'var(--splunk-border)',
              color: attackOverlay ? '#E02424' : 'var(--splunk-muted)',
            }}
          >
            <Shield size={13} />
            ATT&CK
          </button>

          {/* Export dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--splunk-border)', color: 'var(--splunk-muted)' }}>
              <Download size={13} />
              Export
            </button>
            <div className="absolute right-0 top-full mt-1 rounded-lg border py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all" style={{ background: '#1A1A2E', borderColor: 'var(--splunk-border)', minWidth: 120 }}>
              <button onClick={() => handleExport('svg')} className="w-full px-3 py-1.5 text-left text-xs hover:bg-white/5" style={{ color: 'var(--splunk-text)' }}>Download SVG</button>
              <button onClick={() => handleExport('png')} className="w-full px-3 py-1.5 text-left text-xs hover:bg-white/5" style={{ color: 'var(--splunk-text)' }}>Download PNG</button>
            </div>
          </div>

          {/* Legend */}
          <div className="hidden lg:flex items-center gap-3 text-xs ml-2">
            {[
              { color: 'var(--splunk-green)', label: 'Trusted' },
              { color: '#3B82F6', label: 'Low' },
              { color: 'var(--splunk-gold)', label: 'Medium' },
              { color: 'var(--splunk-orange)', label: 'High' },
              { color: 'var(--splunk-red)', label: 'Critical' },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span style={{ color: 'var(--splunk-muted)' }}>{l.label}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 ml-2">
            <button onClick={() => setScale(s => Math.min(2.5, s + 0.2))} className="p-1.5 rounded-lg border hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--splunk-border)', color: 'var(--splunk-muted)' }}>
              <ZoomIn size={14} />
            </button>
            <button onClick={() => setScale(s => Math.max(0.4, s - 0.2))} className="p-1.5 rounded-lg border hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--splunk-border)', color: 'var(--splunk-muted)' }}>
              <ZoomOut size={14} />
            </button>
            <button onClick={() => {
              const el = containerRef.current;
              if (!el) return;
              const rect = el.getBoundingClientRect();
              const scaleX = rect.width / graphBounds.width;
              const scaleY = rect.height / graphBounds.height;
              const fitScale = Math.min(scaleX, scaleY, 1.2) * 0.85;
              setScale(fitScale);
              setOffset({ x: rect.width / 2 - graphBounds.cx * fitScale, y: rect.height / 2 - graphBounds.cy * fitScale });
            }} className="p-1.5 rounded-lg border hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--splunk-border)', color: 'var(--splunk-muted)' }}>
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Selector Tabs */}
      <div className="flex items-center gap-1 px-6 py-2 border-b shrink-0" style={{ borderColor: 'var(--splunk-border)' }}>
        <Layers size={14} style={{ color: 'var(--splunk-muted)' }} className="mr-2" />
        {layerTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveLayer(tab.id); setSelectedNode(null); setSelectedEdge(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: activeLayer === tab.id ? `${tab.color}15` : 'transparent',
              color: activeLayer === tab.id ? tab.color : 'var(--splunk-muted)',
              border: `1px solid ${activeLayer === tab.id ? `${tab.color}30` : 'transparent'}`,
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.id === 'killchain' && <span className="ml-1 px-1 py-0 rounded text-[9px] font-bold" style={{ background: '#E0242420', color: '#E02424' }}>{killChains.filter(k => k.status === 'active').length}</span>}
          </button>
        ))}

        {/* Timeline Scrubber */}
        <div className="flex items-center gap-2 ml-auto">
          <Clock size={13} style={{ color: 'var(--splunk-muted)' }} />
          <span className="text-[10px] font-mono" style={{ color: 'var(--splunk-muted)' }}>-24h</span>
          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={timelineValue}
            onChange={e => setTimelineValue(Number(e.target.value))}
            className="w-32 h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--splunk-orange) ${(timelineValue / 24) * 100}%, #2A2A3A ${(timelineValue / 24) * 100}%)`,
              accentColor: 'var(--splunk-orange)',
            }}
          />
          <span className="text-[10px] font-mono min-w-[32px]" style={{ color: timelineValue === 24 ? '#4BDE80' : 'var(--splunk-orange)' }}>
            {timelineValue === 24 ? 'Now' : `${timelineValue}h`}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
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
            <filter id="edge-glow-red" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="edge-glow-green" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="edge-glow-blue" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="edge-glow-gray" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="edge-glow-purple" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
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
            {visibleEdges.map((edge, i) => {
              const from = getNode(edge.from);
              const to = getNode(edge.to);
              if (!from || !to) return null;
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;

              let edgeColor = 'rgba(255,255,255,0.08)';
              let strokeWidth = 1;
              let dashArray: string | undefined = undefined;
              let dashOffsetValue: number | undefined = undefined;
              let isClickable = false;
              let glowFilter = '';
              let edgeLabel = edge.label;

              // ATT&CK overlay coloring
              if (attackOverlay && edge.killChainTactic) {
                edgeColor = tacticColors[edge.killChainTactic] || '#FF4C4C';
                strokeWidth = 2.5;
                dashArray = '6 4';
                dashOffsetValue = -dashOffset;
                isClickable = true;
                glowFilter = 'url(#edge-glow-red)';
                edgeLabel = edge.killChainTactic;
              } else if (edge.suspicious) {
                edgeColor = '#FF4C4C';
                strokeWidth = 2;
                dashArray = '6 4';
                dashOffsetValue = -dashOffset;
                isClickable = true;
                glowFilter = 'url(#edge-glow-red)';
              } else if (activeLayer === 'ueba' && (uebaDeviceIds.has(edge.from) || uebaDeviceIds.has(edge.to)) && edge.from !== 'GATEWAY' && edge.to !== 'GATEWAY') {
                edgeColor = '#7E3AF2';
                strokeWidth = 2;
                dashArray = '5 3';
                dashOffsetValue = -dashOffset;
                glowFilter = 'url(#edge-glow-purple)';
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
                  {(edge.suspicious || (attackOverlay && edge.killChainTactic)) && edgeLabel && (
                    <text x={midX} y={midY - 8} textAnchor="middle" fill={edgeColor} fontSize="9" opacity="0.9" fontWeight="600">
                      {edgeLabel}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {visibleNodes.map(node => {
              const color = getRiskColor(node.risk);
              const r = nodeRadius(node);
              const isSelected = selectedNode?.id === node.id;
              const isUeba = uebaDeviceIds.has(node.id);
              const isKillChain = killChainDeviceIds.has(node.id);

              // UEBA ring effect
              const showUebaRing = activeLayer === 'ueba' && isUeba;
              // Kill chain ring effect
              const showKcRing = activeLayer === 'killchain' && isKillChain;

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

                  {/* UEBA ring */}
                  {showUebaRing && (
                    <circle r={r + 10} fill="none" stroke="#7E3AF2" strokeWidth="2" strokeDasharray="4 3" opacity="0.6">
                      <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Kill Chain ring */}
                  {showKcRing && (
                    <circle r={r + 10} fill="none" stroke="#E02424" strokeWidth="2" strokeDasharray="4 3" opacity="0.6">
                      <animate attributeName="stroke-dashoffset" values="0;-14" dur="1s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Pulse ring for critical */}
                  {(node.risk === 'critical' || node.risk === 'high') && (
                    <circle r={r + 8} fill="none" stroke={color} strokeWidth="1" opacity="0.3">
                      <animate attributeName="r" values={`${r + 6};${r + 14};${r + 6}`} dur="2s" repeatCount="indefinite" />
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
                  {/* Layer indicator badges */}
                  {activeLayer === 'ueba' && isUeba && (
                    <text x={r + 4} y={-r + 2} fontSize="8" fill="#7E3AF2" fontWeight="bold">
                      {uebaEntities.find(e => e.deviceId === node.id)?.driftSigma.toFixed(1)}σ
                    </text>
                  )}
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

              {/* UEBA context */}
              {activeLayer === 'ueba' && uebaDeviceIds.has(selectedNode.id) && (() => {
                const entity = uebaEntities.find(e => e.deviceId === selectedNode.id);
                if (!entity) return null;
                return (
                  <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--splunk-border)' }}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#7E3AF2' }}>UEBA Drift</span>
                      <span className="font-bold" style={{ color: entity.status === 'alert' ? '#FF4C4C' : '#FFB347' }}>+{entity.driftSigma}σ</span>
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--splunk-muted)' }}>
                      Top drift: {entity.features.sort((a, b) => (b.current / b.baseline) - (a.current / a.baseline))[0]?.name}
                    </div>
                  </div>
                );
              })()}

              {/* Kill chain context */}
              {activeLayer === 'killchain' && killChainDeviceIds.has(selectedNode.id) && (() => {
                const chains = killChains.filter(kc => kc.devices.includes(selectedNode.id));
                if (chains.length === 0) return null;
                return (
                  <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--splunk-border)' }}>
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#E02424' }}>Kill Chains</div>
                    {chains.map(kc => (
                      <div key={kc.id} className="flex justify-between text-xs mb-0.5">
                        <span style={{ color: 'var(--splunk-text)' }}>{kc.name}</span>
                        <span className="capitalize" style={{ color: kc.severity === 'critical' ? '#FF4C4C' : '#FF6B35' }}>{kc.severity}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
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
              {selectedEdge.killChainTactic && (
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--splunk-muted)' }}>ATT&CK Tactic</span>
                  <span style={{ color: tacticColors[selectedEdge.killChainTactic] || '#FF4C4C' }}>{selectedEdge.killChainTactic}</span>
                </div>
              )}
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
            Click device or red edge · Scroll to zoom · Drag to pan · Use tabs to switch layers
          </div>
        )}

        {/* Active layer indicator */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border" style={{
          background: `${layerTabs.find(t => t.id === activeLayer)!.color}10`,
          borderColor: `${layerTabs.find(t => t.id === activeLayer)!.color}25`,
          color: layerTabs.find(t => t.id === activeLayer)!.color,
        }}>
          {layerTabs.find(t => t.id === activeLayer)!.icon} {layerTabs.find(t => t.id === activeLayer)!.label}
          {attackOverlay && <span className="ml-2" style={{ color: '#E02424' }}>+ ATT&CK</span>}
          {timelineValue < 24 && <span className="ml-2" style={{ color: 'var(--splunk-orange)' }}>@ T-{24 - timelineValue}h</span>}
        </div>
      </div>
    </div>
  );
}