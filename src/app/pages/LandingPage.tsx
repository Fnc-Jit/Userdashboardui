import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Shield, Cpu, AlertTriangle, Network, Bell, Lock,
  ChevronRight, Activity, Eye, Zap, Globe,
  Github, Linkedin, BookOpen, FileText, Video, BookMarked,
  ExternalLink, ArrowRight, Mail, Twitter, Youtube, Calendar, Search, User, ChevronDown
} from 'lucide-react';
import { DeviceScrollSection } from '../components/DeviceScrollSection';
import { RequestAccessModal } from '../components/RequestAccessModal';
import exampleImage from 'figma:asset/37e448d9def7ecd968dbd26abcb3017a97415173.png';

const features = [
  {
    icon: Activity,
    title: 'Real-Time Device Monitoring',
    desc: 'Continuously monitor IoT device trust scores, behavioral anomalies, and risk classifications across your entire network.',
    color: '#FF6B35',
  },
  {
    icon: AlertTriangle,
    title: 'Incident Investigation',
    desc: 'Deep-dive into security incidents with detailed evidence logs, AI-generated narratives, and recommended remediation actions.',
    color: '#E8478C',
  },
  {
    icon: Bell,
    title: 'Live Alert Stream',
    desc: 'Real-time streaming alerts for policy violations, trust score changes, device status updates, and graph anomalies.',
    color: '#4BDE80',
  },
  {
    icon: Network,
    title: 'Network Topology',
    desc: 'Visualize your full IoT network topology with risk-colored nodes, suspicious connection edges, and lateral movement detection.',
    color: '#3B82F6',
  },
  {
    icon: Lock,
    title: 'Device Isolation',
    desc: 'Instantly isolate compromised devices, toggle maintenance mode, and clear violations directly from the dashboard.',
    color: '#FF4C4C',
  },
  {
    icon: Globe,
    title: 'Threat Intelligence',
    desc: 'Integrated threat intelligence feeds provide real-time context on known malicious IPs, domains, and CVEs affecting your devices.',
    color: '#FFB347',
  },
];

const stats = [
  { label: 'Devices Monitored', value: '10K+', icon: Cpu },
  { label: 'Threats Blocked', value: '99.7%', icon: Shield },
  { label: 'Alert Response', value: '<30s', icon: Zap },
  { label: 'SOC Teams', value: '500+', icon: Eye },
];

const resources = [
  {
    tag: 'WHITEPAPER',
    title: 'The State of IoT Security 2026',
    desc: 'Discover why organizations with AI-driven IoT monitoring detect threats 4× faster than peers relying on traditional tools.',
    img: 'https://images.unsplash.com/photo-1758520144667-3041caeff3c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwU09DJTIwYW5hbHlzdCUyMGRhcmslMjBvZmZpY2V8ZW58MXx8fHwxNzczMDgyMjIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    cta: 'Get the report',
    featured: true,
  },
  {
    tag: 'GUIDE',
    title: 'CISO Report 2026',
    desc: 'How security leaders are modernizing IoT defense postures.',
    img: 'https://images.unsplash.com/photo-1648415383716-f9828037d2a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJlYXQlMjBpbnRlbGxpZ2VuY2UlMjBzZWN1cml0eSUyMHJlc2VhcmNoZXIlMjBsYXB0b3B8ZW58MXx8fHwxNzczMDgyMjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    cta: 'Read guide',
  },
  {
    tag: 'RESEARCH',
    title: 'IoT Network Threat Vectors',
    desc: 'The new rules of lateral movement detection in OT/IT environments.',
    img: 'https://images.unsplash.com/photo-1761497039673-83fea602ae8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJb1QlMjBuZXR3b3JrJTIwc2VjdXJpdHklMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MzA4MjIyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    cta: 'Explore research',
  },
  {
    tag: 'REPORT',
    title: 'Data & Risk Management',
    desc: 'Governing IoT device data pipelines in regulated industries.',
    img: 'https://images.unsplash.com/photo-1718630732291-3bc8de36b030?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwbWFuYWdlbWVudCUyMGNsb3VkJTIwaW5mcmFzdHJ1Y3R1cmV8ZW58MXx8fHwxNzczMDgyMjIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    cta: 'Download report',
  },
];

const footerLinks = {
  company: {
    label: 'COMPANY',
    links: [
      { name: 'About IoT Sentinel', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Newsroom', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Security Policy', href: '#' },
    ],
  },
  product: {
    label: 'PRODUCT',
    links: [
      { name: 'Dashboard', href: '/login' },
      { name: 'Device Inventory', href: '/login' },
      { name: 'Incident Review', href: '/login' },
      { name: 'Network Topology', href: '/login' },
      { name: 'Live Alerts', href: '/login' },
    ],
  },
  learn: {
    label: 'LEARN',
    links: [
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'MITRE ATT&CK Integration', href: '#' },
      { name: 'Training & Certification', href: '#' },
      { name: 'Release Notes', href: '#' },
    ],
  },
  resources: {
    label: 'RESOURCES',
    links: [
      { name: 'Whitepapers', href: '#' },
      { name: 'Case Studies', href: '#' },
      { name: 'Webinars', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'View All Resources', href: '#' },
    ],
  },
};

const socialLinks = [
  {
    name: 'GitHub',
    href: '#',
    icon: Github,
    color: '#FFFFFF',
    hoverColor: '#FF6B35',
    desc: 'Open source components, integrations & detection rules.',
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: Linkedin,
    color: '#FFFFFF',
    hoverColor: '#0A66C2',
    desc: 'Follow us for threat intel updates and product news.',
  },
  {
    name: 'Twitter / X',
    href: '#',
    icon: Twitter,
    color: '#FFFFFF',
    hoverColor: '#1D9BF0',
    desc: 'Real-time CVE alerts and security community discussions.',
  },
  {
    name: 'YouTube',
    href: '#',
    icon: Youtube,
    color: '#FFFFFF',
    hoverColor: '#FF0000',
    desc: 'Demo walkthroughs, SOC use cases, and tutorials.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Request Access');

  const openModal = (title: string) => {
    setModalTitle(title);
    setAccessModalOpen(true);
  };

  return (
    <div className="min-h-screen overflow-clip" style={{ background: '#0C0C0C', position: 'relative' }}>
      {/* Request Access Modal */}
      <RequestAccessModal
        isOpen={accessModalOpen}
        onClose={() => setAccessModalOpen(false)}
        title={modalTitle}
      />
      {/* Splunk animated gradient bar at top */}
      <div className="splunk-gradient-bar" />

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,107,53,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.02) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Glow orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-8" style={{ background: 'radial-gradient(circle, #FF6B35, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-8" style={{ background: 'radial-gradient(circle, #E8478C, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="fixed bottom-0 left-0 right-0 h-96 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(139,20,60,0.15), transparent)' }} />

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-8 py-0 h-16 w-full" style={{ background: '#000000', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center h-full">
          <div className="flex items-center mr-10 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="text-xl font-bold tracking-tight" style={{ color: '#FFFFFF' }}>iot<span className="font-normal" style={{ color: '#FFFFFF' }}>sentinel</span></div>
          </div>

          <div className="hidden lg:flex items-center h-full gap-2">
            {/* Platform Dropdown */}
            <div className="group h-full flex items-center">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="relative h-full flex items-center px-4 text-sm font-medium text-[#e2e2e2] transition-colors hover:bg-white/10 hover:text-white">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity" />
                Platform <ChevronDown size={14} className="ml-1.5 opacity-60 transition-transform duration-200 group-hover:-rotate-180" />
              </button>
              
              {/* Mega Menu Content */}
              <div className="absolute left-0 w-full bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t border-slate-200 cursor-default" style={{ top: '100%', zIndex: 100 }}>
                <div className="max-w-7xl mx-auto px-8 py-10 flex gap-12">
                  {/* Left columns */}
                  <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-10">
                    <div>
                      <h4 className="text-sm font-semibold mb-6" style={{ color: '#64748b' }}>Products</h4>
                      <div className="space-y-6">
                        {features.slice(0, 3).map((f) => {
                          const Icon = f.icon;
                          return (
                            <button key={f.title} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full text-left flex items-start gap-4 group/item">
                              <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 bg-slate-50 border border-slate-100 group-hover/item:border-slate-300 transition-colors">
                                <Icon size={18} style={{ color: f.color }} />
                              </div>
                              <div>
                                <div className="text-[15px] font-semibold text-slate-900 group-hover/item:text-black">{f.title}</div>
                                <div className="text-[13px] text-slate-500 mt-0.5 line-clamp-1">{f.desc}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-8">
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[14px] font-semibold hover:underline" style={{ color: '#E8478C' }}>Platform overview</button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-6" style={{ color: '#64748b' }}>Use Cases</h4>
                      <div className="space-y-6">
                        {features.slice(3, 6).map((f) => {
                          const Icon = f.icon;
                          return (
                            <button key={f.title} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full text-left flex items-start gap-4 group/item">
                              <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 bg-slate-50 border border-slate-100 group-hover/item:border-slate-300 transition-colors">
                                <Icon size={18} style={{ color: f.color }} />
                              </div>
                              <div>
                                <div className="text-[15px] font-semibold text-slate-900 group-hover/item:text-black">{f.title}</div>
                                <div className="text-[13px] text-slate-500 mt-0.5 line-clamp-1">{f.desc}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-8">
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[14px] font-semibold hover:underline" style={{ color: '#E8478C' }}>View all use cases</button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right promo card */}
                  <div className="w-[400px] shrink-0">
                    <div className="rounded-2xl p-8 h-full" style={{ background: 'linear-gradient(180deg, #FFF5F7 0%, #FFF 100%)', border: '1px solid #FFE4E6' }}>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">See IoT Sentinel in action</h3>
                      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-semibold flex items-center gap-1 mb-6 hover:underline" style={{ color: '#E8478C' }}>
                        Explore the product tour <ArrowRight size={14} />
                      </button>
                      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 relative overflow-hidden">
                        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                        <div className="relative z-10">
                          <div className="text-sm font-bold text-slate-900 mb-1">Intermediate findings</div>
                          <div className="text-[10px] text-slate-500 mb-4">Intermediate findings count 19<br/>Priority <span className="text-red-500">Critical</span></div>
                          <div className="space-y-2">
                            <div className="bg-red-600 text-white text-[10px] font-medium px-3 py-1 rounded-full w-max ml-12">An unusual volume of network...</div>
                            <div className="bg-red-600 text-white text-[10px] font-medium px-3 py-1 rounded-full w-max ml-16">Malicious PowerShell Proces...</div>
                            <div className="bg-amber-500 text-white text-[10px] font-medium px-3 py-1 rounded-full w-max ml-6 flex items-center gap-1"><User size={10}/> User fyodor@splunk...</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom banner in mega menu */}
                <div className="border-t border-slate-100 bg-slate-50/50">
                  <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={16} style={{ color: '#FF6B35' }} />
                      <span className="text-sm font-semibold text-slate-900">Build digital resilience with <span style={{ color: '#FF6B35' }}>Sentinel AI</span></span>
                    </div>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline">Learn more</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Nav Links */}
            {[
              { name: 'Security' },
              { name: 'Observability' },
              { name: 'Industries' },
              { name: 'Resources' }
            ].map(item => (
              <div key={item.name} className="group h-full flex items-center">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="relative h-full flex items-center px-4 text-sm font-medium text-[#e2e2e2] transition-colors hover:bg-white/10 hover:text-white">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-[#e2e2e2]">
            <div className="group relative h-full flex items-center py-4">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors flex items-center gap-1">Support <ChevronDown size={14} className="opacity-60 transition-transform duration-200 group-hover:-rotate-180" /></button>
              <div className="absolute top-full right-0 w-48 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border rounded-xl overflow-hidden py-2" style={{ zIndex: 100, background: '#1A1A1A', borderColor: '#2A2A3A' }}>
                <a href="https://github.com/Fnc-Jit" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#e2e2e2] hover:bg-white/10 hover:text-white">
                  <Github size={16} /> GitHub
                </a>
                <a href="mailto:jitrajesh5@gmail.com" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#e2e2e2] hover:bg-white/10 hover:text-white">
                  <Mail size={16} /> Email Support
                </a>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">J</div>
            <button className="hover:text-white transition-colors"><Calendar size={18} /></button>
            <button className="hover:text-white transition-colors"><Search size={18} /></button>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all bg-white text-black hover:bg-gray-100"
          >
            Access Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 lg:px-16 pt-24 pb-32 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div 
          className="flex-1 text-left"
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-6" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Security and
            <br />
            observability at
            <br />
            <span className="splunk-gradient-text">
              enterprise scale
            </span>
          </h1>

          <p className="text-lg mb-10 max-w-xl text-[#e2e2e2]">
            Revolutionize digital resilience for the AI era.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button
              onClick={() => openModal('Request a Demo')}
              className="flex items-center justify-center px-8 py-3.5 rounded-full font-bold transition-all bg-white text-black hover:bg-gray-100"
            >
              Request a demo
            </button>
          </div>
        </motion.div>

        {/* Dashboard graphic */}
        <motion.div
          className="flex-1 w-full max-w-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img 
            src={exampleImage} 
            alt="IoT Sentinel Dashboard" 
            className="w-full h-auto rounded-2xl shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 40px rgba(232, 71, 140, 0.15))' }}
          />
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative z-10 px-6 lg:px-16 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="splunk-subheader" style={{ color: '#FF6B35' }}>Platform Metrics</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl border"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <Icon className="mx-auto mb-3" size={28} style={{ color: '#FF6B35' }} />
                <div className="text-3xl font-bold mb-1 splunk-gradient-text">{s.value}</div>
                <div className="text-sm" style={{ color: '#8B8FA3' }}>{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════════ MAGIC DEVICE SCROLL ══════════ */}
      <DeviceScrollSection />

      {/* Features */}
      <section id="features" className="relative z-10 px-6 lg:px-16 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="splunk-subheader block mb-3" style={{ color: '#E8478C' }}>Use Cases & Solutions</span>
          <h2 className="text-3xl font-bold mb-4 splunk-gradient-text inline-block" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>Everything SOC Teams Need</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#8B8FA3' }}>
            From real-time monitoring to automated incident response, IoT Sentinel covers the full security lifecycle.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border hover:border-opacity-50 transition-all group"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110" style={{ background: `${f.color}12`, border: `1px solid ${f.color}25` }}>
                  <Icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: '#FFFFFF' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8B8FA3' }}>{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════════ RESOURCES SECTION ══════════ */}
      <section id="resources" className="relative z-10 px-6 lg:px-16 py-24" style={{ background: 'rgba(10,8,20,0.8)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="splunk-subheader block mb-3" style={{ color: '#FF6B35' }}>Resources</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.1 }}>
              <span style={{ color: '#FF6B35' }}>Trending </span>
              <span style={{ color: '#E8478C' }}>industry research</span>
            </h2>
          </motion.div>

          {/* Featured resource card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-6 rounded-2xl overflow-hidden border flex flex-col lg:flex-row group cursor-pointer hover:border-opacity-60 transition-all"
            style={{ background: '#111827', borderColor: 'rgba(255,107,53,0.15)', minHeight: 280 }}
          >
            <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen size={20} style={{ color: '#FF6B35' }} />
                  <span className="text-xs uppercase tracking-widest" style={{ color: '#8B8FA3' }}>Whitepaper</span>
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#FFFFFF' }}>
                  The State of IoT Security 2026
                </h3>
                <p className="text-sm leading-relaxed mb-6 max-w-md" style={{ color: '#8B8FA3' }}>
                  Discover why organizations with AI-driven IoT monitoring detect threats 4× faster than peers relying on traditional security tools. Includes 500+ SOC survey results.
                </p>
              </div>
              <button
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-white/10 w-fit"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF' }}
              >
                Get the report <ArrowRight size={14} />
              </button>
            </div>
            <div className="lg:w-[420px] h-56 lg:h-auto relative overflow-hidden">
              <img
                src={resources[0].img}
                alt="IoT Security State of the Industry"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #111827 0%, transparent 30%)' }} />
            </div>
          </motion.div>

          {/* 3 smaller cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {resources.slice(1).map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden border group cursor-pointer hover:border-opacity-60 transition-all"
                style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="h-44 relative overflow-hidden">
                  <img src={r.img} alt={r.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111827 10%, transparent 60%)' }} />
                  <span
                    className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded uppercase tracking-wider font-semibold"
                    style={{ background: 'rgba(232,71,140,0.2)', color: '#E8478C', border: '1px solid rgba(232,71,140,0.3)' }}
                  >
                    {r.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="text-sm font-semibold mb-1.5" style={{ color: '#FFFFFF' }}>{r.title}</h4>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: '#8B8FA3' }}>{r.desc}</p>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80" style={{ color: '#FF6B35' }}>
                    {r.cta} <ArrowRight size={11} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
              style={{ color: '#8B8FA3' }}
            >
              View all resources <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ GET CONNECTED CTA ══════════ */}
      <section id="connect" className="relative z-10 overflow-hidden" style={{ minHeight: 420 }}>
        {/* Dramatic gradient background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #0C0C0C 0%, #1a0a1e 30%, #0d1a2e 60%, #0C0C0C 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(232,71,140,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(59,130,246,0.12) 0%, transparent 50%)',
        }} />
        {/* Animated accent lines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 500 420" className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="xMidYMid slice">
            <path d="M 500 80 Q 300 200 450 340" stroke="url(#lineGrad1)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 500 140 Q 280 260 420 400" stroke="url(#lineGrad2)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 480 20 Q 350 180 480 360" stroke="url(#lineGrad1)" strokeWidth="1" fill="none" strokeLinecap="round" />
            <defs>
              <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8478C" />
                <stop offset="100%" stopColor="#FF6B35" />
              </linearGradient>
              <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#FFB347" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16 py-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <span className="splunk-subheader block mb-5" style={{ color: '#FF6B35' }}>Get Connected</span>
            <h2 className="mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.1, color: '#FFFFFF' }}>
              <span style={{ color: '#FF6B35' }}>Start</span> your journey
              <br />with IoT Sentinel
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#8B8FA3' }}>
              From defending against cyber threats to scaling your security operations, IoT Sentinel is with you every step of the way. Have questions? Reach out to our team.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openModal('Access Dashboard')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:scale-105"
                style={{ background: '#FFFFFF', color: '#0C0C0C' }}
              >
                <Shield size={16} />
                Access Dashboard
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border transition-all hover:bg-white/5"
                style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#FFFFFF' }}
              >
                <Eye size={16} />
                Explore product tours
              </button>
            </div>
          </motion.div>

          {/* Social connect cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-sm font-semibold mb-6 uppercase tracking-widest" style={{ color: '#8B8FA3' }}>Connect With Us</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {socialLinks.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.button
                    key={s.name}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    viewport={{ once: true }}
                    className="flex flex-col text-left gap-3 p-5 rounded-2xl border transition-all hover:scale-[1.02] group"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <Icon size={20} style={{ color: '#FFFFFF' }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1" style={{ color: '#FFFFFF' }}>{s.name}</div>
                      <div className="text-xs leading-relaxed" style={{ color: '#8B8FA3' }}>{s.desc}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs mt-auto" style={{ color: '#FF6B35' }}>
                      Follow <ArrowRight size={10} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ SPLUNK-STYLE FULL FOOTER (WHITE THEME) ══════════ */}
      <footer className="relative z-10 border-t" style={{ background: '#FFFFFF', borderColor: 'rgba(0,0,0,0.1)' }}>
        {/* Top gradient accent */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #FF6B35, #E8478C, transparent)' }} />

        {/* Main footer columns */}
        <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-16 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)' }}>
                  <Shield size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: '#000000' }}>IoT Sentinel</div>
                  <div className="text-[10px]" style={{ color: '#475569' }}>a Cisco-inspired platform</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-5" style={{ color: '#475569' }}>
                Enterprise-grade IoT security monitoring, threat detection, and automated incident response for modern SOC teams.
              </p>
              {/* Mini social icons */}
              <div className="flex items-center gap-3">
                {[
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Youtube, href: '#', label: 'YouTube' },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      aria-label={s.label}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(0,0,0,0.04)' }}
                    >
                      <Icon size={14} style={{ color: '#475569' }} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Link columns */}
            {Object.values(footerLinks).map(col => (
              <div key={col.label}>
                <h4 className="text-[10px] font-semibold mb-4 uppercase tracking-widest" style={{ color: '#FF6B35' }}>
                  {col.label}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link.name}>
                      <button
                         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                         className="text-xs transition-colors hover:text-black"
                         style={{ color: '#475569' }}
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Connect with us highlight bar */}
        <div className="border-t border-b mx-6 lg:mx-16 py-8" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-1" style={{ color: '#000000' }}>Connect with our community</h4>
              <p className="text-xs" style={{ color: '#475569' }}>Follow us on GitHub and LinkedIn for the latest security research, open-source tools, and platform updates.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-black/5 hover:border-black/20"
                style={{ borderColor: 'rgba(0,0,0,0.2)', color: '#000000' }}
              >
                <Github size={15} />
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={{ background: '#0A66C2', color: '#FFFFFF' }}
              >
                <Linkedin size={15} />
                LinkedIn
              </a>
              <a
                href="mailto:team@iotsentinel.io"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-black/5"
                style={{ borderColor: 'rgba(255,107,53,0.3)', color: '#FF6B35' }}
              >
                <Mail size={15} />
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: '#64748B' }}>
            &copy; 2026 IoT Sentinel Security Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Legal', 'Privacy', 'Sitemap', 'Security Policy'].map(item => (
              <button key={item} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs transition-colors hover:text-black" style={{ color: '#64748B' }}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}