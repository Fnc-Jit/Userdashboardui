import { RiskLevel, riskColors, riskLabels } from '../data/mockData';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const color = riskColors[level];
  const label = riskLabels[level];

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'isolated' | 'maintenance' | 'open' | 'investigating' | 'resolved' | 'closed';
  size?: 'sm' | 'md';
}

const statusConfig = {
  active: { color: '#4BDE80', label: 'Active' },
  isolated: { color: '#FF4C4C', label: 'Isolated' },
  maintenance: { color: '#FFB347', label: 'Maintenance' },
  open: { color: '#FF4C4C', label: 'Open' },
  investigating: { color: '#FF6B35', label: 'Investigating' },
  resolved: { color: '#4BDE80', label: 'Resolved' },
  closed: { color: '#8B8FA3', label: 'Closed' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cfg = statusConfig[status] || { color: '#9AA4C6', label: status };
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses}`}
      style={{ background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: cfg.color, animationPlayState: status === 'active' ? 'running' : 'paused' }}
      />
      {cfg.label}
    </span>
  );
}