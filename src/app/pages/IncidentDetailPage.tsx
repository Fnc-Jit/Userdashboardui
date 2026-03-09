import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, AlertTriangle, Shield, Cpu, ExternalLink,
  CheckCircle, Clock, FileText, Users, Zap, ChevronRight
} from 'lucide-react';
import { getIncidentById, getDeviceById, riskColors } from '../data/mockData';
import { RiskBadge, StatusBadge } from '../components/RiskBadge';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const incident = getIncidentById(id!);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [status, setStatus] = useState(incident?.status || 'open');

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

  const addNote = () => {
    if (note.trim()) {
      setNotes(prev => [`[${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}] ${note}`, ...prev]);
      setNote('');
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as any);
  };

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

          {/* Evidence */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
            <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: '#2A2A3A' }}>
              <Shield size={15} style={{ color: '#FF6B35' }} />
              <span className="splunk-subheader" style={{ color: '#FF6B35' }}>Forensics</span>
              <span className="text-sm font-semibold ml-2" style={{ color: '#FFFFFF' }}>Evidence ({incident.evidence.length})</span>
            </div>
            <div className="divide-y" style={{ divideColor: '#2A2A3A' }}>
              {incident.evidence.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: riskColor }} />
                  <p className="text-sm" style={{ color: '#8B8FA3' }}>{ev}</p>
                </div>
              ))}
            </div>
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
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border ml-4 shrink-0 hover:opacity-80 transition-opacity" style={{ borderColor: `${riskColor}40`, color: riskColor }}>
                Execute <ChevronRight size={12} />
              </button>
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
        </div>
      </div>
    </div>
  );
}
