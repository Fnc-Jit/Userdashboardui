import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from 'motion/react';
import {
  Camera, Thermometer, Lock, Activity, Wifi, Cpu,
  Radio, Monitor, Server, Zap, Globe, AlertTriangle, Network,
} from 'lucide-react';

/* ── IoT device cards — x/y as % offset from center ── */
const devices = [
  { id: 'cctv-1',  label: 'CCTV Camera',     sub: 'Lobby — Live',     icon: Camera,        color: '#FF6B35', x: -34, y: -30 },
  { id: 'cctv-2',  label: 'IP Camera',        sub: 'Server Room',      icon: Camera,        color: '#FF6B35', x:  30, y: -34 },
  { id: 'cctv-3',  label: 'PTZ Camera',       sub: 'Parking — Live',   icon: Camera,        color: '#FF6B35', x: -38, y:  14 },
  { id: 'cctv-4',  label: 'Dome Camera',      sub: 'Warehouse',        icon: Camera,        color: '#FF6B35', x:  36, y:  22 },
  { id: 'thermo',  label: 'Smart Thermostat', sub: 'HVAC Zone A',      icon: Thermometer,   color: '#4BDE80', x: -16, y: -42 },
  { id: 'lock',    label: 'Smart Lock',       sub: 'Access Control',   icon: Lock,          color: '#E8478C', x:  14, y: -44 },
  { id: 'medical', label: 'Medical Monitor',  sub: 'ICU Ward B',       icon: Activity,      color: '#FF4C4C', x: -40, y:  34 },
  { id: 'wifi',    label: 'AP Controller',    sub: 'Cisco Meraki',     icon: Wifi,          color: '#3B82F6', x:  40, y: -12 },
  { id: 'plc',     label: 'Industrial PLC',   sub: 'Siemens OT/ICS',  icon: Cpu,           color: '#FFB347', x: -8,  y:  44 },
  { id: 'radio',   label: 'RF Sensor',        sub: 'BLE Gateway',      icon: Radio,         color: '#A855F7', x:  26, y:  42 },
  { id: 'display', label: 'Smart Display',    sub: 'Conf. Room',       icon: Monitor,       color: '#00CED1', x: -42, y:  -4 },
  { id: 'server',  label: 'Edge Server',      sub: 'On-Premise Node',  icon: Server,        color: '#4BDE80', x:  42, y:  34 },
  { id: 'hvac',    label: 'HVAC Controller',  sub: 'Honeywell BMS',    icon: Zap,           color: '#FFB347', x: -24, y:  38 },
  { id: 'motion',  label: 'Motion Sensor',    sub: 'PIR Zone 4',       icon: Globe,         color: '#E8478C', x:  16, y: -18 },
  { id: 'alarm',   label: 'Intrusion Panel',  sub: 'DSC PowerSeries',  icon: AlertTriangle, color: '#FF4C4C', x: -28, y: -14 },
  { id: 'switch',  label: 'Network Switch',   sub: 'Cisco Catalyst',   icon: Network,       color: '#3B82F6', x:  32, y:  8 },
];

/* ── Individual floating card ── */
function DeviceCard({
  device,
  progress,
}: {
  device: typeof devices[0];
  progress: ReturnType<typeof useSpring>;
}) {
  const Icon = device.icon;
  const isCamera = device.id.startsWith('cctv');

  // Spread: at progress 0 cards sit at center, at ~0.5 they're fully spread
  const spreadProgress = useTransform(progress, [0, 0.15, 0.55], [0, 0, 1]);
  const x = useTransform(spreadProgress, [0, 1], [0, device.x]);
  const y = useTransform(spreadProgress, [0, 1], [0, device.y]);

  // Visibility: fade in early, stay visible, fade out near end
  const opacity = useTransform(progress, [0, 0.08, 0.18, 0.65, 0.78], [0, 0, 0.9, 0.9, 0]);
  const scale   = useTransform(progress, [0, 0.08, 0.22, 0.65, 0.78], [0.3, 0.3, 1, 1, 0.6]);

  const left = useMotionTemplate`calc(50% + ${x}%)`;
  const top = useMotionTemplate`calc(50% + ${y}%)`;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left,
        top,
        x: '-50%',
        y: '-50%',
        opacity,
        scale,
        pointerEvents: 'none',
      }}
    >
      <div
        className="rounded-2xl border flex flex-col items-center justify-center gap-1.5 px-4 py-3 backdrop-blur-sm"
        style={{
          background: 'rgba(12,12,12,0.75)',
          borderColor: `${device.color}40`,
          minWidth: 110,
          boxShadow: `0 0 20px ${device.color}15, inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${device.color}18`, border: `1px solid ${device.color}30` }}
        >
          <Icon size={20} style={{ color: device.color }} />
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold whitespace-nowrap" style={{ color: '#FFFFFF' }}>{device.label}</div>
          <div className="text-[9px] mt-0.5 whitespace-nowrap" style={{ color: '#8B8FA3' }}>{device.sub}</div>
        </div>
        {isCamera && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4BDE80] animate-pulse" />
            <span className="text-[8px] uppercase tracking-wider" style={{ color: '#4BDE80' }}>Live</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function DeviceScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 24 });

  /* Center text */
  const titleOpacity = useTransform(progress, [0.02, 0.10, 0.60, 0.74], [0, 1, 1, 0]);
  const titleScale   = useTransform(progress, [0.02, 0.12], [0.88, 1]);
  const subOpacity   = useTransform(progress, [0.06, 0.14, 0.60, 0.74], [0, 1, 1, 0]);
  const badgeOpacity = useTransform(progress, [0.02, 0.08, 0.60, 0.72], [0, 1, 1, 0]);

  /* Soft radial rays opacity */
  const rayOpacity = useTransform(progress, [0.05, 0.15, 0.55, 0.72], [0, 0.6, 0.6, 0]);

  /* End-of-scroll reveal */
  const endOpacity = useTransform(progress, [0.76, 0.88, 1], [0, 1, 1]);
  const endY       = useTransform(progress, [0.76, 0.92], [40, 0]);

  /* Scroll hint */
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="device-scroll"
      style={{ height: '400vh', position: 'relative' }}
    >
      {/* ── Sticky viewport ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 50%, #0e0a1c 0%, #0C0C0C 65%)',
        }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,107,53,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.025) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Soft radial glow rays — contained within viewport */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: rayOpacity }}
        >
          {/* Radial line-like glows using conic gradients */}
          <div className="absolute inset-0" style={{
            background: `
              conic-gradient(
                from -40deg at 50% 50%,
                transparent 0deg,
                rgba(255,107,53,0.08) 2deg,
                transparent 4deg,
                transparent 15deg,
                rgba(232,71,140,0.06) 17deg,
                transparent 19deg,
                transparent 30deg,
                rgba(255,179,71,0.05) 32deg,
                transparent 34deg,
                transparent 50deg,
                rgba(255,107,53,0.07) 52deg,
                transparent 54deg,
                transparent 85deg,
                rgba(232,71,140,0.06) 87deg,
                transparent 89deg,
                transparent 140deg,
                rgba(255,107,53,0.07) 142deg,
                transparent 144deg,
                transparent 165deg,
                rgba(232,71,140,0.05) 167deg,
                transparent 169deg,
                transparent 210deg,
                rgba(255,179,71,0.06) 212deg,
                transparent 214deg,
                transparent 280deg,
                rgba(255,107,53,0.05) 282deg,
                transparent 284deg,
                transparent 360deg
              )
            `,
          }} />
        </motion.div>

        {/* Central radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 40% 35% at 50% 50%, rgba(255,107,53,0.09) 0%, transparent 70%)' }}
        />

        {/* Floating device cards */}
        <div className="absolute inset-0" style={{ pointerEvents: 'none', zIndex: 5 }}>
          {devices.map(device => (
            <DeviceCard key={device.id} device={device} progress={progress} />
          ))}
        </div>

        {/* ── Center pinned text ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none" style={{ zIndex: 10 }}>
          <motion.div style={{ opacity: badgeOpacity }} className="mb-5">
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-semibold px-4 py-1.5 rounded-full border"
              style={{ color: '#FF6B35', borderColor: 'rgba(255,107,53,0.3)', background: 'rgba(255,107,53,0.07)' }}
            >
              Sentinel · Device Coverage
            </span>
          </motion.div>

          <motion.h2
            style={{
              opacity: titleOpacity,
              scale: titleScale,
              fontSize: 'clamp(2.2rem, 5.5vw, 4.8rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              color: '#FFFFFF',
            }}
          >
            Monitor &amp;{' '}
            <span style={{ color: '#FF6B35' }}>Save</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #E8478C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              any device
            </span>
            , anywhere
          </motion.h2>

          <motion.p
            style={{ opacity: subOpacity, color: '#8B8FA3' }}
            className="mt-5 max-w-lg text-base leading-relaxed"
          >
            From live CCTV streams to industrial PLCs — Sentinel monitors, scores,
            and protects every endpoint on your network in real time.
          </motion.p>

          <motion.div style={{ opacity: subOpacity }} className="mt-8 flex items-center gap-8">
            {[
              { value: '500+', label: 'Device Types' },
              { value: '24/7',  label: 'Live Monitoring' },
              { value: '99.7%', label: 'Detection Rate' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold" style={{ color: '#FF6B35' }}>{stat.value}</div>
                <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: '#8B8FA3' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Scroll hint ── */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          aria-hidden
        >
          <span className="text-[10px] uppercase tracking-widest" style={{ color: '#8B8FA3' }}>Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
            <motion.div
              className="w-1 h-2 rounded-full"
              style={{ background: '#FF6B35' }}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* ── End-of-scroll reveal overlay ── */}
        <motion.div
          style={{
            opacity: endOpacity,
            y: endY,
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 20,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(12,12,12,0.96) 0%, rgba(12,12,12,1) 80%)',
          }}
        >
          <div className="text-center px-6 max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8 border"
              style={{ background: 'rgba(75,222,128,0.08)', borderColor: 'rgba(75,222,128,0.28)', color: '#4BDE80' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#4BDE80] animate-pulse" />
              All devices protected · Zero blind spots
            </div>

            <h3
              style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.1, color: '#FFFFFF' }}
            >
              One platform.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF6B35, #E8478C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Every device.
              </span>
              <br />
              Total visibility.
            </h3>

            <p className="mt-6 text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#8B8FA3' }}>
              Sentinel automatically discovers, classifies, and assigns trust scores to every
              device on your network — cameras, locks, PLCs, medical equipment, and more.
              No agents. No manual setup. Just instant, continuous protection.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
              {[
                { icon: '🎥', label: 'CCTV & IP Cameras' },
                { icon: '🔒', label: 'Access Control' },
                { icon: '⚙️', label: 'Industrial OT/ICS' },
                { icon: '🏥', label: 'Medical Devices' },
                { icon: '🌡️', label: 'Building Automation' },
                { icon: '📡', label: 'Network Infrastructure' },
              ].map(d => (
                <span
                  key={d.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.09)', color: '#FFFFFF' }}
                >
                  {d.icon} {d.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
