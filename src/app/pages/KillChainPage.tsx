import { useState } from 'react';
import { Link2, ChevronRight, Clock, Cpu, AlertTriangle } from 'lucide-react';
import { killChains, attackHeatmap, type KillChain, type ATTACKTactic } from '../data/mockData';

const tacticColors: Record<string, string> = {
  'Reconnaissance': '#3B82F6', 'Initial Access': '#F59E0B', 'Execution': '#EF4444',
  'Persistence': '#8B5CF6', 'Privilege Escalation': '#EC4899', 'Defense Evasion': '#6366F1',
  'Credential Access': '#F97316', 'Discovery': '#14B8A6', 'Lateral Movement': '#EC4899',
  'Collection': '#84CC16', 'Command & Control': '#E02424', 'Exfiltration': '#DC2626',
  'Impact': '#991B1B',
};

function getHeatColor(count: number): string {
  if (count === 0) return '#1A1A2E';
  if (count <= 2) return '#1A56DB40';
  if (count <= 4) return '#F59E0B60';
  if (count <= 6) return '#FF6B3580';
  return '#FF4C4CA0';
}

export default function KillChainPage() {
  const [selectedChain, setSelectedChain] = useState<KillChain>(killChains[0]);

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen" style={{ color: '#E2E2E2' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E02424, #991B1B)' }}>
            <Link2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Kill Chain Correlation</h1>
            <p className="text-xs" style={{ color: '#8B8FA3' }}>MITRE ATT&CK Multi-Stage Attack Visualization</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#FF4C4C' }}>
          <AlertTriangle size={14} />
          Active Chains: {killChains.filter(k => k.status === 'active').length}
        </div>
      </div>

      {/* Attack Chain Graph */}
      <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Attack Chain: {selectedChain.name}</h3>
          <div className="flex items-center gap-4 text-[10px]" style={{ color: '#8B8FA3' }}>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-white inline-block" /> Confirmed</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 inline-block border-t border-dashed" style={{ borderColor: '#8B8FA3' }} /> Suspected</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF4C4C] inline-block" /> Critical</span>
          </div>
        </div>

        {/* Swim-lane kill chain visualization */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-start gap-0 min-w-[800px]">
            {selectedChain.stages.map((stage, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center" style={{ minWidth: 120 }}>
                  {/* Tactic badge */}
                  <div
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-center whitespace-nowrap"
                    style={{ background: `${tacticColors[stage.tactic]}30`, color: tacticColors[stage.tactic], border: `1px solid ${tacticColors[stage.tactic]}50` }}
                  >
                    {stage.tactic}
                  </div>
                  {/* Connecting line */}
                  <div className="w-0.5 h-4" style={{ background: '#2A2A3A' }} />
                  {/* Technique node */}
                  <div
                    className={`p-2.5 rounded-lg text-center border ${stage.confirmed ? '' : 'border-dashed'}`}
                    style={{
                      background: '#0C0C0C',
                      borderColor: stage.confirmed ? tacticColors[stage.tactic] : '#8B8FA3',
                      boxShadow: stage.confirmed ? `0 0 12px ${tacticColors[stage.tactic]}30` : 'none',
                    }}
                  >
                    <div className="text-[10px] font-medium text-white">{stage.technique}</div>
                    <div className="flex items-center justify-center gap-1 mt-1 text-[9px]" style={{ color: '#8B8FA3' }}>
                      <Cpu size={9} /> {stage.deviceId}
                    </div>
                    <div className="text-[9px] mt-0.5" style={{ color: '#8B8FA3' }}>
                      {new Date(stage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                {/* Arrow between stages */}
                {idx < selectedChain.stages.length - 1 && (
                  <div className="flex items-center mx-1 mt-4">
                    <div className={`w-8 h-0.5 ${selectedChain.stages[idx + 1].confirmed ? 'bg-white' : 'border-t border-dashed'}`} style={{ borderColor: '#8B8FA3' }} />
                    <ChevronRight size={12} style={{ color: selectedChain.stages[idx + 1].confirmed ? '#fff' : '#8B8FA3' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Chains + ATT&CK Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Chains */}
        <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <h3 className="text-sm font-semibold text-white mb-3">Active Chains</h3>
          <div className="space-y-2">
            {killChains.map(chain => (
              <button
                key={chain.id}
                onClick={() => setSelectedChain(chain)}
                className={`w-full p-3 rounded-lg text-left transition-all ${selectedChain.id === chain.id ? 'ring-1' : ''}`}
                style={{
                  background: selectedChain.id === chain.id ? '#1A1A2E' : '#0C0C0C',
                  outline: selectedChain.id === chain.id ? '1px solid #E02424' : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">{chain.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold" style={{ background: '#FF4C4C20', color: '#FF4C4C' }}>
                    {chain.severity}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px]" style={{ color: '#8B8FA3' }}>
                  <span>{chain.stages.length} stages</span>
                  <span>{chain.devices.length} devices</span>
                  <span className="flex items-center gap-1"><Clock size={9} /> {chain.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ATT&CK Heatmap */}
        <div className="lg:col-span-2 rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <h3 className="text-sm font-semibold text-white mb-3">MITRE ATT&CK Detection Heatmap</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {attackHeatmap.map(item => (
              <div
                key={item.tactic}
                className="p-2 rounded-lg text-center cursor-pointer hover:ring-1 transition-all"
                style={{
                  background: getHeatColor(item.detections),
                  outline: `1px solid ${tacticColors[item.tactic]}40`,
                }}
                title={`${item.tactic}: ${item.detections} detections`}
              >
                <div className="text-[9px] font-medium text-white leading-tight">{item.tactic}</div>
                <div className="text-lg font-bold mt-1" style={{ color: item.detections > 0 ? '#fff' : '#8B8FA3' }}>
                  {item.detections}
                </div>
                <div className="text-[8px]" style={{ color: '#8B8FA3' }}>detections</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-3 text-[10px]" style={{ color: '#8B8FA3' }}>
            <span>Color scale:</span>
            {[0, 2, 4, 6, 8].map(n => (
              <span key={n} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded" style={{ background: getHeatColor(n) }} /> {n}+
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
