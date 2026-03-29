import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Shield, ArrowRight, Search, X, ChevronRight, Github, Linkedin, Mail
} from 'lucide-react';
import { RequestAccessModal } from '../components/RequestAccessModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Request Access');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const agents = [
    {
      id: 0,
      name: 'GE Agent',
      description: 'Distributed agent technology for endpoint monitoring and threat detection.',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F5cfdc268ef594ccaa100a8e91f270b69%2Fe4bf4e94c7634d928de61550a93b5987?format=webp&width=800&height=1200',
    },
    {
      id: 1,
      name: 'GE Desktop',
      description: 'Desktop-focused monitoring with comprehensive visibility into user activities.',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F5cfdc268ef594ccaa100a8e91f270b69%2F857332e20eb5400184a3a5ae78e06db6?format=webp&width=800&height=1200',
    },
    {
      id: 2,
      name: 'GE Sensor',
      description: 'Network sensor technology for real-time traffic analysis and threat intelligence.',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F5cfdc268ef594ccaa100a8e91f270b69%2F57a6f664c7db44688b4f35b3c8b9117f?format=webp&width=800&height=1200',
    },
  ];

  const siemImages = [
    'https://cdn.builder.io/api/v1/image/assets%2F5cfdc268ef594ccaa100a8e91f270b69%2F36b8e939f59d494a81be02ce225128b9?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2F5cfdc268ef594ccaa100a8e91f270b69%2F59abf0c7848e46b2b3d0ac061d4d0708?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2F5cfdc268ef594ccaa100a8e91f270b69%2F3c3529c030814bf1a59780fa2ea48440?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2F5cfdc268ef594ccaa100a8e91f270b69%2Fee39d45836d542dcbc2ada02e85e95ea?format=webp&width=800&height=1200',
    'https://cdn.builder.io/api/v1/image/assets%2F5cfdc268ef594ccaa100a8e91f270b69%2Fa89b940bdf0d4821a0c3b868430f52e7?format=webp&width=800&height=1200',
  ];

  const articles = [
    {
      title: 'Advanced SIEM Architecture',
      category: 'RESEARCH',
      excerpt: 'Understanding modern log correlation and event normalization at scale',
      body: 'Effective SIEM design starts with clean data ingestion. This paper covers normalization pipelines, custom parsers, and log source onboarding strategies that scale from 100 to 100,000 EPS without degrading query performance.',
      readTime: '5 min read',
      published: 'Published Mar 2025',
    },
    {
      title: 'Threat Detection Strategies',
      category: 'GUIDE',
      excerpt: 'Implementing detection rules and threat hunting playbooks',
      body: 'Modern SOCs face thousands of alerts daily. Sentinel\'s detection engine applies layered correlation rules across log sources — reducing false positives by up to 80% while surfacing only high-confidence threats. Built on MITRE ATT&CK, every rule maps directly to adversary behavior.',
      readTime: '5 min read',
      published: 'Published Mar 2025',
    },
    {
      title: 'Incident Response Best Practices',
      category: 'WHITEPAPER',
      excerpt: 'How SOC teams orchestrate rapid containment and forensic triage',
      body: 'Speed is everything in incident response. This guide covers how leading SOC teams use Sentinel\'s automated playbooks to contain threats in minutes — not hours. Covers isolation, forensic capture, and stakeholder notification workflows end-to-end.',
      readTime: '8 min read',
      published: 'Published Mar 2025',
    },
    {
      title: 'MITRE ATT&CK Mapping',
      category: 'RESEARCH',
      excerpt: 'Correlating adversary TTPs with real-time kill chain telemetry',
      body: 'Sentinel maps every detected event to the ATT&CK framework in real time. Analysts get immediate TTP context — no manual lookup required. This research paper covers how kill chain correlation improves analyst confidence and reduces investigation time by 60%.',
      readTime: '6 min read',
      published: 'Published Mar 2025',
    },
    {
      title: 'Zero Trust Segmentation',
      category: 'GUIDE',
      excerpt: 'Enforcing least-privilege access across hybrid infrastructure',
      body: 'Zero trust isn\'t a product — it\'s an architecture decision. This guide walks through network micro-segmentation strategies, device trust scoring, and how Sentinel\'s topology module enforces policy boundaries across hybrid cloud environments.',
      readTime: '7 min read',
      published: 'Published Mar 2025',
    },
    {
      title: 'UEBA Behavioral Baselines',
      category: 'WHITEPAPER',
      excerpt: 'Detecting insider threats using per-device ML drift models',
      body: 'Machine learning drift detection catches what signature rules miss. This whitepaper explains how Sentinel builds per-device behavioral baselines and flags anomalies before they become breaches — with real case studies from OT and enterprise environments.',
      readTime: '9 min read',
      published: 'Published Mar 2025',
    },
  ];

  const openModal = (title: string) => {
    setModalTitle(title);
    setAccessModalOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <div className="min-h-screen" style={{ background: '#FFFFFF' }}>
      <RequestAccessModal
        isOpen={accessModalOpen}
        onClose={() => setAccessModalOpen(false)}
        title={modalTitle}
      />

      {/* ═══════════ NAVIGATION BAR - PALANTIR FLOATING HUD ═══════════ */}
      <nav
        className="fixed z-[999] h-16 flex items-center justify-center"
        style={{
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 48px)',
          maxWidth: '1200px',
          borderRadius: '12px',
          background: 'rgba(15, 15, 20, 0.45)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div className="w-full px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo - Monochrome */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 transition-all duration-200 group"
            style={{ color: 'rgba(255,255,255,0.70)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.70)';
            }}
          >
            <div className="w-6 h-6 flex items-center justify-center border rounded-md" style={{ borderColor: 'rgba(255,255,255,0.70)', color: 'rgba(255,255,255,0.70)' }}>
              <Shield size={14} strokeWidth={1.5} />
            </div>
            <span className="text-sm font-semibold hidden sm:inline">Sentinel</span>
          </button>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {[
              { label: 'Reports', id: 'reports' },
              { label: 'Demo', action: () => openModal('Request a Demo') },
              { label: 'Agent Architecture', id: 'architecture' },
              { label: 'Access Dashboard', nav: '/login' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if ('id' in item) {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  } else if ('action' in item) {
                    item.action();
                  } else if ('nav' in item) {
                    navigate(item.nav);
                  }
                }}
                className="text-sm font-medium transition-all duration-200"
                style={{ color: 'rgba(255,255,255,0.70)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.70)';
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right: Search Icon & CTA */}
          <div className="flex items-center gap-4 ml-auto">
            {/* God's Eye - Icon Only, Minimal */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center justify-center w-10 h-10 border rounded transition-all duration-200 group"
              style={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.70)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.70)';
              }}
              title="God's Eye Search (⌘K)"
            >
              <Search size={16} strokeWidth={1.5} />
            </button>

            {/* Request Demo CTA - Sharp Rectangle */}
            <button
              onClick={() => openModal('Request a Demo')}
              className="hidden sm:flex items-center px-6 py-2.5 font-medium text-sm transition-all duration-200"
              style={{
                background: '#FFFFFF',
                color: '#0F0F14',
                border: '1px solid rgba(255,255,255,0.9)',
                borderRadius: '0px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Request Demo
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="pt-40 pb-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#000000' }}>
              Intelligent Threat Detection
              <br />
              for Modern Infrastructure
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#666666' }}>
              Sentinel delivers comprehensive security monitoring and incident response for enterprises at any scale.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => openModal('Request a Demo')}
                className="px-8 py-3 rounded-lg font-medium transition-all"
                style={{ background: '#000000', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1A1A1A'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#000000'}
              >
                Request a Demo
              </button>
              <button
                onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 rounded-lg font-medium border transition-all"
                style={{ borderColor: '#000000', color: '#000000' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F5F5F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Agent Architecture
              </button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.img
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src={agents[0].image}
            alt="Sentinel Platform"
            className="w-full rounded-xl shadow-lg"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* ═══════════ AGENT ARCHITECTURE SECTION (PALANTIR STYLE) ═══════════ */}
      <section id="architecture" className="py-20">
        {agents.map((agent, idx) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="min-h-screen flex items-center px-6 lg:px-8 border-b"
            style={{ background: idx % 2 === 0 ? '#FFFFFF' : '#F9F9F9', borderColor: '#E5E7EB' }}
          >
            <div className="max-w-7xl mx-auto w-full">
              <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                {/* Text Content */}
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#000000' }}>
                    {agent.name}
                  </h2>
                  <p className="text-lg mb-8 leading-relaxed" style={{ color: '#666666' }}>
                    {agent.description}
                  </p>
                  <button
                    onClick={() => openModal(`Learn about ${agent.name}`)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
                    style={{ background: '#000000', color: '#FFFFFF' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#1A1A1A'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#000000'}
                  >
                    Learn More <ArrowRight size={16} />
                  </button>
                </motion.div>

                {/* Image */}
                <motion.div
                  className="flex-1 w-full"
                  initial={{ opacity: 0, x: idx % 2 === 0 ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full rounded-xl shadow-lg transition-transform duration-300 cursor-pointer"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ═══════════ SIEM SECTION - PALANTIR APOLLO STYLE ═══════════ */}
      <section id="reports" className="py-0 px-0" style={{ background: '#FFFFFF', fontFamily: "'DM Sans', sans-serif" }}>
        {[
          { counter: '/0.1', title: 'SOC', desc: 'Unified security operations center — triage, investigate, and respond from a single pane of glass.' },
          { counter: '/0.2', title: 'Kill Chain', desc: 'Visualize multi-stage attacks mapped to MITRE ATT&CK in real time.' },
          { counter: '/0.3', title: 'Topology', desc: 'Live network graph showing every device, connection, and anomaly across your infrastructure.' },
          { counter: '/0.4', title: 'Compliance', desc: 'Continuous NIST CSF / ISO 27443 compliance scoring with auto-generated audit reports.' },
          { counter: '/0.5', title: 'Threat Intel', desc: 'Fuse global threat feeds with internal telemetry to surface contextual IOCs instantly.' },
          { counter: '/0.6', title: 'Devices', desc: 'Full device inventory with behavioral baselines, risk scores, and real-time drift detection.' },
          { counter: '/0.7', title: 'Overview', desc: 'Command-level situational awareness — every alert, asset, and action in one operational view.' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden border-b flex items-center"
            style={{
              background: '#FFFFFF',
              height: '260px',
              borderColor: 'rgba(0,0,0,0.07)',
              cursor: 'default',
              padding: '0 60px',
              display: 'flex',
            }}
            onMouseEnter={(e) => {
              const row = e.currentTarget as HTMLElement;
              // Update symbol opacity
              const symbol = row.querySelector('[data-symbol-icon]') as HTMLElement;
              if (symbol) symbol.style.opacity = '0.3';
              // Update title opacity
              const title = row.querySelector('[data-title-word]') as HTMLElement;
              if (title) title.style.opacity = '1';
              // Update video overlay
              const videoOverlay = row.querySelector('[data-video-overlay]') as HTMLElement;
              if (videoOverlay) videoOverlay.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const row = e.currentTarget as HTMLElement;
              // Reset symbol opacity
              const symbol = row.querySelector('[data-symbol-icon]') as HTMLElement;
              if (symbol) symbol.style.opacity = '0.12';
              // Reset title opacity
              const title = row.querySelector('[data-title-word]') as HTMLElement;
              if (title) title.style.opacity = '0.08';
              // Reset video overlay
              const videoOverlay = row.querySelector('[data-video-overlay]') as HTMLElement;
              if (videoOverlay) videoOverlay.style.opacity = '0';
            }}
          >
            {/* Column 1 - 20% */}
            <div
              style={{
                width: '20%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingRight: '40px',
              }}
            >
              {/* Counter Label */}
              <div
                className="font-mono tracking-wider mb-4"
                style={{
                  fontSize: '13px',
                  color: 'rgba(0,0,0,0.35)',
                }}
              >
                {item.counter}
              </div>

              {/* Description */}
              <p
                className="leading-relaxed mb-6"
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'rgba(0,0,0,0.55)',
                  lineHeight: '1.5',
                }}
              >
                {item.desc}
              </p>

              {/* Learn More Link */}
              <button
                onClick={() => openModal(item.title)}
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300"
                style={{ color: '#d4500a' }}
              >
                Learn more
                <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Column 2 - 15% Symbol */}
            <div
              style={{
                width: '15%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: '40px',
              }}
            >
              <div
                data-symbol-icon="true"
                className="transition-all duration-400"
                style={{
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.12,
                }}
              >
                {/* Sentinel Shield Icon - White Stroke */}
                <svg
                  className="transition-all duration-400"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s-8-4-8-10V6l8-3 8 3v6c0 6-8 10-8 10z" />
                </svg>
              </div>
            </div>

            {/* Column 3 - 65% Title + Video */}
            <div
              style={{
                width: '65%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {/* Video Box - Fixed 380x220px */}
              <div
                style={{
                  width: '380px',
                  height: '220px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                  position: 'relative',
                  marginRight: '40px',
                }}
              >
                {/* Static Thumbnail */}
                <img
                  src={siemImages[idx % siemImages.length]}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(20%)',
                  }}
                />

                {/* Video Overlay - Fades In On Hover */}
                <div
                  data-video-overlay="true"
                  className="absolute inset-0 transition-all duration-350 opacity-0 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15,15,20,0.8) 0%, rgba(15,15,20,0.5) 100%)',
                  }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 backdrop-blur">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                    <p className="text-white text-xs font-medium">Feature Video</p>
                  </div>
                </div>
              </div>

              {/* Title Word - Always Visible */}
              <div
                data-title-word="true"
                style={{
                  fontSize: 'clamp(4rem, 9vw, 8rem)',
                  fontWeight: 700,
                  color: '#0d0d14',
                  opacity: 0.08,
                  transition: 'opacity 0.4s ease-out',
                  textAlign: 'right',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.title}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Section intro text */}
        <div
          style={{
            padding: '80px 60px',
            background: '#FFFFFF',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            marginTop: '-1px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#000000' }}>
              Security Information & Event Management
            </h2>
            <p className="text-lg" style={{ color: '#666666' }}>
              Sentinel provides comprehensive SIEM capabilities designed for modern security operations centers. Monitor, detect, investigate, and respond to threats across your entire infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURED INSIGHTS SECTION - MARQUEE LAYOUT ═══════════ */}
      <section className="insights-section py-20 px-6 lg:px-8" style={{ background: '#F9F9F9' }}>
        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .insights-marquee-container {
            overflow: hidden;
            width: 100%;
          }

          .insights-marquee-track {
            display: flex;
            gap: 0;
            animation: scroll 40s linear infinite;
          }


          .insight-card {
            flex-shrink: 0;
            width: 320px;
            min-height: 420px;
            padding: 40px 32px;
            background: #f0f0f0;
            border-radius: 16px 16px 0 0;
            border: none;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
          }

          .insight-card:hover {
            background: #f0f0f0;
            transform: translateY(-12px);
          }

          .insight-card:hover .insight-card-tag,
          .insight-card:hover .insight-card-title,
          .insight-card:hover .insight-card-description {
            transform: translateY(-8px);
          }

          .insight-card:hover .insight-card-body {
            opacity: 1;
            max-height: 120px;
            margin-top: 16px;
          }

          .insight-card-tag {
            font-size: 11px;
            letter-spacing: 0.12em;
            color: rgba(0, 0, 0, 0.4);
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 12px;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .insight-card-title {
            font-size: 17px;
            font-weight: 700;
            color: #1a1a1a;
            line-height: 1.5;
            margin-bottom: 12px;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .insight-card-description {
            font-size: 13px;
            color: rgba(0, 0, 0, 0.5);
            line-height: 1.6;
            margin-bottom: 16px;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .insight-card-body {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.55);
            line-height: 1.75;
            margin-bottom: 24px;
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            margin: 0;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            flex-grow: 1;
          }

          .insight-card-metadata {
            font-size: 11px;
            color: rgba(0, 0, 0, 0.3);
            font-family: 'Courier New', monospace;
            letter-spacing: 0.05em;
            margin-bottom: 16px;
            margin-top: auto;
          }

          .insight-card-link {
            font-size: 12px;
            font-weight: 600;
            color: #c94a1a;
            text-decoration: none;
            transition: all 0.2s ease;
            align-self: flex-start;
          }

          .insight-card-link:hover {
            transform: translateX(4px);
          }
        `}</style>

        <div className="max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 400, color: '#0d0d14', marginBottom: '12px' }}>
              Featured Insights
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.45)' }}>
              Latest research, guides, and best practices from the Sentinel team.
            </p>
          </motion.div>
        </div>

        <div className="insights-marquee-container">
          <div className="insights-marquee-track">
            {/* First set of articles */}
            {articles.map((article, idx) => (
              <button
                key={`article-${idx}`}
                onClick={() => openModal(article.title)}
                className="insight-card"
              >
                <div>
                  <div className="insight-card-tag">
                    {article.category}
                  </div>
                  <h3 className="insight-card-title">
                    {article.title}
                  </h3>
                  <p className="insight-card-description">
                    {article.excerpt}
                  </p>
                  <p className="insight-card-body">
                    {article.body}
                  </p>
                </div>
                <div>
                  <div className="insight-card-metadata">
                    {article.readTime}  ·  {article.published}
                  </div>
                  <div className="insight-card-link">
                    Read more →
                  </div>
                </div>
              </button>
            ))}

            {/* Duplicate set for seamless loop */}
            {articles.map((article, idx) => (
              <button
                key={`article-dup-${idx}`}
                onClick={() => openModal(article.title)}
                className="insight-card"
              >
                <div>
                  <div className="insight-card-tag">
                    {article.category}
                  </div>
                  <h3 className="insight-card-title">
                    {article.title}
                  </h3>
                  <p className="insight-card-description">
                    {article.excerpt}
                  </p>
                  <p className="insight-card-body">
                    {article.body}
                  </p>
                </div>
                <div>
                  <div className="insight-card-metadata">
                    {article.readTime}  ·  {article.published}
                  </div>
                  <div className="insight-card-link">
                    Read more →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section className="py-20 px-6 lg:px-8" style={{ background: '#000000' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#FFFFFF' }}>
              Ready to transform your security?
            </h2>
            <p className="text-lg mb-8" style={{ color: '#CCCCCC' }}>
              Join leading enterprises using Sentinel for comprehensive threat detection and incident response.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => openModal('Request a Demo')}
                className="px-8 py-3 rounded-lg font-medium transition-all"
                style={{ background: '#FFFFFF', color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F0F0F0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
              >
                Request a Demo
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 rounded-lg font-medium border transition-all"
                style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Access Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ GOD'S EYE SEARCH MODAL ═══════════ */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl rounded-2xl border overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              borderColor: 'rgba(0,0,0,0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)' }}>
                <Search size={16} className="text-white" />
              </div>
              <input
                autoFocus
                type="text"
                placeholder="Search God's Eye intelligence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-base"
                style={{ color: '#000000' }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 hover:bg-black/5 rounded transition-colors"
                style={{ color: '#999999' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            {searchQuery ? (
              <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
                <div className="text-xs font-semibold mb-4 uppercase tracking-widest" style={{ color: '#999999' }}>
                  Results for "{searchQuery}"
                </div>
                {[
                  { title: 'Threat Intelligence Database', desc: 'Real-time threat feeds and indicators' },
                  { title: 'Device Inventory', desc: 'Monitor all endpoints across infrastructure' },
                  { title: 'Incident Investigations', desc: 'Deep-dive into security events' },
                  { title: 'Network Topology', desc: 'Visualize device connections and risks' },
                ].filter(item =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.desc.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(item => (
                  <button
                    key={item.title}
                    className="w-full text-left p-3 rounded-lg transition-colors hover:bg-black/5"
                    onClick={() => setSearchOpen(false)}
                  >
                    <div className="text-sm font-medium" style={{ color: '#000000' }}>
                      {item.title}
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#666666' }}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8">
                <div className="text-xs font-semibold mb-4 uppercase tracking-widest" style={{ color: '#999999' }}>
                  Quick Actions
                </div>
                <div className="space-y-3">
                  {[
                    { icon: '🔍', title: 'Threat Intelligence', desc: 'Explore global threat data' },
                    { icon: '💻', title: 'Device Monitoring', desc: 'Real-time endpoint status' },
                    { icon: '⚠️', title: 'Incidents', desc: 'Active security investigations' },
                    { icon: '🌐', title: 'Network Analysis', desc: 'Topology and risk assessment' },
                  ].map(action => (
                    <button
                      key={action.title}
                      className="w-full text-left p-3 rounded-lg transition-colors hover:bg-black/5"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{action.icon}</span>
                        <div>
                          <div className="text-sm font-medium" style={{ color: '#000000' }}>
                            {action.title}
                          </div>
                          <div className="text-xs" style={{ color: '#666666' }}>
                            {action.desc}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t px-6 lg:px-8 py-16" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)' }}>
                  <Shield size={16} className="text-white" />
                </div>
                <span className="font-bold" style={{ color: '#000000' }}>Sentinel</span>
              </div>
              <p className="text-sm" style={{ color: '#666666' }}>
                Enterprise security monitoring and threat detection platform.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-sm mb-4" style={{ color: '#000000' }}>Product</h4>
              <ul className="space-y-2">
                {['Reports', 'Demo', 'Architecture', 'Dashboard'].map(link => (
                  <li key={link}>
                    <button className="text-sm transition-colors hover:text-black" style={{ color: '#666666' }}>
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-sm mb-4" style={{ color: '#000000' }}>Company</h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map(link => (
                  <li key={link}>
                    <button className="text-sm transition-colors hover:text-black" style={{ color: '#666666' }}>
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-sm mb-4" style={{ color: '#000000' }}>Legal</h4>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Security', 'Compliance'].map(link => (
                  <li key={link}>
                    <button className="text-sm transition-colors hover:text-black" style={{ color: '#666666' }}>
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social & Bottom */}
          <div className="border-t pt-8" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-sm" style={{ color: '#999999' }}>
                &copy; 2026 Sentinel Security. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://github.com/Fnc-Jit" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg transition-colors hover:bg-gray-100" style={{ color: '#666666' }}>
                  <Github size={18} />
                </a>
                <a href="https://www.linkedin.com/in/jitraj-esh/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg transition-colors hover:bg-gray-100" style={{ color: '#666666' }}>
                  <Linkedin size={18} />
                </a>
                <a href="mailto:team@sentinel.io" className="p-2 rounded-lg transition-colors hover:bg-gray-100" style={{ color: '#666666' }}>
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
