import { useState, useRef, useCallback, useEffect } from 'react';
import { Terminal, Trash2, ChevronUp, ChevronDown, ChevronRight, PanelRightClose, PanelRightOpen } from 'lucide-react';
import {
  devices, incidents, initialAlerts, iocs, uebaEntities, killChains,
  complianceFunctions, overallComplianceScore, socQueue, auditLog, siemLayerStatus
} from '../data/mockData';

// ── Types ──
type OutputLine = { text: string; color?: string; bold?: boolean };

// ── Command Processor ──
function handleCommand(input: string): OutputLine[] {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  if (!cmd) return [{ text: 'Type a command. Use "help" to get started.', color: '#8B8FA3' }];

  if (cmd === 'help') {
    return [
      { text: 'Sentinel CLI — Command Reference', color: '#FF5A1F', bold: true },
      { text: '' },
      { text: '  SYSTEM', color: '#8B8FA3', bold: true },
      { text: '  sentinel status                   System health check', color: '#4BDE80' },
      { text: '  sentinel stats                    Full system statistics', color: '#4BDE80' },
      { text: '  sentinel layers                   Pipeline layer status', color: '#4BDE80' },
      { text: '' },
      { text: '  DEVICES', color: '#8B8FA3', bold: true },
      { text: '  sentinel devices list              List all devices (sorted by trust)', color: '#3B82F6' },
      { text: '  sentinel devices get <id>          Device detail', color: '#3B82F6' },
      { text: '  sentinel devices scores <id>       Sub-scores breakdown', color: '#3B82F6' },
      { text: '  sentinel devices incidents <id>    Incidents for device', color: '#3B82F6' },
      { text: '' },
      { text: '  INCIDENTS', color: '#8B8FA3', bold: true },
      { text: '  sentinel incidents list             List all incidents', color: '#F59E0B' },
      { text: '  sentinel incidents get <id>         Incident detail', color: '#F59E0B' },
      { text: '  sentinel incidents narrative <id>   AI narrative', color: '#F59E0B' },
      { text: '  sentinel incidents evidence <id>    Evidence items', color: '#F59E0B' },
      { text: '' },
      { text: '  ALERTS', color: '#8B8FA3', bold: true },
      { text: '  sentinel alerts list                Recent alerts', color: '#E02424' },
      { text: '' },
      { text: '  THREAT INTEL', color: '#8B8FA3', bold: true },
      { text: '  sentinel ti list                    IOC feed', color: '#FF5A1F' },
      { text: '  sentinel ti check <value>           Check IOC blocklist', color: '#FF5A1F' },
      { text: '' },
      { text: '  UEBA', color: '#8B8FA3', bold: true },
      { text: '  sentinel ueba list                  Entity drift scores', color: '#7E3AF2' },
      { text: '  sentinel ueba get <id>              Entity UEBA profile', color: '#7E3AF2' },
      { text: '' },
      { text: '  KILL CHAIN', color: '#8B8FA3', bold: true },
      { text: '  sentinel killchain list             Active kill chains', color: '#E02424' },
      { text: '  sentinel killchain get <id>         Chain detail', color: '#E02424' },
      { text: '' },
      { text: '  LOG EXPLORER', color: '#8B8FA3', bold: true },
      { text: '  sentinel logs tail                  Log tail preview', color: '#8B8FA3' },
      { text: '' },
      { text: '  COMPLIANCE', color: '#8B8FA3', bold: true },
      { text: '  sentinel compliance status          Compliance posture', color: '#8B5CF6' },
      { text: '' },
      { text: '  SOC', color: '#8B8FA3', bold: true },
      { text: '  sentinel soc queue                  Analyst queue', color: '#10B981' },
      { text: '  sentinel soc audit-log              Audit trail', color: '#10B981' },
      { text: '' },
      { text: '  MODEL', color: '#8B8FA3', bold: true },
      { text: '  sentinel model info                 ML model details', color: '#1A56DB' },
      { text: '' },
      { text: '  DEMO', color: '#8B8FA3', bold: true },
      { text: '  sentinel demo list                  Available demo scenarios', color: '#FFB347' },
      { text: '' },
      { text: '  UTILITY', color: '#8B8FA3', bold: true },
      { text: '  clear                               Clear terminal', color: '#8B8FA3' },
    ];
  }

  // Allow "sentinel ..." prefix or direct command
  const effectiveCmd = cmd === 'sentinel' ? parts[1]?.toLowerCase() : cmd;
  const effectiveSub = cmd === 'sentinel' ? parts[2]?.toLowerCase() : parts[1]?.toLowerCase();
  const effectiveArg = cmd === 'sentinel' ? parts[3] : parts[2];

  if (!effectiveCmd) return [{ text: 'Usage: sentinel <command>. Type "help" for list.', color: '#F59E0B' }];

  // ── status ──
  if (effectiveCmd === 'status') {
    return [
      { text: '✅ API         : http://localhost:8000  [healthy]', color: '#4BDE80' },
      { text: '✅ Database    : PostgreSQL 16.x        [connected]', color: '#4BDE80' },
      { text: '✅ Redis Cache : 127.0.0.1:6379        [connected]', color: '#4BDE80' },
      { text: '✅ WebSocket   : ws://localhost:8000/ws [active]', color: '#4BDE80' },
      { text: '✅ ML Model    : Isolation Forest       [loaded, threshold=-0.3197]', color: '#4BDE80' },
    ];
  }

  // ── stats ──
  if (effectiveCmd === 'stats') {
    const critical = devices.filter(d => d.riskLevel === 'critical').length;
    const high = devices.filter(d => d.riskLevel === 'high').length;
    const open = incidents.filter(i => i.status === 'open').length;
    return [
      { text: '── System Statistics ──', color: '#FF5A1F', bold: true },
      { text: `  Total Devices     : ${devices.length}` },
      { text: `  Critical Risk     : ${critical}`, color: critical > 0 ? '#FF4C4C' : '#4BDE80' },
      { text: `  High Risk         : ${high}`, color: high > 0 ? '#FF6B35' : '#4BDE80' },
      { text: `  Open Incidents    : ${open}`, color: open > 0 ? '#F59E0B' : '#4BDE80' },
      { text: `  Active Alerts     : ${initialAlerts.length}` },
      { text: `  Active IOCs       : ${iocs.filter(i => i.active).length}` },
      { text: `  Kill Chains       : ${killChains.filter(k => k.status === 'active').length} active` },
      { text: `  Compliance Score  : ${overallComplianceScore}/100` },
    ];
  }

  // ── layers ──
  if (effectiveCmd === 'layers') {
    return [
      { text: '── Pipeline Layer Status ──', color: '#FF5A1F', bold: true },
      ...siemLayerStatus.map(l => {
        const icon = l.status === 'live' ? '✅' : l.status === 'warning' ? '⚠️' : '🚨';
        const clr = l.status === 'live' ? '#4BDE80' : l.status === 'warning' ? '#F59E0B' : '#FF4C4C';
        return { text: `  ${icon} ${l.layer.padEnd(16)} ${l.status.toUpperCase().padEnd(10)} ${l.detail}`, color: clr };
      }),
    ];
  }

  // ── devices ──
  if (effectiveCmd === 'devices') {
    if (!effectiveSub || effectiveSub === 'list') {
      const sorted = [...devices].sort((a, b) => a.trustScore - b.trustScore);
      return [
        { text: 'DEVICE ID    CLASS             VENDOR          IP               TRUST   RISK       STATUS', color: '#8B8FA3', bold: true },
        { text: '─'.repeat(92), color: '#2A2A3A' },
        ...sorted.map(d => ({
          text: `${d.id.padEnd(13)}${d.class.padEnd(18)}${d.vendor.padEnd(16)}${d.ip.padEnd(17)}${String(d.trustScore).padEnd(8)}${d.riskLevel.toUpperCase().padEnd(11)}${d.status.toUpperCase()}`,
          color: d.riskLevel === 'critical' ? '#FF4C4C' : d.riskLevel === 'high' ? '#FF6B35' : d.riskLevel === 'medium' ? '#FFB347' : '#4BDE80',
        })),
      ];
    }
    if (effectiveSub === 'get' && effectiveArg) {
      const dev = devices.find(d => d.id.toLowerCase() === effectiveArg.toLowerCase() || d.name.toLowerCase().includes(effectiveArg.toLowerCase()));
      if (!dev) return [{ text: `Device "${effectiveArg}" not found.`, color: '#FF4C4C' }];
      return [
        { text: `┌──────────────────────────────────────────────────────────┐`, color: '#3B82F6' },
        { text: `│  DEVICE  ${dev.id.padEnd(47)}│`, color: '#3B82F6', bold: true },
        { text: `├──────────────────────────────────────────────────────────┤`, color: '#3B82F6' },
        { text: `│  Name        : ${dev.name}` },
        { text: `│  Class       : ${dev.class}` },
        { text: `│  Vendor      : ${dev.vendor}` },
        { text: `│  IP          : ${dev.ip}` },
        { text: `│  MAC         : ${dev.mac}` },
        { text: `│  Trust Score : ${dev.trustScore}`, color: dev.trustScore < 40 ? '#FF4C4C' : dev.trustScore < 65 ? '#FFB347' : '#4BDE80' },
        { text: `│  Risk Level  : ${dev.riskLevel.toUpperCase()}` },
        { text: `│  Status      : ${dev.status.toUpperCase()}` },
        { text: `│  Last Seen   : ${new Date(dev.lastSeen).toLocaleString()}` },
        { text: `├──────────────────────────────────────────────────────────┤`, color: '#3B82F6' },
        { text: `│  SUB-SCORES` , color: '#8B8FA3', bold: true },
        { text: `│  Behavioral  : ${dev.behavioral}  Policy: ${dev.policy}  Drift: ${dev.drift}  Threat: ${dev.threat}` },
        { text: `└──────────────────────────────────────────────────────────┘`, color: '#3B82F6' },
      ];
    }
    if (effectiveSub === 'scores' && effectiveArg) {
      const dev = devices.find(d => d.id.toLowerCase() === effectiveArg.toLowerCase());
      if (!dev) return [{ text: `Device "${effectiveArg}" not found.`, color: '#FF4C4C' }];
      const bar = (v: number) => '█'.repeat(Math.round(v / 5)) + '░'.repeat(20 - Math.round(v / 5));
      return [
        { text: `── Sub-Scores: ${dev.id} ──`, color: '#3B82F6', bold: true },
        { text: `  Behavioral  : ${bar(dev.behavioral)}  ${dev.behavioral}`, color: dev.behavioral < 40 ? '#FF4C4C' : '#4BDE80' },
        { text: `  Policy      : ${bar(dev.policy)}  ${dev.policy}`, color: dev.policy < 40 ? '#FF4C4C' : '#4BDE80' },
        { text: `  Drift       : ${bar(dev.drift)}  ${dev.drift}`, color: dev.drift < 40 ? '#FF4C4C' : '#4BDE80' },
        { text: `  Threat      : ${bar(dev.threat)}  ${dev.threat}`, color: dev.threat < 40 ? '#FF4C4C' : '#4BDE80' },
      ];
    }
    if (effectiveSub === 'incidents' && effectiveArg) {
      const devIncs = incidents.filter(i => i.deviceId.toLowerCase() === effectiveArg.toLowerCase());
      if (devIncs.length === 0) return [{ text: `No incidents for "${effectiveArg}".`, color: '#4BDE80' }];
      return [
        { text: `── Incidents for ${effectiveArg.toUpperCase()} (${devIncs.length}) ──`, color: '#F59E0B', bold: true },
        ...devIncs.map(i => ({
          text: `  ${i.id.padEnd(12)} ${i.status.toUpperCase().padEnd(14)} ${i.riskLevel.toUpperCase().padEnd(10)} ${i.confidence}% confidence`,
          color: i.riskLevel === 'critical' ? '#FF4C4C' : i.riskLevel === 'high' ? '#FF6B35' : '#FFB347',
        })),
      ];
    }
    return [{ text: 'Usage: sentinel devices [list|get <id>|scores <id>|incidents <id>]', color: '#F59E0B' }];
  }

  // ── incidents ──
  if (effectiveCmd === 'incidents') {
    if (!effectiveSub || effectiveSub === 'list') {
      return [
        { text: 'ID              STATUS          DEVICE       RISK         CONFIDENCE', color: '#8B8FA3', bold: true },
        { text: '─'.repeat(70), color: '#2A2A3A' },
        ...incidents.map(i => ({
          text: `${i.id.padEnd(16)}${i.status.toUpperCase().padEnd(16)}${i.deviceId.padEnd(13)}${i.riskLevel.toUpperCase().padEnd(13)}${i.confidence}%`,
          color: i.riskLevel === 'critical' ? '#FF4C4C' : i.riskLevel === 'high' ? '#FF6B35' : '#FFB347',
        })),
      ];
    }
    if (effectiveSub === 'get' && effectiveArg) {
      const inc = incidents.find(i => i.id.toLowerCase() === effectiveArg.toLowerCase());
      if (!inc) return [{ text: `Incident "${effectiveArg}" not found.`, color: '#FF4C4C' }];
      return [
        { text: `┌──────────────────────────────────────────────────────────┐`, color: '#F59E0B' },
        { text: `│  INCIDENT  ${inc.id.padEnd(20)}[${inc.status.toUpperCase()}]${' '.repeat(Math.max(0, 12 - inc.status.length))}│`, color: '#F59E0B', bold: true },
        { text: `├──────────────────────────────────────────────────────────┤`, color: '#F59E0B' },
        { text: `│  Device     : ${inc.deviceId} (${inc.vendor})` },
        { text: `│  IP         : ${inc.ip}` },
        { text: `│  Trust Score: ${inc.trustScore}  →  ${inc.riskLevel.toUpperCase()}`, color: inc.trustScore < 40 ? '#FF4C4C' : '#FFB347' },
        { text: `│  Confidence : ${inc.confidence}%` },
        { text: `│  Created    : ${new Date(inc.createdAt).toLocaleString()}` },
        { text: `├──────────────────────────────────────────────────────────┤`, color: '#F59E0B' },
        { text: `│  NARRATIVE`, color: '#8B8FA3', bold: true },
        { text: `│  ${inc.narrative}` },
        { text: `├──────────────────────────────────────────────────────────┤`, color: '#F59E0B' },
        { text: `│  ACTION: ${inc.recommendedAction}`, color: '#FF6B35' },
        { text: `└──────────────────────────────────────────────────────────┘`, color: '#F59E0B' },
      ];
    }
    if (effectiveSub === 'narrative' && effectiveArg) {
      const inc = incidents.find(i => i.id.toLowerCase() === effectiveArg.toLowerCase());
      if (!inc) return [{ text: `Incident "${effectiveArg}" not found.`, color: '#FF4C4C' }];
      return [
        { text: `── Narrative: ${inc.id} ──`, color: '#F59E0B', bold: true },
        { text: '' },
        { text: inc.narrative },
      ];
    }
    if (effectiveSub === 'evidence' && effectiveArg) {
      const inc = incidents.find(i => i.id.toLowerCase() === effectiveArg.toLowerCase());
      if (!inc) return [{ text: `Incident "${effectiveArg}" not found.`, color: '#FF4C4C' }];
      return [
        { text: `── Evidence: ${inc.id} (${inc.evidence.length} items) ──`, color: '#F59E0B', bold: true },
        ...inc.evidence.map((e, idx) => ({ text: `  ${idx + 1}. ${e}` })),
      ];
    }
    return [{ text: 'Usage: sentinel incidents [list|get <id>|narrative <id>|evidence <id>]', color: '#F59E0B' }];
  }

  // ── alerts ──
  if (effectiveCmd === 'alerts') {
    return [
      { text: `── Recent Alerts (${initialAlerts.length}) ──`, color: '#E02424', bold: true },
      { text: '' },
      ...initialAlerts.map(a => ({
        text: `  [${a.severity.toUpperCase().padEnd(8)}] ${a.type.replace(/_/g, ' ').padEnd(22)} ${a.deviceId.padEnd(10)} ${new Date(a.timestamp).toLocaleTimeString()}`,
        color: a.severity === 'critical' ? '#FF4C4C' : a.severity === 'warning' ? '#FFB347' : '#3B82F6',
      })),
    ];
  }

  // ── ti (threat intel) ──
  if (effectiveCmd === 'ti') {
    if (effectiveSub === 'check' && effectiveArg) {
      const match = iocs.find(i => i.value.toLowerCase().includes(effectiveArg.toLowerCase()));
      if (match) return [
        { text: '🚨 MATCH FOUND', color: '#FF4C4C', bold: true },
        { text: `  Value    : ${match.value}` },
        { text: `  Type     : ${match.type}` },
        { text: `  Severity : ${match.severity.toUpperCase()}`, color: match.severity === 'critical' ? '#FF4C4C' : '#FF6B35' },
        { text: `  Source   : ${match.source}` },
        { text: `  Hits     : ${match.hits}` },
        { text: `  Active   : ${match.active ? 'YES' : 'NO'}` },
        { text: `  First    : ${new Date(match.firstSeen).toLocaleString()}` },
        { text: `  Last     : ${new Date(match.lastSeen).toLocaleString()}` },
        ...(match.linkedDevices.length > 0 ? [{ text: `  Linked   : ${match.linkedDevices.join(', ')}` }] : []),
      ];
      return [{ text: `✅ No IOC match for "${effectiveArg}"`, color: '#4BDE80' }];
    }
    if (!effectiveSub || effectiveSub === 'list') {
      return [
        { text: `── IOC Feed (${iocs.length} indicators) ──`, color: '#FF5A1F', bold: true },
        { text: '' },
        { text: 'TYPE     VALUE                       SEVERITY   SOURCE   HITS   ACTIVE', color: '#8B8FA3', bold: true },
        { text: '─'.repeat(75), color: '#2A2A3A' },
        ...iocs.map(i => ({
          text: `${i.type.padEnd(9)}${i.value.padEnd(28)}${i.severity.toUpperCase().padEnd(11)}${i.source.padEnd(9)}${String(i.hits).padEnd(7)}${i.active ? '●' : '○'}`,
          color: i.severity === 'critical' ? '#FF4C4C' : i.severity === 'high' ? '#FF6B35' : '#FFB347',
        })),
      ];
    }
    return [{ text: 'Usage: sentinel ti [list|check <ip/domain/hash>]', color: '#F59E0B' }];
  }

  // ── ueba ──
  if (effectiveCmd === 'ueba') {
    if (!effectiveSub || effectiveSub === 'list') {
      return [
        { text: 'ENTITY          DRIFT σ     STATUS      FEATURES', color: '#8B8FA3', bold: true },
        { text: '─'.repeat(55), color: '#2A2A3A' },
        ...uebaEntities.map(e => ({
          text: `${e.deviceId.padEnd(16)}${e.driftSigma.toFixed(1).padEnd(12)}${e.status.toUpperCase().padEnd(12)}${e.features.length} features`,
          color: e.status === 'alert' ? '#FF4C4C' : e.status === 'drift' ? '#FFB347' : '#4BDE80',
        })),
      ];
    }
    if (effectiveSub === 'get' && effectiveArg) {
      const entity = uebaEntities.find(e => e.deviceId.toLowerCase() === effectiveArg.toLowerCase());
      if (!entity) return [{ text: `Entity "${effectiveArg}" not found.`, color: '#FF4C4C' }];
      return [
        { text: `┌── UEBA Profile: ${entity.deviceId} ──┐`, color: '#7E3AF2', bold: true },
        { text: `  Name        : ${entity.deviceName}` },
        { text: `  Drift σ     : ${entity.driftSigma.toFixed(2)}`, color: entity.driftSigma > 3 ? '#FF4C4C' : '#F59E0B' },
        { text: `  Status      : ${entity.status.toUpperCase()}` },
        { text: '' },
        { text: '  DRIFT FEATURES', color: '#8B8FA3', bold: true },
        { text: '  FEATURE            BASELINE    CURRENT     UNIT', color: '#8B8FA3' },
        { text: '  ' + '─'.repeat(50), color: '#2A2A3A' },
        ...entity.features.map(f => ({
          text: `  ${f.name.padEnd(20)} ${f.baseline.toFixed(1).padEnd(12)} ${f.current.toFixed(1).padEnd(12)} ${f.unit}`,
          color: Math.abs(f.current - f.baseline) > f.baseline * 0.5 ? '#FF4C4C' : undefined,
        })),
      ];
    }
    return [{ text: 'Usage: sentinel ueba [list|get <entity_id>]', color: '#F59E0B' }];
  }

  // ── killchain ──
  if (effectiveCmd === 'killchain') {
    if (effectiveSub === 'get' && effectiveArg) {
      const chain = killChains.find(k => k.id.toLowerCase() === effectiveArg.toLowerCase());
      if (!chain) return [{ text: `Kill chain "${effectiveArg}" not found.`, color: '#FF4C4C' }];
      return [
        { text: `┌── Kill Chain: ${chain.id} ──┐`, color: '#E02424', bold: true },
        { text: `  Name        : ${chain.name}` },
        { text: `  Severity    : ${chain.severity.toUpperCase()}`, color: chain.severity === 'critical' ? '#FF4C4C' : '#FF6B35' },
        { text: `  Status      : ${chain.status.toUpperCase()}` },
        { text: `  Start       : ${new Date(chain.startTime).toLocaleString()}` },
        { text: `  Duration    : ${chain.duration}` },
        { text: `  Devices     : ${chain.devices.join(', ')}` },
        { text: '' },
        { text: '  KILL CHAIN STAGES', color: '#8B8FA3', bold: true },
        { text: '  ' + '─'.repeat(65), color: '#2A2A3A' },
        ...chain.stages.map((s, idx) => ({
          text: `  ${idx + 1}. [${s.confirmed ? '✓' : '?'}] ${s.tactic.padEnd(22)} ${s.technique.padEnd(30)} ${s.deviceId}`,
          color: s.confirmed ? '#FF4C4C' : '#F59E0B',
        })),
      ];
    }
    if (!effectiveSub || effectiveSub === 'list') {
      return [
        { text: `── Kill Chains (${killChains.length}) ──`, color: '#E02424', bold: true },
        { text: '' },
        ...killChains.map(k => ({
          text: `  ${k.id.padEnd(12)} ${k.status.toUpperCase().padEnd(12)} ${k.severity.toUpperCase().padEnd(10)} stages: ${k.stages.length}  devices: ${k.devices.join(', ')}`,
          color: k.status === 'active' ? '#FF4C4C' : '#4BDE80',
        })),
        { text: '' },
        { text: '  Use "sentinel killchain get <id>" for detail.', color: '#8B8FA3' },
      ];
    }
    return [{ text: 'Usage: sentinel killchain [list|get <id>]', color: '#F59E0B' }];
  }

  // ── compliance ──
  if (effectiveCmd === 'compliance') {
    return [
      { text: `── Compliance Posture ── Overall Score: ${overallComplianceScore}/100`, color: '#8B5CF6', bold: true },
      { text: '' },
      { text: 'FUNCTION       SCORE   BAR', color: '#8B8FA3', bold: true },
      { text: '─'.repeat(55), color: '#2A2A3A' },
      ...complianceFunctions.map(f => ({
        text: `  ${f.name.padEnd(14)} ${String(f.score).padEnd(3)}/100  ${'█'.repeat(Math.round(f.score / 5))}${'░'.repeat(20 - Math.round(f.score / 5))}`,
        color: f.score >= 80 ? '#4BDE80' : f.score >= 60 ? '#FFB347' : '#FF4C4C',
      })),
    ];
  }

  // ── soc ──
  if (effectiveCmd === 'soc') {
    if (effectiveSub === 'audit-log') {
      return [
        { text: '── SOC Audit Log ──', color: '#10B981', bold: true },
        { text: '' },
        { text: 'TIME     ANALYST       ACTION', color: '#8B8FA3', bold: true },
        { text: '─'.repeat(65), color: '#2A2A3A' },
        ...auditLog.map(e => ({
          text: `  ${e.time.padEnd(9)} ${e.analyst.padEnd(13)} ${e.action}`,
        })),
      ];
    }
    if (!effectiveSub || effectiveSub === 'queue') {
      return [
        { text: '── SOC Analyst Queue ──', color: '#10B981', bold: true },
        { text: '' },
        { text: 'INCIDENT        SEVERITY     STATUS          ASSIGNED TO     PLAYBOOK', color: '#8B8FA3', bold: true },
        { text: '─'.repeat(75), color: '#2A2A3A' },
        ...socQueue.map(q => ({
          text: `${q.incidentId.padEnd(16)}${q.severity.toUpperCase().padEnd(13)}${q.steps.find(s => s.status === 'active')?.label.padEnd(16) || 'pending'.padEnd(16)}${(q.assignedTo || 'unassigned').padEnd(16)}${q.playbook}`,
          color: q.severity === 'critical' ? '#FF4C4C' : q.severity === 'high' ? '#FF6B35' : '#FFB347',
        })),
      ];
    }
    return [{ text: 'Usage: sentinel soc [queue|audit-log]', color: '#F59E0B' }];
  }

  // ── model ──
  if (effectiveCmd === 'model') {
    return [
      { text: '── ML Model Info ──', color: '#1A56DB', bold: true },
      { text: '' },
      { text: '  Algorithm      : Isolation Forest (scikit-learn)' },
      { text: '  Estimators     : 200' },
      { text: '  Contamination  : 0.05' },
      { text: '  Threshold      : -0.3197' },
      { text: '  Training Set   : CIC-IDS-2017 + CSE-CIC-IDS-2018 (benign)' },
      { text: '  Last Trained   : 2026-03-12 02:30:00 IST' },
      { text: '  Status         : loaded ✅', color: '#4BDE80' },
    ];
  }

  // ── demo ──
  if (effectiveCmd === 'demo') {
    return [
      { text: '── Available Demo Scenarios ──', color: '#FFB347', bold: true },
      { text: '' },
      { text: '  SCENARIO           DESCRIPTION', color: '#8B8FA3', bold: true },
      { text: '  ' + '─'.repeat(50), color: '#2A2A3A' },
      { text: '  hostel_attack      Full APT kill chain simulation' },
      { text: '  dns_exfil          DNS exfiltration detection' },
      { text: '  brute_force        Credential stuffing attack' },
      { text: '  insider_threat     Insider data theft scenario' },
      { text: '  normal             Normal benign traffic baseline' },
      { text: '' },
      { text: '  Usage: sentinel demo run <scenario> --watch', color: '#8B8FA3' },
      { text: '  (Backend required for live demo execution)', color: '#8B8FA3' },
    ];
  }

  // ── logs ──
  if (effectiveCmd === 'logs') {
    const now = new Date().toISOString();
    return [
      { text: '── Log Tail ──', color: '#8B8FA3', bold: true },
      { text: '' },
      { text: `  ${now} [INFO]  syslog_receiver  started on :1514` },
      { text: `  ${now} [INFO]  kafka_producer   connected to broker` },
      { text: `  ${now} [WARN]  parser_engine    unknown format (2 logs)`, color: '#F59E0B' },
      { text: `  ${now} [INFO]  enrichment       geoip resolved 14 IPs` },
      { text: `  ${now} [ALERT] rule_engine      sigma match: brute_force`, color: '#FF4C4C' },
      { text: `  ${now} [INFO]  indexer          48 events/sec throughput` },
      { text: `  ${now} [INFO]  retention        disk usage: 42% (18.2GB / 43.0GB)` },
      { text: '' },
      { text: '  Backend required for live tail. Connect with: sentinel watch', color: '#8B8FA3' },
    ];
  }

  if (effectiveCmd === 'clear') return [{ text: '__CLEAR__' }];

  return [{ text: `Unknown command: "${input}". Type "help" for available commands.`, color: '#FF4C4C' }];
}

// ── Quick Reference Data ──
const quickRef = [
  { group: 'System', cmds: ['sentinel status', 'sentinel stats', 'sentinel layers'] },
  { group: 'Devices', cmds: ['sentinel devices list', 'sentinel devices get <id>', 'sentinel devices scores <id>'] },
  { group: 'Incidents', cmds: ['sentinel incidents list', 'sentinel incidents get <id>', 'sentinel incidents narrative <id>'] },
  { group: 'Alerts', cmds: ['sentinel alerts list'] },
  { group: 'Threat Intel', cmds: ['sentinel ti list', 'sentinel ti check <value>'] },
  { group: 'UEBA', cmds: ['sentinel ueba list', 'sentinel ueba get <id>'] },
  { group: 'Kill Chain', cmds: ['sentinel killchain list', 'sentinel killchain get <id>'] },
  { group: 'Compliance', cmds: ['sentinel compliance status'] },
  { group: 'SOC', cmds: ['sentinel soc queue', 'sentinel soc audit-log'] },
  { group: 'Model', cmds: ['sentinel model info'] },
  { group: 'Demo', cmds: ['sentinel demo list'] },
  { group: 'Logs', cmds: ['sentinel logs tail'] },
];

// ── Component ──
export default function CLIPage() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<{ input: string; output: OutputLine[] }[]>([
    {
      input: '', output: [
        { text: '╔══════════════════════════════════════════════════════════════╗', color: '#FF5A1F' },
        { text: '║                                                              ║', color: '#FF5A1F' },
        { text: '║    Sentinel CLI  v1.0.0                                      ║', color: '#FF5A1F', bold: true },
        { text: '║    Interactive SIEM Terminal                                   ║', color: '#FF5A1F' },
        { text: '║    Type "help" to see all available commands                  ║', color: '#FF5A1F' },
        { text: '║                                                              ║', color: '#FF5A1F' },
        { text: '╚══════════════════════════════════════════════════════════════╝', color: '#FF5A1F' },
      ]
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = useCallback(() => {
    if (!command.trim()) return;
    const output = handleCommand(command);
    if (output.length === 1 && output[0].text === '__CLEAR__') {
      setHistory([]);
    } else {
      setHistory(prev => [...prev, { input: command, output }]);
    }
    setCmdHistory(prev => [command, ...prev].slice(0, 50));
    setHistoryIdx(-1);
    setCommand('');
  }, [command]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
        setHistoryIdx(next);
        setCommand(cmdHistory[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const next = historyIdx - 1;
        setHistoryIdx(next);
        setCommand(cmdHistory[next]);
      } else {
        setHistoryIdx(-1);
        setCommand('');
      }
    }
  };

  const insertCommand = (cmd: string) => {
    setCommand(cmd.replace(/ <.*>/g, ''));
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-full" style={{ color: '#E2E2E2' }}>
      {/* ── Main Terminal ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 lg:px-6 py-3 shrink-0" style={{ borderBottom: '1px solid #2A2A3A' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF5A1F, #FF8C42)' }}>
            <Terminal size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white">Sentinel CLI</h1>
            <p className="text-[10px]" style={{ color: '#8B8FA3' }}>Interactive SIEM terminal · v1.0.0 · {cmdHistory.length} commands in session</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistory([])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
              style={{ color: '#8B8FA3', border: '1px solid #2A2A3A' }}
              title="Clear terminal"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Clear</span>
            </button>
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
              style={{ color: '#8B8FA3', border: '1px solid #2A2A3A' }}
              title={sidebarOpen ? 'Hide reference' : 'Show reference'}
            >
              {sidebarOpen ? <PanelRightClose size={13} /> : <PanelRightOpen size={13} />}
              <span className="hidden sm:inline">Reference</span>
            </button>
          </div>
        </div>

        {/* Terminal Output */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 lg:px-6 py-3 font-mono text-xs"
          onClick={() => inputRef.current?.focus()}
          style={{ background: '#0A0A0A' }}
        >
          {history.map((entry, idx) => (
            <div key={idx} className="mb-3">
              {entry.input !== '' && (
                <div className="flex items-center gap-1 mb-1">
                  <span style={{ color: '#4BDE80' }}>sentinel</span>
                  <span style={{ color: '#8B8FA3' }}>❯</span>
                  <span className="text-white">{entry.input}</span>
                </div>
              )}
              {entry.output.map((line, li) => (
                <div
                  key={li}
                  className="leading-5 whitespace-pre"
                  style={{
                    color: line.color || '#E2E2E2',
                    fontWeight: line.bold ? 700 : 400,
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>
          ))}

          {/* Active cursor line */}
          <div className="flex items-center gap-1 opacity-60">
            <span style={{ color: '#4BDE80' }}>sentinel</span>
            <span style={{ color: '#8B8FA3' }}>❯</span>
            <span className="animate-pulse" style={{ color: '#4BDE80' }}>▊</span>
          </div>
        </div>

        {/* Input Bar */}
        <div
          className="flex items-center gap-2 px-4 lg:px-6 py-3 shrink-0"
          style={{ background: '#0E0E0E', borderTop: '1px solid #2A2A3A' }}
        >
          <span className="text-base font-bold" style={{ color: '#4BDE80' }}>❯</span>
          <input
            ref={inputRef}
            value={command}
            onChange={e => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="sentinel status"
            className="flex-1 bg-transparent font-mono text-sm outline-none"
            style={{ color: '#FFFFFF' }}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (cmdHistory.length > 0) {
                  const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
                  setHistoryIdx(next);
                  setCommand(cmdHistory[next]);
                }
              }}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/5 transition-colors"
              style={{ color: '#8B8FA3' }}
              title="Previous command"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={submit}
              className="px-3 h-7 rounded-md flex items-center justify-center text-xs font-medium text-white transition-all hover:opacity-90"
              style={{ background: '#FF5A1F' }}
            >
              Run
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Reference Sidebar ── */}
      {sidebarOpen && (
        <div
          className="hidden lg:flex flex-col w-64 shrink-0 overflow-y-auto"
          style={{ background: '#111111', borderLeft: '1px solid #2A2A3A' }}
        >
          <div className="px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #2A2A3A' }}>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quick Reference</h3>
            <p className="text-[10px] mt-0.5" style={{ color: '#8B8FA3' }}>Click to insert command</p>
          </div>
          <div className="p-2 space-y-0.5 overflow-y-auto">
            {quickRef.map(group => (
              <div key={group.group}>
                <button
                  onClick={() => setExpandedGroup(expandedGroup === group.group ? null : group.group)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:bg-white/5"
                  style={{ color: expandedGroup === group.group ? '#FF5A1F' : '#8B8FA3' }}
                >
                  <ChevronRight
                    size={11}
                    style={{
                      transform: expandedGroup === group.group ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.15s',
                    }}
                  />
                  {group.group}
                </button>
                {expandedGroup === group.group && (
                  <div className="ml-4 mb-1 space-y-0.5">
                    {group.cmds.map(cmd => (
                      <button
                        key={cmd}
                        onClick={() => insertCommand(cmd)}
                        className="w-full text-left px-2 py-1 rounded text-[10px] font-mono transition-all hover:bg-white/5 hover:text-[#4BDE80]"
                        style={{ color: '#E2E2E2' }}
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Keyboard shortcuts */}
          <div className="mt-auto px-3 py-3 shrink-0" style={{ borderTop: '1px solid #2A2A3A' }}>
            <p className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#8B8FA3' }}>Shortcuts</p>
            <div className="space-y-1">
              {[
                { key: 'Enter', desc: 'Execute command' },
                { key: '↑', desc: 'Previous command' },
                { key: '↓', desc: 'Next command' },
              ].map(s => (
                <div key={s.key} className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono" style={{ background: '#1A1A2E', color: '#8B8FA3', border: '1px solid #2A2A3A' }}>
                    {s.key}
                  </kbd>
                  <span className="text-[10px]" style={{ color: '#8B8FA3' }}>{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
