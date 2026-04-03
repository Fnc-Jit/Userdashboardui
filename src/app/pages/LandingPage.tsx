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
  const [scrollPassed, setScrollPassed] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

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

  const showcaseSlides = [
    {
      id: 'soc',
      label: 'SOC',
      title: 'The Unified Command Center for Security Operations',
      tag: 'SENTINEL / SOC',
      metadata: [
        { label: 'MODULES', value: '14' },
        { label: 'ALERTS/DAY', value: '50K+' },
        { label: 'RESPONSE TIME', value: '<2min' },
      ],
      image: siemImages[0],
    },
    {
      id: 'killchain',
      label: 'Kill Chain',
      title: 'Multi-Stage Attack Visualization on MITRE ATT&CK',
      tag: 'SENTINEL / KILL CHAIN',
      metadata: [
        { label: 'STAGES', value: '7' },
        { label: 'CHAINS ACTIVE', value: '3' },
        { label: 'LAST DETECTED', value: '4min ago' },
      ],
      image: siemImages[1],
    },
    {
      id: 'topology',
      label: 'Topology',
      title: 'Live Network Graph Across Your Entire Infrastructure',
      tag: 'SENTINEL / TOPOLOGY',
      metadata: [
        { label: 'DEVICES', value: '2,400' },
        { label: 'CONNECTIONS', value: '18K' },
        { label: 'ANOMALIES', value: '12' },
      ],
      image: siemImages[2],
    },
    {
      id: 'compliance',
      label: 'Compliance',
      title: 'Continuous NIST CSF Scoring with Auto Audit Reports',
      tag: 'SENTINEL / COMPLIANCE',
      metadata: [
        { label: 'FRAMEWORKS', value: '4' },
        { label: 'SCORE', value: '87%' },
        { label: 'LAST REPORT', value: 'Today' },
      ],
      image: siemImages[3],
    },
    {
      id: 'threatintel',
      label: 'Threat Intel',
      title: 'Global Threat Feeds Fused with Internal Telemetry',
      tag: 'SENTINEL / THREAT INTEL',
      metadata: [
        { label: 'IOCs TRACKED', value: '1.2M' },
        { label: 'FEEDS', value: '24' },
        { label: 'HIGH PRIORITY', value: '7' },
      ],
      image: siemImages[4],
    },
    {
      id: 'devices',
      label: 'Devices',
      title: 'Full Inventory with Behavioral Baselines and Drift Detection',
      tag: 'SENTINEL / DEVICES',
      metadata: [
        { label: 'DEVICES', value: '2,400' },
        { label: 'AT RISK', value: '18' },
        { label: 'DRIFT ALERTS', value: '5' },
      ],
      image: siemImages[0],
    },
    {
      id: 'overview',
      label: 'Overview',
      title: 'Command-Level Situational Awareness Across All Operations',
      tag: 'SENTINEL / OVERVIEW',
      metadata: [
        { label: 'ACTIVE INCIDENTS', value: '3' },
        { label: 'ANALYSTS ONLINE', value: '12' },
        { label: 'UPTIME', value: '99.98%' },
      ],
      image: siemImages[1],
    },
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

  useEffect(() => {
    const handleScroll = () => {
      setScrollPassed(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      {/* ═══════════ HERO SECTION - PALANTIR VIDEO HERO ═══════════ */}
      <section className="hero-section" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', left: 'calc(-50vw + 50%)', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src="https://videos.pexels.com/video-files/3573352/3573352-sd_640_360_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
          }}
        />

        {/* Centered Hero Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
            width: '100%',
            boxSizing: 'border-box',
            padding: '0 20px',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              fontWeight: 300,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              fontFamily: "'DM Sans', sans-serif",
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            God's Eye
          </h1>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 10,
            opacity: scrollPassed ? 0 : 1,
            transition: 'opacity 0.3s ease-out',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Scroll to Explore
          </div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ STATEMENT PARAGRAPH SECTION ═══════════ */}
      <section style={{ background: '#FFFFFF', padding: '100px 15%' }}>
        <p
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 400,
            color: '#1a1a1a',
            textAlign: 'center',
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          Sentinel detects, correlates, and responds to threats in real-time — purpose-built for{' '}
          <span style={{ color: 'rgba(0,0,0,0.28)' }}>SOC teams</span> defending critical infrastructure,
          enterprises, and national networks.
        </p>
      </section>

      {/* ═══════════ FEATURED SHOWCASE - WARP SPEED STYLE ═══════════ */}
      <section style={{ background: '#F5F5F5', paddingBottom: '100px' }}>
        {/* Tab Strip */}
        <div
          style={{
            padding: '20px 40px',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            alignItems: 'center',
          }}
        >
          {showcaseSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => {
                setActiveSlide(idx);
                setTimerKey(prev => prev + 1);
              }}
              style={{
                fontSize: '13px',
                padding: '8px 16px',
                border: `1px solid ${activeSlide === idx ? '#1a1a1a' : 'rgba(0,0,0,0.15)'}`,
                borderRadius: '2px',
                background: activeSlide === idx ? '#1a1a1a' : 'transparent',
                color: activeSlide === idx ? '#ffffff' : 'rgba(0,0,0,0.5)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (activeSlide !== idx) {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSlide !== idx) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {slide.label}
            </button>
          ))}

          {/* SEE ALL Button */}
          <button
            onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              fontSize: '13px',
              padding: '8px 16px',
              border: '1px solid rgba(0,0,0,0.15)',
              borderRadius: '2px',
              background: 'transparent',
              color: 'rgba(0,0,0,0.5)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              marginLeft: 'auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            SEE ALL
          </button>
        </div>

        {/* Slide Panel */}
        <div
          style={{
            background: '#1e1e1e',
            minHeight: '520px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {showcaseSlides.map((slide, idx) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeSlide === idx ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                inset: 0,
                display: activeSlide === idx ? 'flex' : 'none',
                pointerEvents: activeSlide === idx ? 'auto' : 'none',
              }}
            >
              {/* Left Content (40%) */}
              <div
                style={{
                  flex: '0 0 40%',
                  padding: '60px 48px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: '#ffffff',
                }}
              >
                {/* Tag */}
                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: '24px',
                  }}
                >
                  {slide.tag}
                </div>

                {/* Title with Arrow */}
                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                    fontWeight: 400,
                    lineHeight: 1.3,
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  {slide.title}
                  <span style={{ fontSize: '1.4em', flexShrink: 0 }}>↗</span>
                </h2>

                {/* Metadata Footer (3 columns) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '48px',
                  }}
                >
                  {slide.metadata.map((meta, metaIdx) => (
                    <div key={metaIdx}>
                      <div
                        style={{
                          fontSize: '9px',
                          color: 'rgba(255,255,255,0.4)',
                          fontFamily: 'monospace',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          marginBottom: '8px',
                        }}
                      >
                        {meta.label}
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#ffffff',
                        }}
                      >
                        {meta.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content (60%) - Image */}
              <div
                style={{
                  flex: '0 0 60%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.8)',
                  }}
                />
              </div>
            </motion.div>
          ))}

          {/* Timer Bar */}
          <motion.div
            key={timerKey}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
            onAnimationComplete={() => {
              setActiveSlide((prev) => (prev + 1) % showcaseSlides.length);
              setTimerKey(prevKey => prevKey + 1);
            }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              background: '#ffffff',
              zIndex: 20,
            }}
          />

          {/* Navigation Arrows */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              right: '48px',
              display: 'flex',
              gap: '12px',
              zIndex: 20,
            }}
          >
            {/* Left Arrow */}
            <button
              onClick={() => {
                setActiveSlide((prev) => (prev - 1 + showcaseSlides.length) % showcaseSlides.length);
                setTimerKey(prev => prev + 1);
              }}
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent',
                color: '#ffffff',
                fontSize: '18px',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              ←
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => {
                setActiveSlide((prev) => (prev + 1) % showcaseSlides.length);
                setTimerKey(prev => prev + 1);
              }}
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent',
                color: '#ffffff',
                fontSize: '18px',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════ AGENT ARCHITECTURE SECTION (PALANTIR STYLE) ═══════════ */}
      <section id="architecture" className="py-20">
        {/* Our Software Heading */}
        <div className="px-6 lg:px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold" style={{ color: '#000000' }}>
              Our Software
            </h2>
          </div>
        </div>

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

      {/* ═══════════ GOD'S EYE PLATFORM MODULES SECTION ═══════════ */}
      <section id="platform-modules" className="py-0 px-0" style={{ background: '#ffffff', fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          .module-row {
            animation: fadeIn 0.6s ease-in;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @media (min-width: 769px) {
            .module-row {
              grid-template-columns: 160px 1fr auto !important;
            }
          }

          @media (max-width: 768px) {
            .module-row {
              grid-template-columns: 1fr !important;
              padding: 24px !important;
              min-height: auto !important;
              gap: 16px !important;
            }

            .module-row [data-wordmark] {
              display: none !important;
            }

            .module-row [data-mockup] {
              display: none !important;
            }

            .platform-header {
              padding: 40px 24px !important;
            }
          }

          @media (max-width: 480px) {
            .platform-header {
              padding: 32px 16px !important;
            }

            .platform-header h1 {
              font-size: 24px !important;
            }

            .module-row {
              padding: 16px !important;
            }
          }
        `}</style>
        {/* Section Header */}
        <div className="platform-header" style={{ padding: '80px 60px', borderBottom: '1px solid #e5e5e5' }}>
          <div className="font-mono tracking-widest mb-4" style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.15em' }}>
            GOD'S EYE — PLATFORM MODULES
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-2" style={{ color: '#111111', fontWeight: 400, fontFamily: "'DM Sans', sans-serif" }}>
            Our Software
          </h1>
        </div>

        {/* Platform Modules Grid */}
        {[
          {
            version: '/0.1',
            title: 'SOC',
            desc: 'Unified security operations center — triage, investigate, and respond from a single pane of glass.',
            mockupTabs: ['SOC Workbench', 'Live Alerts', 'Investigations'],
            mockupContent: 'soc',
          },
          {
            version: '/0.2',
            title: 'Kill Chain',
            desc: 'Visualize multi-stage attacks mapped to MITRE ATT&CK in real time.',
            mockupTabs: ['Kill Chain', 'ATT&CK Heatmap'],
            mockupContent: 'killchain',
          },
          {
            version: '/0.3',
            title: 'Topology',
            desc: 'Live network graph — see every device, connection, and anomaly as it happens.',
            mockupTabs: ['Network Topology'],
            mockupContent: 'topology',
          },
          {
            version: '/0.4',
            title: 'Compliance',
            desc: 'Automated compliance tracking across NIST, ISO 27001, SOC 2, and custom frameworks.',
            mockupTabs: ['Compliance'],
            mockupContent: 'compliance',
          },
          {
            version: '/0.5',
            title: 'Threat Intel',
            desc: 'Aggregated threat intelligence — IOCs, actor profiles, and real-time feed correlation.',
            mockupTabs: ['Threat Intel'],
            mockupContent: 'threatintel',
          },
        ].map((module, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="module-row group relative overflow-hidden border-b"
            style={{
              background: '#ffffff',
              borderColor: '#e5e5e5',
              cursor: 'default',
              display: 'grid',
              gridTemplateColumns: '160px 1fr auto',
              minHeight: '120px',
              alignItems: 'center',
              padding: '0 60px',
              gap: '40px',
            }}
            onMouseEnter={(e) => {
              const row = e.currentTarget as HTMLElement;
              const learnMore = row.querySelector('[data-learn-more]') as HTMLElement;
              const mockup = row.querySelector('[data-mockup]') as HTMLElement;
              const wordmark = row.querySelector('[data-wordmark]') as HTMLElement;
              if (learnMore) learnMore.style.opacity = '1';
              if (mockup) {
                mockup.style.opacity = '1';
                mockup.style.transform = 'translateY(0)';
              }
              if (wordmark) wordmark.style.opacity = '0.07';
            }}
            onMouseLeave={(e) => {
              const row = e.currentTarget as HTMLElement;
              const learnMore = row.querySelector('[data-learn-more]') as HTMLElement;
              const mockup = row.querySelector('[data-mockup]') as HTMLElement;
              const wordmark = row.querySelector('[data-wordmark]') as HTMLElement;
              if (learnMore) learnMore.style.opacity = '0';
              if (mockup) {
                mockup.style.opacity = '0';
                mockup.style.transform = 'translateY(10px)';
              }
              if (wordmark) wordmark.style.opacity = '0.15';
            }}
          >
            {/* Column 1: Version + Description + Learn More */}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '160px' }}>
              <div className="font-mono" style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                {module.version}
              </div>
              <p className="leading-relaxed" style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(0,0,0,0.6)', lineHeight: '1.5', marginBottom: '12px' }}>
                {module.desc}
              </p>
              <button
                onClick={() => openModal(module.title)}
                data-learn-more="true"
                className="inline-flex items-center gap-1 transition-all duration-250 opacity-0"
                style={{ fontSize: '12px', color: '#c0392b', fontWeight: 500 }}
              >
                Learn more ›
              </button>
            </div>

            {/* Column 2: Mockup */}
            <div
              data-mockup="true"
              className="transition-all duration-400 opacity-0"
              style={{ transform: 'translateY(10px)', maxWidth: '440px' }}
            >
              <div
                style={{
                  background: '#0d0d0d',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
              >
                {/* macOS-style Top Bar */}
                <div style={{ background: '#1a1a1a', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Colored Dots */}
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#27c93f' }} />
                  {/* Tab Labels */}
                  <div style={{ marginLeft: '12px', display: 'flex', gap: '16px' }}>
                    {module.mockupTabs.map((tab, tabIdx) => (
                      <div key={tabIdx} style={{ fontSize: '9px', fontFamily: 'monospace', color: tabIdx === 0 ? '#ffffff' : '#888888', fontWeight: tabIdx === 0 ? 500 : 400 }}>
                        {tab}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mockup Body */}
                <div style={{ padding: '10px', color: '#ffffff', fontSize: '11px', fontFamily: 'monospace', minHeight: '140px' }}>
                  {module.mockupContent === 'soc' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ padding: '6px 8px', background: 'rgba(255,95,86,0.1)', borderLeft: '3px solid #ff5f56', fontSize: '9px' }}>
                        <div style={{ color: '#ff5f56', fontWeight: 500 }}>CRITICAL</div>
                        <div style={{ color: '#aaa', fontSize: '8px', marginTop: '2px' }}>Unauthorized access attempt - 10.1.2.15</div>
                      </div>
                      <div style={{ padding: '6px 8px', background: 'rgba(255,189,46,0.1)', borderLeft: '3px solid #ffbd2e', fontSize: '9px' }}>
                        <div style={{ color: '#ffbd2e', fontWeight: 500 }}>HIGH</div>
                        <div style={{ color: '#aaa', fontSize: '8px', marginTop: '2px' }}>Suspicious port scan detected</div>
                      </div>
                      <div style={{ padding: '6px 8px', background: 'rgba(255,95,86,0.1)', borderLeft: '3px solid #ff5f56', fontSize: '9px' }}>
                        <div style={{ color: '#ff5f56', fontWeight: 500 }}>CRITICAL</div>
                        <div style={{ color: '#aaa', fontSize: '8px', marginTop: '2px' }}>Malware signature match - endpoint-08</div>
                      </div>
                    </div>
                  )}
                  {module.mockupContent === 'killchain' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '8px', color: '#aaa' }}>
                        <div style={{ padding: '3px 6px', background: '#4a90e2', borderRadius: '2px', color: '#fff' }}>Recon</div>
                        <span>→</span>
                        <div style={{ padding: '3px 6px', background: '#f5a623', borderRadius: '2px', color: '#000' }}>Init Access</div>
                        <span>→</span>
                        <div style={{ padding: '3px 6px', background: '#7ed321', borderRadius: '2px', color: '#000' }}>Lateral</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '8px', color: '#aaa' }}>
                        <div style={{ padding: '3px 6px', background: 'rgba(74,144,226,0.2)', borderRadius: '2px' }}>Spear-Phishing: 3</div>
                        <div style={{ padding: '3px 6px', background: 'rgba(245,166,35,0.2)', borderRadius: '2px' }}>Exploit: 2</div>
                      </div>
                    </div>
                  )}
                  {module.mockupContent === 'topology' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {['FW', 'SW', 'DC', 'AS', 'EP', 'EP', 'IoT', 'DB'].map((label, i) => {
                        const colors = ['#ff5f56', '#27c93f', '#ffbd2e', '#4a90e2'];
                        return (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <div
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: colors[i % colors.length],
                                opacity: 0.8,
                              }}
                            />
                            <div style={{ fontSize: '7px', color: '#aaa', textAlign: 'center' }}>{label}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {module.mockupContent === 'compliance' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { name: 'NIST CSF', score: 82, color: '#27c93f' },
                        { name: 'ISO 27001', score: 67, color: '#ffbd2e' },
                        { name: 'SOC 2', score: 91, color: '#27c93f' },
                        { name: 'PCI-DSS', score: 44, color: '#ff5f56' },
                      ].map((fw, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8px' }}>
                          <div style={{ color: '#aaa' }}>{fw.name}</div>
                          <div style={{ width: '80px', height: '2px', background: '#333', borderRadius: '1px', overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: fw.score + '%',
                                background: fw.color,
                              }}
                            />
                          </div>
                          <div style={{ color: '#aaa', minWidth: '20px', textAlign: 'right' }}>{fw.score}%</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {module.mockupContent === 'threatintel' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { name: 'APT28', tag: 'Nation-State', color: '#ff5f56' },
                        { name: '192.168.1.100', tag: 'IOC', color: '#ffbd2e' },
                        { name: 'LockBit', tag: 'Ransomware', color: '#ff5f56' },
                        { name: 'Mimikatz', tag: 'TTP', color: '#4a90e2' },
                      ].map((threat, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8px' }}>
                          <div style={{ color: '#aaa' }}>{threat.name}</div>
                          <div style={{ padding: '2px 6px', background: threat.color, borderRadius: '2px', color: '#fff', fontWeight: 500, fontSize: '7px' }}>
                            {threat.tag}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 3: Wordmark */}
            <div
              data-wordmark="true"
              style={{
                fontSize: 'clamp(52px, 8vw, 100px)',
                fontWeight: 700,
                color: '#111111',
                opacity: 0.15,
                transition: 'opacity 0.4s ease',
                textAlign: 'right',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                fontFamily: "'Space Grotesk', 'Courier New', monospace",
              }}
            >
              {module.title}
            </div>
          </motion.div>
        ))}
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
            gap: 24px;
            animation: scroll 40s linear infinite;
          }


          .insight-card {
            flex-shrink: 0;
            width: 340px;
            min-height: 380px;
            padding: 44px 36px 36px 36px;
            background: linear-gradient(135deg, #eeeeee calc(100% - 40px), transparent calc(100% - 40px)), linear-gradient(225deg, #d4d4d4 40px, #eeeeee 40px);
            background-position: top right, top right;
            background-size: 40px 40px, 100% 100%;
            background-repeat: no-repeat;
            border-radius: 0;
            border: none;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
          }

          .insight-card:hover {
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
            margin-bottom: 10px;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .insight-card-description {
            font-size: 13px;
            color: rgba(0, 0, 0, 0.5);
            line-height: 1.6;
            margin-bottom: auto;
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
      <section className="px-0 py-0" style={{ background: '#000000', padding: '80px 0 0 0' }}>
        {/* Heading Section */}
        <div style={{ padding: '0 60px 64px 60px' }}>
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
              <p className="text-lg" style={{ color: '#CCCCCC' }}>
                Join leading enterprises using Sentinel for comprehensive threat detection and incident response.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Button Row with Top and Bottom Borders */}
        <div
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid rgba(0,0,0,0.12)',
            borderBottom: '1px solid rgba(0,0,0,0.12)',
            padding: '16px 0',
            width: '100%',
          }}
        >
          <div className="flex w-full gap-3" style={{ padding: '12px 0', justifyContent: 'center', paddingLeft: '60px', paddingRight: '60px' }}>
            {/* Left Button - Request a Demo */}
            <button
              onClick={() => openModal('Request a Demo')}
              className="transition-all"
              style={{
                width: 'calc(50% - 6px)',
                height: '100px',
                background: '#e2e2e2',
                color: '#0d0d14',
                borderRadius: '4px',
                border: 'none',
                padding: '0 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '1.4rem',
                fontWeight: '400',
                transition: 'background 0.25s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#d4d4d4'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#e2e2e2'}
            >
              <span>Request a Demo</span>
              <span
                style={{
                  fontSize: '1.2rem',
                  transition: 'transform 0.25s ease',
                }}
                className="cta-arrow-left"
              >
                →
              </span>
            </button>

            {/* Right Button - Access Dashboard */}
            <button
              onClick={() => navigate('/login')}
              className="transition-all"
              style={{
                width: 'calc(50% - 6px)',
                height: '100px',
                background: '#1a1a1a',
                color: '#ffffff',
                borderRadius: '4px',
                border: 'none',
                padding: '0 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '1.4rem',
                fontWeight: '400',
                transition: 'background 0.25s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1f1f1f'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
            >
              <span>Access Dashboard</span>
              <span
                style={{
                  fontSize: '1.2rem',
                  transition: 'transform 0.25s ease',
                }}
                className="cta-arrow-right"
              >
                →
              </span>
            </button>
          </div>
        </div>

        <style>{`
          .cta-arrow-left:hover,
          button:hover .cta-arrow-left {
            transform: translateX(6px);
          }

          button:hover .cta-arrow-right {
            transform: translateX(6px);
          }
        `}</style>
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
