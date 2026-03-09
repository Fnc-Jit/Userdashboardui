import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import {
  Search, ChevronDown, ChevronRight,
  SlidersHorizontal, RefreshCw, ExternalLink,
  Eye, EyeOff
} from 'lucide-react';
import { incidents, getDeviceById } from '../data/mockData';

/* ──────────────── chart data ──────────────── */
const urgencyData = [
  { name: 'Critical', value: incidents.filter(i => i.severity === 'critical').length, color: '#FFB347' },
  { name: 'High', value: incidents.filter(i => i.severity === 'high').length, color: '#FF6B35' },
  { name: 'Medium', value: incidents.filter(i => i.severity === 'medium').length, color: '#FFD93D' },
  { name: 'Low', value: incidents.filter(i => i.severity === 'low').length, color: '#4BDE80' },
  { name: 'Informational', value: 0, color: '#3B82F6' },
  { name: 'Unknown', value: 0, color: '#8B8FA3' },
];

const statusData = [
  { name: 'New', value: incidents.filter(i => i.status === 'open').length, color: '#E8478C' },
  { name: 'In Progress', value: incidents.filter(i => i.status === 'investigating').length, color: '#FF6B35' },
  { name: 'Pending', value: 0, color: '#FFB347' },
  { name: 'Resolved', value: incidents.filter(i => i.status === 'resolved').length, color: '#4BDE80' },
  { name: 'Closed', value: incidents.filter(i => i.status === 'closed').length, color: '#8B8FA3' },
];

const ownerData = [
  { name: 'Administrator', value: 3, color: '#00CED1' },
  { name: 'eventbot', value: 2, color: '#3B82F6' },
  { name: 'Unassigned', value: 1, color: '#8B8FA3' },
];

const domainData = [
  { name: 'Access', value: 2, color: '#FF6B35' },
  { name: 'Endpoint', value: 1, color: '#4BDE80' },
  { name: 'Network', value: 2, color: '#3B82F6' },
  { name: 'Threat', value: 1, color: '#A855F7' },
];

/* ──────────────── MITRE mapping ──────────────── */
const mitreMappings: Record<string, { tactics: string[]; tacticIds: string[]; techniques: string[] }> = {
  'INC-001': {
    tactics: ['initial-access', 'credential-access', 'lateral-movement'],
    tacticIds: ['TA0001', 'TA0006', 'TA0008'],
    techniques: ['Exploit Public-Facing Application', 'Credential Dumping', 'Remote Services'],
  },
  'INC-002': {
    tactics: ['discovery', 'command-and-control', 'exfiltration'],
    tacticIds: ['TA0007', 'TA0011', 'TA0010'],
    techniques: ['Network Service Scanning', 'Application Layer Protocol', 'Exfiltration Over C2'],
  },
  'INC-003': {
    tactics: ['execution', 'persistence', 'impact'],
    tacticIds: ['TA0002', 'TA0003', 'TA0040'],
    techniques: ['Command and Scripting Interpreter', 'Account Manipulation', 'Data Encrypted for Impact'],
  },
  'INC-004': {
    tactics: ['persistence', 'privilege-escalation'],
    tacticIds: ['TA0003', 'TA0004'],
    techniques: ['Modify Authentication Process', 'Abuse Elevation Control'],
  },
  'INC-005': {
    tactics: ['execution', 'lateral-movement'],
    tacticIds: ['TA0002', 'TA0008'],
    techniques: ['Remote Services – SSH'],
  },
  'INC-006': {
    tactics: ['exfiltration'],
    tacticIds: ['TA0010'],
    techniques: ['Exfiltration Over Web Service'],
  },
};

/* ──────────────── helpers ──────────────── */
function SplunkSelect({ value, onChange, options, className = '' }: {
  value: string;
  onChange: (v: string) => void;
  options: { key: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none pl-2.5 pr-6 py-1.5 rounded text-xs outline-none cursor-pointer"
        style={{ background: '#1A1A2E', border: '1px solid #2A2A3A', color: '#8B8FA3' }}
      >
        {options.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
      </select>
      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#8B8FA3' }} />
    </div>
  );
}

function DonutChart({ title, data }: { title: string; data: { name: string; value: number; color: string }[] }) {
  const active = data.filter(d => d.value > 0);
  return (
    <div className="flex-1 min-w-[160px]">
      <h3 className="text-sm font-semibold mb-3" style={{ color: '#FFFFFF' }}>{title}</h3>
      <div className="flex items-center gap-4">
        <div style={{ width: 100, height: 100, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={active.length ? active : [{ name: 'Empty', value: 1, color: '#2A2A3A' }]}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={45}
                paddingAngle={active.length > 1 ? 3 : 0}
                dataKey="value"
                stroke="none"
              >
                {(active.length ? active : [{ name: 'Empty', value: 1, color: '#2A2A3A' }]).map((entry, idx) => (
                  <Cell key={`${title}-cell-${entry.name}-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A3A', borderRadius: 8, fontSize: 11 }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1">
          {data.filter(d => d.value > 0).map(d => (
            <div key={d.name} className="flex items-center gap-2 text-[11px]">
              <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }} />
              <span style={{ color: '#8B8FA3' }}>{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────── urgency / domain / type maps ──────────────── */
const urgencyConfig: Record<string, { label: string; color: string; arrow: string }> = {
  critical: { label: 'Critical', color: '#FF4C4C', arrow: '▲' },
  high:     { label: 'High',     color: '#FF6B35', arrow: '▲' },
  medium:   { label: 'Medium',   color: '#FFB347', arrow: '▲' },
  low:      { label: 'Low',      color: '#4BDE80', arrow: '' },
};

const domainMap: Record<string, string> = {
  'INC-001': 'Access',
  'INC-002': 'Network',
  'INC-003': 'Endpoint',
  'INC-004': 'Access',
  'INC-005': 'Network',
  'INC-006': 'Threat',
};

const typeMap: Record<string, string> = {
  'INC-001': 'Risk Notable',
  'INC-002': 'Risk Notable',
  'INC-003': 'Risk Notable',
  'INC-004': 'Notable Event',
  'INC-005': 'Notable Event',
  'INC-006': 'Notable Event',
};

const dispositionMap: Record<string, string> = {
  open:         'Undetermined',
  investigating:'True Positive',
  resolved:     'Resolved',
  closed:       'Benign',
};

/* ──────────────── main component ──────────────── */
export default function IncidentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [typeFilterVal, setTypeFilterVal] = useState('all');
  const [searchType, setSearchType] = useState('Correlation');
  const [timeRange, setTimeRange] = useState('Last 24 h');
  const [showCharts, setShowCharts] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filtered = useMemo(() => {
    let result = [...incidents];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.id.toLowerCase().includes(q) ||
        i.deviceId.toLowerCase().includes(q) ||
        i.recommendedAction.toLowerCase().includes(q) ||
        i.narrative.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter(i => i.status === statusFilter);
    if (severityFilter !== 'all') result = result.filter(i => i.severity === severityFilter);
    return result;
  }, [search, statusFilter, severityFilter]);

  const totalNotables = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalNotables / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-full" style={{ background: '#0C0C0C' }}>
      {/* ══════════ Header ══════════ */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#2A2A3A' }}>
        <h1 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>Incident Review</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8B8FA3' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 rounded text-xs outline-none w-48"
              style={{ background: '#1A1A2E', border: '1px solid #2A2A3A', color: '#FFFFFF' }}
            />
          </div>
          <button
            onClick={() => setShowCharts(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border transition-colors hover:bg-white/5"
            style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}
          >
            {showCharts ? <EyeOff size={12} /> : <Eye size={12} />}
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border transition-colors hover:bg-white/5"
            style={{ borderColor: '#2A2A3A', color: '#8B8FA3' }}
          >
            <SlidersHorizontal size={12} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* ══════════ Donut Charts ══════════ */}
        {showCharts && (
          <div className="flex flex-wrap gap-6 pb-4 border-b" style={{ borderColor: '#2A2A3A' }}>
            <DonutChart title="Urgency" data={urgencyData} />
            <DonutChart title="Status" data={statusData} />
            <DonutChart title="Owner" data={ownerData} />
            <DonutChart title="Domain" data={domainData} />
          </div>
        )}

        {/* ══════════ Filter selects ══════════ */}
        {showFilters && (
          <div className="space-y-3 pb-4 border-b" style={{ borderColor: '#2A2A3A' }}>
            <div className="flex flex-wrap gap-3 items-end">
              {[
                { label: 'Saved filters', value: 'all', setter: () => {}, options: [{ key: 'all', label: 'Select...' }] },
                { label: 'Tag', value: 'all', setter: () => {}, options: [{ key: 'all', label: 'Add tags...' }] },
                { label: 'Urgency', value: severityFilter, setter: setSeverityFilter, options: [
                  { key: 'all', label: 'Select...' }, { key: 'critical', label: 'Critical' }, { key: 'high', label: 'High' }, { key: 'medium', label: 'Medium' }, { key: 'low', label: 'Low' },
                ] },
                { label: 'Status', value: statusFilter, setter: setStatusFilter, options: [
                  { key: 'all', label: 'Select...' }, { key: 'open', label: 'New' }, { key: 'investigating', label: 'In Progress' }, { key: 'resolved', label: 'Resolved' }, { key: 'closed', label: 'Closed' },
                ] },
                { label: 'Owner', value: ownerFilter, setter: setOwnerFilter, options: [
                  { key: 'all', label: 'Select...' }, { key: 'admin', label: 'Administrator' }, { key: 'eventbot', label: 'eventbot' },
                ] },
                { label: 'Security Domain', value: domainFilter, setter: setDomainFilter, options: [
                  { key: 'all', label: 'Select...' }, { key: 'access', label: 'Access' }, { key: 'endpoint', label: 'Endpoint' }, { key: 'network', label: 'Network' }, { key: 'threat', label: 'Threat' },
                ] },
                { label: 'Type', value: typeFilterVal, setter: setTypeFilterVal, options: [
                  { key: 'all', label: 'Select...' }, { key: 'notable', label: 'Risk Notable' }, { key: 'event', label: 'Notable Event' },
                ] },
                { label: 'Search Type', value: searchType, setter: setSearchType, options: [
                  { key: 'Correlation', label: 'Correlatio...' }, { key: 'Manual', label: 'Manual' },
                ] },
                { label: 'Time', value: 'time', setter: () => {}, options: [{ key: 'time', label: 'Time' }] },
                { label: 'Time or Associations', value: timeRange, setter: setTimeRange, options: [
                  { key: 'Last 24 h', label: 'Last 24 h' }, { key: 'Last 7 d', label: 'Last 7 d' }, { key: 'Last 30 d', label: 'Last 30 d' },
                ] },
              ].map(f => (
                <div key={f.label} className="min-w-[90px]">
                  <div className="text-[10px] mb-1 uppercase tracking-wider" style={{ color: '#8B8FA3' }}>{f.label}</div>
                  <SplunkSelect value={f.value} onChange={f.setter} options={f.options} />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: '#8B8FA3' }}>
              <span>Earliest:</span>
              <span className="px-2 py-1 rounded" style={{ background: '#4BDE80', color: '#0C0C0C', fontWeight: 600 }}>24h ago</span>
              <span>Latest:</span>
              <span className="px-2 py-1 rounded" style={{ background: '#4BDE80', color: '#0C0C0C', fontWeight: 600 }}>now</span>
            </div>
          </div>
        )}

        {/* ══════════ Results bar ══════════ */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-sm">
            <span style={{ color: '#FFFFFF' }}>
              <strong>{totalNotables}</strong> Notables
            </span>
            <span className="text-xs" style={{ color: '#8B8FA3' }}>Edit Selected</span>
            <span className="text-xs" style={{ color: '#3B82F6', cursor: 'pointer' }}>
              Edit All Matching Events ({totalNotables})
            </span>
            <span className="text-xs" style={{ color: '#3B82F6', cursor: 'pointer' }}>
              Add Selected to Investigation
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#8B8FA3' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-1.5 py-0.5 rounded hover:bg-white/5 disabled:opacity-30"
            >
              &lt; Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 4).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="w-6 h-6 rounded flex items-center justify-center"
                style={page === n ? { background: 'rgba(255,107,53,0.2)', color: '#FF6B35' } : { color: '#8B8FA3' }}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-1.5 py-0.5 rounded hover:bg-white/5 disabled:opacity-30"
            >
              Next &gt;
            </button>
            <span className="mx-1" style={{ color: '#2A2A3A' }}>|</span>
            <span>20 per page</span>
            <span className="mx-1" style={{ color: '#2A2A3A' }}>|</span>
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              Refresh <RefreshCw size={11} />
            </button>
          </div>
        </div>

        {/* ══════════ Table ══════════ */}
        <div className="rounded border overflow-hidden" style={{ background: '#111111', borderColor: '#2A2A3A' }}>
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#1A1A2E', borderBottom: '1px solid #2A2A3A' }}>
                  {[
                    { label: '',                        width: 'w-8' },
                    { label: 'Title ▾',                 width: '' },
                    { label: 'Risk Object ▾',           width: '' },
                    { label: 'Aggregated Risk Score ▾', width: '' },
                    { label: 'Risk Events ▾',           width: '' },
                    { label: 'Type ▾',                  width: '' },
                    { label: 'Time ▾',                  width: '' },
                    { label: 'Disposition ▾',           width: '' },
                    { label: 'Security Domain ▾',       width: '' },
                    { label: 'Urgency ▾',               width: '' },
                    { label: 'Status ▾',                width: '' },
                  ].map(col => (
                    <th
                      key={col.label || 'check'}
                      className={`text-left px-3 py-2.5 font-medium whitespace-nowrap ${col.width}`}
                      style={{ color: '#8B8FA3', borderBottom: '1px solid #2A2A3A' }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              {paged.map(inc => {
                const isExpanded = expandedRow === inc.id;
                const urgency = urgencyConfig[inc.severity] || urgencyConfig.medium;
                const riskScore = inc.trustScore ? 100 - inc.trustScore : 50;
                const device = getDeviceById(inc.deviceId);
                const mitre = mitreMappings[inc.id];
                const domain = domainMap[inc.id] || 'Threat';
                const type = typeMap[inc.id] || 'Notable Event';
                const disposition = dispositionMap[inc.status] || 'Undetermined';

                return (
                  <tbody key={inc.id}>
                    {/* Main row */}
                    <tr
                      className="border-b hover:bg-white/[0.02] cursor-pointer transition-colors"
                      style={{ borderColor: '#2A2A3A' }}
                      onClick={() => setExpandedRow(isExpanded ? null : inc.id)}
                    >
                      <td className="px-3 py-2.5 w-8">
                        {isExpanded
                          ? <ChevronDown size={12} style={{ color: '#FF6B35' }} />
                          : <ChevronRight size={12} style={{ color: '#8B8FA3' }} />
                        }
                      </td>
                      <td className="px-3 py-2.5" style={{ color: '#FFFFFF' }}>
                        <div className="max-w-[240px]">
                          <div className="truncate">{inc.recommendedAction}</div>
                          <div className="text-[10px] mt-0.5" style={{ color: '#8B8FA3' }}>
                            for device={inc.deviceId}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5" style={{ color: '#3B82F6' }}>
                        {device?.name?.toLowerCase().replace(/\s+/g, '_') || inc.deviceId}
                      </td>
                      <td className="px-3 py-2.5">
                        <span style={{ color: '#FFFFFF' }}>{riskScore}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="underline" style={{ color: '#3B82F6', cursor: 'pointer' }}>
                          {inc.evidence.length}
                        </span>
                      </td>
                      <td className="px-3 py-2.5" style={{ color: '#8B8FA3' }}>
                        {type}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap" style={{ color: '#8B8FA3' }}>
                        Today, {new Date(inc.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      </td>
                      <td className="px-3 py-2.5" style={{ color: '#8B8FA3' }}>
                        {disposition}
                      </td>
                      <td className="px-3 py-2.5" style={{ color: '#8B8FA3' }}>
                        {domain}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="flex items-center gap-1" style={{ color: urgency.color }}>
                          {urgency.arrow && <span className="text-[8px]">{urgency.arrow}</span>}
                          {urgency.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5" style={{ color: '#8B8FA3' }}>
                        {inc.status === 'open' ? 'New' : inc.status === 'investigating' ? 'In Progress' : inc.status === 'resolved' ? 'Resolved' : 'Closed'}
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr style={{ background: '#0C0C0C' }}>
                        <td colSpan={11} className="px-5 py-5">
                          <div className="grid lg:grid-cols-2 gap-x-10 gap-y-5">
                            {/* Left column */}
                            <div className="space-y-5">
                              <div>
                                <h4 className="text-xs font-semibold mb-1.5" style={{ color: '#FFFFFF' }}>Description:</h4>
                                <p className="text-xs leading-relaxed" style={{ color: '#8B8FA3' }}>
                                  {inc.narrative}
                                </p>
                              </div>

                              {mitre && (
                                <div>
                                  <h4 className="text-xs font-semibold mb-2" style={{ color: '#FFFFFF' }}>Additional Fields</h4>
                                  <table className="text-xs w-full">
                                    <tbody>
                                      <tr>
                                        <td className="py-1 pr-4 align-top whitespace-nowrap" style={{ color: '#8B8FA3' }}>MITRE</td>
                                        <td className="py-1" style={{ color: '#FFFFFF' }}>
                                          <div className="flex flex-wrap gap-1">
                                            {mitre.tacticIds.map(t => (
                                              <span key={t} className="px-1.5 py-0.5 rounded" style={{ background: '#1A1A2E', color: '#8B8FA3' }}>{t}</span>
                                            ))}
                                          </div>
                                        </td>
                                        <td className="py-1 pl-6 align-top whitespace-nowrap" style={{ color: '#8B8FA3' }}>Action</td>
                                      </tr>
                                      <tr>
                                        <td className="py-1 pr-4 align-top whitespace-nowrap" style={{ color: '#8B8FA3' }}>MITRE Tactic</td>
                                        <td className="py-1" style={{ color: '#FFFFFF' }}>
                                          {mitre.tactics.map(t => (
                                            <div key={t}>{t}</div>
                                          ))}
                                        </td>
                                        <td />
                                      </tr>
                                      <tr>
                                        <td className="py-1 pr-4 align-top whitespace-nowrap" style={{ color: '#8B8FA3' }}>MITRE Tactic ID</td>
                                        <td className="py-1" style={{ color: '#FFFFFF' }}>
                                          {mitre.tacticIds.map(t => (
                                            <div key={`tactic-id-${t}`}>{t}</div>
                                          ))}
                                        </td>
                                        <td />
                                      </tr>
                                      <tr>
                                        <td className="py-1 pr-4 align-top whitespace-nowrap" style={{ color: '#8B8FA3' }}>MITRE Technique</td>
                                        <td className="py-1" style={{ color: '#FFFFFF' }}>
                                          {mitre.techniques.map(t => (
                                            <div key={t}>{t}</div>
                                          ))}
                                        </td>
                                        <td />
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>

                            {/* Right column */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-xs font-semibold mb-1" style={{ color: '#FFFFFF' }}>Related Investigations:</h4>
                                <p className="text-xs" style={{ color: '#8B8FA3' }}>
                                  {inc.status === 'investigating' ? 'Currently under active investigation.' : 'Currently not investigated.'}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-xs font-semibold mb-1" style={{ color: '#FFFFFF' }}>Correlation Search:</h4>
                                <button onClick={(e) => { e.stopPropagation(); navigate('/'); }} className="text-xs flex items-center gap-1 hover:underline" style={{ color: '#3B82F6' }}>
                                  Risk - IoT Trust Score Threshold Exceeded - Rule
                                  <ExternalLink size={10} />
                                </button>
                              </div>

                              <div>
                                <h4 className="text-xs font-semibold mb-1" style={{ color: '#FFFFFF' }}>History:</h4>
                                <button onClick={(e) => { e.stopPropagation(); navigate('/'); }} className="text-xs flex items-center gap-1 hover:underline" style={{ color: '#3B82F6' }}>
                                  View all review activity for this Notable Event
                                  <ExternalLink size={10} />
                                </button>
                              </div>

                              <div>
                                <h4 className="text-xs font-semibold mb-1" style={{ color: '#FFFFFF' }}>Contributing Events:</h4>
                                <button onClick={(e) => { e.stopPropagation(); navigate('/'); }} className="text-xs flex items-center gap-1 hover:underline" style={{ color: '#3B82F6' }}>
                                  View the Individual Risk Attributions
                                  <ExternalLink size={10} />
                                </button>
                              </div>

                              <div>
                                <h4 className="text-xs font-semibold mb-1 flex items-center gap-1.5" style={{ color: '#FFFFFF' }}>
                                  Adaptive Responses:
                                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px]" style={{ background: '#2A2A3A', color: '#8B8FA3' }}>?</span>
                                </h4>
                                <div className="rounded border overflow-hidden mt-2" style={{ borderColor: '#2A2A3A' }}>
                                  <table className="w-full text-[11px]">
                                    <thead>
                                      <tr style={{ background: '#1A1A2E' }}>
                                        {['Response', 'Mode', 'Time', 'User', 'Status'].map(h => (
                                          <th key={h} className="text-left px-2.5 py-1.5 font-medium" style={{ color: '#8B8FA3' }}>{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="border-t" style={{ borderColor: '#2A2A3A' }}>
                                        <td className="px-2.5 py-1.5" style={{ color: '#3B82F6' }}>Notable</td>
                                        <td className="px-2.5 py-1.5" style={{ color: '#8B8FA3' }}>saved</td>
                                        <td className="px-2.5 py-1.5 whitespace-nowrap" style={{ color: '#8B8FA3' }}>
                                          {new Date(inc.createdAt).toISOString().slice(0, 19).replace('T', ' ')}
                                        </td>
                                        <td className="px-2.5 py-1.5" style={{ color: '#8B8FA3' }}>admin</td>
                                        <td className="px-2.5 py-1.5" style={{ color: '#4BDE80' }}>
                                          ✓ success
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); navigate('/'); }} className="text-[11px] flex items-center gap-1 mt-2 hover:underline" style={{ color: '#3B82F6' }}>
                                  View Adaptive Response Invocations
                                  <ExternalLink size={9} />
                                </button>
                              </div>

                              <div>
                                <h4 className="text-xs font-semibold mb-1" style={{ color: '#FFFFFF' }}>Next Steps:</h4>
                                <p className="text-xs" style={{ color: '#FF6B35' }}>{inc.recommendedAction}</p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/incidents/${inc.id}`); }}
                                  className="flex items-center gap-1 mt-2 text-xs hover:opacity-80 transition-opacity"
                                  style={{ color: '#3B82F6' }}
                                >
                                  Open Full Investigation <ExternalLink size={10} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Evidence timeline */}
                          <div className="mt-5 pt-4 border-t" style={{ borderColor: '#2A2A3A' }}>
                            <h4 className="text-xs font-semibold mb-2" style={{ color: '#FFFFFF' }}>Evidence Timeline ({inc.evidence.length})</h4>
                            <div className="flex flex-wrap gap-2">
                              {inc.evidence.map((ev, i) => (
                                <span
                                  key={`${inc.id}-ev-${i}`}
                                  className="px-2.5 py-1 rounded text-[11px]"
                                  style={{ background: '#1A1A2E', border: '1px solid #2A2A3A', color: '#8B8FA3' }}
                                >
                                  {ev}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              })}
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden divide-y" style={{ borderColor: '#2A2A3A' }}>
            {paged.map(inc => {
              const urgency = urgencyConfig[inc.severity] || urgencyConfig.medium;
              const riskScore = inc.trustScore ? 100 - inc.trustScore : 50;
              const isExpanded = expandedRow === inc.id;

              return (
                <div key={inc.id} style={{ borderColor: '#2A2A3A' }}>
                  <div
                    className="p-4 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    onClick={() => setExpandedRow(isExpanded ? null : inc.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isExpanded
                          ? <ChevronDown size={12} style={{ color: '#FF6B35' }} />
                          : <ChevronRight size={12} style={{ color: '#8B8FA3' }} />
                        }
                        <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{inc.recommendedAction}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs shrink-0" style={{ color: urgency.color }}>
                        {urgency.arrow && <span className="text-[8px]">{urgency.arrow}</span>}
                        {urgency.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#8B8FA3' }}>
                      <span style={{ color: '#3B82F6' }}>{inc.deviceId}</span>
                      <span>Score: {riskScore}</span>
                      <span>{domainMap[inc.id]}</span>
                      <span>
                        {inc.status === 'open' ? 'New' : inc.status === 'investigating' ? 'In Progress' : inc.status}
                      </span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      <p className="text-xs leading-relaxed" style={{ color: '#8B8FA3' }}>{inc.narrative}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {inc.evidence.map((ev, i) => (
                          <span key={`${inc.id}-mev-${i}`} className="px-2 py-0.5 rounded text-[10px]" style={{ background: '#1A1A2E', color: '#8B8FA3' }}>{ev}</span>
                        ))}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/incidents/${inc.id}`); }}
                        className="text-xs flex items-center gap-1"
                        style={{ color: '#3B82F6' }}
                      >
                        Open Full Investigation <ExternalLink size={10} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {paged.length === 0 && (
            <div className="py-16 text-center">
              <SlidersHorizontal size={32} className="mx-auto mb-3 opacity-30" style={{ color: '#8B8FA3' }} />
              <p style={{ color: '#8B8FA3' }}>No incidents match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}