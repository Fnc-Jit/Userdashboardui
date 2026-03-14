import { useState } from 'react';
import { Wrench, CheckCircle, Circle, PlayCircle, Clock, User, AlertTriangle } from 'lucide-react';
import { socQueue, auditLog, getDeviceById, type SOCQueueItem, type PlaybookStepStatus } from '../data/mockData';

const stepIcons: Record<PlaybookStepStatus, typeof Circle> = {
  done: CheckCircle, active: PlayCircle, pending: Circle, failed: AlertTriangle,
};
const stepColors: Record<PlaybookStepStatus, string> = {
  done: '#10B981', active: '#F59E0B', pending: '#6B7280', failed: '#EF4444',
};
const sevColors: Record<string, string> = {
  critical: '#FF4C4C', high: '#FF6B35', medium: '#FFB347', low: '#3B82F6',
};

export default function SOCWorkbenchPage() {
  const [selectedItem, setSelectedItem] = useState<SOCQueueItem>(socQueue[0]);
  const [activeTab, setActiveTab] = useState<'playbook' | 'notes' | 'audit'>('playbook');

  const device = getDeviceById(selectedItem.deviceId);

  return (
    <div className="p-4 lg:p-6 min-h-screen" style={{ color: '#E2E2E2' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
            <Wrench size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SOC Workbench</h1>
            <p className="text-xs" style={{ color: '#8B8FA3' }}>Analyst Triage · Playbook Execution · Audit Trail</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#8B8FA3' }}>
          <User size={14} />
          Analyst: <span className="text-white font-medium">jitraj_esh</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ minHeight: 500 }}>
        {/* Left: Queue */}
        <div className="rounded-xl border p-3" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">My Queue ({socQueue.length})</h3>
          </div>
          <div className="space-y-2">
            {socQueue.map(item => (
              <button
                key={item.incidentId}
                onClick={() => { setSelectedItem(item); setActiveTab('playbook'); }}
                className={`w-full p-3 rounded-lg text-left transition-all ${selectedItem.incidentId === item.incidentId ? 'ring-1' : ''}`}
                style={{
                  background: selectedItem.incidentId === item.incidentId ? '#1A1A2E' : '#0C0C0C',
                  outline: selectedItem.incidentId === item.incidentId ? `1px solid ${sevColors[item.severity]}` : 'none',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-sm" style={{ background: sevColors[item.severity] }} />
                  <span className="text-xs font-semibold text-white">{item.incidentId}</span>
                  <span className="text-[10px] px-1 py-0.5 rounded uppercase font-bold ml-auto" style={{ background: `${sevColors[item.severity]}20`, color: sevColors[item.severity] }}>
                    {item.severity}
                  </span>
                </div>
                <div className="text-[10px]" style={{ color: '#8B8FA3' }}>
                  {getDeviceById(item.deviceId)?.name || item.deviceId}
                </div>
                <div className="text-[10px]" style={{ color: '#8B8FA3' }}>
                  Playbook: {item.playbook}
                </div>
              </button>
            ))}
          </div>
          <button className="w-full mt-3 p-2 rounded-lg text-xs text-center border" style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}>
            Take Next from Queue
          </button>
        </div>

        {/* Right: Active Investigation */}
        <div className="lg:col-span-3 rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {selectedItem.incidentId} — {device?.name || selectedItem.deviceId}
              </h3>
              <p className="text-[10px]" style={{ color: '#8B8FA3' }}>
                Playbook: {selectedItem.playbook} · Progress: {selectedItem.steps.filter(s => s.status === 'done').length}/{selectedItem.steps.length}
              </p>
            </div>
            <span className="px-2 py-1 rounded text-[10px] uppercase font-bold" style={{ background: `${sevColors[selectedItem.severity]}20`, color: sevColors[selectedItem.severity] }}>
              {selectedItem.severity}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-4 border-b pb-2" style={{ borderColor: '#2A2A3A' }}>
            {[
              { key: 'playbook', label: 'Playbook' },
              { key: 'notes', label: 'Analyst Notes' },
              { key: 'audit', label: 'Audit Log' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className="px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeTab === tab.key ? '#1A56DB20' : 'transparent',
                  color: activeTab === tab.key ? '#3B82F6' : '#8B8FA3',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Playbook Tab */}
          {activeTab === 'playbook' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white mb-2">PLAYBOOK: {selectedItem.playbook}</h4>
              {selectedItem.steps.map((step, idx) => {
                const Icon = stepIcons[step.status];
                return (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <Icon size={18} style={{ color: stepColors[step.status] }} />
                      {idx < selectedItem.steps.length - 1 && (
                        <div className="w-0.5 h-8 mt-1" style={{ background: stepColors[step.status] + '40' }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${step.status === 'done' ? 'line-through' : ''}`} style={{ color: step.status === 'done' ? '#8B8FA3' : '#fff' }}>
                          Step {idx + 1}: {step.label}
                        </span>
                        {step.status === 'active' && (
                          <button className="px-3 py-1 rounded-lg text-[10px] font-bold" style={{ background: '#F59E0B', color: '#000' }}>
                            Execute
                          </button>
                        )}
                        {step.status === 'done' && (
                          <span className="text-[10px]" style={{ color: '#10B981' }}>✓ Done</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div>
              <textarea
                className="w-full h-64 rounded-lg p-3 text-xs font-mono bg-transparent border resize-none"
                style={{ borderColor: '#2A2A3A', color: '#E2E2E2' }}
                defaultValue={selectedItem.notes}
                placeholder="# Investigation Notes&#10;Write your analysis here..."
              />
              <div className="flex justify-end mt-2">
                <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: '#1A56DB', color: '#fff' }}>Save Notes</button>
              </div>
            </div>
          )}

          {/* Audit Log Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-2">
              {auditLog.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 rounded-lg" style={{ background: '#0C0C0C' }}>
                  <div className="flex items-center gap-1.5 text-[10px] shrink-0" style={{ color: '#8B8FA3', minWidth: 40 }}>
                    <Clock size={10} /> {entry.time}
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: entry.analyst === 'system' ? '#7E3AF2' : '#F59E0B' }}>
                    {entry.analyst}
                  </span>
                  <span className="text-[10px]" style={{ color: '#E2E2E2' }}>{entry.action}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
