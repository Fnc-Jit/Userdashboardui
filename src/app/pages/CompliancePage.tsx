import { useState } from 'react';
import { ClipboardCheck, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { complianceControls, complianceFunctions, overallComplianceScore } from '../data/mockData';

const statusIcons = { pass: CheckCircle, fail: XCircle, partial: AlertCircle };
const statusColors = { pass: '#4BDE80', fail: '#FF4C4C', partial: '#FFB347' };

export default function CompliancePage() {
  const [framework, setFramework] = useState('NIST CSF');
  const [filterFunc, setFilterFunc] = useState('all');

  const filtered = complianceControls.filter(c => filterFunc === 'all' || c.function === filterFunc);
  const pieData = complianceFunctions.map(f => ({ name: f.name, value: f.score }));

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen" style={{ color: '#E2E2E2' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            <ClipboardCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Compliance Dashboard</h1>
            <p className="text-xs" style={{ color: '#8B8FA3' }}>NIST CSF / IEC 62443 Compliance Posture</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={framework} onChange={e => setFramework(e.target.value)} className="px-3 py-1.5 rounded-lg text-xs border bg-transparent" style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}>
            <option value="NIST CSF">NIST CSF</option>
            <option value="IEC 62443">IEC 62443</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#10B981', color: '#fff' }}>
            <Download size={14} /> Generate PDF Report
          </button>
        </div>
      </div>

      {/* Top Row: Score Donut + Function Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overall Score Donut */}
        <div className="rounded-xl border p-4 flex flex-col items-center justify-center" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <h3 className="text-sm font-semibold text-white mb-2">Overall Score</h3>
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value: overallComplianceScore }, { value: 100 - overallComplianceScore }]}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={80}
                  startAngle={90} endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#1A1A2E" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{overallComplianceScore}</span>
              <span className="text-[10px]" style={{ color: '#8B8FA3' }}>/ 100</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 text-[10px]">
            {[{ label: 'Pass', color: '#4BDE80' }, { label: 'Partial', color: '#FFB347' }, { label: 'Fail', color: '#FF4C4C' }].map(s => (
              <span key={s.label} className="flex items-center gap-1" style={{ color: s.color }}>
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} /> {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Function Breakdown */}
        <div className="lg:col-span-2 rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Function Breakdown ({framework})</h3>
          <div className="space-y-4">
            {complianceFunctions.map(fn => (
              <div key={fn.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">{fn.name}</span>
                  <span className="text-xs font-bold" style={{ color: fn.color }}>{fn.score}%</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: '#0C0C0C' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${fn.score}%`, background: fn.color }}
                  />
                </div>
                {fn.score < 50 && (
                  <div className="text-[10px] mt-0.5" style={{ color: '#FF4C4C' }}>
                    ← Gap — needs improvement
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Gaps Table */}
      <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-sm font-semibold text-white">Control Details</h3>
          <div className="flex items-center gap-2">
            {['all', ...complianceFunctions.map(f => f.name)].map(f => (
              <button
                key={f}
                onClick={() => setFilterFunc(f)}
                className="px-2 py-0.5 rounded text-[10px] transition-all"
                style={{
                  background: filterFunc === f ? '#1A56DB30' : '#1A1A2E',
                  color: filterFunc === f ? '#3B82F6' : '#8B8FA3',
                }}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #2A2A3A' }}>
                {['Control ID', 'Function', 'Requirement', 'Score', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: '#8B8FA3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ctrl => {
                const Icon = statusIcons[ctrl.status];
                return (
                  <tr key={ctrl.id} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid #1A1A2E' }}>
                    <td className="py-2 px-3 font-mono text-white">{ctrl.id}</td>
                    <td className="py-2 px-3" style={{ color: '#8B8FA3' }}>{ctrl.function}</td>
                    <td className="py-2 px-3 text-white">{ctrl.requirement}</td>
                    <td className="py-2 px-3 font-bold" style={{ color: statusColors[ctrl.status] }}>{ctrl.score}%</td>
                    <td className="py-2 px-3">
                      <span className="flex items-center gap-1" style={{ color: statusColors[ctrl.status] }}>
                        <Icon size={12} />
                        {ctrl.status === 'pass' ? 'Pass' : ctrl.status === 'fail' ? 'Gap' : 'Partial'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      {ctrl.status === 'fail' ? (
                        <button className="px-2 py-0.5 rounded text-[10px]" style={{ background: '#FF4C4C20', color: '#FF4C4C' }}>Fix</button>
                      ) : (
                        <button className="px-2 py-0.5 rounded text-[10px]" style={{ background: '#1A1A2E', color: '#8B8FA3' }}>View</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
