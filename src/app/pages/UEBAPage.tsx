import { useState } from 'react';
import { Brain, ChevronDown } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { uebaEntities, type UEBAEntity } from '../data/mockData';

const statusColors = { normal: '#4BDE80', drift: '#FFB347', alert: '#FF4C4C' };
const statusLabels = { normal: 'Normal', drift: '⚠ Drift', alert: '🚨 Alert' };

export default function UEBAPage() {
  const [selectedEntity, setSelectedEntity] = useState<UEBAEntity>(uebaEntities[0]);
  const [timeRange, setTimeRange] = useState('24h');

  // Normalize features for radar chart (0-100 scale)
  const radarData = selectedEntity.features.map(f => {
    const delta = f.current / (f.baseline || 1);
    return {
      feature: f.name,
      baseline: 50,
      current: Math.min(100, delta * 50),
    };
  });

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen" style={{ color: '#E2E2E2' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7E3AF2, #3B82F6)' }}>
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Entity Behavior Analytics</h1>
            <p className="text-xs" style={{ color: '#8B8FA3' }}>Per-device behavioral baseline drift detection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="px-3 py-1.5 rounded-lg text-xs border bg-transparent" style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}>
            <option value="1h">Last 1h</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
          </select>
        </div>
      </div>

      {/* Top Row: Radar + Drifting Entities + CUSUM Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Behavioral Anomaly Radar */}
        <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <h3 className="text-sm font-semibold text-white mb-2">Behavioral Anomaly Radar</h3>
          <p className="text-[10px] mb-3" style={{ color: '#8B8FA3' }}>Device: {selectedEntity.deviceName}</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#2A2A3A" />
              <PolarAngleAxis dataKey="feature" tick={{ fontSize: 9, fill: '#8B8FA3' }} />
              <PolarRadiusAxis tick={false} domain={[0, 100]} />
              <Radar name="Baseline" dataKey="baseline" stroke="#4BDE80" fill="#4BDE80" fillOpacity={0.1} strokeDasharray="4 4" />
              <Radar name="Current" dataKey="current" stroke="#FF4C4C" fill="#FF4C4C" fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Drifting Entities */}
        <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <h3 className="text-sm font-semibold text-white mb-3">Top Drifting Entities</h3>
          <div className="space-y-2">
            {uebaEntities.sort((a, b) => b.driftSigma - a.driftSigma).map(entity => (
              <button
                key={entity.deviceId}
                onClick={() => setSelectedEntity(entity)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${selectedEntity.deviceId === entity.deviceId ? 'ring-1' : ''}`}
                style={{
                  background: selectedEntity.deviceId === entity.deviceId ? '#1A1A2E' : '#0C0C0C',
                  outline: selectedEntity.deviceId === entity.deviceId ? '1px solid #7E3AF2' : 'none',
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: statusColors[entity.status] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{entity.deviceName}</div>
                  <div className="text-[10px]" style={{ color: '#8B8FA3' }}>
                    {entity.deviceId} · Top drift: {entity.features.sort((a, b) => (b.current / b.baseline) - (a.current / a.baseline))[0]?.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold" style={{ color: statusColors[entity.status] }}>+{entity.driftSigma}σ</div>
                  <div className="text-[10px]" style={{ color: statusColors[entity.status] }}>{statusLabels[entity.status]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CUSUM Drift Timeline */}
        <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <h3 className="text-sm font-semibold text-white mb-3">CUSUM Drift Timeline</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8B8FA3' }} />
              <YAxis tick={{ fontSize: 10, fill: '#8B8FA3' }} label={{ value: 'σ', position: 'insideLeft', fontSize: 10, fill: '#8B8FA3' }} />
              <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A3A', borderRadius: 8, fontSize: 11 }} />
              <ReferenceLine y={2} stroke="#FFB347" strokeDasharray="5 5" label={{ value: 'Drift', position: 'right', fontSize: 9, fill: '#FFB347' }} />
              <ReferenceLine y={3} stroke="#FF4C4C" strokeDasharray="5 5" label={{ value: 'Alert', position: 'right', fontSize: 9, fill: '#FF4C4C' }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {uebaEntities.slice(0, 3).map((entity, idx) => (
                <Line
                  key={entity.deviceId}
                  data={entity.cusumHistory}
                  dataKey="value"
                  name={entity.deviceName.split(' ')[0]}
                  stroke={['#FF4C4C', '#FFB347', '#7E3AF2'][idx]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Baseline Comparison Table */}
      <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
        <h3 className="text-sm font-semibold text-white mb-3">Baseline Comparison Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #2A2A3A' }}>
                {['Device', 'Feature', 'Baseline', 'Current', 'Δ', 'Status'].map(h => (
                  <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: '#8B8FA3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uebaEntities.flatMap(entity =>
                entity.features
                  .filter(f => f.current / (f.baseline || 1) > 1.5)
                  .map(f => {
                    const delta = f.current / (f.baseline || 1);
                    const isAlert = delta > 5;
                    const isDrift = delta > 2;
                    return (
                      <tr key={`${entity.deviceId}-${f.name}`} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid #1A1A2E' }}>
                        <td className="py-2 px-3 text-white">{entity.deviceName}</td>
                        <td className="py-2 px-3 font-mono" style={{ color: '#8B8FA3' }}>{f.name}</td>
                        <td className="py-2 px-3" style={{ color: '#8B8FA3' }}>{f.baseline}{f.unit}</td>
                        <td className="py-2 px-3 text-white font-medium">{f.current}{f.unit}</td>
                        <td className="py-2 px-3 font-bold" style={{ color: isAlert ? '#FF4C4C' : isDrift ? '#FFB347' : '#4BDE80' }}>
                          +{delta.toFixed(1)}x
                        </td>
                        <td className="py-2 px-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{
                            background: isAlert ? '#FF4C4C20' : isDrift ? '#FFB34720' : '#4BDE8020',
                            color: isAlert ? '#FF4C4C' : isDrift ? '#FFB347' : '#4BDE80',
                          }}>
                            {isAlert ? '🚨 ALERT' : isDrift ? '⚠ DRIFT' : 'OK'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
