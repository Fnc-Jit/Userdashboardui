export type RiskLevel = 'trusted' | 'low' | 'medium' | 'high' | 'critical';
export type DeviceStatus = 'active' | 'isolated' | 'maintenance';
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Evidence {
  id: string;
  type: string;
  severity: string;
  timestamp: string;
  details: string;
}

export interface Device {
  id: string;
  name: string;
  class: string;
  vendor: string;
  trustScore: number;
  riskLevel: RiskLevel;
  status: DeviceStatus;
  lastSeen: string;
  mac: string;
  ip: string;
  behavioral: number;
  policy: number;
  drift: number;
  threat: number;
  history: { date: string; score: number }[];
  evidence: Evidence[];
}

export interface Incident {
  id: string;
  deviceId: string;
  riskLevel: RiskLevel;
  severity: IncidentSeverity;
  status: IncidentStatus;
  recommendedAction: string;
  createdAt: string;
  narrative: string;
  evidence: string[];
  timeline: { time: string; event: string }[];
  adjacentDevices: string[];
  trustScore: number;
  confidence: number;
  vendor: string;
  ip: string;
}

export interface Alert {
  id: string;
  type: 'trust_update' | 'policy_violation' | 'status_change' | 'graph_anomaly' | 'new_incident';
  deviceId: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

function generateHistory(baseScore: number): { date: string; score: number }[] {
  const history = [];
  const now = new Date('2026-03-09');
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const variance = (Math.random() - 0.5) * 15;
    const score = Math.max(0, Math.min(100, Math.round(baseScore + variance)));
    history.push({ date: d.toISOString().slice(0, 10), score });
  }
  return history;
}

export const devices: Device[] = [
  {
    id: 'DEV-001', name: 'Smart Thermostat', class: 'HVAC', vendor: 'Nest',
    trustScore: 94, riskLevel: 'trusted', status: 'active',
    lastSeen: '2026-03-09T10:23:00Z', mac: 'AA:BB:CC:DD:EE:01', ip: '192.168.1.101',
    behavioral: 96, policy: 93, drift: 91, threat: 97,
    history: generateHistory(94),
    evidence: [],
  },
  {
    id: 'DEV-002', name: 'IP Camera - Lobby', class: 'Surveillance', vendor: 'Hikvision',
    trustScore: 71, riskLevel: 'low', status: 'active',
    lastSeen: '2026-03-09T10:20:00Z', mac: 'AA:BB:CC:DD:EE:02', ip: '192.168.1.102',
    behavioral: 72, policy: 68, drift: 74, threat: 70,
    history: generateHistory(71),
    evidence: [
      { id: 'EV-001', type: 'Unusual Outbound Traffic', severity: 'low', timestamp: '2026-03-09T08:15:00Z', details: 'Camera sent 120MB to external IP 45.33.32.156 outside business hours.' },
    ],
  },
  {
    id: 'DEV-003', name: 'Industrial PLC #1', class: 'OT/ICS', vendor: 'Siemens',
    trustScore: 55, riskLevel: 'medium', status: 'active',
    lastSeen: '2026-03-09T10:18:00Z', mac: 'AA:BB:CC:DD:EE:03', ip: '192.168.2.10',
    behavioral: 58, policy: 52, drift: 60, threat: 50,
    history: generateHistory(55),
    evidence: [
      { id: 'EV-002', type: 'Firmware Drift', severity: 'medium', timestamp: '2026-03-08T14:00:00Z', details: 'Firmware version mismatch detected. Expected v3.2.1, found v3.1.9.' },
      { id: 'EV-003', type: 'Policy Violation', severity: 'medium', timestamp: '2026-03-08T12:30:00Z', details: 'Device attempted SSH connection to unregistered host 10.0.5.23.' },
    ],
  },
  {
    id: 'DEV-004', name: 'Medical Monitor', class: 'Medical', vendor: 'Philips',
    trustScore: 28, riskLevel: 'high', status: 'active',
    lastSeen: '2026-03-09T09:55:00Z', mac: 'AA:BB:CC:DD:EE:04', ip: '192.168.3.50',
    behavioral: 30, policy: 25, drift: 22, threat: 35,
    history: generateHistory(28),
    evidence: [
      { id: 'EV-004', type: 'Lateral Movement Detected', severity: 'high', timestamp: '2026-03-09T06:30:00Z', details: 'Device scanned 47 internal hosts on port 22 in 5 minutes.' },
      { id: 'EV-005', type: 'C2 Communication', severity: 'critical', timestamp: '2026-03-09T07:00:00Z', details: 'Beaconing to known C2 domain: update-service.xyz every 60 seconds.' },
      { id: 'EV-006', type: 'Data Exfiltration', severity: 'high', timestamp: '2026-03-09T07:45:00Z', details: 'Large encrypted upload (2.3GB) to external S3 bucket not in approved list.' },
    ],
  },
  {
    id: 'DEV-005', name: 'Smart Lock - Server Room', class: 'Access Control', vendor: 'Schlage',
    trustScore: 11, riskLevel: 'critical', status: 'isolated',
    lastSeen: '2026-03-09T09:10:00Z', mac: 'AA:BB:CC:DD:EE:05', ip: '10.0.0.55',
    behavioral: 8, policy: 12, drift: 15, threat: 9,
    history: generateHistory(11),
    evidence: [
      { id: 'EV-007', type: 'Authentication Bypass', severity: 'critical', timestamp: '2026-03-09T05:00:00Z', details: 'Lock firmware exploited via CVE-2024-11382 allowing remote unlock.' },
      { id: 'EV-008', type: 'Credential Dump', severity: 'critical', timestamp: '2026-03-09T05:15:00Z', details: 'Device transmitted LDAP credential hashes to 198.51.100.42.' },
    ],
  },
  {
    id: 'DEV-006', name: 'Conference Room Display', class: 'AV/Display', vendor: 'Samsung',
    trustScore: 88, riskLevel: 'trusted', status: 'active',
    lastSeen: '2026-03-09T10:22:00Z', mac: 'AA:BB:CC:DD:EE:06', ip: '192.168.1.120',
    behavioral: 90, policy: 87, drift: 88, threat: 91,
    history: generateHistory(88),
    evidence: [],
  },
  {
    id: 'DEV-007', name: 'Industrial PLC #2', class: 'OT/ICS', vendor: 'Rockwell',
    trustScore: 47, riskLevel: 'medium', status: 'maintenance',
    lastSeen: '2026-03-09T08:00:00Z', mac: 'AA:BB:CC:DD:EE:07', ip: '192.168.2.11',
    behavioral: 45, policy: 50, drift: 42, threat: 52,
    history: generateHistory(47),
    evidence: [
      { id: 'EV-009', type: 'Anomalous Protocol Usage', severity: 'medium', timestamp: '2026-03-08T16:00:00Z', details: 'Device using Modbus protocol on non-standard port 5022.' },
    ],
  },
  {
    id: 'DEV-008', name: 'HVAC Controller', class: 'HVAC', vendor: 'Honeywell',
    trustScore: 79, riskLevel: 'low', status: 'active',
    lastSeen: '2026-03-09T10:24:00Z', mac: 'AA:BB:CC:DD:EE:08', ip: '192.168.1.130',
    behavioral: 80, policy: 76, drift: 81, threat: 79,
    history: generateHistory(79),
    evidence: [],
  },
  {
    id: 'DEV-009', name: 'Network Printer', class: 'Peripheral', vendor: 'HP',
    trustScore: 63, riskLevel: 'low', status: 'active',
    lastSeen: '2026-03-09T10:15:00Z', mac: 'AA:BB:CC:DD:EE:09', ip: '192.168.1.200',
    behavioral: 65, policy: 60, drift: 66, threat: 62,
    history: generateHistory(63),
    evidence: [],
  },
  {
    id: 'DEV-010', name: 'Smart Elevator Panel', class: 'Building Mgmt', vendor: 'KONE',
    trustScore: 38, riskLevel: 'high', status: 'active',
    lastSeen: '2026-03-09T09:40:00Z', mac: 'AA:BB:CC:DD:EE:10', ip: '192.168.4.5',
    behavioral: 35, policy: 40, drift: 38, threat: 42,
    history: generateHistory(38),
    evidence: [
      { id: 'EV-010', type: 'Unauthorized Config Change', severity: 'high', timestamp: '2026-03-09T04:00:00Z', details: 'Panel configuration was modified from unregistered management IP 10.0.9.1.' },
    ],
  },
  {
    id: 'DEV-011', name: 'VoIP Gateway', class: 'Telephony', vendor: 'Cisco',
    trustScore: 85, riskLevel: 'trusted', status: 'active',
    lastSeen: '2026-03-09T10:21:00Z', mac: 'AA:BB:CC:DD:EE:11', ip: '192.168.1.50',
    behavioral: 87, policy: 84, drift: 86, threat: 85,
    history: generateHistory(85),
    evidence: [],
  },
  {
    id: 'DEV-012', name: 'Infusion Pump', class: 'Medical', vendor: 'Baxter',
    trustScore: 22, riskLevel: 'critical', status: 'isolated',
    lastSeen: '2026-03-09T08:30:00Z', mac: 'AA:BB:CC:DD:EE:12', ip: '10.0.1.80',
    behavioral: 18, policy: 25, drift: 20, threat: 28,
    history: generateHistory(22),
    evidence: [
      { id: 'EV-011', type: 'Ransomware Pattern', severity: 'critical', timestamp: '2026-03-09T02:00:00Z', details: 'File encryption activity detected consistent with LockBit 3.0 ransomware.' },
      { id: 'EV-012', type: 'Admin Account Created', severity: 'critical', timestamp: '2026-03-09T02:30:00Z', details: 'Unauthorized administrative account "svc_backup" created via SNMP write.' },
    ],
  },
];

export const incidents: Incident[] = [
  {
    id: 'INC-001', deviceId: 'DEV-005', riskLevel: 'critical', severity: 'critical',
    status: 'investigating', recommendedAction: 'VLAN Isolation + Firewall Block',
    createdAt: '2026-03-09T05:00:00Z',
    narrative: 'Smart Lock in the Server Room was compromised via CVE-2024-11382, allowing unauthenticated remote access. The device subsequently exfiltrated LDAP credential hashes to an external threat actor IP. Lateral movement to adjacent access control devices is suspected.',
    evidence: ['Authentication bypass via known CVE', 'Credential dump detected (LDAP hashes)', 'C2 communication established', 'Physical access log anomalies'],
    timeline: [
      { time: '04:58', event: 'Anomalous inbound connection detected from 198.51.100.42' },
      { time: '05:00', event: 'CVE-2024-11382 exploit pattern identified' },
      { time: '05:02', event: 'Lock firmware integrity check failed' },
      { time: '05:15', event: 'Credential exfiltration detected (2.1MB outbound)' },
      { time: '05:30', event: 'Device isolated by automated policy' },
      { time: '06:00', event: 'SOC analyst assigned – investigation begins' },
    ],
    adjacentDevices: ['DEV-001', 'DEV-006', 'DEV-011'],
    trustScore: 11, confidence: 97, vendor: 'Schlage', ip: '10.0.0.55',
  },
  {
    id: 'INC-002', deviceId: 'DEV-004', riskLevel: 'high', severity: 'high',
    status: 'open', recommendedAction: 'Network Segmentation + Traffic Inspection',
    createdAt: '2026-03-09T06:30:00Z',
    narrative: 'Medical Monitor in Ward 3 began scanning internal network hosts and established a persistent connection to a known Command & Control domain. Large data exfiltration event suggests patient data may be at risk.',
    evidence: ['Port scan of 47 internal hosts', 'C2 beaconing every 60 seconds', 'Encrypted upload of 2.3GB'],
    timeline: [
      { time: '06:30', event: 'Internal port scan detected (port 22)' },
      { time: '07:00', event: 'C2 domain communication confirmed' },
      { time: '07:45', event: 'Large data upload initiated' },
      { time: '08:15', event: 'Alert triggered – trust score dropped to 28' },
      { time: '09:00', event: 'Incident created and assigned' },
    ],
    adjacentDevices: ['DEV-012', 'DEV-007'],
    trustScore: 28, confidence: 91, vendor: 'Philips', ip: '192.168.3.50',
  },
  {
    id: 'INC-003', deviceId: 'DEV-012', riskLevel: 'critical', severity: 'critical',
    status: 'open', recommendedAction: 'Immediate Isolation + Factory Reset',
    createdAt: '2026-03-09T02:00:00Z',
    narrative: 'Infusion Pump in ICU detected with ransomware-like behavior including file encryption activity matching LockBit 3.0 signatures. An unauthorized admin account was also created via SNMP write access.',
    evidence: ['File encryption pattern matches LockBit 3.0', 'Unauthorized SNMP write operation', 'Admin account "svc_backup" created', 'Outbound DNS queries to known ransomware C2'],
    timeline: [
      { time: '02:00', event: 'File encryption activity detected' },
      { time: '02:15', event: 'SNMP write operation from unregistered host' },
      { time: '02:30', event: 'Admin account creation detected' },
      { time: '03:00', event: 'DNS anomaly: query to ransomware C2 infrastructure' },
      { time: '03:30', event: 'Device isolated automatically' },
    ],
    adjacentDevices: ['DEV-004', 'DEV-007', 'DEV-010'],
    trustScore: 22, confidence: 99, vendor: 'Baxter', ip: '10.0.1.80',
  },
  {
    id: 'INC-004', deviceId: 'DEV-010', riskLevel: 'high', severity: 'high',
    status: 'investigating', recommendedAction: 'Config Rollback + Access Review',
    createdAt: '2026-03-09T04:00:00Z',
    narrative: 'Smart Elevator Panel received unauthorized configuration changes from an unregistered management IP, potentially allowing unauthorized physical access to restricted floors.',
    evidence: ['Config change from unregistered IP 10.0.9.1', 'No change request in ITSM system', 'Affected floors 4-7 (executive level)'],
    timeline: [
      { time: '04:00', event: 'Config modification initiated from 10.0.9.1' },
      { time: '04:05', event: 'Access control rules updated for floors 4-7' },
      { time: '04:30', event: 'Security audit detected unauthorized change' },
      { time: '05:00', event: 'Incident created' },
    ],
    adjacentDevices: ['DEV-005', 'DEV-001'],
    trustScore: 38, confidence: 84, vendor: 'KONE', ip: '192.168.4.5',
  },
  {
    id: 'INC-005', deviceId: 'DEV-003', riskLevel: 'medium', severity: 'medium',
    status: 'resolved', recommendedAction: 'Firmware Update Required',
    createdAt: '2026-03-08T14:00:00Z',
    narrative: 'Industrial PLC detected with outdated firmware and attempted unauthorized SSH connections to an internal host not in the approved communication matrix.',
    evidence: ['Firmware version mismatch', 'SSH connection attempt to 10.0.5.23'],
    timeline: [
      { time: '14:00', event: 'Firmware drift detected' },
      { time: '14:30', event: 'Unauthorized SSH attempt logged' },
      { time: '16:00', event: 'Incident investigated' },
      { time: '18:00', event: 'Firmware update scheduled' },
    ],
    adjacentDevices: ['DEV-007', 'DEV-008'],
    trustScore: 55, confidence: 76, vendor: 'Siemens', ip: '192.168.2.10',
  },
  {
    id: 'INC-006', deviceId: 'DEV-002', riskLevel: 'low', severity: 'low',
    status: 'closed', recommendedAction: 'Monitor + Traffic Filtering',
    createdAt: '2026-03-09T08:15:00Z',
    narrative: 'Lobby IP Camera transmitted an unusually large amount of data outside business hours to an external IP address.',
    evidence: ['120MB outbound to 45.33.32.156 at 02:00 local time'],
    timeline: [
      { time: '08:15', event: 'Unusual traffic pattern detected' },
      { time: '09:00', event: 'Traffic destination analyzed – CDN endpoint confirmed' },
      { time: '09:30', event: 'Closed as false positive – firmware update traffic' },
    ],
    adjacentDevices: ['DEV-001', 'DEV-006'],
    trustScore: 71, confidence: 60, vendor: 'Hikvision', ip: '192.168.1.102',
  },
];

export const initialAlerts: Alert[] = [
  { id: 'ALT-001', type: 'new_incident', deviceId: 'DEV-005', message: 'Critical incident INC-001 opened on Smart Lock – Server Room', timestamp: '2026-03-09T05:30:00Z', severity: 'critical' },
  { id: 'ALT-002', type: 'status_change', deviceId: 'DEV-005', message: 'DEV-005 status changed: Active → Isolated', timestamp: '2026-03-09T05:30:00Z', severity: 'critical' },
  { id: 'ALT-003', type: 'trust_update', deviceId: 'DEV-004', message: 'DEV-004 trust score dropped: 65 → 28 (Behavioral anomaly)', timestamp: '2026-03-09T07:00:00Z', severity: 'critical' },
  { id: 'ALT-004', type: 'new_incident', deviceId: 'DEV-004', message: 'High severity incident INC-002 opened on Medical Monitor', timestamp: '2026-03-09T09:00:00Z', severity: 'warning' },
  { id: 'ALT-005', type: 'policy_violation', deviceId: 'DEV-003', message: 'DEV-003 violated communication policy – unauthorized SSH attempt', timestamp: '2026-03-09T08:00:00Z', severity: 'warning' },
  { id: 'ALT-006', type: 'graph_anomaly', deviceId: 'DEV-012', message: 'Lateral movement detected: DEV-012 → DEV-004 suspicious connection', timestamp: '2026-03-09T02:45:00Z', severity: 'critical' },
  { id: 'ALT-007', type: 'trust_update', deviceId: 'DEV-012', message: 'DEV-012 trust score dropped: 58 → 22 (Ransomware activity)', timestamp: '2026-03-09T02:15:00Z', severity: 'critical' },
  { id: 'ALT-008', type: 'status_change', deviceId: 'DEV-012', message: 'DEV-012 status changed: Active → Isolated', timestamp: '2026-03-09T03:30:00Z', severity: 'warning' },
  { id: 'ALT-009', type: 'trust_update', deviceId: 'DEV-002', message: 'DEV-002 trust score updated: 68 → 71 (Behavior normalized)', timestamp: '2026-03-09T09:30:00Z', severity: 'info' },
  { id: 'ALT-010', type: 'status_change', deviceId: 'DEV-007', message: 'DEV-007 placed in maintenance mode by admin@iot-sentinel.io', timestamp: '2026-03-09T08:00:00Z', severity: 'info' },
  { id: 'ALT-011', type: 'policy_violation', deviceId: 'DEV-010', message: 'DEV-010 config modified from unregistered IP 10.0.9.1', timestamp: '2026-03-09T04:05:00Z', severity: 'warning' },
  { id: 'ALT-012', type: 'graph_anomaly', deviceId: 'DEV-004', message: 'Network anomaly: DEV-004 scanning subnet 192.168.3.0/24', timestamp: '2026-03-09T06:32:00Z', severity: 'critical' },
];

export const riskColors: Record<RiskLevel, string> = {
  trusted: '#4BDE80',
  low: '#3B82F6',
  medium: '#FFB347',
  high: '#FF6B35',
  critical: '#FF4C4C',
};

export const riskLabels: Record<RiskLevel, string> = {
  trusted: 'Trusted',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const getDeviceById = (id: string) => devices.find(d => d.id === id);
export const getIncidentById = (id: string) => incidents.find(i => i.id === id);

export const dashboardStats = {
  totalDevices: devices.length,
  trustedDevices: devices.filter(d => d.riskLevel === 'trusted').length,
  highRiskDevices: devices.filter(d => d.riskLevel === 'high' || d.riskLevel === 'critical').length,
  activeIncidents: incidents.filter(i => i.status === 'open' || i.status === 'investigating').length,
};

export const riskDistribution = [
  { name: 'Trusted', value: devices.filter(d => d.riskLevel === 'trusted').length, color: '#4BDE80' },
  { name: 'Low', value: devices.filter(d => d.riskLevel === 'low').length, color: '#3B82F6' },
  { name: 'Medium', value: devices.filter(d => d.riskLevel === 'medium').length, color: '#FFB347' },
  { name: 'High', value: devices.filter(d => d.riskLevel === 'high').length, color: '#FF6B35' },
  { name: 'Critical', value: devices.filter(d => d.riskLevel === 'critical').length, color: '#FF4C4C' },
];

// ════════════════════════════════════════════════════════════════
// SIEM LAYER DATA
// ════════════════════════════════════════════════════════════════

// ── THREAT INTEL (IOCs) ──
export type IOCSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IOCType = 'ip' | 'domain' | 'hash' | 'cve';

export interface IOC {
  id: string;
  type: IOCType;
  value: string;
  source: string;
  severity: IOCSeverity;
  hits: number;
  firstSeen: string;
  lastSeen: string;
  active: boolean;
  linkedDevices: string[];
  country?: string;
}

export const iocs: IOC[] = [
  { id: 'IOC-001', type: 'ip', value: '185.220.101.34', source: 'OTX', severity: 'critical', hits: 3, firstSeen: '2026-03-07T12:00:00Z', lastSeen: '2026-03-09T13:00:00Z', active: true, linkedDevices: ['DEV-005'], country: 'DE' },
  { id: 'IOC-002', type: 'domain', value: 'update-service.xyz', source: 'MISP', severity: 'critical', hits: 2, firstSeen: '2026-03-08T08:00:00Z', lastSeen: '2026-03-09T07:00:00Z', active: true, linkedDevices: ['DEV-004'], country: 'RU' },
  { id: 'IOC-003', type: 'ip', value: '198.51.100.42', source: 'OTX', severity: 'high', hits: 1, firstSeen: '2026-03-09T05:15:00Z', lastSeen: '2026-03-09T05:15:00Z', active: true, linkedDevices: ['DEV-005'], country: 'CN' },
  { id: 'IOC-004', type: 'hash', value: 'a1b2c3d4e5f6789012345678abcdef01', source: 'Manual', severity: 'high', hits: 0, firstSeen: '2026-03-06T10:00:00Z', lastSeen: '2026-03-06T10:00:00Z', active: true, linkedDevices: [], country: undefined },
  { id: 'IOC-005', type: 'domain', value: 'malware.c2-relay.net', source: 'OTX', severity: 'critical', hits: 5, firstSeen: '2026-03-05T14:00:00Z', lastSeen: '2026-03-09T09:00:00Z', active: true, linkedDevices: ['DEV-012'], country: 'KP' },
  { id: 'IOC-006', type: 'ip', value: '203.0.113.42', source: 'MISP', severity: 'high', hits: 1, firstSeen: '2026-03-09T09:15:00Z', lastSeen: '2026-03-09T09:15:00Z', active: true, linkedDevices: ['DEV-012'], country: 'IR' },
  { id: 'IOC-007', type: 'cve', value: 'CVE-2024-11382', source: 'NVD', severity: 'critical', hits: 1, firstSeen: '2026-03-01T00:00:00Z', lastSeen: '2026-03-09T05:00:00Z', active: true, linkedDevices: ['DEV-005'], country: undefined },
  { id: 'IOC-008', type: 'ip', value: '45.33.32.156', source: 'Manual', severity: 'medium', hits: 1, firstSeen: '2026-03-09T08:15:00Z', lastSeen: '2026-03-09T08:15:00Z', active: false, linkedDevices: ['DEV-002'], country: 'US' },
];

export const threatScoreTrend = [
  { day: 'Mar 3', network: 12, c2: 3, exploit: 1, exfil: 0 },
  { day: 'Mar 4', network: 15, c2: 5, exploit: 2, exfil: 1 },
  { day: 'Mar 5', network: 8, c2: 7, exploit: 3, exfil: 2 },
  { day: 'Mar 6', network: 22, c2: 4, exploit: 1, exfil: 0 },
  { day: 'Mar 7', network: 18, c2: 12, exploit: 5, exfil: 3 },
  { day: 'Mar 8', network: 25, c2: 9, exploit: 4, exfil: 2 },
  { day: 'Mar 9', network: 31, c2: 15, exploit: 7, exfil: 4 },
];

export const geoHits: Record<string, number> = {
  DE: 3, RU: 2, CN: 1, KP: 5, IR: 1, US: 1
};

// ── UEBA ──
export interface UEBAFeature {
  name: string;
  baseline: number;
  current: number;
  unit: string;
}

export interface UEBAEntity {
  deviceId: string;
  deviceName: string;
  driftSigma: number;
  status: 'normal' | 'drift' | 'alert';
  features: UEBAFeature[];
  cusumHistory: { day: string; value: number }[];
}

export const uebaEntities: UEBAEntity[] = [
  {
    deviceId: 'DEV-005', deviceName: 'Smart Lock - Server Room', driftSigma: 4.2, status: 'alert',
    features: [
      { name: 'conn_rate', baseline: 5.2, current: 48.7, unit: '/hr' },
      { name: 'dns_entropy', baseline: 0.31, current: 2.87, unit: '' },
      { name: 'iat_mean', baseline: 120, current: 15, unit: 'ms' },
      { name: 'bytes_ratio', baseline: 0.8, current: 3.2, unit: '' },
      { name: 'off_hours', baseline: 0.05, current: 0.72, unit: '%' },
      { name: 'unique_dst', baseline: 3, current: 24, unit: '' },
    ],
    cusumHistory: [
      { day: 'Mar 3', value: 0.2 }, { day: 'Mar 4', value: 0.5 }, { day: 'Mar 5', value: 1.1 },
      { day: 'Mar 6', value: 1.8 }, { day: 'Mar 7', value: 2.5 }, { day: 'Mar 8', value: 3.4 }, { day: 'Mar 9', value: 4.2 },
    ],
  },
  {
    deviceId: 'DEV-004', deviceName: 'Medical Monitor', driftSigma: 2.8, status: 'drift',
    features: [
      { name: 'conn_rate', baseline: 8.1, current: 32.4, unit: '/hr' },
      { name: 'dns_entropy', baseline: 0.45, current: 1.92, unit: '' },
      { name: 'iat_mean', baseline: 200, current: 60, unit: 'ms' },
      { name: 'bytes_ratio', baseline: 1.0, current: 2.5, unit: '' },
      { name: 'off_hours', baseline: 0.1, current: 0.45, unit: '%' },
      { name: 'unique_dst', baseline: 5, current: 14, unit: '' },
    ],
    cusumHistory: [
      { day: 'Mar 3', value: 0.1 }, { day: 'Mar 4', value: 0.4 }, { day: 'Mar 5', value: 0.8 },
      { day: 'Mar 6', value: 1.2 }, { day: 'Mar 7', value: 1.7 }, { day: 'Mar 8', value: 2.3 }, { day: 'Mar 9', value: 2.8 },
    ],
  },
  {
    deviceId: 'DEV-012', deviceName: 'Infusion Pump', driftSigma: 3.6, status: 'alert',
    features: [
      { name: 'conn_rate', baseline: 2.0, current: 22.1, unit: '/hr' },
      { name: 'dns_entropy', baseline: 0.2, current: 2.1, unit: '' },
      { name: 'iat_mean', baseline: 300, current: 55, unit: 'ms' },
      { name: 'bytes_ratio', baseline: 0.5, current: 4.8, unit: '' },
      { name: 'off_hours', baseline: 0.02, current: 0.65, unit: '%' },
      { name: 'unique_dst', baseline: 2, current: 18, unit: '' },
    ],
    cusumHistory: [
      { day: 'Mar 3', value: 0.3 }, { day: 'Mar 4', value: 0.7 }, { day: 'Mar 5', value: 1.5 },
      { day: 'Mar 6', value: 2.1 }, { day: 'Mar 7', value: 2.6 }, { day: 'Mar 8', value: 3.1 }, { day: 'Mar 9', value: 3.6 },
    ],
  },
  {
    deviceId: 'DEV-010', deviceName: 'Smart Elevator Panel', driftSigma: 1.9, status: 'drift',
    features: [
      { name: 'conn_rate', baseline: 12.4, current: 28.9, unit: '/hr' },
      { name: 'dns_entropy', baseline: 0.55, current: 1.1, unit: '' },
      { name: 'iat_mean', baseline: 150, current: 80, unit: 'ms' },
      { name: 'bytes_ratio', baseline: 0.9, current: 1.8, unit: '' },
      { name: 'off_hours', baseline: 0.08, current: 0.3, unit: '%' },
      { name: 'unique_dst', baseline: 6, current: 11, unit: '' },
    ],
    cusumHistory: [
      { day: 'Mar 3', value: 0.1 }, { day: 'Mar 4', value: 0.3 }, { day: 'Mar 5', value: 0.6 },
      { day: 'Mar 6', value: 0.9 }, { day: 'Mar 7', value: 1.2 }, { day: 'Mar 8', value: 1.5 }, { day: 'Mar 9', value: 1.9 },
    ],
  },
  {
    deviceId: 'DEV-003', deviceName: 'Industrial PLC #1', driftSigma: 1.1, status: 'drift',
    features: [
      { name: 'conn_rate', baseline: 6.0, current: 11.2, unit: '/hr' },
      { name: 'dns_entropy', baseline: 0.3, current: 0.6, unit: '' },
      { name: 'iat_mean', baseline: 250, current: 180, unit: 'ms' },
      { name: 'bytes_ratio', baseline: 0.7, current: 1.1, unit: '' },
      { name: 'off_hours', baseline: 0.15, current: 0.28, unit: '%' },
      { name: 'unique_dst', baseline: 4, current: 7, unit: '' },
    ],
    cusumHistory: [
      { day: 'Mar 3', value: 0.0 }, { day: 'Mar 4', value: 0.1 }, { day: 'Mar 5', value: 0.3 },
      { day: 'Mar 6', value: 0.5 }, { day: 'Mar 7', value: 0.7 }, { day: 'Mar 8', value: 0.9 }, { day: 'Mar 9', value: 1.1 },
    ],
  },
];

// ── KILL CHAIN ──
export type ATTACKTactic = 'Reconnaissance' | 'Initial Access' | 'Execution' | 'Persistence' | 'Privilege Escalation' | 'Defense Evasion' | 'Credential Access' | 'Discovery' | 'Lateral Movement' | 'Collection' | 'Command & Control' | 'Exfiltration' | 'Impact';

export interface KillChainStage {
  tactic: ATTACKTactic;
  technique: string;
  deviceId: string;
  timestamp: string;
  confirmed: boolean;
}

export interface KillChain {
  id: string;
  name: string;
  severity: 'high' | 'critical';
  stages: KillChainStage[];
  devices: string[];
  startTime: string;
  duration: string;
  status: 'active' | 'contained' | 'resolved';
}

export const killChains: KillChain[] = [
  {
    id: 'KC-001', name: 'Server Room Lock Compromise', severity: 'critical', status: 'active',
    startTime: '2026-03-09T04:58:00Z', duration: '8h 34m', devices: ['DEV-005', 'DEV-010', 'DEV-012'],
    stages: [
      { tactic: 'Reconnaissance', technique: 'Port Scanning', deviceId: 'DEV-005', timestamp: '2026-03-09T04:58:00Z', confirmed: true },
      { tactic: 'Initial Access', technique: 'Exploit Public-Facing App (CVE-2024-11382)', deviceId: 'DEV-005', timestamp: '2026-03-09T05:00:00Z', confirmed: true },
      { tactic: 'Credential Access', technique: 'LDAP Credential Dump', deviceId: 'DEV-005', timestamp: '2026-03-09T05:15:00Z', confirmed: true },
      { tactic: 'Lateral Movement', technique: 'Remote Service Exploitation', deviceId: 'DEV-010', timestamp: '2026-03-09T06:30:00Z', confirmed: true },
      { tactic: 'Command & Control', technique: 'Tor Proxy', deviceId: 'DEV-005', timestamp: '2026-03-09T07:00:00Z', confirmed: true },
      { tactic: 'Exfiltration', technique: 'Exfiltration Over C2 Channel', deviceId: 'DEV-005', timestamp: '2026-03-09T07:45:00Z', confirmed: false },
    ],
  },
  {
    id: 'KC-002', name: 'Medical Device Ransomware', severity: 'critical', status: 'active',
    startTime: '2026-03-09T02:00:00Z', duration: '11h 30m', devices: ['DEV-012', 'DEV-004'],
    stages: [
      { tactic: 'Initial Access', technique: 'Unauthorized Firmware Update', deviceId: 'DEV-012', timestamp: '2026-03-09T02:00:00Z', confirmed: true },
      { tactic: 'Execution', technique: 'SNMP Write Exploitation', deviceId: 'DEV-012', timestamp: '2026-03-09T02:15:00Z', confirmed: true },
      { tactic: 'Persistence', technique: 'Create Account (svc_backup)', deviceId: 'DEV-012', timestamp: '2026-03-09T02:30:00Z', confirmed: true },
      { tactic: 'Command & Control', technique: 'DNS Tunneling to C2', deviceId: 'DEV-012', timestamp: '2026-03-09T03:00:00Z', confirmed: true },
      { tactic: 'Impact', technique: 'Data Encrypted for Impact (LockBit 3.0)', deviceId: 'DEV-012', timestamp: '2026-03-09T03:30:00Z', confirmed: true },
      { tactic: 'Lateral Movement', technique: 'Beaconing to Adjacent Device', deviceId: 'DEV-004', timestamp: '2026-03-09T06:30:00Z', confirmed: false },
    ],
  },
];

export const attackHeatmap: { tactic: ATTACKTactic; detections: number }[] = [
  { tactic: 'Reconnaissance', detections: 8 },
  { tactic: 'Initial Access', detections: 4 },
  { tactic: 'Execution', detections: 3 },
  { tactic: 'Persistence', detections: 2 },
  { tactic: 'Privilege Escalation', detections: 1 },
  { tactic: 'Defense Evasion', detections: 0 },
  { tactic: 'Credential Access', detections: 3 },
  { tactic: 'Discovery', detections: 6 },
  { tactic: 'Lateral Movement', detections: 5 },
  { tactic: 'Collection', detections: 1 },
  { tactic: 'Command & Control', detections: 7 },
  { tactic: 'Exfiltration', detections: 4 },
  { tactic: 'Impact', detections: 2 },
];

// ── LOG EXPLORER ──
export interface LogEvent {
  id: string;
  timestamp: string;
  deviceId: string;
  eventType: string;
  severity: 'info' | 'warning' | 'high' | 'critical';
  message: string;
  raw: Record<string, unknown>;
}

function generateLogEvents(): LogEvent[] {
  const types = ['trust_update', 'policy_violation', 'dns_query', 'connection', 'firmware_check', 'auth_attempt', 'config_change', 'scan_detected'];
  const sevs: LogEvent['severity'][] = ['info', 'warning', 'high', 'critical'];
  const events: LogEvent[] = [];
  const devIds = devices.map(d => d.id);
  const base = new Date('2026-03-09T14:00:00Z');
  for (let i = 0; i < 50; i++) {
    const t = new Date(base.getTime() - i * 60000 * (1 + Math.random() * 3));
    const devId = devIds[Math.floor(Math.random() * devIds.length)];
    const evtType = types[Math.floor(Math.random() * types.length)];
    const sev = sevs[Math.floor(Math.random() * sevs.length)];
    events.push({
      id: `LOG-${String(i + 1).padStart(3, '0')}`,
      timestamp: t.toISOString(),
      deviceId: devId,
      eventType: evtType,
      severity: sev,
      message: `${evtType.replace(/_/g, ' ')} on ${devId}`,
      raw: { src_ip: `192.168.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 255)}`, dst_port: [22, 80, 443, 8080, 5022][Math.floor(Math.random() * 5)], bytes: Math.floor(Math.random() * 50000), protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)] },
    });
  }
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const logEvents: LogEvent[] = generateLogEvents();

export const logHistogram = Array.from({ length: 60 }, (_, i) => ({
  minute: `${String(13 + Math.floor(i / 60)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
  count: Math.floor(Math.random() * 25) + 1,
}));

// ── COMPLIANCE ──
export type ComplianceStatus = 'pass' | 'fail' | 'partial';

export interface ComplianceControl {
  id: string;
  function: string;
  requirement: string;
  status: ComplianceStatus;
  score: number;
}

export const complianceControls: ComplianceControl[] = [
  { id: 'ID.AM-1', function: 'Identify', requirement: 'Physical devices inventoried', status: 'pass', score: 95 },
  { id: 'ID.AM-2', function: 'Identify', requirement: 'Software platforms mapped', status: 'pass', score: 88 },
  { id: 'ID.RA-1', function: 'Identify', requirement: 'Asset vulnerabilities identified', status: 'partial', score: 62 },
  { id: 'PR.AC-1', function: 'Protect', requirement: 'Identities & credentials managed', status: 'pass', score: 82 },
  { id: 'PR.AC-4', function: 'Protect', requirement: 'Access permissions managed', status: 'pass', score: 78 },
  { id: 'PR.DS-1', function: 'Protect', requirement: 'Data-at-rest protected', status: 'fail', score: 35 },
  { id: 'PR.IP-1', function: 'Protect', requirement: 'Baseline config maintained', status: 'partial', score: 55 },
  { id: 'DE.AE-1', function: 'Detect', requirement: 'Network operations baseline', status: 'pass', score: 95 },
  { id: 'DE.CM-1', function: 'Detect', requirement: 'Network monitored for events', status: 'pass', score: 98 },
  { id: 'DE.CM-7', function: 'Detect', requirement: 'Unauthorized activity monitored', status: 'pass', score: 92 },
  { id: 'DE.DP-4', function: 'Detect', requirement: 'Event detection communicated', status: 'pass', score: 85 },
  { id: 'RS.RP-1', function: 'Respond', requirement: 'Response plan executed', status: 'fail', score: 28 },
  { id: 'RS.CO-2', function: 'Respond', requirement: 'Incidents reported', status: 'fail', score: 32 },
  { id: 'RS.AN-1', function: 'Respond', requirement: 'Notifications from detection', status: 'partial', score: 45 },
  { id: 'RC.RP-1', function: 'Recover', requirement: 'Recovery plan executed', status: 'fail', score: 15 },
  { id: 'RC.CO-3', function: 'Recover', requirement: 'Recovery activities communicated', status: 'fail', score: 25 },
];

export const complianceFunctions = [
  { name: 'Identify', score: 78, color: '#3B82F6' },
  { name: 'Protect', score: 61, color: '#8B5CF6' },
  { name: 'Detect', score: 91, color: '#10B981' },
  { name: 'Respond', score: 34, color: '#F59E0B' },
  { name: 'Recover', score: 22, color: '#EF4444' },
];

export const overallComplianceScore = 72;

// ── SOC WORKBENCH ──
export type PlaybookStepStatus = 'done' | 'active' | 'pending' | 'failed';

export interface PlaybookStep {
  id: string;
  label: string;
  status: PlaybookStepStatus;
}

export interface SOCQueueItem {
  incidentId: string;
  deviceId: string;
  severity: IncidentSeverity;
  assignedTo: string;
  playbook: string;
  steps: PlaybookStep[];
  notes: string;
}

export const socQueue: SOCQueueItem[] = [
  {
    incidentId: 'INC-001', deviceId: 'DEV-005', severity: 'critical', assignedTo: 'jitraj_esh', playbook: 'VLAN_ISOLATION',
    steps: [
      { id: 'S1', label: 'Confirm anomaly source', status: 'done' },
      { id: 'S2', label: 'Isolate device to VLAN 99', status: 'active' },
      { id: 'S3', label: 'Notify NOC team', status: 'pending' },
      { id: 'S4', label: 'File incident report', status: 'pending' },
    ],
    notes: '# Investigation Notes\nDevice contacted Tor exit node at 13:00. Confirmed lateral movement to DEV-010.',
  },
  {
    incidentId: 'INC-003', deviceId: 'DEV-012', severity: 'critical', assignedTo: 'jitraj_esh', playbook: 'RANSOMWARE_RESPONSE',
    steps: [
      { id: 'S1', label: 'Isolate device immediately', status: 'done' },
      { id: 'S2', label: 'Capture memory dump', status: 'done' },
      { id: 'S3', label: 'Block C2 domains at firewall', status: 'active' },
      { id: 'S4', label: 'Factory reset device', status: 'pending' },
      { id: 'S5', label: 'Restore from known-good firmware', status: 'pending' },
    ],
    notes: '# Ransomware Analysis\nLockBit 3.0 pattern confirmed. Admin account "svc_backup" created via SNMP.',
  },
  {
    incidentId: 'INC-002', deviceId: 'DEV-004', severity: 'high', assignedTo: 'jitraj_esh', playbook: 'NETWORK_SEGMENTATION',
    steps: [
      { id: 'S1', label: 'Analyze C2 beaconing pattern', status: 'done' },
      { id: 'S2', label: 'Apply network segmentation', status: 'pending' },
      { id: 'S3', label: 'Deploy deep packet inspection', status: 'pending' },
    ],
    notes: '',
  },
  {
    incidentId: 'INC-004', deviceId: 'DEV-010', severity: 'high', assignedTo: 'jitraj_esh', playbook: 'CONFIG_ROLLBACK',
    steps: [
      { id: 'S1', label: 'Review config diff', status: 'done' },
      { id: 'S2', label: 'Rollback to last known-good', status: 'pending' },
      { id: 'S3', label: 'Audit access permissions', status: 'pending' },
    ],
    notes: '',
  },
];

export const auditLog = [
  { time: '14:31', analyst: 'jitraj_esh', action: 'Cleared INC-006 — confirmed false positive' },
  { time: '14:28', analyst: 'jitraj_esh', action: 'Executed Step 1 on INC-001 (Confirm anomaly)' },
  { time: '14:15', analyst: 'jitraj_esh', action: 'Assigned INC-004 to self from queue' },
  { time: '13:50', analyst: 'system', action: 'Auto-isolated DEV-005 via policy trigger' },
  { time: '13:10', analyst: 'system', action: 'Auto-isolated DEV-012 via ransomware detection' },
  { time: '12:45', analyst: 'jitraj_esh', action: 'Opened SOC Workbench session' },
];

// ── SIEM LAYER STATUS ──
export const siemLayerStatus = [
  { layer: 'Layer 1', name: 'Network', status: 'live' as const, detail: 'All flows monitored', color: '#1A56DB' },
  { layer: 'Layer 2', name: 'UEBA', status: 'live' as const, detail: `${uebaEntities.filter(e => e.status === 'alert').length} alert(s)`, color: '#7E3AF2' },
  { layer: 'Layer 3', name: 'Correlation', status: 'warning' as const, detail: `${killChains.filter(k => k.status === 'active').length} active chain(s)`, color: '#E02424' },
  { layer: 'Threat Intel', name: 'IOC Feed', status: 'alert' as const, detail: `${iocs.filter(i => i.hits > 0).length} IOC hit(s)`, color: '#FF5A1F' },
];

// ── CORRELATED ALERTS ──
export interface CorrelatedAlert {
  id: string;
  layers: string[];
  deviceId: string;
  deviceName: string;
  severity: 'high' | 'critical';
  message: string;
  timestamp: string;
}

export const correlatedAlerts: CorrelatedAlert[] = [
  { id: 'CA-001', layers: ['L1', 'L2', 'L3'], deviceId: 'DEV-005', deviceName: 'Smart Lock', severity: 'critical', message: '3-layer correlated — Tor contact + behavioral drift + kill chain progression', timestamp: '2026-03-09T13:32:00Z' },
  { id: 'CA-002', layers: ['L1', 'L3'], deviceId: 'DEV-012', deviceName: 'Infusion Pump', severity: 'critical', message: 'Network anomaly + ransomware kill chain active', timestamp: '2026-03-09T09:18:00Z' },
  { id: 'CA-003', layers: ['L1', 'L2'], deviceId: 'DEV-004', deviceName: 'Medical Monitor', severity: 'high', message: 'Network + UEBA drift — C2 beaconing with behavioral anomaly', timestamp: '2026-03-09T12:05:00Z' },
];