import { useState, useCallback } from 'react';
import {
  Wrench, Bell, Clock, Mail, Smartphone,
  CheckCircle, ChevronDown, Shield, Database
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-all duration-200"
      style={{ background: checked ? 'var(--splunk-orange)' : 'var(--splunk-border)' }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
        style={{ background: '#fff', left: checked ? '22px' : '2px', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
      />
    </button>
  );
}

function SettingsSection({ title, icon: Icon, subheader, children }: { title: string; icon: any; subheader?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--splunk-card)', borderColor: 'var(--splunk-border)' }}>
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--splunk-border)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)' }}>
          <Icon size={15} style={{ color: 'var(--splunk-orange)' }} />
        </div>
        <div>
          {subheader && <span className="splunk-subheader block" style={{ color: 'var(--splunk-pink)' }}>{subheader}</span>}
          <h2 className="text-sm font-semibold" style={{ color: 'var(--splunk-text)' }}>{title}</h2>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function SettingsRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b last:border-0" style={{ borderColor: 'var(--splunk-border)' }}>
      <div>
        <div className="text-sm" style={{ color: 'var(--splunk-text)' }}>{label}</div>
        {desc && <div className="text-xs mt-0.5" style={{ color: 'var(--splunk-muted)' }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

const durations = ['15 minutes', '30 minutes', '1 hour', '4 hours', '8 hours', '24 hours'];

export default function SettingsPage() {
  const { theme, setTheme, density, setDensity } = useTheme();
  const [maintenance, setMaintenance] = useState(false);
  const [duration, setDuration] = useState('1 hour');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [digestMode, setDigestMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKey, setApiKey] = useState('sk-sentinel-a8f2b91e4c6d0325');
  const [rotateConfirm, setRotateConfirm] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRotateKey = useCallback(() => {
    if (!rotateConfirm) {
      setRotateConfirm(true);
      setTimeout(() => setRotateConfirm(false), 3000);
      return;
    }
    const chars = 'abcdef0123456789';
    const newKey = 'sk-sentinel-' + Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setApiKey(newKey);
    setApiKeyVisible(true);
    setRotateConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [rotateConfirm]);

  return (
    <div className="p-6 lg:p-8 space-y-5 min-h-full max-w-3xl mx-auto" style={{ background: 'var(--splunk-bg)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="splunk-subheader block mb-1" style={{ color: 'var(--splunk-orange)' }}>Configuration</span>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--splunk-text)' }}>Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--splunk-muted)' }}>Platform configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{ background: saved ? 'rgba(75,222,128,0.2)' : 'linear-gradient(135deg, var(--splunk-orange), var(--splunk-pink))', color: saved ? 'var(--splunk-green)' : '#fff', border: saved ? '1px solid rgba(75,222,128,0.4)' : 'none' }}
        >
          {saved ? <><CheckCircle size={15} />Saved!</> : 'Save Changes'}
        </button>
      </div>

      {/* Maintenance Mode */}
      <SettingsSection title="Maintenance Mode" icon={Wrench} subheader="Operations">
        <SettingsRow
          label="Enable Maintenance Mode"
          desc="Suppress alerts and notifications for all devices during maintenance windows."
        >
          <Toggle checked={maintenance} onChange={setMaintenance} />
        </SettingsRow>
        {maintenance && (
          <div className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(255,179,71,0.06)', border: '1px solid rgba(255,179,71,0.15)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={13} style={{ color: '#FFB347' }} />
              <span className="text-sm" style={{ color: '#FFB347' }}>Maintenance active</span>
            </div>
            <div>
              <label className="splunk-subheader mb-1.5 block">Duration</label>
              <div className="relative">
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl text-sm outline-none pr-8"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,179,71,0.25)', color: '#FFFFFF' }}
                >
                  {durations.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#8B8FA3' }} />
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: '#8B8FA3' }}>
              Maintenance mode will auto-disable after <span style={{ color: '#FFB347' }}>{duration}</span>.
            </p>
          </div>
        )}
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notification Settings" icon={Bell} subheader="Alerts">
        <SettingsRow label="Email Alerts" desc="Receive security alerts via email to analyst@sentinel.io">
          <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
        </SettingsRow>
        <SettingsRow label="Push Notifications" desc="Browser and mobile push notifications for real-time alerts">
          <Toggle checked={pushAlerts} onChange={setPushAlerts} />
        </SettingsRow>
        <SettingsRow label="Critical Alerts Only" desc="Only receive notifications for critical severity events">
          <Toggle checked={criticalOnly} onChange={setCriticalOnly} />
        </SettingsRow>
        <SettingsRow label="Daily Digest Mode" desc="Receive a daily summary email instead of individual alerts">
          <Toggle checked={digestMode} onChange={setDigestMode} />
        </SettingsRow>
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--splunk-border)' }}>
          <div className="splunk-subheader mb-3">Notification Channels</div>
          <div className="flex gap-2 flex-wrap">
            {[
              { icon: Mail, label: 'Email', active: emailAlerts },
              { icon: Smartphone, label: 'Mobile Push', active: pushAlerts },
              { icon: Bell, label: 'Browser', active: pushAlerts },
            ].map(ch => (
              <div key={ch.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border"
                style={{ background: ch.active ? 'rgba(255,107,53,0.08)' : 'transparent', borderColor: ch.active ? 'rgba(255,107,53,0.2)' : 'var(--splunk-border)', color: ch.active ? 'var(--splunk-orange)' : 'var(--splunk-muted)' }}>
                <ch.icon size={12} />
                {ch.label}
                {ch.active && <CheckCircle size={11} style={{ color: 'var(--splunk-green)' }} />}
              </div>
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* Security Settings */}
      <SettingsSection title="Security & API" icon={Shield} subheader="Access Control">
        <SettingsRow label="Two-Factor Authentication" desc="Require 2FA for all SOC analyst logins">
          <Toggle checked={true} onChange={() => { }} />
        </SettingsRow>
        <SettingsRow label="Session Timeout" desc="Auto-logout after 30 minutes of inactivity">
          <span className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(255,107,53,0.1)', color: 'var(--splunk-orange)' }}>30 min</span>
        </SettingsRow>
        <div className="mt-4">
          <div className="text-sm mb-2" style={{ color: 'var(--splunk-text)' }}>API Key</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-2.5 rounded-xl text-sm font-mono" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--splunk-border)', color: 'var(--splunk-muted)' }}>
              {apiKeyVisible ? apiKey : '•••••••••••••••••••••••••••••••'}
            </div>
            <button
              onClick={() => setApiKeyVisible(v => !v)}
              className="px-3 py-2 rounded-xl text-xs border hover:bg-white/5 transition-colors"
              style={{ borderColor: 'var(--splunk-border)', color: 'var(--splunk-muted)' }}
            >
              {apiKeyVisible ? 'Hide' : 'Reveal'}
            </button>
            <button
              onClick={handleRotateKey}
              className="px-3 py-2 rounded-xl text-xs border hover:bg-white/5 transition-colors"
              style={{ borderColor: rotateConfirm ? 'rgba(255,76,76,0.4)' : 'var(--splunk-border)', color: rotateConfirm ? '#FF4C4C' : 'var(--splunk-orange)' }}
            >
              {rotateConfirm ? 'Confirm Rotate?' : 'Rotate'}
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* Integrations */}
      <SettingsSection title="SIEM Integrations" icon={Database} subheader="Connectors">
        {[
          { name: 'OTX (AlienVault)', status: 'connected', color: '#4BDE80' },
          { name: 'MISP (Threat Sharing)', status: 'connected', color: '#4BDE80' },
          { name: 'Splunk SOAR', status: 'pending', color: '#FFB347' },
          { name: 'PagerDuty', status: 'disconnected', color: '#FF4C4C' },
        ].map(integ => (
          <SettingsRow key={integ.name} label={integ.name} desc={`Status: ${integ.status}`}>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold" style={{ background: `${integ.color}15`, color: integ.color }}>
              {integ.status}
            </span>
          </SettingsRow>
        ))}
      </SettingsSection>

      {/* Policies */}
      <SettingsSection title="Detection Policies" icon={Shield} subheader="UEBA / Correlation">
        <SettingsRow label="UEBA Drift Threshold" desc="Alert when CUSUM exceeds this σ value">
          <span className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(126,58,242,0.1)', color: '#7E3AF2' }}>3.0σ</span>
        </SettingsRow>
        <SettingsRow label="Auto-Isolate Critical Devices" desc="Automatically quarantine devices when trust score drops below 15">
          <Toggle checked={true} onChange={() => {}} />
        </SettingsRow>
        <SettingsRow label="Kill Chain Auto-Correlation" desc="Automatically correlate alerts across SIEM layers">
          <Toggle checked={true} onChange={() => {}} />
        </SettingsRow>
        <SettingsRow label="IOC Auto-Block" desc="Automatically block IOCs with severity ≥ high in the firewall">
          <Toggle checked={false} onChange={() => {}} />
        </SettingsRow>
      </SettingsSection>

      {/* RBAC */}
      <SettingsSection title="Users & RBAC" icon={Shield} subheader="Access Management">
        <div className="space-y-2">
          {[
            { user: 'jitraj_esh', role: 'Super Admin', level: 5 },
            { user: 'soc_analyst_1', role: 'SOC Analyst', level: 3 },
            { user: 'viewer_01', role: 'Read-Only', level: 1 },
          ].map(u => (
            <div key={u.user} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--splunk-border)' }}>
              <div>
                <div className="text-sm" style={{ color: 'var(--splunk-text)' }}>{u.user}</div>
                <div className="text-xs" style={{ color: 'var(--splunk-muted)' }}>{u.role} · Level {u.level}</div>
              </div>
              <button className="px-2 py-0.5 rounded text-[10px] border" style={{ borderColor: 'var(--splunk-border)', color: 'var(--splunk-muted)' }}>Edit</button>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Data Retention */}
      <SettingsSection title="Data Retention" icon={Database} subheader="Storage">
        <SettingsRow label="Log Retention Period" desc="How long raw logs are kept before archival">
          <span className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(255,107,53,0.1)', color: 'var(--splunk-orange)' }}>90 days</span>
        </SettingsRow>
        <SettingsRow label="Incident Archive Period" desc="How long resolved incidents are visible before archival">
          <span className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(255,107,53,0.1)', color: 'var(--splunk-orange)' }}>365 days</span>
        </SettingsRow>
        <SettingsRow label="IOC Feed Refresh Interval" desc="How often threat intelligence feeds are refreshed">
          <span className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(255,107,53,0.1)', color: 'var(--splunk-orange)' }}>15 min</span>
        </SettingsRow>
      </SettingsSection>

      {/* System Info */}
      <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,107,53,0.02)', borderColor: 'rgba(255,107,53,0.08)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Database size={14} style={{ color: 'var(--splunk-orange)' }} />
          <span className="splunk-subheader" style={{ color: 'var(--splunk-pink)' }}>Platform</span>
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--splunk-text)' }}>System Information</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-xs">
          {[
            { label: 'Platform Version', value: 'v2.4.1' },
            { label: 'Data Retention', value: '90 days' },
            { label: 'Last Model Update', value: 'Mar 8, 2026' },
            { label: 'Uptime', value: '99.97%' },
          ].map(item => (
            <div key={item.label}>
              <div className="uppercase tracking-wider" style={{ color: 'var(--splunk-muted)' }}>{item.label}</div>
              <div className="mt-0.5 font-medium" style={{ color: 'var(--splunk-orange)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
