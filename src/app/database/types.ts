/**
 * Database Type Definitions for IoT Sentinel
 * These types map to the PostgreSQL schema and can be used with any database client
 */

// ============================================================
// USERS & AUTHENTICATION
// ============================================================

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'analyst' | 'admin' | 'viewer';
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
}

export interface UserNotificationSettings {
  user_id: string;
  email_alerts_enabled: boolean;
  push_notifications_enabled: boolean;
  alert_threshold: 'info' | 'warning' | 'critical';
  updated_at: string;
}

// ============================================================
// DEVICES
// ============================================================

export type RiskLevel = 'trusted' | 'low' | 'medium' | 'high' | 'critical';
export type DeviceStatus = 'active' | 'isolated' | 'maintenance';

export interface DeviceRow {
  id: string;
  name: string;
  class: string;
  vendor: string;
  trust_score: number;
  risk_level: RiskLevel;
  status: DeviceStatus;
  last_seen: string;
  mac_address: string;
  ip_address: string;
  behavioral_score: number | null;
  policy_score: number | null;
  drift_score: number | null;
  threat_score: number | null;
  firmware_version: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeviceTrustHistory {
  id: string;
  device_id: string;
  trust_score: number;
  risk_level: RiskLevel;
  behavioral_score: number | null;
  policy_score: number | null;
  drift_score: number | null;
  threat_score: number | null;
  recorded_at: string;
}

// ============================================================
// EVIDENCE
// ============================================================

export type EvidenceSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface EvidenceRow {
  id: string;
  device_id: string;
  type: string;
  severity: EvidenceSeverity;
  timestamp: string;
  details: string;
  created_at: string;
}

// ============================================================
// INCIDENTS
// ============================================================

export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface IncidentRow {
  id: string;
  device_id: string;
  risk_level: RiskLevel;
  severity: IncidentSeverity;
  status: IncidentStatus;
  recommended_action: string;
  narrative: string;
  trust_score: number | null;
  confidence: number | null;
  vendor: string | null;
  ip_address: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface IncidentEvidence {
  incident_id: string;
  evidence_description: string;
  sequence_order: number;
  created_at: string;
}

export interface IncidentTimeline {
  id: string;
  incident_id: string;
  time_offset: string;
  event_description: string;
  sequence_order: number;
  created_at: string;
}

export interface IncidentAdjacentDevice {
  incident_id: string;
  device_id: string;
  created_at: string;
}

// ============================================================
// ANALYST NOTES
// ============================================================

export interface AnalystNote {
  id: string;
  incident_id: string;
  user_id: string;
  note_text: string;
  created_at: string;
}

// ============================================================
// ALERTS
// ============================================================

export type AlertType = 'trust_update' | 'policy_violation' | 'status_change' | 'graph_anomaly' | 'new_incident';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface AlertRow {
  id: string;
  type: AlertType;
  device_id: string;
  message: string;
  timestamp: string;
  severity: AlertSeverity;
  is_read: boolean;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  created_at: string;
}

// ============================================================
// NETWORK TOPOLOGY
// ============================================================

export type NodeType = 'gateway' | 'device';
export type EdgeType = 'normal' | 'trusted' | 'monitored';

export interface NetworkNode {
  id: string;
  node_type: NodeType;
  position_x: number;
  position_y: number;
  trust_score: number | null;
  risk_level: RiskLevel | null;
  created_at: string;
  updated_at: string;
}

export interface NetworkEdge {
  id: string;
  source_id: string;
  target_id: string;
  edge_type: EdgeType;
  is_suspicious: boolean;
  suspicious_label: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// SYSTEM SETTINGS
// ============================================================

export type SettingType = 'string' | 'boolean' | 'number' | 'json';

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: SettingType;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

// ============================================================
// AUDIT LOG
// ============================================================

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value: Record<string, any> | null;
  new_value: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// ============================================================
// VIEW TYPES (Read-Only)
// ============================================================

export interface HighRiskDeviceView extends DeviceRow {
  evidence_count: number;
  incident_count: number;
}

export interface ActiveIncidentView extends IncidentRow {
  device_name: string;
  device_class: string;
  device_vendor: string;
  assigned_to_name: string | null;
  assigned_to_email: string | null;
  note_count: number;
}

export interface DashboardStatsView {
  total_devices: number;
  trusted_devices: number;
  high_risk_devices: number;
  active_incidents: number;
  avg_trust_score: number;
  unread_alerts: number;
}

// ============================================================
// INSERT/UPDATE TYPES (without auto-generated fields)
// ============================================================

export type DeviceInsert = Omit<DeviceRow, 'created_at' | 'updated_at'>;
export type DeviceUpdate = Partial<Omit<DeviceRow, 'id' | 'created_at' | 'updated_at'>>;

export type IncidentInsert = Omit<IncidentRow, 'created_at' | 'updated_at' | 'resolved_at'>;
export type IncidentUpdate = Partial<Omit<IncidentRow, 'id' | 'created_at' | 'updated_at'>>;

export type AlertInsert = Omit<AlertRow, 'created_at'>;
export type AlertUpdate = Partial<Omit<AlertRow, 'id' | 'created_at'>>;

export type EvidenceInsert = Omit<EvidenceRow, 'created_at'>;

export type AnalystNoteInsert = Omit<AnalystNote, 'id' | 'created_at'>;

// ============================================================
// QUERY FILTER TYPES
// ============================================================

export interface DeviceFilters {
  risk_level?: RiskLevel | RiskLevel[];
  status?: DeviceStatus | DeviceStatus[];
  class?: string | string[];
  vendor?: string | string[];
  search?: string; // searches name, id, vendor, class
  min_trust_score?: number;
  max_trust_score?: number;
}

export interface IncidentFilters {
  status?: IncidentStatus | IncidentStatus[];
  severity?: IncidentSeverity | IncidentSeverity[];
  device_id?: string;
  assigned_to?: string;
  created_after?: string;
  created_before?: string;
  search?: string; // searches id, device_id, recommended_action
}

export interface AlertFilters {
  type?: AlertType | AlertType[];
  severity?: AlertSeverity | AlertSeverity[];
  device_id?: string;
  is_read?: boolean;
  timestamp_after?: string;
  timestamp_before?: string;
}

// ============================================================
// PAGINATION & SORTING
// ============================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams<T = any> {
  sort_by?: keyof T;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: any;
}
