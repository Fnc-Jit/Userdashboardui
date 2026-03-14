import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
import {
  ArrowLeft, Cpu, Shield, AlertTriangle, Wifi, Clock, Tag,
  Hash, MapPin, Activity, CheckCircle, Wrench, WifiOff, ChevronRight
} from 'lucide-react';
import { getDeviceById, riskColors } from '../data/mockData';
import { RiskBadge, StatusBadge } from '../components/RiskBadge';

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span style={{ color: '#8B8FA3' }}>{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl border text-xs" style={{ background: '#1A1A2E', borderColor: '#2A2A3A', color: '#FFFFFF' }}>
        <div style={{ color: '#8B8FA3' }}>{label}</div>
        <div style={{ color: '#FF6B35' }}>Score: {payload[0].value}</div>
      </div>
    );
  }
  return null;
};

export default function DeviceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const device = getDeviceById(id!);
  const [status, setStatus] = useState(device?.status || 'active');
  const [actionDone, setActionDone] = useState<string | null>(null);

  if (!device) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: '#0C0C0C', color: '#8B8FA3' }}>
        Device not found.
      </div>
    );
  }

  const color = riskColors[device.riskLevel];
  const chartData = device.history.slice(-14);

  const handleAction = (action: string) => {
    if (action === 'isolate') setStatus('isolated');
    if (action === 'maintenance') setStatus(s => s === 'maintenance' ? 'active' : 'maintenance');
    if (action === 'clear') setActionDone('Violations cleared successfully');
    setTimeout(() => setActionDone(null), 3000);
  };

  const infoItems = [
    { icon: Tag, label: 'Vendor', value: device.vendor },
    { icon: Cpu, label: 'Device Class', value: device.class },
    { icon: Hash, label: 'MAC Address', value: device.mac },
    { icon: MapPin, label: 'IP Address', value: device.ip },
    { icon: Clock, label: 'Last Seen', value: new Date(device.lastSeen).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { icon: Wifi, label: 'Status', value: null },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-5 min-h-full" style={{ background: '#0C0C0C' }}>
      {/* Back */}
      <button onClick={() => navigate('/dashboard/devices')} className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: '#8B8FA3' }}>
        <ArrowLeft size={16} />
        Back to Devices
      </button>

      {/* Success notification */}
      {actionDone && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(75,222,128,0.1)', border: '1px solid rgba(75,222,128,0.3)', color: '#4BDE80' }}>
          <CheckCircle size={15} />
          {actionDone}
        </div>
      )}

      {/* Hero trust panel */}
      <div className="rounded-2xl p-6 lg:p-8 border relative overflow-hidden" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${color}08, transparent 60%)` }} />
        <span className="splunk-subheader block mb-3" style={{ color: '#E8478C' }}>Device Detail</span>
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${color}12`, border: `2px solid ${color}25` }}>
              <Cpu size={36} style={{ color }} />
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-1" style={{ color: '#FFFFFF' }}>{device.name}</h1>
              <div className="text-sm mb-2" style={{ color: '#8B8FA3' }}>{device.id} · {device.vendor}</div>
              <div className="flex items-center gap-2">
                <RiskBadge level={device.riskLevel} size="md" />
                <StatusBadge status={status as any} size="md" />
              </div>
            </div>
          </div>
          <div className="lg:ml-auto text-center lg:text-right">
            <div className="text-6xl font-bold mb-1" style={{ color }}>{device.trustScore}</div>
            <div className="text-sm" style={{ color: '#8B8FA3' }}>Trust Score</div>
            <div className="flex items-center justify-center lg:justify-end gap-1 mt-1 text-xs" style={{ color: '#FF4C4C' }}>
              <Activity size={12} />
              Declining trend
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Device Info */}
        <div className="rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
          <span className="splunk-subheader block mb-2" style={{ color: '#FF6B35' }}>Properties</span>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Device Information</h2>
          <div className="space-y-3">
            {infoItems.map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <item.icon size={13} style={{ color: '#8B8FA3' }} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] mb-0.5 uppercase tracking-wider" style={{ color: '#8B8FA3' }}>{item.label}</div>
                  {item.value ? (
                    <div className="text-xs font-mono" style={{ color: '#FFFFFF' }}>{item.value}</div>
                  ) : (
                    <StatusBadge status={status as any} size="sm" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
          <span className="splunk-subheader block mb-2" style={{ color: '#E8478C' }}>Analytics</span>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Score Breakdown</h2>
          <div className="space-y-4">
            <ScoreBar label="Behavioral Score" value={device.behavioral} color="#FF6B35" />
            <ScoreBar label="Policy Score" value={device.policy} color="#3B82F6" />
            <ScoreBar label="Drift Score" value={device.drift} color="#FFB347" />
            <ScoreBar label="Threat Intelligence" value={device.threat} color="#4BDE80" />
          </div>
        </div>

        {/* Device Actions */}
        <div className="rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
          <span className="splunk-subheader block mb-2" style={{ color: '#FFB347' }}>Operations</span>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Device Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleAction('clear')}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl border text-sm transition-all hover:border-[#4BDE80] hover:bg-[#4BDE80]/5"
              style={{ borderColor: '#2A2A3A', color: '#4BDE80' }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={15} />
                Clear Violations
              </div>
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => handleAction('maintenance')}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl border text-sm transition-all hover:border-[#FFB347] hover:bg-[#FFB347]/5"
              style={{ borderColor: '#2A2A3A', color: '#FFB347' }}
            >
              <div className="flex items-center gap-2">
                <Wrench size={15} />
                {status === 'maintenance' ? 'Exit Maintenance' : 'Toggle Maintenance'}
              </div>
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => handleAction('isolate')}
              disabled={status === 'isolated'}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl border text-sm transition-all hover:border-[#FF4C4C] hover:bg-[#FF4C4C]/5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: '#2A2A3A', color: '#FF4C4C' }}
            >
              <div className="flex items-center gap-2">
                <WifiOff size={15} />
                {status === 'isolated' ? 'Device Isolated' : 'Isolate Device'}
              </div>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="mt-4 px-3 py-2.5 rounded-xl text-xs" style={{ background: 'rgba(255,107,53,0.05)', border: '1px solid rgba(255,107,53,0.1)', color: '#8B8FA3' }}>
            Actions are logged and require confirmation in production environments.
          </div>
        </div>
      </div>

      {/* Trust History Chart */}
      <div className="rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
        <span className="splunk-subheader block mb-1" style={{ color: '#E8478C' }}>Historical Data</span>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Trust Score History (14 days)</h2>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-[#4BDE80] inline-block rounded" /> Trusted (≥80)</span>
            <span className="flex items-center gap-1.5" style={{ color: '#8B8FA3' }}><span className="w-2.5 h-0.5 bg-[#FF6B35] inline-block rounded" /> High Risk (≤40)</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: '#8B8FA3', fontSize: 10 }} tickFormatter={d => d.slice(5)} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#8B8FA3', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={80} stroke="#4BDE80" strokeDasharray="4 4" strokeOpacity={0.5} />
            <ReferenceLine y={40} stroke="#FF6B35" strokeDasharray="4 4" strokeOpacity={0.5} />
            <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: color }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Evidence Panel */}
      {device.evidence.length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: '#2A2A3A' }}>
            <span className="splunk-subheader block mb-1" style={{ color: '#FF4C4C' }}>Forensics</span>
            <h2 className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Evidence & Violations ({device.evidence.length})</h2>
          </div>
          <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
            {device.evidence.map(ev => {
              const sevColor = ev.severity === 'critical' ? '#FF4C4C' : ev.severity === 'high' ? '#FF6B35' : ev.severity === 'medium' ? '#FFB347' : '#3B82F6';
              return (
                <div key={ev.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} style={{ color: sevColor }} />
                      <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{ev.type}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${sevColor}20`, color: sevColor, border: `1px solid ${sevColor}40` }}>
                        {ev.severity}
                      </span>
                      <span className="text-xs" style={{ color: '#8B8FA3' }}>
                        {new Date(ev.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#8B8FA3' }}>{ev.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
