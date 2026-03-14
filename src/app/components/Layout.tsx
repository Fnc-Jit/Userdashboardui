import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, Cpu, AlertTriangle, Bell, Network, Settings,
  Shield, LogOut, Menu, X, ChevronDown, Activity, Search, Mail, Github,
  User, Clock, Building2, Key, Fingerprint,
  FileText, Brain, Link2, Globe, ClipboardCheck, Wrench
} from 'lucide-react';

type NavItemType = { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean } | { divider: string };

const navItems: NavItemType[] = [
  { to: '/dashboard', label: 'Security Posture', icon: LayoutDashboard, end: true },
  { to: '/dashboard/devices', label: 'Device Inventory', icon: Cpu },
  { to: '/dashboard/incidents', label: 'Investigations', icon: AlertTriangle },
  { to: '/dashboard/alerts', label: 'Live Alerts', icon: Bell },
  { to: '/dashboard/topology', label: 'Network Topology', icon: Network },
  { divider: 'SIEM LAYERS' },
  { to: '/dashboard/log-explorer', label: 'Log Explorer', icon: FileText },
  { to: '/dashboard/ueba', label: 'UEBA', icon: Brain },
  { to: '/dashboard/kill-chain', label: 'Kill Chain', icon: Link2 },
  { to: '/dashboard/threat-intel', label: 'Threat Intel', icon: Globe },
  { to: '/dashboard/compliance', label: 'Compliance', icon: ClipboardCheck },
  { to: '/dashboard/soc', label: 'SOC Workbench', icon: Wrench },
  { divider: 'ADMIN' },
  { to: '/dashboard/settings', label: 'Configure', icon: Settings },
];

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ background: '#0C0C0C' }}>
      {/* Splunk animated gradient bar */}
      <div className="splunk-gradient-bar shrink-0" />

      {/* ===== TOP BAR ROW 1: Logo + Controls ===== */}
      <header className="flex items-center justify-between px-4 lg:px-5 h-11 shrink-0" style={{ background: '#1A1A1A', borderBottom: '1px solid #2A2A3A' }}>
        {/* Left: Logo + Apps */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)' }}>
              <Shield size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: '#4BDE80' }}>iot</span>
            <span className="text-sm" style={{ color: '#8B8FA3' }}>sentinel</span>
          </button>
          <div className="hidden md:flex items-center gap-1 text-xs cursor-pointer hover:text-white transition-colors" style={{ color: '#8B8FA3' }}>
            Apps <ChevronDown size={12} />
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 rounded hover:bg-white/5 transition-colors"
            style={{ color: '#8B8FA3' }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] uppercase tracking-widest" style={{ color: '#4BDE80' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#4BDE80] animate-pulse" />
            Online
          </div>

          {/* Admin badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,76,76,0.12)', color: '#FF4C4C' }}>
            <span className="w-1.5 h-1.5 rounded-sm" style={{ background: '#FF4C4C' }} />
            <span className="hidden sm:inline">Administrator</span>
          </div>

          {/* Quick links */}
          <div className="hidden lg:flex items-center gap-2 text-xs" style={{ color: '#8B8FA3' }}>
            <button
              onClick={() => navigate('/dashboard/alerts')}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Bell size={12} />
              Messages
              <ChevronDown size={10} />
            </button>
            <span style={{ color: '#2A2A3A' }}>|</span>
            <button
              onClick={() => navigate('/dashboard/settings')}
              className="hover:text-white transition-colors"
            >
              Settings
            </button>
            <span style={{ color: '#2A2A3A' }}>|</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-white transition-colors"
            >
              Activity
            </button>
            <span style={{ color: '#2A2A3A' }}>|</span>
            <div className="group relative">
              <button className="hover:text-white transition-colors">Help</button>
              <div className="absolute top-full right-0 w-48 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border rounded-xl overflow-hidden py-2 mt-1" style={{ zIndex: 100, background: '#1A1A1A', borderColor: '#2A2A3A' }}>
                <a href="https://github.com/Fnc-Jit" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#e2e2e2] hover:bg-white/10 hover:text-white">
                  <Github size={16} /> GitHub
                </a>
                <a href="mailto:jitrajesh5@gmail.com" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#e2e2e2] hover:bg-white/10 hover:text-white">
                  <Mail size={16} /> Email Support
                </a>
              </div>
            </div>
          </div>

          {/* User avatar */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(v => !v)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold" style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)', color: '#fff' }}>
                SA
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-[199]" onClick={() => setProfileOpen(false)} />
                <div
                  className="absolute top-full right-0 mt-2 w-72 rounded-2xl border overflow-hidden z-[200] animate-fade-in-up"
                  style={{ background: '#1A1A2E', borderColor: '#2A2A3A', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}
                >
                  {/* Profile Header */}
                  <div className="px-5 pt-5 pb-4" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(232,71,140,0.08))' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)', color: '#fff' }}>
                        SA
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>SOC Administrator</div>
                        <div className="text-xs" style={{ color: '#8B8FA3' }}>admin@iot-sentinel.io</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 px-2 py-1 rounded-lg w-fit text-[10px] uppercase tracking-wider font-medium" style={{ background: 'rgba(255,76,76,0.12)', color: '#FF4C4C' }}>
                      <Fingerprint size={10} />
                      Super Administrator
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="px-5 py-3 space-y-2.5">
                    {[
                      { icon: User, label: 'Full Name', value: 'Jit Rajesh' },
                      { icon: Building2, label: 'Department', value: 'Security Operations Center' },
                      { icon: Key, label: 'Access Level', value: 'Full Admin (Level 5)' },
                      { icon: Clock, label: 'Last Login', value: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                      { icon: Activity, label: 'Session', value: 'Active · 32 min' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <item.icon size={11} style={{ color: '#8B8FA3' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-wider" style={{ color: '#8B8FA3' }}>{item.label}</div>
                          <div className="text-xs" style={{ color: '#FFFFFF' }}>{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="border-t px-3 py-2" style={{ borderColor: '#2A2A3A' }}>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-white/5 transition-colors"
                      style={{ color: '#8B8FA3' }}
                    >
                      <Settings size={13} /> Settings & Preferences
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-white/5 transition-colors"
                      style={{ color: '#FF4C4C' }}
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button onClick={handleLogout} className="hidden sm:flex items-center gap-1 text-xs hover:text-white transition-colors" style={{ color: '#8B8FA3' }}>
            <LogOut size={12} />
          </button>

          {/* Search icon */}
          <button
            className="p-1 hover:text-white transition-colors"
            style={{ color: '#8B8FA3' }}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={15} />
          </button>
        </div>
      </header>

      {/* ===== TOP BAR ROW 2: Navigation Tabs ===== */}
      <nav className="hidden md:flex items-center gap-0 px-4 lg:px-5 h-10 shrink-0 overflow-x-auto" style={{ background: '#111111', borderBottom: '1px solid #2A2A3A' }}>
        {navItems.map((item, idx) => {
          if ('divider' in item) {
            return <span key={`div-${idx}`} className="px-2 text-[9px] uppercase tracking-widest font-medium" style={{ color: '#4B5563' }}>{item.divider}</span>;
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="relative h-full flex items-center"
            >
              {({ isActive }) => (
                <div className="relative h-full flex items-center">
                  <span
                    className={`px-4 py-1 text-[13px] transition-colors whitespace-nowrap ${isActive ? 'text-white' : 'text-[#8B8FA3] hover:text-white'
                      }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-t-full"
                      style={{ background: '#4BDE80' }}
                    />
                  )}
                </div>
              )}
            </NavLink>
          );
        })}

        {/* Right side: Enterprise Security badge */}
        <div className="ml-auto hidden xl:flex items-center gap-2 pl-4" style={{ color: '#8B8FA3' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ border: '1.5px solid #4BDE80' }}>
            <Shield size={12} style={{ color: '#4BDE80' }} />
          </div>
          <span className="text-xs whitespace-nowrap">Enterprise Security</span>
        </div>
      </nav>

      {/* ===== Mobile dropdown nav ===== */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b" style={{ background: '#111111', borderColor: '#2A2A3A' }}>
          <div className="py-2 px-3 space-y-0.5">
            {navItems.map((item, idx) => {
              if ('divider' in item) {
                return <div key={`div-${idx}`} className="pt-2 pb-1 px-3 text-[9px] uppercase tracking-widest font-medium" style={{ color: '#4B5563' }}>{item.divider}</div>;
              }
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'text-white' : 'text-[#8B8FA3]'
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? 'rgba(255,107,53,0.08)' : undefined,
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={16} style={{ color: isActive ? '#FF6B35' : '#8B8FA3' }} />
                      <span>{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#4BDE80' }} />
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
            <div className="border-t my-2" style={{ borderColor: '#2A2A3A' }} />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5"
              style={{ color: '#8B8FA3' }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* ===== Page Content ===== */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* ===== Search Modal ===== */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border p-1 animate-fade-in-up"
            style={{ background: '#1A1A2E', borderColor: '#2A2A3A' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#2A2A3A' }}>
              <Search size={18} style={{ color: '#8B8FA3' }} />
              <input
                type="text"
                placeholder="Search devices, incidents, alerts, topology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: '#FFFFFF' }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 hover:bg-white/5 rounded transition-colors"
                style={{ color: '#8B8FA3' }}
              >
                <X size={16} />
              </button>
            </div>

            {searchQuery.length > 0 ? (
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#8B8FA3' }}>
                  Quick Actions
                </div>

                {/* Sample search results */}
                <button
                  onClick={() => {
                    navigate('/dashboard/devices');
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <Cpu size={16} style={{ color: '#FF6B35' }} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-0.5" style={{ color: '#FFFFFF' }}>Device Inventory</div>
                    <div className="text-xs" style={{ color: '#8B8FA3' }}>View all IoT devices and trust scores</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate('/dashboard/incidents');
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <AlertTriangle size={16} style={{ color: '#FF4C4C' }} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-0.5" style={{ color: '#FFFFFF' }}>Investigations</div>
                    <div className="text-xs" style={{ color: '#8B8FA3' }}>Review security incidents</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate('/dashboard/alerts');
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <Bell size={16} style={{ color: '#4BDE80' }} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-0.5" style={{ color: '#FFFFFF' }}>Live Alerts</div>
                    <div className="text-xs" style={{ color: '#8B8FA3' }}>Real-time security notifications</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate('/dashboard/topology');
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <Network size={16} style={{ color: '#3B82F6' }} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-0.5" style={{ color: '#FFFFFF' }}>Network Topology</div>
                    <div className="text-xs" style={{ color: '#8B8FA3' }}>Visualize device connections</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate('/dashboard/settings');
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <Settings size={16} style={{ color: '#FFB347' }} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-0.5" style={{ color: '#FFFFFF' }}>Configure</div>
                    <div className="text-xs" style={{ color: '#8B8FA3' }}>System settings and preferences</div>
                  </div>
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search size={32} className="mx-auto mb-3 opacity-20" style={{ color: '#8B8FA3' }} />
                <p className="text-sm" style={{ color: '#8B8FA3' }}>
                  Start typing to search across devices, incidents, alerts, and more...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Mobile bottom nav ===== */}
      <nav className="md:hidden flex border-t shrink-0" style={{ background: '#111111', borderColor: '#2A2A3A' }}>
        {navItems.filter((item): item is Exclude<NavItemType, { divider: string }> => !('divider' in item)).slice(0, 5).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-[10px] gap-0.5 transition-colors relative ${isActive ? 'text-white' : 'text-[#8B8FA3]'}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-0 left-2 right-2 h-[2px]" style={{ background: '#4BDE80' }} />
                )}
                <item.icon size={16} style={{ color: isActive ? '#FF6B35' : undefined }} />
                <span>{item.label.split(' ')[0]}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}