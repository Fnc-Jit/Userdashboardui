import { useState, Fragment } from 'react';
import { Search, Download, ChevronDown, ChevronRight, FileText, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush
} from 'recharts';
import { logEvents, logHistogram, type LogEvent } from '../data/mockData';

const severityColors: Record<string, string> = {
  critical: '#FF4C4C', high: '#FF6B35', warning: '#FFB347', info: '#3B82F6',
};

export default function LogExplorerPage() {
  const [query, setQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filterSev, setFilterSev] = useState<string>('all');

  const filtered = logEvents.filter(e => {
    if (filterSev !== 'all' && e.severity !== filterSev) return false;
    if (query) {
      const q = query.toLowerCase();
      return e.deviceId.toLowerCase().includes(q) || e.eventType.toLowerCase().includes(q) || e.message.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-4 lg:p-6 space-y-5 min-h-screen" style={{ color: '#E2E2E2' }}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A56DB, #3B82F6)' }}>
          <FileText size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Log Explorer</h1>
          <p className="text-xs" style={{ color: '#8B8FA3' }}>Search, filter, and analyze raw event logs</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border p-3" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: '#4BDE80' }}>&gt;</span>
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="device:CCTV01 AND event_type:policy_violation AND severity:HIGH"
            className="flex-1 bg-transparent text-sm font-mono text-white outline-none placeholder:text-gray-600"
          />
          <button className="px-4 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#1A56DB', color: '#fff' }}>
            <Search size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-[10px]" style={{ color: '#8B8FA3' }}>Quick filters:</span>
          {['all', 'critical', 'high', 'warning', 'info'].map(s => (
            <button
              key={s}
              onClick={() => setFilterSev(s)}
              className={`px-2 py-0.5 rounded text-[10px] uppercase transition-all ${filterSev === s ? 'font-bold' : ''}`}
              style={{
                background: filterSev === s ? (severityColors[s] || '#1A56DB') + '30' : '#1A1A2E',
                color: filterSev === s ? (severityColors[s] || '#1A56DB') : '#8B8FA3',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Event Histogram */}
      <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
        <h3 className="text-xs font-semibold text-white mb-2">Event Timeline</h3>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={logHistogram}>
            <XAxis dataKey="minute" tick={{ fontSize: 8, fill: '#8B8FA3' }} interval={9} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A3A', borderRadius: 8, fontSize: 10 }} />
            <Bar dataKey="count" fill="#1A56DB" radius={[2, 2, 0, 0]} />
            <Brush dataKey="minute" height={15} stroke="#2A2A3A" fill="#0C0C0C" travellerWidth={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-xs font-semibold text-white">Results ({filtered.length} events)</h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] border" style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}>
              <Download size={10} /> CSV
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] border" style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}>
              <Download size={10} /> JSON
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0" style={{ background: '#141414' }}>
              <tr style={{ borderBottom: '1px solid #2A2A3A' }}>
                <th className="text-left py-2 px-2 w-6" />
                {['Timestamp', 'Device', 'Event Type', 'Severity'].map(h => (
                  <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: '#8B8FA3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(evt => (
                <Fragment key={evt.id}>
                  <tr
                    key={evt.id}
                    onClick={() => setExpandedRow(expandedRow === evt.id ? null : evt.id)}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid #1A1A2E' }}
                  >
                    <td className="py-2 px-2">
                      <ChevronRight
                        size={12}
                        style={{ color: '#8B8FA3', transform: expandedRow === evt.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                      />
                    </td>
                    <td className="py-2 px-3 font-mono text-[10px]" style={{ color: '#8B8FA3' }}>
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 } as Intl.DateTimeFormatOptions)}
                    </td>
                    <td className="py-2 px-3 text-white">{evt.deviceId}</td>
                    <td className="py-2 px-3" style={{ color: '#8B8FA3' }}>{evt.eventType}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded uppercase text-[10px] font-bold" style={{ background: `${severityColors[evt.severity]}20`, color: severityColors[evt.severity] }}>
                        {evt.severity}
                      </span>
                    </td>
                  </tr>
                  {expandedRow === evt.id && (
                    <tr key={`${evt.id}-expanded`}>
                      <td colSpan={5} className="px-4 py-3" style={{ background: '#0C0C0C' }}>
                        <pre className="text-[10px] font-mono overflow-x-auto whitespace-pre-wrap" style={{ color: '#4BDE80' }}>
                          {JSON.stringify(evt.raw, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
