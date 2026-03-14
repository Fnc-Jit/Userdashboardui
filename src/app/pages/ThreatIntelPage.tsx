import { useState, useRef } from 'react';
import { Globe, Plus, Download, Upload, Search, X, Shield, Hash, Bug, Server, Trash2 } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { iocs as initialIocs, threatScoreTrend, geoHits, type IOC } from '../data/mockData';

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
  const [iocList, setIocList] = useState<IOC[]>(initialIocs);
  const [showAddModal, setShowAddModal] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add IOC form state
  const [newIoc, setNewIoc] = useState({
    type: 'ip' as 'ip' | 'domain' | 'hash' | 'cve',
    value: '',
    severity: 'high' as 'critical' | 'high' | 'medium' | 'low',
    source: 'Manual',
  });

  const filtered = iocList.filter(i => {
    if (filter === 'active' && !i.active) return false;
    if (search && !i.value.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // ── Add IOC ──
  const handleAddIOC = () => {
    if (!newIoc.value.trim()) return;
    const ioc: IOC = {
      id: `IOC-${String(iocList.length + 1).padStart(3, '0')}`,
      type: newIoc.type,
      value: newIoc.value.trim(),
      source: newIoc.source,
      severity: newIoc.severity,
      hits: 0,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      active: true,
      linkedDevices: [],
      country: undefined,
    };
    setIocList(prev => [ioc, ...prev]);
    setNewIoc({ type: 'ip', value: '', severity: 'high', source: 'Manual' });
    setShowAddModal(false);
  };

  // ── Delete IOC ──
  const handleDeleteIOC = (id: string) => {
    setIocList(prev => prev.filter(i => i.id !== id));
  };

  // ── Toggle IOC active/inactive ──
  const handleToggleIOC = (id: string) => {
    setIocList(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));
  };

  // ── Export CSV ──
  const handleExport = () => {
    const headers = ['ID', 'Type', 'Value', 'Source', 'Severity', 'Hits', 'First Seen', 'Last Seen', 'Active', 'Linked Devices', 'Country'];
    const rows = iocList.map(i => [
      i.id, i.type, i.value, i.source, i.severity, i.hits,
      i.firstSeen, i.lastSeen, i.active ? 'true' : 'false',
      i.linkedDevices.join(';'), i.country || '',
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel_iocs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Import CSV ──
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) { setImportMsg('CSV has no data rows.'); return; }

      const header = lines[0].toLowerCase();
      const hasHeader = header.includes('type') || header.includes('value');
      const dataLines = hasHeader ? lines.slice(1) : lines;

      let imported = 0;
      const newIOCs: IOC[] = [];

      for (const line of dataLines) {
        // Parse CSV (handles quoted fields)
        const cols = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(c => c.replace(/^"|"$/g, '').trim()) || [];
        if (cols.length < 3) continue;

        const type = (['ip', 'domain', 'hash', 'cve'].includes(cols[0]?.toLowerCase()) ? cols[0].toLowerCase() : 'ip') as IOC['type'];
        const value = cols[1] || cols[0];
        const severity = (['critical', 'high', 'medium', 'low'].includes(cols[2]?.toLowerCase()) ? cols[2].toLowerCase() : 'medium') as IOC['severity'];

        if (!value) continue;
        // Skip duplicates
        if (iocList.some(i => i.value === value) || newIOCs.some(i => i.value === value)) continue;

        newIOCs.push({
          id: `IOC-${String(iocList.length + newIOCs.length + 1).padStart(3, '0')}`,
          type,
          value,
          source: cols[3] || 'CSV Import',
          severity,
          hits: 0,
          firstSeen: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          active: true,
          linkedDevices: [],
          country: undefined,
        });
        imported++;
      }

      setIocList(prev => [...newIOCs, ...prev]);
      setImportMsg(`Imported ${imported} IOC(s) from ${file.name}`);
      setTimeout(() => setImportMsg(''), 4000);
    };
    reader.readAsText(file);
    // Reset input so same file can be re-imported
    e.target.value = '';
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen" style={{ color: '#E2E2E2' }}>
      {/* Hidden file input for CSV import */}
      <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleImportCSV} />

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
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110" style={{ background: '#FF5A1F', color: '#fff' }}>
            <Plus size={14} /> Add IOC
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all hover:bg-white/5" style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}>
            <Upload size={14} /> Import CSV
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all hover:bg-white/5" style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Import success banner */}
      {importMsg && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium" style={{ background: '#10B98115', border: '1px solid #10B98130', color: '#4BDE80' }}>
          ✓ {importMsg}
        </div>
      )}

      {/* Top Row: IOC Feed + GeoIP Map + Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* IOC Feed */}
        <div className="rounded-xl border p-4" style={{ background: '#141414', borderColor: '#2A2A3A' }}>
          <h3 className="text-sm font-semibold text-white mb-3">Active IOC Feed</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {iocList.filter(i => i.active).map(ioc => {
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
            <svg viewBox="0 0 100 60" className="w-full h-full opacity-30">
              <path d="M15,15 Q20,10 30,12 L35,15 Q38,20 35,25 L25,30 Q20,35 18,32 L15,25 Z" fill="#2A2A3A" />
              <path d="M45,10 Q55,8 65,12 L70,18 Q72,25 68,30 L55,35 Q48,32 45,25 Z" fill="#2A2A3A" />
              <path d="M62,10 Q75,8 85,15 L88,25 Q85,35 78,38 L68,35 Q62,28 62,18 Z" fill="#2A2A3A" />
              <path d="M22,35 Q28,32 35,38 L32,48 Q25,50 20,45 Z" fill="#2A2A3A" />
              <path d="M68,38 Q75,35 82,40 L80,52 Q72,55 68,48 Z" fill="#2A2A3A" />
            </svg>
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
          <h3 className="text-sm font-semibold text-white">Blocklist Manager <span className="text-[10px] font-normal ml-2" style={{ color: '#8B8FA3' }}>{filtered.length} indicator(s)</span></h3>
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
                {['Type', 'IP / Domain / Hash', 'Source', 'Severity', 'Hits', 'Last Seen', 'Devices', 'Status', 'Actions'].map(h => (
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
                      <button onClick={() => handleToggleIOC(ioc.id)} className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${ioc.active ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20' : 'text-gray-500 bg-gray-500/10 hover:bg-gray-500/20'}`}>
                        {ioc.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-2 px-3">
                      <button onClick={() => handleDeleteIOC(ioc.id)} className="p-1 rounded hover:bg-red-500/20 transition-colors" title="Remove IOC">
                        <Trash2 size={13} style={{ color: '#FF4C4C' }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add IOC Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowAddModal(false)}>
          <div className="rounded-2xl border p-6 w-full max-w-md" style={{ background: '#141414', borderColor: '#2A2A3A' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white">Add Indicator of Compromise</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors"><X size={18} style={{ color: '#8B8FA3' }} /></button>
            </div>

            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#8B8FA3' }}>Type</label>
                <div className="flex gap-2">
                  {(['ip', 'domain', 'hash', 'cve'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setNewIoc(p => ({ ...p, type: t }))}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase transition-all"
                      style={{
                        background: newIoc.type === t ? '#FF5A1F15' : '#1A1A2E',
                        border: `1px solid ${newIoc.type === t ? '#FF5A1F' : '#2A2A3A'}`,
                        color: newIoc.type === t ? '#FF5A1F' : '#8B8FA3',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Value */}
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#8B8FA3' }}>
                  {newIoc.type === 'ip' ? 'IP Address' : newIoc.type === 'domain' ? 'Domain Name' : newIoc.type === 'hash' ? 'File Hash (MD5/SHA256)' : 'CVE Identifier'}
                </label>
                <input
                  value={newIoc.value}
                  onChange={e => setNewIoc(p => ({ ...p, value: e.target.value }))}
                  placeholder={newIoc.type === 'ip' ? '185.220.101.34' : newIoc.type === 'domain' ? 'malware.c2-relay.net' : newIoc.type === 'hash' ? 'a1b2c3d4e5f6...' : 'CVE-2024-12345'}
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono border bg-transparent transition-colors focus:outline-none"
                  style={{ borderColor: '#2A2A3A', color: '#E2E2E2' }}
                  onFocus={e => (e.target.style.borderColor = '#FF5A1F')}
                  onBlur={e => (e.target.style.borderColor = '#2A2A3A')}
                  autoFocus
                />
              </div>

              {/* Severity */}
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#8B8FA3' }}>Severity</label>
                <div className="flex gap-2">
                  {(['critical', 'high', 'medium', 'low'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setNewIoc(p => ({ ...p, severity: s }))}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase transition-all"
                      style={{
                        background: newIoc.severity === s ? `${severityColors[s]}15` : '#1A1A2E',
                        border: `1px solid ${newIoc.severity === s ? severityColors[s] : '#2A2A3A'}`,
                        color: newIoc.severity === s ? severityColors[s] : '#8B8FA3',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source */}
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#8B8FA3' }}>Source</label>
                <select
                  value={newIoc.source}
                  onChange={e => setNewIoc(p => ({ ...p, source: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm border bg-transparent"
                  style={{ borderColor: '#2A2A3A', color: '#E2E2E2' }}
                >
                  <option value="Manual">Manual</option>
                  <option value="OTX">OTX (AlienVault)</option>
                  <option value="MISP">MISP</option>
                  <option value="NVD">NVD</option>
                  <option value="VirusTotal">VirusTotal</option>
                  <option value="AbuseIPDB">AbuseIPDB</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-xs border transition-colors hover:bg-white/5" style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}>
                Cancel
              </button>
              <button
                onClick={handleAddIOC}
                disabled={!newIoc.value.trim()}
                className="px-5 py-2 rounded-lg text-xs font-medium text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#FF5A1F' }}
              >
                Add Indicator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
