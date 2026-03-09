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