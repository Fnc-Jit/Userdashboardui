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
      excerpt: 'Understanding modern security information and event management systems.',
      image: siemImages[0],
    },
    {
      title: 'Threat Detection Strategies',
      category: 'GUIDE',
      excerpt: 'Implementing effective detection rules and threat hunting methodologies.',
      image: siemImages[1],
    },
    {
      title: 'Incident Response Best Practices',
      category: 'WHITEPAPER',
      excerpt: 'How leading SOC teams orchestrate rapid response to security incidents.',
      image: siemImages[2],
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

      {/* ═══════════ SIEM SECTION - PALANTIR "OUR SOFTWARE" STYLE ═══════════ */}
      <section id="reports" className="py-0 px-0" style={{ background: '#FFFFFF', fontFamily: "'DM Sans', sans-serif" }}>
        {['Unified Event Collection', 'Real-time Analysis', 'Threat Detection', 'Incident Investigation', 'Automated Response'].map((title, idx) => {
          const descriptions = [
            'Collect and normalize log data from all sources across your infrastructure.',
            'Process millions of events per second with advanced machine learning algorithms.',
            'Identify suspicious patterns and known threats in real-time.',
            'Deep-dive into incidents with comprehensive forensic evidence.',
            'Automate response actions to contain threats faster.',
          ];
          const labels = ['/0.1', '/0.2', '/0.3', '/0.4', '/0.5'];
          const symbols = ['📊', '⚡', '🎯', '🔍', '🚀'];

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden transition-all duration-600 border-b"
              style={{
                background: '#FFFFFF',
                height: '280px',
                display: 'flex',
                borderColor: 'rgba(0,0,0,0.08)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const container = e.currentTarget as HTMLElement;
                container.style.height = '620px';
              }}
              onMouseLeave={(e) => {
                const container = e.currentTarget as HTMLElement;
                container.style.height = '280px';
              }}
            >
              {/* Left Column - 35% */}
              <div
                className="flex flex-col justify-center relative z-10 transition-all duration-500"
                style={{
                  width: '35%',
                  paddingLeft: '60px',
                  paddingRight: '48px',
                  paddingTop: '80px',
                  paddingBottom: '80px',
                }}
              >
                {/* Counter Label */}
                <div
                  className="font-mono text-sm tracking-wider mb-8 transition-all duration-500"
                  style={{
                    fontSize: '13px',
                    color: 'rgba(0,0,0,0.35)',
                    opacity: 1,
                    transform: 'translateY(0)',
                  }}
                >
                  {labels[idx]}
                </div>

                {/* Description (visible in collapsed state) */}
                <p
                  className="transition-all duration-500 leading-relaxed"
                  style={{
                    fontSize: '15px',
                    fontWeight: 400,
                    color: 'rgba(0,0,0,0.55)',
                    marginBottom: '32px',
                    opacity: 1,
                    maxHeight: '100px',
                    overflow: 'hidden',
                  }}
                >
                  {descriptions[idx]}
                </p>

                {/* Title (hidden in collapsed, appears on expand) */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  className="group-hover:opacity-100 opacity-0 transition-all duration-500"
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                    fontWeight: 800,
                    color: '#0d0d14',
                    lineHeight: 1.1,
                    marginBottom: '24px',
                  }}
                >
                  {title}
                </motion.h3>

                {/* Learn More Link (hidden in collapsed, appears on expand) */}
                <button
                  onClick={() => openModal(title)}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:gap-3"
                  style={{ color: '#d4500a' }}
                >
                  Learn more
                  <ChevronRight size={16} className="transition-transform duration-200" />
                </button>
              </div>

              {/* Right Column - 65% */}
              <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                {/* Ghost Symbol (visible in collapsed, fades on hover) */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:opacity-0"
                  style={{
                    opacity: 0.08,
                    fontSize: '200px',
                    filter: 'grayscale(100%)',
                  }}
                >
                  {symbols[idx]}
                </div>

                {/* Video Panel (hidden in collapsed, appears on expand) */}
                <div
                  className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                  style={{
                    borderRadius: '4px',
                  }}
                >
                  <img
                    src={siemImages[idx]}
                    alt={title}
                    className="w-full h-full object-cover"
                    style={{
                      boxShadow: '0 4px 40px rgba(0,0,0,0.12)',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}

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

      {/* ═══════════ ARTICLES SECTION ═══════════ */}
      <section className="py-20 px-6 lg:px-8" style={{ background: '#F9F9F9' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>
              Featured Insights
            </h2>
            <p className="text-lg" style={{ color: '#666666' }}>
              Latest research, guides, and best practices from our team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <motion.button
                key={idx}
                onClick={() => openModal(article.title)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden border transition-all text-left hover:shadow-xl hover:-translate-y-2"
                style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FF6B35' }}>
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold my-3" style={{ color: '#000000' }}>
                    {article.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#666666' }}>
                    {article.excerpt}
                  </p>
                </div>
              </motion.button>
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
