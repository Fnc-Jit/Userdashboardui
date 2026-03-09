import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Bell, Play, Pause, Trash2, Activity, AlertTriangle,
  Shield, Network, Cpu, TrendingDown
} from 'lucide-react';
import { initialAlerts, Alert } from '../data/mockData';

const alertTypeConfig = {
  trust_update: { icon: TrendingDown, color: '#FF6B35', label: 'Trust Update' },
  policy_violation: { icon: Shield, color: '#E8478C', label: 'Policy Violation' },
  status_change: { icon: Cpu, color: '#FFB347', label: 'Status Change' },
  graph_anomaly: { icon: Network, color: '#FF4C4C', label: 'Graph Anomaly' },
  new_incident: { icon: AlertTriangle, color: '#FF4C4C', label: 'New Incident' },
};

const severityConfig = {
  critical: { color: '#FF4C4C', bg: 'rgba(255,76,76,0.06)', border: 'rgba(255,76,76,0.15)' },
  warning: { color: '#FF6B35', bg: 'rgba(255,107,53,0.06)', border: 'rgba(255,107,53,0.15)' },
  info: { color: '#8B8FA3', bg: 'rgba(139,143,163,0.04)', border: 'rgba(139,143,163,0.08)' },
};

function generateNewAlert(id: number): Alert {
  const types: Alert['type'][] = ['trust_update', 'policy_violation', 'status_change', 'graph_anomaly'];
  const deviceIds = ['DEV-003', 'DEV-004', 'DEV-007', 'DEV-009', 'DEV-010'];
  const messages = [
    'Behavioral anomaly detected – unusual traffic pattern',
    'Trust score fluctuation detected on monitored device',
    'Network scan attempt blocked by policy engine',
    'Device communication graph updated – new edge detected',
    'Policy compliance check failed for monitored endpoint',
  ];
  const severities: Alert['severity'][] = ['info', 'warning', 'critical'];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    id: `ALT-${String(id).padStart(3, '0')}`,
    type,
    deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date().toISOString(),
    severity: severities[Math.floor(Math.random() * severities.length)],
  };
}

export default function AlertsPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([...initialAlerts].reverse());
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<Alert['severity'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Alert['type'] | 'all'>('all');
  const counterRef = useRef(100);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        counterRef.current++;
        const newAlert = generateNewAlert(counterRef.current);
        setAlerts(prev => [newAlert, ...prev].slice(0, 100));
      }, 3500);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const filtered = alerts.filter(a => {
    if (filter !== 'all' && a.severity !== filter) return false;
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    return true;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  return (
    <div className="p-6 lg:p-8 space-y-5 min-h-full" style={{ background: '#0C0C0C' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="splunk-subheader block mb-1" style={{ color: '#FF6B35' }}>Real-Time Monitoring</span>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>Live Alert Stream</h1>
            {!paused && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs" style={{ background: 'rgba(75,222,128,0.1)', color: '#4BDE80' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#4BDE80] animate-pulse" />
                Live
              </div>
            )}
          </div>
          <p className="text-sm mt-0.5" style={{ color: '#8B8FA3' }}>
            {alerts.length} total · {criticalCount} critical · {warningCount} warnings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaused(p => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all hover:opacity-80"
            style={paused
              ? { background: 'rgba(75,222,128,0.12)', borderColor: 'rgba(75,222,128,0.3)', color: '#4BDE80' }
              : { background: 'rgba(255,107,53,0.1)', borderColor: 'rgba(255,107,53,0.3)', color: '#FF6B35' }
            }
          >
            {paused ? <><Play size={14} />Resume</> : <><Pause size={14} />Pause</>}
          </button>
          <button
            onClick={() => setAlerts([])}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all hover:opacity-80"
            style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(alertTypeConfig).map(([key, cfg]) => {
          const count = alerts.filter(a => a.type === key).length;
          return (
            <button
              key={key}
              onClick={() => setTypeFilter(typeFilter === key as any ? 'all' : key as any)}
              className="p-3 rounded-xl border text-left transition-all hover:opacity-80"
              style={{
                background: typeFilter === key ? `${cfg.color}10` : 'rgba(255,255,255,0.02)',
                borderColor: typeFilter === key ? `${cfg.color}25` : 'rgba(255,255,255,0.05)',
              }}
            >
              <cfg.icon size={16} className="mb-2" style={{ color: cfg.color }} />
              <div className="text-lg font-bold" style={{ color: cfg.color }}>{count}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: '#8B8FA3' }}>{cfg.label}</div>
            </button>
          );
        })}
      </div>

      {/* Severity filter */}
      <div className="flex items-center gap-2">
        <span className="splunk-subheader">Severity:</span>
        {(['all', 'critical', 'warning', 'info'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-1 rounded-lg text-xs capitalize transition-all"
            style={filter === s
              ? { background: 'rgba(255,107,53,0.15)', color: '#FF6B35', border: '1px solid rgba(255,107,53,0.3)' }
              : { color: '#8B8FA3' }
            }
          >
            {s}
          </button>
        ))}
      </div>

      {/* Alert stream */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
            <Bell size={32} className="mx-auto mb-3 opacity-30" style={{ color: '#8B8FA3' }} />
            <p style={{ color: '#8B8FA3' }}>No alerts match your filters</p>
          </div>
        ) : (
          filtered.map((alert, idx) => {
            const typeInfo = alertTypeConfig[alert.type];
            const sevInfo = severityConfig[alert.severity];
            const isNew = idx === 0 && !paused;
            return (
              <div
                key={alert.id}
                className="flex items-start gap-4 p-4 rounded-xl border cursor-pointer hover:opacity-80 transition-all"
                style={{
                  background: isNew ? `${typeInfo.color}05` : sevInfo.bg,
                  borderColor: isNew ? `${typeInfo.color}25` : sevInfo.border,
                  animation: idx === 0 ? 'slideIn 0.3s ease' : undefined,
                }}
                onClick={() => {
                  if (alert.deviceId) navigate(`/dashboard/devices/${alert.deviceId}`);
                }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${typeInfo.color}12`, border: `1px solid ${typeInfo.color}20` }}>
                  <typeInfo.icon size={16} style={{ color: typeInfo.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${typeInfo.color}12`, color: typeInfo.color }}>
                        {typeInfo.label}
                      </span>
                      <span className="text-xs font-mono" style={{ color: '#FF6B35' }}>{alert.deviceId}</span>
                      {isNew && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#4BDE80]/15 text-[#4BDE80]">NEW</span>}
                    </div>
                    <span className="text-xs shrink-0" style={{ color: '#8B8FA3' }}>
                      {new Date(alert.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: '#FFFFFF' }}>{alert.message}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-mono" style={{ color: '#8B8FA3' }}>{alert.id}</span>
                    <span className="text-[10px] capitalize font-medium" style={{ color: sevInfo.color }}>{alert.severity}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
