-- IoT Sentinel Database Schema
-- PostgreSQL Compatible
-- Generated: March 9, 2026

-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'analyst', -- 'analyst', 'admin', 'viewer'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- DEVICES
-- ============================================================

CREATE TABLE IF NOT EXISTS devices (
  id VARCHAR(50) PRIMARY KEY, -- e.g., 'DEV-001'
  name VARCHAR(255) NOT NULL,
  class VARCHAR(100) NOT NULL, -- HVAC, Surveillance, Medical, OT/ICS, etc.
  vendor VARCHAR(100) NOT NULL,
  trust_score INTEGER NOT NULL CHECK (trust_score >= 0 AND trust_score <= 100),
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('trusted', 'low', 'medium', 'high', 'critical')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'isolated', 'maintenance')),
  last_seen TIMESTAMPTZ NOT NULL,
  mac_address VARCHAR(17) UNIQUE NOT NULL, -- AA:BB:CC:DD:EE:FF
  ip_address VARCHAR(45) NOT NULL, -- supports IPv4 and IPv6
  behavioral_score INTEGER CHECK (behavioral_score >= 0 AND behavioral_score <= 100),
  policy_score INTEGER CHECK (policy_score >= 0 AND policy_score <= 100),
  drift_score INTEGER CHECK (drift_score >= 0 AND drift_score <= 100),
  threat_score INTEGER CHECK (threat_score >= 0 AND threat_score <= 100),
  firmware_version VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_devices_risk_level ON devices(risk_level);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_class ON devices(class);
CREATE INDEX idx_devices_vendor ON devices(vendor);
CREATE INDEX idx_devices_trust_score ON devices(trust_score);
CREATE INDEX idx_devices_last_seen ON devices(last_seen);

-- ============================================================
-- DEVICE TRUST HISTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS device_trust_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(50) NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  trust_score INTEGER NOT NULL CHECK (trust_score >= 0 AND trust_score <= 100),
  risk_level VARCHAR(20) NOT NULL,
  behavioral_score INTEGER,
  policy_score INTEGER,
  drift_score INTEGER,
  threat_score INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_device_history FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE INDEX idx_trust_history_device ON device_trust_history(device_id, recorded_at DESC);
CREATE INDEX idx_trust_history_date ON device_trust_history(recorded_at);

-- ============================================================
-- EVIDENCE
-- ============================================================

CREATE TABLE IF NOT EXISTS evidence (
  id VARCHAR(50) PRIMARY KEY, -- e.g., 'EV-001'
  device_id VARCHAR(50) NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL, -- e.g., 'Unusual Outbound Traffic', 'Firmware Drift'
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  timestamp TIMESTAMPTZ NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_evidence_device FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE INDEX idx_evidence_device ON evidence(device_id);
CREATE INDEX idx_evidence_severity ON evidence(severity);
CREATE INDEX idx_evidence_timestamp ON evidence(timestamp DESC);

-- ============================================================
-- INCIDENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS incidents (
  id VARCHAR(50) PRIMARY KEY, -- e.g., 'INC-001'
  device_id VARCHAR(50) NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('trusted', 'low', 'medium', 'high', 'critical')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  recommended_action TEXT NOT NULL,
  narrative TEXT NOT NULL,
  trust_score INTEGER CHECK (trust_score >= 0 AND trust_score <= 100),
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  vendor VARCHAR(100),
  ip_address VARCHAR(45),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  CONSTRAINT fk_incident_device FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE INDEX idx_incidents_device ON incidents(device_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX idx_incidents_assigned_to ON incidents(assigned_to);

-- ============================================================
-- INCIDENT EVIDENCE (Many-to-Many)
-- ============================================================

CREATE TABLE IF NOT EXISTS incident_evidence (
  incident_id VARCHAR(50) NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  evidence_description TEXT NOT NULL,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (incident_id, sequence_order)
);

CREATE INDEX idx_incident_evidence ON incident_evidence(incident_id);

-- ============================================================
-- INCIDENT TIMELINE
-- ============================================================

CREATE TABLE IF NOT EXISTS incident_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id VARCHAR(50) NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  time_offset VARCHAR(10) NOT NULL, -- e.g., '04:58' (HH:MM format)
  event_description TEXT NOT NULL,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_timeline_incident FOREIGN KEY (incident_id) REFERENCES incidents(id)
);

CREATE INDEX idx_timeline_incident ON incident_timeline(incident_id, sequence_order);

-- ============================================================
-- ADJACENT DEVICES (Incident Correlation)
-- ============================================================

CREATE TABLE IF NOT EXISTS incident_adjacent_devices (
  incident_id VARCHAR(50) NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  device_id VARCHAR(50) NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (incident_id, device_id)
);

CREATE INDEX idx_adjacent_incident ON incident_adjacent_devices(incident_id);
CREATE INDEX idx_adjacent_device ON incident_adjacent_devices(device_id);

-- ============================================================
-- ANALYST NOTES
-- ============================================================

CREATE TABLE IF NOT EXISTS analyst_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id VARCHAR(50) NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_note_incident FOREIGN KEY (incident_id) REFERENCES incidents(id),
  CONSTRAINT fk_note_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_notes_incident ON analyst_notes(incident_id, created_at DESC);
CREATE INDEX idx_notes_user ON analyst_notes(user_id);

-- ============================================================
-- ALERTS
-- ============================================================

CREATE TABLE IF NOT EXISTS alerts (
  id VARCHAR(50) PRIMARY KEY, -- e.g., 'ALT-001'
  type VARCHAR(30) NOT NULL CHECK (type IN ('trust_update', 'policy_violation', 'status_change', 'graph_anomaly', 'new_incident')),
  device_id VARCHAR(50) NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  is_read BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_alert_device FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE INDEX idx_alerts_device ON alerts(device_id);
CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_timestamp ON alerts(timestamp DESC);
CREATE INDEX idx_alerts_unread ON alerts(is_read, timestamp DESC);

-- ============================================================
-- NETWORK TOPOLOGY
-- ============================================================

CREATE TABLE IF NOT EXISTS network_nodes (
  id VARCHAR(50) PRIMARY KEY, -- device_id or 'GATEWAY'
  node_type VARCHAR(20) NOT NULL CHECK (node_type IN ('gateway', 'device')),
  position_x DECIMAL(10, 2) NOT NULL,
  position_y DECIMAL(10, 2) NOT NULL,
  trust_score INTEGER CHECK (trust_score >= 0 AND trust_score <= 100),
  risk_level VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS network_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id VARCHAR(50) NOT NULL REFERENCES network_nodes(id) ON DELETE CASCADE,
  target_id VARCHAR(50) NOT NULL REFERENCES network_nodes(id) ON DELETE CASCADE,
  edge_type VARCHAR(20) NOT NULL CHECK (edge_type IN ('normal', 'trusted', 'monitored')),
  is_suspicious BOOLEAN DEFAULT false,
  suspicious_label VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_edge_source FOREIGN KEY (source_id) REFERENCES network_nodes(id),
  CONSTRAINT fk_edge_target FOREIGN KEY (target_id) REFERENCES network_nodes(id),
  UNIQUE (source_id, target_id)
);

CREATE INDEX idx_edges_source ON network_edges(source_id);
CREATE INDEX idx_edges_target ON network_edges(target_id);
CREATE INDEX idx_edges_suspicious ON network_edges(is_suspicious);

-- ============================================================
-- SYSTEM SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(20) DEFAULT 'string', -- 'string', 'boolean', 'number', 'json'
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON system_settings(setting_key);

-- ============================================================
-- NOTIFICATION SETTINGS (Per User)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_notification_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_alerts_enabled BOOLEAN DEFAULT true,
  push_notifications_enabled BOOLEAN DEFAULT true,
  alert_threshold VARCHAR(20) DEFAULT 'warning', -- 'info', 'warning', 'critical'
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOG
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- 'device_isolated', 'incident_created', 'status_changed', etc.
  entity_type VARCHAR(50) NOT NULL, -- 'device', 'incident', 'user', 'setting'
  entity_id VARCHAR(50) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ============================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_nodes_updated_at BEFORE UPDATE ON network_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_edges_updated_at BEFORE UPDATE ON network_edges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================

-- Active high-risk devices view
CREATE OR REPLACE VIEW vw_high_risk_devices AS
SELECT 
  d.*,
  COUNT(DISTINCT e.id) as evidence_count,
  COUNT(DISTINCT i.id) as incident_count
FROM devices d
LEFT JOIN evidence e ON d.id = e.device_id
LEFT JOIN incidents i ON d.id = i.device_id AND i.status IN ('open', 'investigating')
WHERE d.risk_level IN ('high', 'critical')
  AND d.status = 'active'
GROUP BY d.id;

-- Active incidents with device info
CREATE OR REPLACE VIEW vw_active_incidents AS
SELECT 
  i.*,
  d.name as device_name,
  d.class as device_class,
  d.vendor as device_vendor,
  u.full_name as assigned_to_name,
  u.email as assigned_to_email,
  COUNT(DISTINCT an.id) as note_count
FROM incidents i
INNER JOIN devices d ON i.device_id = d.id
LEFT JOIN users u ON i.assigned_to = u.id
LEFT JOIN analyst_notes an ON i.id = an.incident_id
WHERE i.status IN ('open', 'investigating')
GROUP BY i.id, d.name, d.class, d.vendor, u.full_name, u.email;

-- Dashboard statistics view
CREATE OR REPLACE VIEW vw_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM devices) as total_devices,
  (SELECT COUNT(*) FROM devices WHERE risk_level = 'trusted') as trusted_devices,
  (SELECT COUNT(*) FROM devices WHERE risk_level IN ('high', 'critical')) as high_risk_devices,
  (SELECT COUNT(*) FROM incidents WHERE status IN ('open', 'investigating')) as active_incidents,
  (SELECT AVG(trust_score)::INTEGER FROM devices) as avg_trust_score,
  (SELECT COUNT(*) FROM alerts WHERE is_read = false) as unread_alerts;

-- ============================================================
-- SAMPLE DATA INSERTION (Based on mockData.ts)
-- ============================================================

-- Insert a default admin user
INSERT INTO users (email, full_name, role) VALUES
  ('analyst@iot-sentinel.io', 'Security Analyst', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE devices IS 'IoT devices monitored by the system';
COMMENT ON TABLE device_trust_history IS 'Historical trust score tracking for trend analysis';
COMMENT ON TABLE evidence IS 'Security evidence and violations detected on devices';
COMMENT ON TABLE incidents IS 'Security incidents requiring investigation';
COMMENT ON TABLE alerts IS 'Real-time alert stream for SOC monitoring';
COMMENT ON TABLE network_nodes IS 'Network topology node positions';
COMMENT ON TABLE network_edges IS 'Network topology connections and anomalies';
COMMENT ON TABLE audit_log IS 'Complete audit trail of all system actions';
