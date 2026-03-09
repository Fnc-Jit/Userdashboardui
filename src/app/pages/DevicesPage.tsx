import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, Download, Cpu, ChevronUp, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { devices, Device, RiskLevel, riskColors } from '../data/mockData';
import { RiskBadge, StatusBadge } from '../components/RiskBadge';

type SortField = 'id' | 'name' | 'trustScore' | 'lastSeen';
type SortDir = 'asc' | 'desc';

const riskFilters: { key: RiskLevel | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'trusted', label: 'Trusted' },
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
  { key: 'critical', label: 'Critical' },
];

function TrustBar({ score }: { score: number }) {
  const color = score >= 80 ? '#4BDE80' : score >= 60 ? '#3B82F6' : score >= 40 ? '#FFB347' : score >= 20 ? '#FF6B35' : '#FF4C4C';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-medium w-7 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

export default function DevicesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('trustScore');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [view, setView] = useState<'table' | 'cards'>('table');

  const filtered = useMemo(() => {
    let result = [...devices];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.id.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.vendor.toLowerCase().includes(q) ||
        d.class.toLowerCase().includes(q)
      );
    }
    if (riskFilter !== 'all') result = result.filter(d => d.riskLevel === riskFilter);

    result.sort((a, b) => {
      let av: any = a[sortField], bv: any = b[sortField];
      if (sortField === 'lastSeen') { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [search, riskFilter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={12} className="opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp size={12} style={{ color: '#FF6B35' }} /> : <ChevronDown size={12} style={{ color: '#FF6B35' }} />;
  };

  const exportCSV = () => {
    const rows = [
      ['ID', 'Name', 'Class', 'Vendor', 'Trust Score', 'Risk Level', 'Status', 'IP', 'Last Seen'],
      ...filtered.map(d => [d.id, d.name, d.class, d.vendor, d.trustScore, d.riskLevel, d.status, d.ip, d.lastSeen]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'devices.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8 space-y-5 min-h-full" style={{ background: '#0C0C0C' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="splunk-subheader block mb-1" style={{ color: '#FF6B35' }}>Asset Management</span>
          <h1 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>Device Inventory</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8B8FA3' }}>{filtered.length} of {devices.length} devices</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border hover:bg-white/5 transition-colors"
          style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#8B8FA3' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, name, vendor, class..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: '#1A1A2E', border: '1px solid #2A2A3A', color: '#FFFFFF' }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,107,53,0.4)'}
            onBlur={e => e.currentTarget.style.borderColor = '#2A2A3A'}
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#1A1A2E', border: '1px solid #2A2A3A' }}>
          {riskFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setRiskFilter(f.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={riskFilter === f.key
                ? { background: riskColors[f.key as RiskLevel] || 'rgba(255,107,53,0.2)', color: f.key === 'all' ? '#FF6B35' : '#fff' }
                : { color: '#8B8FA3' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#2A2A3A' }}>
                {[
                  { label: 'Device', field: 'id' as SortField },
                  { label: 'Class / Vendor', field: null },
                  { label: 'Trust Score', field: 'trustScore' as SortField },
                  { label: 'Risk Level', field: null },
                  { label: 'Status', field: null },
                  { label: 'IP Address', field: null },
                  { label: 'Last Seen', field: 'lastSeen' as SortField },
                ].map(col => (
                  <th
                    key={col.label}
                    className={`text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider ${col.field ? 'cursor-pointer hover:opacity-80 select-none' : ''}`}
                    style={{ color: '#8B8FA3' }}
                    onClick={() => col.field && handleSort(col.field)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.field && <SortIcon field={col.field} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr
                  key={d.id}
                  className="border-b hover:bg-white/[0.02] cursor-pointer transition-colors"
                  style={{ borderColor: '#2A2A3A' }}
                  onClick={() => navigate(`/dashboard/devices/${d.id}`)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${riskColors[d.riskLevel]}12` }}>
                        <Cpu size={14} style={{ color: riskColors[d.riskLevel] }} />
                      </div>
                      <div>
                        <div style={{ color: '#FFFFFF' }}>{d.name}</div>
                        <div className="text-xs" style={{ color: '#8B8FA3' }}>{d.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div style={{ color: '#FFFFFF' }}>{d.class}</div>
                    <div className="text-xs" style={{ color: '#8B8FA3' }}>{d.vendor}</div>
                  </td>
                  <td className="px-5 py-3.5 w-36">
                    <TrustBar score={d.trustScore} />
                  </td>
                  <td className="px-5 py-3.5"><RiskBadge level={d.riskLevel} size="sm" /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={d.status} size="sm" /></td>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: '#8B8FA3' }}>{d.ip}</td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: '#8B8FA3' }}>
                    {new Date(d.lastSeen).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden divide-y" style={{ divideColor: '#2A2A3A' }}>
          {filtered.map(d => (
            <div
              key={d.id}
              className="p-4 hover:bg-white/[0.02] cursor-pointer transition-colors"
              onClick={() => navigate(`/dashboard/devices/${d.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${riskColors[d.riskLevel]}12` }}>
                    <Cpu size={15} style={{ color: riskColors[d.riskLevel] }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{d.name}</div>
                    <div className="text-xs" style={{ color: '#8B8FA3' }}>{d.id} · {d.vendor}</div>
                  </div>
                </div>
                <StatusBadge status={d.status} size="sm" />
              </div>
              <TrustBar score={d.trustScore} />
              <div className="flex items-center gap-2 mt-2">
                <RiskBadge level={d.riskLevel} size="sm" />
                <span className="text-xs" style={{ color: '#8B8FA3' }}>{d.ip}</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <SlidersHorizontal size={32} className="mx-auto mb-3 opacity-30" style={{ color: '#8B8FA3' }} />
            <p style={{ color: '#8B8FA3' }}>No devices match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
