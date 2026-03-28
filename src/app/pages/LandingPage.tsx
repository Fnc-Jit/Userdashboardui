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
  const [activeAgent, setActiveAgent] = useState(0);

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

      {/* ═══════════ NAVIGATION BAR ═══════════ */}
      <nav className="fixed top-0 w-full z-50 border-b" style={{ background: 'rgba(255,255,255,0.95)', borderColor: '#E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)' }}>
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: '#000000' }}>Sentinel</span>
          </button>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => document.getElementById('reports')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium transition-colors hover:text-black" style={{ color: '#666666' }}>
              Reports
            </button>
            <button onClick={() => openModal('Request a Demo')} className="text-sm font-medium transition-colors hover:text-black" style={{ color: '#666666' }}>
              Demo
            </button>
            <button onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium transition-colors hover:text-black" style={{ color: '#666666' }}>
              Agent Architecture
            </button>
            <button onClick={() => navigate('/login')} className="text-sm font-medium transition-colors hover:text-black" style={{ color: '#666666' }}>
              Access Dashboard
            </button>
          </div>

          {/* Right: Search & CTA */}
          <div className="flex items-center gap-4">
            {/* Glassmorphic Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: 'rgba(255,255,255,0.5)', borderColor: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(8px)' }}>
              <Search size={16} style={{ color: '#999999' }} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-32"
                style={{ color: '#000000' }}
              />
            </div>

            {/* CTA Button */}
            <button
              onClick={() => openModal('Request a Demo')}
              className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-all"
              style={{ background: '#000000', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1A1A1A'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#000000'}
            >
              Request Demo
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="pt-32 pb-16 px-6 lg:px-8">
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

          {/* Glassmorphic Search Tile - God's Eye */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative"
          >
            <div
              className="relative rounded-3xl border overflow-hidden p-12 cursor-pointer group transition-all hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255,255,255,0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
              onClick={() => setSearchOpen(true)}
            >
              {/* Animated background orb */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-30 group-hover:opacity-50 transition-opacity" style={{ background: 'radial-gradient(circle, #FF6B35, transparent 70%)' }} />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: 'radial-gradient(circle, #E8478C, transparent 70%)' }} />

              {/* Content */}
              <div className="relative z-10">
                {/* Header with God's Eye */}
                <div className="mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)' }}>
                    <Search size={18} className="text-white" />
                  </div>
                  <span className="text-2xl font-bold tracking-tight" style={{ color: '#000000' }}>God's Eye</span>
                </div>

                {/* Search input */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Explore threats, analyze events, monitor infrastructure..."
                    className="w-full bg-transparent outline-none text-lg py-4 px-0"
                    style={{ color: '#000000' }}
                    onFocus={() => setSearchOpen(true)}
                  />
                  <div className="h-px mt-4 w-full" style={{ background: 'rgba(0,0,0,0.1)' }} />
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-3">
                  {['Threat Intelligence', 'Device Inventory', 'Incidents', 'Network Topology'].map(suggestion => (
                    <button
                      key={suggestion}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all border"
                      style={{
                        background: 'rgba(255, 107, 53, 0.1)',
                        borderColor: 'rgba(255, 107, 53, 0.3)',
                        color: '#000000',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 107, 53, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 107, 53, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.3)';
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {/* Footer text */}
                <p className="text-sm mt-6" style={{ color: '#666666' }}>
                  Press <code className="px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.05)' }}>⌘K</code> or click to search
                </p>
              </div>
            </div>
          </motion.div>
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

      {/* ═══════════ SIEM EXPLANATION SECTION ═══════════ */}
      <section id="reports" className="py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#000000' }}>
              Security Information & Event Management
            </h2>
            <p className="text-lg" style={{ color: '#666666' }}>
              Sentinel provides comprehensive SIEM capabilities designed for modern security operations centers. Monitor, detect, investigate, and respond to threats across your entire infrastructure.
            </p>
          </motion.div>

          {/* SIEM Content Grid */}
          <div className="space-y-16">
            {siemImages.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4" style={{ color: '#000000' }}>
                    {['Unified Event Collection', 'Real-time Analysis', 'Threat Detection', 'Incident Investigation', 'Automated Response'][idx]}
                  </h3>
                  <p className="text-base leading-relaxed mb-4" style={{ color: '#666666' }}>
                    {[
                      'Collect and normalize log data from all sources across your infrastructure.',
                      'Process millions of events per second with advanced machine learning algorithms.',
                      'Identify suspicious patterns and known threats in real-time.',
                      'Deep-dive into incidents with comprehensive forensic evidence.',
                      'Automate response actions to contain threats faster.',
                    ][idx]}
                  </p>
                  <button
                    className="inline-flex items-center gap-2 text-sm font-medium transition-all"
                    style={{ color: '#FF6B35' }}
                  >
                    Learn more <ChevronRight size={16} />
                  </button>
                </div>
                <motion.div className="flex-1 w-full" whileHover={{ scale: 1.05 }}>
                  <img
                    src={image}
                    alt="SIEM Feature"
                    className="w-full rounded-xl shadow-lg transition-transform duration-300"
                    style={{ maxHeight: '350px', objectFit: 'cover' }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
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
