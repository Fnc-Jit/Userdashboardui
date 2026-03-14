import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, AlertTriangle, Shield, Cpu, ExternalLink,
  CheckCircle, Clock, FileText, Users, Zap, ChevronRight,
  Link2, Play, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell,
} from 'recharts';
import { getIncidentById, getDeviceById, riskColors, killChains, incidents, socQueue, ATTACKTactic } from '../data/mockData';
import { RiskBadge, StatusBadge } from '../components/RiskBadge';

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

// SHAP feature contributions (mock per-incident)
const shapData: Record<string, { feature: string; contribution: number; direction: 'positive' | 'negative' }[]> = {
  'INC-001': [
    { feature: 'dns_entropy', contribution: 0.32, direction: 'positive' },
    { feature: 'conn_rate', contribution: 0.28, direction: 'positive' },
    { feature: 'off_hours_activity', contribution: 0.18, direction: 'positive' },
    { feature: 'unique_destinations', contribution: 0.12, direction: 'positive' },
    { feature: 'bytes_ratio', contribution: 0.06, direction: 'positive' },
    { feature: 'firmware_version', contribution: -0.04, direction: 'negative' },
    { feature: 'iat_mean', contribution: -0.08, direction: 'negative' },
  ],
  'INC-002': [
    { feature: 'conn_rate', contribution: 0.35, direction: 'positive' },
    { feature: 'beaconing_score', contribution: 0.30, direction: 'positive' },
    { feature: 'bytes_ratio', contribution: 0.15, direction: 'positive' },
    { feature: 'unique_destinations', contribution: 0.10, direction: 'positive' },
    { feature: 'dns_entropy', contribution: 0.08, direction: 'positive' },
    { feature: 'iat_mean', contribution: -0.05, direction: 'negative' },
    { feature: 'firmware_version', contribution: -0.03, direction: 'negative' },
  ],
  'INC-003': [
    { feature: 'beaconing_score', contribution: 0.40, direction: 'positive' },
    { feature: 'dns_entropy', contribution: 0.25, direction: 'positive' },
    { feature: 'off_hours_activity', contribution: 0.15, direction: 'positive' },
    { feature: 'conn_rate', contribution: 0.10, direction: 'positive' },
    { feature: 'unique_destinations', contribution: 0.05, direction: 'positive' },
    { feature: 'bytes_ratio', contribution: -0.03, direction: 'negative' },
    { feature: 'iat_mean', contribution: -0.06, direction: 'negative' },
  ],
};

// Default SHAP data for unknown incidents
const defaultShapData = [
  { feature: 'conn_rate', contribution: 0.25, direction: 'positive' as const },
  { feature: 'dns_entropy', contribution: 0.20, direction: 'positive' as const },
  { feature: 'off_hours_activity', contribution: 0.15, direction: 'positive' as const },
  { feature: 'bytes_ratio', contribution: 0.10, direction: 'positive' as const },
  { feature: 'unique_destinations', contribution: 0.08, direction: 'positive' as const },
  { feature: 'firmware_version', contribution: -0.05, direction: 'negative' as const },
  { feature: 'iat_mean', contribution: -0.07, direction: 'negative' as const },
];

// Similar incidents mock data
function getSimilarIncidents(currentId: string) {
  return incidents
    .filter(i => i.id !== currentId)
    .map(i => ({
      ...i,
      similarity: Math.floor(60 + Math.random() * 35),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
}

type DetailTab = 'evidence' | 'killchain' | 'shap' | 'similar';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const incident = getIncidentById(id!);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [status, setStatus] = useState(incident?.status || 'open');
  const [activeTab, setActiveTab] = useState<DetailTab>('evidence');

  if (!incident) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: '#0C0C0C', color: '#8B8FA3' }}>
        Incident not found.
      </div>
    );
  }

  const device = getDeviceById(incident.deviceId);
  const riskColor = riskColors[incident.riskLevel];
  const sevColor = riskColors[incident.severity as keyof typeof riskColors] || '#FFB347';

  // Get kill chains involving this incident's device
  const relatedChains = killChains.filter(kc => kc.devices.includes(incident.deviceId));
  const incidentShap = shapData[incident.id] || defaultShapData;
  const similarIncidents = getSimilarIncidents(incident.id);

  // SOC playbook for this incident
  const socItem = socQueue.find(s => s.incidentId === incident.id);

  const addNote = () => {
    if (note.trim()) {
      setNotes(prev => [`[${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}] ${note}`, ...prev]);
      setNote('');
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as any);
  };

  const tabs: { id: DetailTab; label: string; count?: number }[] = [
    { id: 'evidence', label: 'Evidence', count: incident.evidence.length },
    { id: 'killchain', label: 'Kill Chain', count: relatedChains.length },
    { id: 'shap', label: 'SHAP Analysis' },
    { id: 'similar', label: 'Similar Incidents', count: similarIncidents.length },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-5 min-h-full" style={{ background: '#0C0C0C' }}>
      {/* Back */}
      <button onClick={() => navigate('/dashboard/incidents')} className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: '#8B8FA3' }}>
        <ArrowLeft size={16} />
        Back to Incidents
      </button>

      {/* Incident header */}
      <div className="rounded-2xl p-6 border relative overflow-hidden" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top left, ${riskColor}06, transparent 60%)` }} />
        <span className="splunk-subheader block mb-3" style={{ color: '#E8478C' }}>Incident Investigation</span>
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${riskColor}12`, border: `2px solid ${riskColor}25` }}>
              <AlertTriangle size={26} style={{ color: riskColor }} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-xl font-bold font-mono" style={{ color: '#FFFFFF' }}>{incident.id}</h1>
                <RiskBadge level={incident.riskLevel} size="md" />
                <StatusBadge status={status as any} size="md" />
              </div>
              <p className="text-sm" style={{ color: '#8B8FA3' }}>
                Created {new Date(incident.createdAt).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          {/* Quick actions */}
          <div className="lg:ml-auto flex items-center gap-2 flex-wrap">
            {/* Playbook launcher */}
            {socItem && (
              <button
                onClick={() => navigate('/dashboard/soc')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-all hover:opacity-80"
                style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: '#10B981' }}
              >
                <Play size={12} />
                Run {socItem.playbook.replace(/_/g, ' ')}
              </button>
            )}
            {['open', 'investigating', 'resolved', 'closed'].map(s => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className="px-3 py-1.5 rounded-xl text-xs border capitalize transition-all hover:opacity-80"
                style={status === s
                  ? { background: 'rgba(255,107,53,0.15)', borderColor: 'rgba(255,107,53,0.4)', color: '#FF6B35' }
                  : { borderColor: '#2A2A3A', color: '#8B8FA3' }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Risk Summary */}
          <div className="rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
            <span className="splunk-subheader block mb-2" style={{ color: '#FF6B35' }}>Risk Assessment</span>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Risk Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: '#2A2A3A' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: riskColor }}>{incident.trustScore}</div>
                <div className="text-xs" style={{ color: '#8B8FA3' }}>Trust Score</div>
              </div>
              <div className="text-center p-4 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: '#2A2A3A' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: sevColor }}>{incident.confidence}%</div>
                <div className="text-xs" style={{ color: '#8B8FA3' }}>AI Confidence</div>
              </div>
              <div className="text-center p-4 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: '#2A2A3A' }}>
                <div className="text-sm font-semibold mb-1 capitalize" style={{ color: sevColor }}>{incident.severity}</div>
                <div className="text-xs" style={{ color: '#8B8FA3' }}>Severity</div>
              </div>
            </div>
          </div>

          {/* Incident Narrative */}
          <div className="rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
            <div className="flex items-center gap-2 mb-1">
              <FileText size={15} style={{ color: '#FF6B35' }} />
              <span className="splunk-subheader" style={{ color: '#E8478C' }}>AI Analysis</span>
            </div>
            <h2 className="text-sm font-semibold mb-3" style={{ color: '#FFFFFF' }}>Incident Narrative</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#8B8FA3' }}>{incident.narrative}</p>
          </div>

          {/* Tab Bar: Evidence | Kill Chain | SHAP | Similar */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
            <div className="flex border-b" style={{ borderColor: '#2A2A3A' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-1.5 px-5 py-3 text-xs font-medium transition-colors"
                  style={{ color: activeTab === tab.id ? '#FFFFFF' : '#8B8FA3' }}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{
                      background: activeTab === tab.id ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.05)',
                      color: activeTab === tab.id ? '#FF6B35' : '#8B8FA3',
                    }}>{tab.count}</span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#FF6B35' }} />
                  )}
                </button>
              ))}
            </div>

            {/* Evidence Tab */}
            {activeTab === 'evidence' && (
              <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
                {incident.evidence.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: riskColor }} />
                    <p className="text-sm" style={{ color: '#8B8FA3' }}>{ev}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Kill Chain Tab */}
            {activeTab === 'killchain' && (
              <div className="p-5">
                {relatedChains.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield size={28} className="mx-auto mb-2 opacity-30" style={{ color: '#8B8FA3' }} />
                    <p className="text-sm" style={{ color: '#8B8FA3' }}>No kill chain detected for this incident</p>
                  </div>
                ) : (
                  relatedChains.map(chain => (
                    <div key={chain.id} className="mb-6 last:mb-0">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>{chain.name}</h3>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{
                              background: chain.severity === 'critical' ? '#FF4C4C15' : '#FF6B3515',
                              color: chain.severity === 'critical' ? '#FF4C4C' : '#FF6B35',
                            }}>{chain.severity}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{
                              background: chain.status === 'active' ? '#FF4C4C15' : '#4BDE8015',
                              color: chain.status === 'active' ? '#FF4C4C' : '#4BDE80',
                            }}>{chain.status}</span>
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: '#8B8FA3' }}>
                            {chain.devices.length} devices · {chain.duration} · Started {new Date(chain.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button
                          onClick={() => navigate('/dashboard/kill-chain')}
                          className="text-xs px-2 py-1 rounded-lg border hover:opacity-80 transition-opacity"
                          style={{ borderColor: '#E0242430', color: '#E02424' }}
                        >
                          View Full Chain →
                        </button>
                      </div>

                      {/* Kill Chain Stepper */}
                      <div className="relative ml-3">
                        <div className="absolute left-2 top-3 bottom-3 w-0.5" style={{ background: '#2A2A3A' }} />
                        {chain.stages.map((stage, si) => {
                          const isThisDevice = stage.deviceId === incident.deviceId;
                          const color = tacticColors[stage.tactic] || '#8B8FA3';
                          return (
                            <div key={si} className="flex items-start gap-4 mb-3 last:mb-0 relative">
                              <div className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{
                                background: stage.confirmed ? color : '#1A1A2E',
                                border: `2px solid ${stage.confirmed ? color : '#3A3A4A'}`,
                              }}>
                                {stage.confirmed ? (
                                  <CheckCircle size={10} style={{ color: '#fff' }} />
                                ) : (
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#3A3A4A' }} />
                                )}
                              </div>
                              <div className={`flex-1 rounded-lg p-2.5 border ${isThisDevice ? '' : ''}`} style={{
                                background: isThisDevice ? `${color}08` : 'rgba(255,255,255,0.02)',
                                borderColor: isThisDevice ? `${color}20` : '#2A2A3A',
                              }}>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-semibold" style={{ color }}>{stage.tactic}</span>
                                  {isThisDevice && (
                                    <span className="text-[8px] px-1 py-0 rounded" style={{ background: `${riskColor}20`, color: riskColor }}>THIS DEVICE</span>
                                  )}
                                  {!stage.confirmed && (
                                    <span className="text-[8px] px-1 py-0 rounded" style={{ background: '#FFB34720', color: '#FFB347' }}>SUSPECTED</span>
                                  )}
                                </div>
                                <div className="text-xs" style={{ color: '#8B8FA3' }}>{stage.technique}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-mono" style={{ color: '#8B8FA3' }}>{stage.deviceId}</span>
                                  <span className="text-[10px]" style={{ color: '#8B8FA3' }}>
                                    {new Date(stage.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SHAP Analysis Tab */}
            {activeTab === 'shap' && (
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={15} style={{ color: '#FF6B35' }} />
                  <h3 className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Feature Contribution (SHAP Waterfall)</h3>
                </div>
                <p className="text-xs mb-4" style={{ color: '#8B8FA3' }}>
                  Shows how each behavioral feature contributed to the anomaly score. Positive values increase risk; negative values decrease risk.
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={incidentShap.map(d => ({
                      ...d,
                      value: d.direction === 'negative' ? -Math.abs(d.contribution) : Math.abs(d.contribution),
                    }))}
                    layout="vertical"
                    margin={{ left: 120, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[-0.15, 0.5]}
                      tick={{ fill: '#8B8FA3', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
                    />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      tick={{ fill: '#8B8FA3', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={110}
                    />
                    <Tooltip
                      contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A3A', borderRadius: 8 }}
                      labelStyle={{ color: '#FFFFFF' }}
                      formatter={(value: number) => [value >= 0 ? `+${value.toFixed(3)}` : value.toFixed(3), 'SHAP']}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {incidentShap.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={entry.direction === 'positive' ? '#FF4C4C' : '#4BDE80'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2 justify-center">
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <div className="w-3 h-2 rounded-sm" style={{ background: '#FF4C4C' }} />
                    <span style={{ color: '#8B8FA3' }}>Increases Risk</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <div className="w-3 h-2 rounded-sm" style={{ background: '#4BDE80' }} />
                    <span style={{ color: '#8B8FA3' }}>Decreases Risk</span>
                  </div>
                </div>
              </div>
            )}

            {/* Similar Incidents Tab */}
            {activeTab === 'similar' && (
              <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
                {similarIncidents.map(sim => (
                  <div
                    key={sim.id}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    onClick={() => navigate(`/dashboard/incidents/${sim.id}`)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${riskColors[sim.riskLevel]}12` }}>
                        <Link2 size={16} style={{ color: riskColors[sim.riskLevel] }} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono" style={{ color: '#FFFFFF' }}>{sim.id}</span>
                          <RiskBadge level={sim.riskLevel} size="sm" />
                        </div>
                        <div className="text-xs truncate mt-0.5" style={{ color: '#8B8FA3' }}>
                          {sim.deviceId} · {sim.recommendedAction}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{
                          color: sim.similarity >= 80 ? '#FF4C4C' : sim.similarity >= 60 ? '#FFB347' : '#8B8FA3'
                        }}>{sim.similarity}%</div>
                        <div className="text-[10px]" style={{ color: '#8B8FA3' }}>match</div>
                      </div>
                      <ChevronRight size={14} style={{ color: '#8B8FA3' }} />
                    </div>
                  </div>
                ))}
                <div className="px-5 py-3 text-center">
                  <p className="text-[10px]" style={{ color: '#8B8FA3' }}>ML-matched based on feature vectors, attack patterns, and device class</p>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Action */}
          <div className="rounded-2xl p-5 border" style={{ background: `${riskColor}06`, borderColor: `${riskColor}20` }}>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={15} style={{ color: riskColor }} />
              <span className="splunk-subheader" style={{ color: '#FFB347' }}>Remediation</span>
            </div>
            <h2 className="text-sm font-semibold mb-2" style={{ color: '#FFFFFF' }}>Recommended Action</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: riskColor }}>{incident.recommendedAction}</p>
                <p className="text-xs" style={{ color: '#8B8FA3' }}>Runbook: Execute containment procedure and notify security team lead.</p>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                {socItem && (
                  <button
                    onClick={() => navigate('/dashboard/soc')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border hover:opacity-80 transition-opacity"
                    style={{ borderColor: 'rgba(16,185,129,0.4)', color: '#10B981', background: 'rgba(16,185,129,0.08)' }}
                  >
                    <Play size={12} />
                    Playbook
                  </button>
                )}
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border hover:opacity-80 transition-opacity" style={{ borderColor: `${riskColor}40`, color: riskColor }}>
                  Execute <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Analyst Notes */}
          <div className="rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
            <span className="splunk-subheader block mb-2" style={{ color: '#E8478C' }}>Collaboration</span>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Analyst Notes</h2>
            <div className="flex gap-2 mb-4">
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addNote()}
                placeholder="Add a note..."
                className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #2A2A3A', color: '#FFFFFF' }}
              />
              <button
                onClick={addNote}
                className="px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ background: 'rgba(255,107,53,0.15)', color: '#FF6B35', border: '1px solid rgba(255,107,53,0.3)' }}
              >
                Add
              </button>
            </div>
            {notes.length > 0 ? (
              <div className="space-y-2">
                {notes.map((n, i) => (
                  <div key={i} className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #2A2A3A', color: '#8B8FA3' }}>
                    {n}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-center py-4" style={{ color: '#8B8FA3' }}>No notes yet. Press Enter to add a note.</p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Device Context */}
          <div className="rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
            <div className="flex items-center gap-2 mb-1">
              <Cpu size={15} style={{ color: '#FF6B35' }} />
              <span className="splunk-subheader" style={{ color: '#FF6B35' }}>Asset Context</span>
            </div>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Device Context</h2>
            <div className="space-y-3">
              {[
                { label: 'Device ID', value: incident.deviceId },
                { label: 'Vendor', value: incident.vendor },
                { label: 'IP Address', value: incident.ip },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-xs mb-0.5 uppercase tracking-wider" style={{ color: '#8B8FA3' }}>{item.label}</div>
                  <div className="text-sm font-mono" style={{ color: '#FFFFFF' }}>{item.value}</div>
                </div>
              ))}
            </div>
            {device && (
              <button
                onClick={() => navigate(`/dashboard/devices/${incident.deviceId}`)}
                className="flex items-center gap-2 mt-4 text-xs hover:opacity-80 transition-opacity"
                style={{ color: '#FF6B35' }}
              >
                <ExternalLink size={12} />
                View Device Details
              </button>
            )}
          </div>

          {/* Timeline */}
          <div className="rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={15} style={{ color: '#4BDE80' }} />
              <span className="splunk-subheader" style={{ color: '#4BDE80' }}>Timeline</span>
            </div>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Event Timeline</h2>
            <div className="relative">
              <div className="absolute left-2.5 top-0 bottom-0 w-px" style={{ background: '#2A2A3A' }} />
              <div className="space-y-4">
                {incident.timeline.map((ev, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: i === 0 ? riskColor : '#2A2A3A', border: `2px solid ${i === 0 ? riskColor : '#3A3A4A'}` }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div className="pb-1">
                      <div className="text-xs font-mono mb-0.5" style={{ color: '#FF6B35' }}>{ev.time}</div>
                      <p className="text-xs leading-relaxed" style={{ color: '#8B8FA3' }}>{ev.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Adjacent Devices */}
          <div className="rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
            <div className="flex items-center gap-2 mb-1">
              <Users size={15} style={{ color: '#FFB347' }} />
              <span className="splunk-subheader" style={{ color: '#FFB347' }}>Blast Radius</span>
            </div>
            <h2 className="text-sm font-semibold mb-3" style={{ color: '#FFFFFF' }}>Adjacent Devices</h2>
            <p className="text-xs mb-3" style={{ color: '#8B8FA3' }}>Potentially affected by lateral movement:</p>
            <div className="space-y-2">
              {incident.adjacentDevices.map(devId => {
                const dev = getDeviceById(devId);
                return (
                  <button
                    key={devId}
                    onClick={() => navigate(`/dashboard/devices/${devId}`)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl border hover:bg-white/[0.02] transition-colors"
                    style={{ borderColor: '#2A2A3A' }}
                  >
                    <div className="flex items-center gap-2">
                      <Cpu size={13} style={{ color: dev ? riskColors[dev.riskLevel] : '#8B8FA3' }} />
                      <div className="text-left">
                        <div className="text-xs font-mono" style={{ color: '#FFFFFF' }}>{devId}</div>
                        {dev && <div className="text-[10px]" style={{ color: '#8B8FA3' }}>{dev.name}</div>}
                      </div>
                    </div>
                    {dev && <RiskBadge level={dev.riskLevel} size="sm" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Playbook Status (if available) */}
          {socItem && (
            <div className="rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: 'rgba(16,185,129,0.15)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Play size={15} style={{ color: '#10B981' }} />
                <span className="splunk-subheader" style={{ color: '#10B981' }}>Active Playbook</span>
              </div>
              <h2 className="text-sm font-semibold mb-3" style={{ color: '#FFFFFF' }}>{socItem.playbook.replace(/_/g, ' ')}</h2>
              <div className="space-y-2">
                {socItem.steps.map(step => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{
                      background: step.status === 'done' ? '#10B981' : step.status === 'active' ? '#F59E0B' : '#2A2A3A',
                      border: `1.5px solid ${step.status === 'done' ? '#10B981' : step.status === 'active' ? '#F59E0B' : '#3A3A4A'}`,
                    }}>
                      {step.status === 'done' && <CheckCircle size={8} style={{ color: '#fff' }} />}
                      {step.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />}
                    </div>
                    <span className="text-xs" style={{
                      color: step.status === 'done' ? '#4BDE80' : step.status === 'active' ? '#F59E0B' : '#8B8FA3',
                      textDecoration: step.status === 'done' ? 'line-through' : 'none',
                    }}>{step.label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/dashboard/soc')}
                className="w-full mt-3 py-2 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
                style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                Open SOC Workbench →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
