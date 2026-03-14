import { useState } from 'react';
import { Globe, Plus, Download, Upload, Search, ExternalLink, Shield, Hash, Bug, Server } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { iocs, threatScoreTrend, geoHits, type IOC } from '../data/mockData';

const severityColors: Record<string, string> = {
  critical: '#FF4C4C', high: '#FF6B35', medium: '#FFB347', low: '#3B82F6',
};
const typeIcons: Record<string, typeof Globe> = {
  ip: Server, domain: Globe, hash: Hash, cve: Bug,
};

const countries: Record<string, { name: string; x: number; y: number }> = {
  US: { name: 'United States', x: 22, y: 38 }, DE: { name: 'Germany', x: 50, y: 32 },
  RU: { name: 'Russia', x: 62, y: 28 }, CN: { name: 'China', x: 72, y: 38 },
  KP: { name: 'North Korea', x: 76, y: 38 }, IR: { name: 'Iran', x: 58, y: 40 },
};

export default function ThreatIntelPage() {
  const [filter, setFilter] = useState<'all' | 'active'>('all');
  const [search, setSearch] = useState('');

  const filtered = iocs.filter(i => {
    if (filter === 'active' && !i.active) return false;
    if (search && !i.value.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen" style={{ color: '#E2E2E2' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF5A1F, #E02424)' }}>
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Threat Intelligence</h1>
            <p className="text-xs" style={{ color: '#8B8FA3' }}>Live IOC Feed · IP/Domain Reputation · Blocklist Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#FF5A1F', color: '#fff' }}>
            <Plus size={14} /> Add IOC
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}>
            <Upload size={14} /> Import CSV
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Top Row: IOC Feed + GeoIP Map + Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* IOC Feed */}
        <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <h3 className="text-sm font-semibold text-white mb-3">Active IOC Feed</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {iocs.filter(i => i.active).map(ioc => {
              const Icon = typeIcons[ioc.type] || Globe;
              return (
                <div key={ioc.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: '#1A1A2E' }}>
                  <Icon size={14} style={{ color: severityColors[ioc.severity] }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-white truncate">{ioc.value}</div>
                    <div className="text-[10px]" style={{ color: '#8B8FA3' }}>{ioc.source} · {ioc.hits} hit(s)</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold" style={{ background: `${severityColors[ioc.severity]}20`, color: severityColors[ioc.severity] }}>
                    {ioc.severity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* GeoIP Heat Map */}
        <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <h3 className="text-sm font-semibold text-white mb-3">GeoIP Threat Map</h3>
          <div className="relative w-full h-48 rounded-lg overflow-hidden" style={{ background: '#0C0C0C' }}>
            {/* Simple world outline */}
            <svg viewBox="0 0 100 60" className="w-full h-full opacity-30">
              <path d="M15,15 Q20,10 30,12 L35,15 Q38,20 35,25 L25,30 Q20,35 18,32 L15,25 Z" fill="#2A2A3A" />
              <path d="M45,10 Q55,8 65,12 L70,18 Q72,25 68,30 L55,35 Q48,32 45,25 Z" fill="#2A2A3A" />
              <path d="M62,10 Q75,8 85,15 L88,25 Q85,35 78,38 L68,35 Q62,28 62,18 Z" fill="#2A2A3A" />
              <path d="M22,35 Q28,32 35,38 L32,48 Q25,50 20,45 Z" fill="#2A2A3A" />
              <path d="M68,38 Q75,35 82,40 L80,52 Q72,55 68,48 Z" fill="#2A2A3A" />
            </svg>
            {/* Hit markers */}
            {Object.entries(geoHits).map(([code, hits]) => {
              const c = countries[code];
              if (!c) return null;
              const size = Math.min(6, 2 + hits);
              return (
                <div
                  key={code}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    left: `${c.x}%`, top: `${c.y}%`, width: size * 4, height: size * 4,
                    background: `radial-gradient(circle, #FF4C4C, transparent)`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: `0 0 ${size * 3}px rgba(255,76,76,0.6)`,
                  }}
                  title={`${c.name}: ${hits} hits`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(geoHits).map(([code, hits]) => (
              <span key={code} className="text-[10px] px-2 py-0.5 rounded" style={{ background: '#1A1A2E', color: '#FF4C4C' }}>
                {countries[code]?.name || code}: {hits}
              </span>
            ))}
          </div>
        </div>

        {/* Threat Score Trend */}
        <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <h3 className="text-sm font-semibold text-white mb-3">Threat Score Trend (7-day)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={threatScoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8B8FA3' }} />
              <YAxis tick={{ fontSize: 10, fill: '#8B8FA3' }} />
              <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A3A', borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="network" stackId="1" stroke="#1A56DB" fill="#1A56DB" fillOpacity={0.3} name="Network" />
              <Area type="monotone" dataKey="c2" stackId="1" stroke="#E02424" fill="#E02424" fillOpacity={0.3} name="C2" />
              <Area type="monotone" dataKey="exploit" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} name="Exploit" />
              <Area type="monotone" dataKey="exfil" stackId="1" stroke="#7E3AF2" fill="#7E3AF2" fillOpacity={0.3} name="Exfil" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Blocklist Manager */}
      <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-sm font-semibold text-white">Blocklist Manager</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8B8FA3' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search IPs/Domains..."
                className="pl-8 pr-3 py-1.5 rounded-lg text-xs border bg-transparent"
                style={{ borderColor: '#2A2A3A', color: '#E2E2E2', width: 200 }}
              />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value as 'all' | 'active')} className="px-2 py-1.5 rounded-lg text-xs border bg-transparent" style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}>
              <option value="all">All</option>
              <option value="active">Active Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #2A2A3A' }}>
                {['Type', 'IP / Domain / Hash', 'Source', 'Severity', 'Hits', 'Last Seen', 'Devices', 'Status'].map(h => (
                  <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: '#8B8FA3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ioc => {
                const Icon = typeIcons[ioc.type] || Globe;
                return (
                  <tr key={ioc.id} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid #1A1A2E' }}>
                    <td className="py-2 px-3"><Icon size={14} style={{ color: '#8B8FA3' }} /></td>
                    <td className="py-2 px-3 font-mono text-white">{ioc.value}</td>
                    <td className="py-2 px-3" style={{ color: '#8B8FA3' }}>{ioc.source}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded uppercase text-[10px] font-bold" style={{ background: `${severityColors[ioc.severity]}20`, color: severityColors[ioc.severity] }}>
                        {ioc.severity}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-white font-medium">{ioc.hits}</td>
                    <td className="py-2 px-3" style={{ color: '#8B8FA3' }}>{new Date(ioc.lastSeen).toLocaleDateString()}</td>
                    <td className="py-2 px-3" style={{ color: '#8B8FA3' }}>{ioc.linkedDevices.join(', ') || '—'}</td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${ioc.active ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-500/10'}`}>
                        {ioc.active ? 'Active' : 'Inactive'}
                      </span>
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
