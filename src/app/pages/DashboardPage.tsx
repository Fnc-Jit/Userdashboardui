import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart,
  BarChart, Bar, Legend
} from 'recharts';
import { Cpu, AlertTriangle, Shield, Activity, TrendingUp, TrendingDown, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { devices, incidents, riskDistribution, dashboardStats, riskColors } from '../data/mockData';
import { RiskBadge, StatusBadge } from '../components/RiskBadge';

const trendData = [
  { day: 'Mar 3', avg: 62 }, { day: 'Mar 4', avg: 65 }, { day: 'Mar 5', avg: 60 },
  { day: 'Mar 6', avg: 58 }, { day: 'Mar 7', avg: 55 }, { day: 'Mar 8', avg: 53 },
  { day: 'Mar 9', avg: 51 },
];

// Security Posture data
const notablesByUrgency = [
  { id: 'urgency-1', time: '2:00 PM Wed May 29', critical: 5, high: 8, medium: 12, low: 15, info: 8 },
  { id: 'urgency-2', time: '4:00 PM', critical: 3, high: 10, medium: 14, low: 12, info: 6 },
  { id: 'urgency-3', time: '6:00 PM', critical: 7, high: 6, medium: 10, low: 18, info: 10 },
  { id: 'urgency-4', time: '8:00 PM', critical: 4, high: 12, medium: 8, low: 14, info: 7 },
  { id: 'urgency-5', time: '10:00 PM', critical: 6, high: 9, medium: 15, low: 11, info: 9 },
  { id: 'urgency-6', time: '12:00 AM Thu May 30', critical: 8, high: 7, medium: 11, low: 16, info: 12 },
  { id: 'urgency-7', time: '2:00 AM', critical: 2, high: 11, medium: 13, low: 9, info: 8 },
  { id: 'urgency-8', time: '4:00 AM', critical: 5, high: 8, medium: 16, low: 13, info: 11 },
  { id: 'urgency-9', time: '6:00 AM', critical: 9, high: 5, medium: 9, low: 17, info: 10 },
  { id: 'urgency-10', time: '8:00 AM', critical: 4, high: 14, medium: 12, low: 10, info: 8 },
  { id: 'urgency-11', time: '10:00 AM', critical: 6, high: 10, medium: 14, low: 15, info: 13 },
  { id: 'urgency-12', time: '12:00 PM', critical: 7, high: 8, medium: 11, low: 12, info: 9 },
];

const notablesByDomain = [
  { id: 'domain-1', domain: 'Thu May 29 2025', endpoint: 12, network: 18, access: 15, threat: 10 },
  { id: 'domain-2', domain: 'Fri May 30', endpoint: 15, network: 14, access: 12, threat: 13 },
  { id: 'domain-3', domain: 'Sat May 31', endpoint: 10, network: 20, access: 16, threat: 11 },
  { id: 'domain-4', domain: 'Sun Jun 1', endpoint: 18, network: 16, access: 14, threat: 15 },
  { id: 'domain-5', domain: 'Mon Jun 2', endpoint: 14, network: 19, access: 13, threat: 12 },
];

const untriagedByDomain = [
  { id: 'untriaged-1', domain: 'Thu May 29 2025', endpoint: 8, network: 12, access: 10, threat: 7 },
  { id: 'untriaged-2', domain: 'Fri May 30', endpoint: 10, network: 9, access: 8, threat: 11 },
  { id: 'untriaged-3', domain: 'Sat May 31', endpoint: 6, network: 15, access: 12, threat: 8 },
  { id: 'untriaged-4', domain: 'Sun Jun 1', endpoint: 14, network: 11, access: 9, threat: 13 },
  { id: 'untriaged-5', domain: 'Mon Jun 2', endpoint: 9, network: 14, access: 11, threat: 9 },
];

const topUntriagedSources = [
  { id: 'source-1', name: 'Network Firewall Malicious Traffic Detection', value: 28, color: '#A855F7' },
  { id: 'source-2', name: 'Endpoint Detection & Response', value: 24, color: '#EC4899' },
  { id: 'source-3', name: 'Cloud Security Events', value: 18, color: '#3B82F6' },
  { id: 'source-4', name: 'Identity Access Management', value: 15, color: '#10B981' },
  { id: 'source-5', name: 'Other Sources', value: 15, color: '#F59E0B' },
];

const untriagedByType = [
  { id: 'type-1', name: 'Malware', value: 32, color: '#EF4444' },
  { id: 'type-2', name: 'Phishing', value: 28, color: '#F59E0B' },
  { id: 'type-3', name: 'Anomaly', value: 22, color: '#3B82F6' },
  { id: 'type-4', name: 'Policy Violation', value: 12, color: '#8B5CF6' },
  { id: 'type-5', name: 'Other', value: 6, color: '#6B7280' },
];

function KPICard({ title, value, icon: Icon, color, sub }: { title: string; value: string | number; icon: any; color: string; sub?: string }) {
  return (
    <div className="rounded-2xl p-5 border animate-fade-in-up" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <TrendingDown size={14} style={{ color: '#8B8FA3' }} />
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
      <div className="text-sm" style={{ color: '#8B8FA3' }}>{title}</div>
      {sub && <div className="text-xs mt-1" style={{ color: '#8B8FA3' }}>{sub}</div>}
    </div>
  );
}

function PostureMetricCard({ title, value, change, icon: Icon }: { title: string; value: string; change: string; icon: any }) {
  return (
    <div className="rounded-xl p-6 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
      <div className="mb-4">
        <span className="text-xs uppercase tracking-wider" style={{ color: '#8B8FA3' }}>{title}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <div className="text-4xl font-bold" style={{ color: '#FFFFFF' }}>{value}</div>
        <span className="text-sm font-medium" style={{ color: '#FF4C4C' }}>{change}</span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl border text-xs" style={{ background: '#1A1A2E', borderColor: '#2A2A3A', color: '#FFFFFF' }}>
        <div style={{ color: '#8B8FA3' }}>{label}</div>
        <div style={{ color: '#FF6B35' }}>Avg Trust: {payload[0].value}</div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'posture'>('posture');
  const [timeRange, setTimeRange] = useState('7d');
  const highRiskDevices = devices.filter(d => d.riskLevel === 'high' || d.riskLevel === 'critical').slice(0, 5);
  const recentIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating').slice(0, 4);

  return (
    <div className="flex flex-col h-full" style={{ background: '#0C0C0C' }}>
      {/* Tabs */}
      <div className="border-b shrink-0" style={{ borderColor: '#2A2A3A', background: '#0C0C0C' }}>
        <div className="flex items-center px-6 lg:px-8">
          <button
            onClick={() => setActiveTab('overview')}
            className="relative px-4 py-4 text-sm font-medium transition-colors"
            style={{ color: activeTab === 'overview' ? '#FFFFFF' : '#8B8FA3' }}
          >
            Security Overview
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#FF6B35' }} />
            )}
          </button>
          <button
            onClick={() => setActiveTab('posture')}
            className="relative px-4 py-4 text-sm font-medium transition-colors blink-animation"
            style={{ color: activeTab === 'posture' ? '#FFFFFF' : '#8B8FA3' }}
          >
            Security Posture
            {activeTab === 'posture' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#FF6B35' }} />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'overview' ? (
          <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="splunk-subheader block mb-1" style={{ color: '#FF6B35' }}>Security Overview</span>
                <h1 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>Security Overview</h1>
                <p className="text-sm mt-0.5" style={{ color: '#8B8FA3' }}>Monday, March 9, 2026 · Real-time monitoring active</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs" style={{ background: 'rgba(75,222,128,0.08)', borderColor: 'rgba(75,222,128,0.2)', color: '#4BDE80' }}>
                <Activity size={12} />
                Live
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard title="Total Devices" value={dashboardStats.totalDevices} icon={Cpu} color="#FF6B35" />
              <KPICard title="Trusted Devices" value={dashboardStats.trustedDevices} icon={Shield} color="#4BDE80" sub="Trust score ≥ 80" />
              <KPICard title="High Risk Devices" value={dashboardStats.highRiskDevices} icon={AlertTriangle} color="#FF6B35" sub="Requires attention" />
              <KPICard title="Active Incidents" value={dashboardStats.activeIncidents} icon={Activity} color="#FF4C4C" sub="Open + Investigating" />
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-5 gap-4">
              {/* Donut chart */}
              <div className="lg:col-span-2 rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="splunk-subheader" style={{ color: '#E8478C' }}>Risk Analysis</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Risk Distribution</h2>
                  <span className="text-xs" style={{ color: '#8B8FA3' }}>12 devices</span>
                </div>
                <div className="flex items-center gap-4">
                  <div style={{ width: 160, height: 160, flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                          {riskDistribution.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A3A', borderRadius: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {riskDistribution.map(r => (
                      <div key={r.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                          <span className="text-xs" style={{ color: '#8B8FA3' }}>{r.name}</span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#FFFFFF' }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trust trend */}
              <div className="lg:col-span-3 rounded-2xl p-5 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="splunk-subheader" style={{ color: '#E8478C' }}>Trend Analysis</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Average Trust Score Trend</h2>
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#FF4C4C' }}>
                    <TrendingDown size={12} />
                    -4.2% this week
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="trustGradDashboard" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fill: '#8B8FA3', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[40, 80]} tick={{ fill: '#8B8FA3', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="avg" stroke="#FF6B35" strokeWidth={2} fill="url(#trustGradDashboard)" dot={{ fill: '#FF6B35', strokeWidth: 0, r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom panels */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* High Risk Devices */}
              <div className="rounded-2xl border overflow-hidden" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#2A2A3A' }}>
                  <div>
                    <span className="splunk-subheader block mb-0.5" style={{ color: '#FF6B35' }}>Device Health</span>
                    <h2 className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>High Risk Devices</h2>
                  </div>
                  <button onClick={() => navigate('/dashboard/devices')} className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity" style={{ color: '#FF6B35' }}>
                    View All <ArrowRight size={12} />
                  </button>
                </div>
                <div className="divide-y" style={{ divideColor: '#2A2A3A' }}>
                  {highRiskDevices.map(d => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] cursor-pointer transition-colors"
                      onClick={() => navigate(`/dashboard/devices/${d.id}`)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${riskColors[d.riskLevel]}12` }}>
                          <Cpu size={14} style={{ color: riskColors[d.riskLevel] }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm truncate" style={{ color: '#FFFFFF' }}>{d.name}</div>
                          <div className="text-xs" style={{ color: '#8B8FA3' }}>{d.id} · {d.vendor}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-medium" style={{ color: riskColors[d.riskLevel] }}>{d.trustScore}</div>
                          <div className="text-xs" style={{ color: '#8B8FA3' }}>Trust</div>
                        </div>
                        <RiskBadge level={d.riskLevel} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Incidents */}
              <div className="rounded-2xl border overflow-hidden" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#2A2A3A' }}>
                  <div>
                    <span className="splunk-subheader block mb-0.5" style={{ color: '#E8478C' }}>Incident Response</span>
                    <h2 className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Active Incidents</h2>
                  </div>
                  <button onClick={() => navigate('/dashboard/incidents')} className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity" style={{ color: '#FF6B35' }}>
                    View All <ArrowRight size={12} />
                  </button>
                </div>
                <div className="divide-y" style={{ divideColor: '#2A2A3A' }}>
                  {recentIncidents.map(inc => (
                    <div
                      key={inc.id}
                      className="flex items-start justify-between px-5 py-3 hover:bg-white/[0.02] cursor-pointer transition-colors"
                      onClick={() => navigate(`/dashboard/incidents/${inc.id}`)}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${riskColors[inc.riskLevel]}12` }}>
                          <AlertTriangle size={14} style={{ color: riskColors[inc.riskLevel] }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm" style={{ color: '#FFFFFF' }}>{inc.id}</div>
                          <div className="text-xs truncate" style={{ color: '#8B8FA3' }}>{inc.deviceId} · {inc.recommendedAction}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#8B8FA3' }}>{new Date(inc.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <RiskBadge level={inc.riskLevel} size="sm" />
                        <StatusBadge status={inc.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 lg:p-8 space-y-6">
            {/* Executive Summary Header */}
            <div>
              <h1 className="text-2xl font-semibold mb-4" style={{ color: '#FFFFFF' }}>Executive Summary</h1>
              
              {/* Time Range Filters */}
              <div className="flex items-center gap-2 mb-6">
                {['24h', '7d', '30d', '90d', '1y'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className="px-4 py-1.5 rounded text-xs font-medium transition-colors"
                    style={{
                      background: timeRange === range ? 'rgba(255,107,53,0.15)' : 'transparent',
                      color: timeRange === range ? '#FF6B35' : '#8B8FA3',
                      border: `1px solid ${timeRange === range ? 'rgba(255,107,53,0.3)' : '#2A2A3A'}`,
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div>
              <h3 className="text-sm font-medium mb-4" style={{ color: '#FFFFFF' }}>Key Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PostureMetricCard title="Mean Time to Triage" value="106 min" change="↑106" icon={Clock} />
                <PostureMetricCard title="Mean Time to Resolution" value="187 min" change="↑187" icon={CheckCircle2} />
                <PostureMetricCard title="Investigations Created" value="1" change="↑1" icon={Activity} />
              </div>
            </div>

            {/* Notables - Distribution by Urgency */}
            <div className="rounded-xl p-6 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1" style={{ color: '#FFFFFF' }}>Notables</h3>
                <p className="text-xs" style={{ color: '#8B8FA3' }}>Distribution by Urgency</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={notablesByUrgency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: '#8B8FA3', fontSize: 10 }} 
                    axisLine={false} 
                    tickLine={false}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: '#8B8FA3', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A3A', borderRadius: 8 }}
                    labelStyle={{ color: '#FFFFFF' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Bar key="bar-critical" dataKey="critical" stackId="a" fill="#FF4C4C" name="Critical" />
                  <Bar key="bar-high" dataKey="high" stackId="a" fill="#FF6B35" name="High" />
                  <Bar key="bar-medium" dataKey="medium" stackId="a" fill="#FFB347" name="Medium" />
                  <Bar key="bar-low" dataKey="low" stackId="a" fill="#FDE047" name="Low" />
                  <Bar key="bar-info" dataKey="info" stackId="a" fill="#4BDE80" name="Informational" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Notables by Domain & Untriaged */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Notables by Domain */}
              <div className="rounded-xl p-6 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-1" style={{ color: '#FFFFFF' }}>Notables by Domain</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={notablesByDomain}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis 
                      dataKey="domain" 
                      tick={{ fill: '#8B8FA3', fontSize: 10 }} 
                      axisLine={false} 
                      tickLine={false}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fill: '#8B8FA3', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A3A', borderRadius: 8 }}
                    />
                    <Legend iconType="circle" />
                    <Bar key="bar-domain-endpoint" dataKey="endpoint" fill="#3B82F6" name="Endpoint" />
                    <Bar key="bar-domain-network" dataKey="network" fill="#8B5CF6" name="Network" />
                    <Bar key="bar-domain-access" dataKey="access" fill="#EC4899" name="Access" />
                    <Bar key="bar-domain-threat" dataKey="threat" fill="#F59E0B" name="Threat" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Untriaged Notables by Domain */}
              <div className="rounded-xl p-6 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-1" style={{ color: '#FFFFFF' }}>Untriaged Notables by Domain</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={untriagedByDomain}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis 
                      dataKey="domain" 
                      tick={{ fill: '#8B8FA3', fontSize: 10 }} 
                      axisLine={false} 
                      tickLine={false}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fill: '#8B8FA3', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A3A', borderRadius: 8 }}
                    />
                    <Legend iconType="circle" />
                    <Bar key="bar-untriaged-endpoint" dataKey="endpoint" fill="#3B82F6" name="Endpoint" />
                    <Bar key="bar-untriaged-network" dataKey="network" fill="#8B5CF6" name="Network" />
                    <Bar key="bar-untriaged-access" dataKey="access" fill="#EC4899" name="Access" />
                    <Bar key="bar-untriaged-threat" dataKey="threat" fill="#F59E0B" name="Threat" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Row - Pie Charts */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Top 10 Untriaged Notables by Source */}
              <div className="rounded-xl p-6 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-1" style={{ color: '#FFFFFF' }}>Top 10 Untriaged Notables by Source</h3>
                </div>
                <div className="flex items-center gap-6">
                  <div style={{ width: 180, height: 180, flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={topUntriagedSources} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={50} 
                          outerRadius={80} 
                          paddingAngle={2} 
                          dataKey="value"
                        >
                          {topUntriagedSources.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A3A', borderRadius: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {topUntriagedSources.map(item => (
                      <div key={item.name} className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: item.color }} />
                          <span className="text-xs leading-tight" style={{ color: '#8B8FA3' }}>{item.name}</span>
                        </div>
                        <span className="text-xs font-medium shrink-0" style={{ color: '#FFFFFF' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Untriaged Notables by Type */}
              <div className="rounded-xl p-6 border" style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}>
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-1" style={{ color: '#FFFFFF' }}>Untriaged Notables by Type</h3>
                </div>
                <div className="flex items-center gap-6">
                  <div style={{ width: 180, height: 180, flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={untriagedByType} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={50} 
                          outerRadius={80} 
                          paddingAngle={2} 
                          dataKey="value"
                        >
                          {untriagedByType.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A3A', borderRadius: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {untriagedByType.map(item => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                          <span className="text-xs" style={{ color: '#8B8FA3' }}>{item.name}</span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#FFFFFF' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}