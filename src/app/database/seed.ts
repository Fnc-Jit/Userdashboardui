/**
 * Database Seed Script
 * Populates the database with initial data from mockData.ts
 * 
 * Usage:
 * - Run this script after creating the database schema
 * - This will insert all devices, incidents, alerts, and related data
 */

import type { DatabaseService } from './connection';
import { devices, incidents, initialAlerts } from '../data/mockData';

export async function seedDatabase(db: DatabaseService): Promise<void> {
  console.log('🌱 Starting database seed...');

  try {
    // Create default user first (needed for foreign key references)
    console.log('Creating default user...');
    await db.adapter.execute(`
      INSERT INTO users (id, email, full_name, role) 
      VALUES (
        'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        'analyst@iot-sentinel.io',
        'Security Analyst',
        'admin'
      )
      ON CONFLICT (email) DO NOTHING
    `);

    // Seed devices
    console.log(`Seeding ${devices.length} devices...`);
    for (const device of devices) {
      await db.adapter.execute(
        `
        INSERT INTO devices (
          id, name, class, vendor, trust_score, risk_level, status,
          last_seen, mac_address, ip_address, behavioral_score, policy_score,
          drift_score, threat_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          class = EXCLUDED.class,
          vendor = EXCLUDED.vendor,
          trust_score = EXCLUDED.trust_score,
          risk_level = EXCLUDED.risk_level,
          status = EXCLUDED.status,
          last_seen = EXCLUDED.last_seen,
          mac_address = EXCLUDED.mac_address,
          ip_address = EXCLUDED.ip_address,
          behavioral_score = EXCLUDED.behavioral_score,
          policy_score = EXCLUDED.policy_score,
          drift_score = EXCLUDED.drift_score,
          threat_score = EXCLUDED.threat_score
        `,
        [
          device.id,
          device.name,
          device.class,
          device.vendor,
          device.trustScore,
          device.riskLevel,
          device.status,
          device.lastSeen,
          device.mac,
          device.ip,
          device.behavioral,
          device.policy,
          device.drift,
          device.threat,
        ]
      );

      // Seed device trust history
      if (device.history && device.history.length > 0) {
        console.log(`  → Seeding ${device.history.length} history entries for ${device.id}...`);
        for (const historyEntry of device.history) {
          await db.adapter.execute(
            `
            INSERT INTO device_trust_history (
              device_id, trust_score, risk_level, recorded_at
            ) VALUES ($1, $2, $3, $4)
            `,
            [device.id, historyEntry.score, device.riskLevel, historyEntry.date + 'T12:00:00Z']
          );
        }
      }

      // Seed evidence
      if (device.evidence && device.evidence.length > 0) {
        console.log(`  → Seeding ${device.evidence.length} evidence entries for ${device.id}...`);
        for (const evidence of device.evidence) {
          await db.adapter.execute(
            `
            INSERT INTO evidence (
              id, device_id, type, severity, timestamp, details
            ) VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE SET
              type = EXCLUDED.type,
              severity = EXCLUDED.severity,
              timestamp = EXCLUDED.timestamp,
              details = EXCLUDED.details
            `,
            [evidence.id, device.id, evidence.type, evidence.severity, evidence.timestamp, evidence.details]
          );
        }
      }
    }

    // Seed incidents
    console.log(`Seeding ${incidents.length} incidents...`);
    for (const incident of incidents) {
      await db.adapter.execute(
        `
        INSERT INTO incidents (
          id, device_id, risk_level, severity, status, recommended_action,
          narrative, trust_score, confidence, vendor, ip_address, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          device_id = EXCLUDED.device_id,
          risk_level = EXCLUDED.risk_level,
          severity = EXCLUDED.severity,
          status = EXCLUDED.status,
          recommended_action = EXCLUDED.recommended_action,
          narrative = EXCLUDED.narrative,
          trust_score = EXCLUDED.trust_score,
          confidence = EXCLUDED.confidence,
          vendor = EXCLUDED.vendor,
          ip_address = EXCLUDED.ip_address
        `,
        [
          incident.id,
          incident.deviceId,
          incident.riskLevel,
          incident.severity,
          incident.status,
          incident.recommendedAction,
          incident.narrative,
          incident.trustScore,
          incident.confidence,
          incident.vendor,
          incident.ip,
          incident.createdAt,
        ]
      );

      // Seed incident evidence
      if (incident.evidence && incident.evidence.length > 0) {
        console.log(`  → Seeding ${incident.evidence.length} evidence entries for ${incident.id}...`);
        for (let i = 0; i < incident.evidence.length; i++) {
          await db.adapter.execute(
            `
            INSERT INTO incident_evidence (
              incident_id, evidence_description, sequence_order
            ) VALUES ($1, $2, $3)
            ON CONFLICT (incident_id, sequence_order) DO UPDATE SET
              evidence_description = EXCLUDED.evidence_description
            `,
            [incident.id, incident.evidence[i], i]
          );
        }
      }

      // Seed incident timeline
      if (incident.timeline && incident.timeline.length > 0) {
        console.log(`  → Seeding ${incident.timeline.length} timeline entries for ${incident.id}...`);
        for (let i = 0; i < incident.timeline.length; i++) {
          const timelineEntry = incident.timeline[i];
          await db.adapter.execute(
            `
            INSERT INTO incident_timeline (
              incident_id, time_offset, event_description, sequence_order
            ) VALUES ($1, $2, $3, $4)
            `,
            [incident.id, timelineEntry.time, timelineEntry.event, i]
          );
        }
      }

      // Seed adjacent devices
      if (incident.adjacentDevices && incident.adjacentDevices.length > 0) {
        console.log(`  → Seeding ${incident.adjacentDevices.length} adjacent devices for ${incident.id}...`);
        for (const adjacentDeviceId of incident.adjacentDevices) {
          await db.adapter.execute(
            `
            INSERT INTO incident_adjacent_devices (
              incident_id, device_id
            ) VALUES ($1, $2)
            ON CONFLICT (incident_id, device_id) DO NOTHING
            `,
            [incident.id, adjacentDeviceId]
          );
        }
      }
    }

    // Seed alerts
    console.log(`Seeding ${initialAlerts.length} alerts...`);
    for (const alert of initialAlerts) {
      await db.adapter.execute(
        `
        INSERT INTO alerts (
          id, type, device_id, message, timestamp, severity, is_read
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          type = EXCLUDED.type,
          device_id = EXCLUDED.device_id,
          message = EXCLUDED.message,
          timestamp = EXCLUDED.timestamp,
          severity = EXCLUDED.severity
        `,
        [alert.id, alert.type, alert.deviceId, alert.message, alert.timestamp, alert.severity, false]
      );
    }

    // Seed network topology nodes
    console.log('Seeding network topology...');
    
    // Gateway node
    await db.adapter.execute(
      `
      INSERT INTO network_nodes (
        id, node_type, position_x, position_y, trust_score, risk_level
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        position_x = EXCLUDED.position_x,
        position_y = EXCLUDED.position_y,
        trust_score = EXCLUDED.trust_score,
        risk_level = EXCLUDED.risk_level
      `,
      ['GATEWAY', 'gateway', 400, 260, 100, 'trusted']
    );

    // Device nodes (using pre-defined positions from TopologyPage.tsx)
    const nodePositions = [
      { id: 'DEV-001', x: 200, y: 80 },
      { id: 'DEV-002', x: 350, y: 50 },
      { id: 'DEV-003', x: 500, y: 80 },
      { id: 'DEV-004', x: 600, y: 150 },
      { id: 'DEV-005', x: 650, y: 260 },
      { id: 'DEV-006', x: 600, y: 370 },
      { id: 'DEV-007', x: 500, y: 440 },
      { id: 'DEV-008', x: 350, y: 470 },
      { id: 'DEV-009', x: 200, y: 440 },
      { id: 'DEV-010', x: 100, y: 370 },
      { id: 'DEV-011', x: 50, y: 260 },
      { id: 'DEV-012', x: 100, y: 150 },
    ];

    for (const pos of nodePositions) {
      const device = devices.find(d => d.id === pos.id);
      if (device) {
        await db.adapter.execute(
          `
          INSERT INTO network_nodes (
            id, node_type, position_x, position_y, trust_score, risk_level
          ) VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO UPDATE SET
            position_x = EXCLUDED.position_x,
            position_y = EXCLUDED.position_y,
            trust_score = EXCLUDED.trust_score,
            risk_level = EXCLUDED.risk_level
          `,
          [device.id, 'device', pos.x, pos.y, device.trustScore, device.riskLevel]
        );
      }
    }

    // Seed network edges (connections)
    const edges = [
      // Normal connections from gateway to all devices
      ...devices.map(d => ({ source: 'GATEWAY', target: d.id, type: 'normal', suspicious: false, label: null })),
      // Suspicious lateral movement
      { source: 'DEV-004', target: 'DEV-012', type: 'normal', suspicious: true, label: 'Lateral Movement' },
      { source: 'DEV-005', target: 'DEV-010', type: 'normal', suspicious: true, label: 'Suspicious' },
    ];

    for (const edge of edges) {
      await db.adapter.execute(
        `
        INSERT INTO network_edges (
          source_id, target_id, edge_type, is_suspicious, suspicious_label
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (source_id, target_id) DO UPDATE SET
          edge_type = EXCLUDED.edge_type,
          is_suspicious = EXCLUDED.is_suspicious,
          suspicious_label = EXCLUDED.suspicious_label
        `,
        [edge.source, edge.target, edge.type, edge.suspicious, edge.label]
      );
    }

    // Seed system settings
    console.log('Seeding system settings...');
    await db.adapter.execute(`
      INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
      VALUES 
        ('maintenance_mode', 'false', 'boolean', 'Enable system-wide maintenance mode'),
        ('maintenance_duration', '4h', 'string', 'Default maintenance duration'),
        ('alert_retention_days', '90', 'number', 'Number of days to retain alerts'),
        ('data_retention_days', '365', 'number', 'Number of days to retain historical data')
      ON CONFLICT (setting_key) DO NOTHING
    `);

    console.log('✅ Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

/**
 * Clear all data from the database
 */
export async function clearDatabase(db: DatabaseService): Promise<void> {
  console.log('🧹 Clearing database...');

  try {
    await db.adapter.execute('TRUNCATE TABLE analyst_notes CASCADE');
    await db.adapter.execute('TRUNCATE TABLE incident_adjacent_devices CASCADE');
    await db.adapter.execute('TRUNCATE TABLE incident_timeline CASCADE');
    await db.adapter.execute('TRUNCATE TABLE incident_evidence CASCADE');
    await db.adapter.execute('TRUNCATE TABLE incidents CASCADE');
    await db.adapter.execute('TRUNCATE TABLE evidence CASCADE');
    await db.adapter.execute('TRUNCATE TABLE device_trust_history CASCADE');
    await db.adapter.execute('TRUNCATE TABLE alerts CASCADE');
    await db.adapter.execute('TRUNCATE TABLE network_edges CASCADE');
    await db.adapter.execute('TRUNCATE TABLE network_nodes CASCADE');
    await db.adapter.execute('TRUNCATE TABLE devices CASCADE');
    await db.adapter.execute('TRUNCATE TABLE system_settings CASCADE');
    await db.adapter.execute('TRUNCATE TABLE user_notification_settings CASCADE');
    await db.adapter.execute('TRUNCATE TABLE audit_log CASCADE');

    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}
