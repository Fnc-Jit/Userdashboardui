/**
 * Database Connection & Service Layer
 * 
 * This file provides an abstraction layer for database operations.
 * It can be adapted to work with:
 * - Supabase (PostgreSQL with real-time capabilities)
 * - PostgreSQL (via pg or node-postgres)
 * - MySQL
 * - Any REST API backend
 * 
 * USAGE:
 * 1. Choose your database backend
 * 2. Implement the DatabaseAdapter interface for your chosen backend
 * 3. Initialize DatabaseService with your adapter
 * 4. Use the service methods throughout your application
 */

import type {
  DeviceRow,
  DeviceInsert,
  DeviceUpdate,
  DeviceFilters,
  IncidentRow,
  IncidentInsert,
  IncidentUpdate,
  IncidentFilters,
  AlertRow,
  AlertInsert,
  AlertUpdate,
  AlertFilters,
  EvidenceRow,
  EvidenceInsert,
  AnalystNote,
  AnalystNoteInsert,
  DeviceTrustHistory,
  NetworkNode,
  NetworkEdge,
  PaginatedResponse,
  PaginationParams,
  SortParams,
  DashboardStatsView,
  HighRiskDeviceView,
  ActiveIncidentView,
  User,
  IncidentTimeline,
  IncidentEvidence,
} from './types';

// ============================================================
// DATABASE ADAPTER INTERFACE
// ============================================================

/**
 * Database adapter interface
 * Implement this interface for your chosen database backend
 */
export interface DatabaseAdapter {
  // Connection management
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Query execution
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  queryOne<T = any>(sql: string, params?: any[]): Promise<T | null>;
  execute(sql: string, params?: any[]): Promise<void>;

  // Transactions
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  // Real-time subscriptions (optional, for Supabase/Firebase)
  subscribe?<T = any>(
    table: string,
    callback: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE'; new: T; old: T }) => void
  ): () => void;
}

// ============================================================
// DATABASE SERVICE
// ============================================================

export class DatabaseService {
  private adapter: DatabaseAdapter;

  constructor(adapter: DatabaseAdapter) {
    this.adapter = adapter;
  }

  /** Expose the adapter for advanced operations (e.g., seeding, raw SQL) */
  getAdapter(): DatabaseAdapter {
    return this.adapter;
  }

  async connect(): Promise<void> {
    await this.adapter.connect();
  }

  async disconnect(): Promise<void> {
    await this.adapter.disconnect();
  }

  // ============================================================
  // DEVICES
  // ============================================================

  async getDevices(
    filters?: DeviceFilters,
    pagination?: PaginationParams,
    sort?: SortParams<DeviceRow>
  ): Promise<PaginatedResponse<DeviceRow>> {
    let sql = 'SELECT * FROM devices WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.risk_level) {
      const levels = Array.isArray(filters.risk_level) ? filters.risk_level : [filters.risk_level];
      sql += ` AND risk_level = ANY($${paramIndex})`;
      params.push(levels);
      paramIndex++;
    }

    if (filters?.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      sql += ` AND status = ANY($${paramIndex})`;
      params.push(statuses);
      paramIndex++;
    }

    if (filters?.class) {
      const classes = Array.isArray(filters.class) ? filters.class : [filters.class];
      sql += ` AND class = ANY($${paramIndex})`;
      params.push(classes);
      paramIndex++;
    }

    if (filters?.vendor) {
      const vendors = Array.isArray(filters.vendor) ? filters.vendor : [filters.vendor];
      sql += ` AND vendor = ANY($${paramIndex})`;
      params.push(vendors);
      paramIndex++;
    }

    if (filters?.search) {
      sql += ` AND (name ILIKE $${paramIndex} OR id ILIKE $${paramIndex} OR vendor ILIKE $${paramIndex} OR class ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters?.min_trust_score !== undefined) {
      sql += ` AND trust_score >= $${paramIndex}`;
      params.push(filters.min_trust_score);
      paramIndex++;
    }

    if (filters?.max_trust_score !== undefined) {
      sql += ` AND trust_score <= $${paramIndex}`;
      params.push(filters.max_trust_score);
      paramIndex++;
    }

    // Count total
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.adapter.queryOne<{ count: string }>(countSql, params);
    const total = parseInt(countResult?.count || '0', 10);

    // Apply sorting
    const sortBy = sort?.sort_by || 'id';
    const sortOrder = sort?.sort_order || 'asc';
    sql += ` ORDER BY ${String(sortBy)} ${sortOrder}`;

    // Apply pagination
    const limit = pagination?.limit || 50;
    const page = pagination?.page || 1;
    const offset = pagination?.offset ?? (page - 1) * limit;

    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const data = await this.adapter.query<DeviceRow>(sql, params);

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async getDeviceById(id: string): Promise<DeviceRow | null> {
    const sql = 'SELECT * FROM devices WHERE id = $1';
    return await this.adapter.queryOne<DeviceRow>(sql, [id]);
  }

  async createDevice(device: DeviceInsert): Promise<DeviceRow> {
    const columns = Object.keys(device).join(', ');
    const placeholders = Object.keys(device).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(device);

    const sql = `INSERT INTO devices (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.adapter.query<DeviceRow>(sql, values);
    return result[0];
  }

  async updateDevice(id: string, updates: DeviceUpdate): Promise<DeviceRow | null> {
    const columns = Object.keys(updates);
    const setClauses = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];

    const sql = `UPDATE devices SET ${setClauses} WHERE id = $1 RETURNING *`;
    const result = await this.adapter.query<DeviceRow>(sql, values);
    return result[0] || null;
  }

  async deleteDevice(id: string): Promise<void> {
    const sql = 'DELETE FROM devices WHERE id = $1';
    await this.adapter.execute(sql, [id]);
  }

  // ============================================================
  // DEVICE TRUST HISTORY
  // ============================================================

  async getDeviceTrustHistory(deviceId: string, days: number = 30): Promise<DeviceTrustHistory[]> {
    const sql = `
      SELECT * FROM device_trust_history 
      WHERE device_id = $1 
        AND recorded_at >= NOW() - INTERVAL '${days} days'
      ORDER BY recorded_at ASC
    `;
    return await this.adapter.query<DeviceTrustHistory>(sql, [deviceId]);
  }

  async recordDeviceTrustHistory(deviceId: string): Promise<void> {
    const device = await this.getDeviceById(deviceId);
    if (!device) return;

    const sql = `
      INSERT INTO device_trust_history 
        (device_id, trust_score, risk_level, behavioral_score, policy_score, drift_score, threat_score)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await this.adapter.execute(sql, [
      deviceId,
      device.trust_score,
      device.risk_level,
      device.behavioral_score,
      device.policy_score,
      device.drift_score,
      device.threat_score,
    ]);
  }

  // ============================================================
  // EVIDENCE
  // ============================================================

  async getDeviceEvidence(deviceId: string): Promise<EvidenceRow[]> {
    const sql = 'SELECT * FROM evidence WHERE device_id = $1 ORDER BY timestamp DESC';
    return await this.adapter.query<EvidenceRow>(sql, [deviceId]);
  }

  async createEvidence(evidence: EvidenceInsert): Promise<EvidenceRow> {
    const columns = Object.keys(evidence).join(', ');
    const placeholders = Object.keys(evidence).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(evidence);

    const sql = `INSERT INTO evidence (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.adapter.query<EvidenceRow>(sql, values);
    return result[0];
  }

  // ============================================================
  // INCIDENTS
  // ============================================================

  async getIncidents(
    filters?: IncidentFilters,
    pagination?: PaginationParams,
    sort?: SortParams<IncidentRow>
  ): Promise<PaginatedResponse<IncidentRow>> {
    let sql = 'SELECT * FROM incidents WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      sql += ` AND status = ANY($${paramIndex})`;
      params.push(statuses);
      paramIndex++;
    }

    if (filters?.severity) {
      const severities = Array.isArray(filters.severity) ? filters.severity : [filters.severity];
      sql += ` AND severity = ANY($${paramIndex})`;
      params.push(severities);
      paramIndex++;
    }

    if (filters?.device_id) {
      sql += ` AND device_id = $${paramIndex}`;
      params.push(filters.device_id);
      paramIndex++;
    }

    if (filters?.assigned_to) {
      sql += ` AND assigned_to = $${paramIndex}`;
      params.push(filters.assigned_to);
      paramIndex++;
    }

    if (filters?.search) {
      sql += ` AND (id ILIKE $${paramIndex} OR device_id ILIKE $${paramIndex} OR recommended_action ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    // Count total
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.adapter.queryOne<{ count: string }>(countSql, params);
    const total = parseInt(countResult?.count || '0', 10);

    // Apply sorting
    const sortBy = sort?.sort_by || 'created_at';
    const sortOrder = sort?.sort_order || 'desc';
    sql += ` ORDER BY ${String(sortBy)} ${sortOrder}`;

    // Apply pagination
    const limit = pagination?.limit || 50;
    const page = pagination?.page || 1;
    const offset = pagination?.offset ?? (page - 1) * limit;

    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const data = await this.adapter.query<IncidentRow>(sql, params);

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async getIncidentById(id: string): Promise<IncidentRow | null> {
    const sql = 'SELECT * FROM incidents WHERE id = $1';
    return await this.adapter.queryOne<IncidentRow>(sql, [id]);
  }

  async createIncident(incident: IncidentInsert): Promise<IncidentRow> {
    const columns = Object.keys(incident).join(', ');
    const placeholders = Object.keys(incident).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(incident);

    const sql = `INSERT INTO incidents (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.adapter.query<IncidentRow>(sql, values);
    return result[0];
  }

  async updateIncident(id: string, updates: IncidentUpdate): Promise<IncidentRow | null> {
    const columns = Object.keys(updates);
    const setClauses = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];

    const sql = `UPDATE incidents SET ${setClauses} WHERE id = $1 RETURNING *`;
    const result = await this.adapter.query<IncidentRow>(sql, values);
    return result[0] || null;
  }

  async getIncidentEvidence(incidentId: string): Promise<string[]> {
    const sql = 'SELECT evidence_description FROM incident_evidence WHERE incident_id = $1 ORDER BY sequence_order';
    const result = await this.adapter.query<{ evidence_description: string }>(sql, [incidentId]);
    return result.map(r => r.evidence_description);
  }

  async getIncidentTimeline(incidentId: string): Promise<Array<{ time: string; event: string }>> {
    const sql = 'SELECT time_offset as time, event_description as event FROM incident_timeline WHERE incident_id = $1 ORDER BY sequence_order';
    return await this.adapter.query(sql, [incidentId]);
  }

  async getIncidentAdjacentDevices(incidentId: string): Promise<string[]> {
    const sql = 'SELECT device_id FROM incident_adjacent_devices WHERE incident_id = $1';
    const result = await this.adapter.query<{ device_id: string }>(sql, [incidentId]);
    return result.map(r => r.device_id);
  }

  // ============================================================
  // ANALYST NOTES
  // ============================================================

  async getIncidentNotes(incidentId: string): Promise<AnalystNote[]> {
    const sql = 'SELECT * FROM analyst_notes WHERE incident_id = $1 ORDER BY created_at DESC';
    return await this.adapter.query<AnalystNote>(sql, [incidentId]);
  }

  async createAnalystNote(note: AnalystNoteInsert): Promise<AnalystNote> {
    const sql = `
      INSERT INTO analyst_notes (incident_id, user_id, note_text)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await this.adapter.query<AnalystNote>(sql, [
      note.incident_id,
      note.user_id,
      note.note_text,
    ]);
    return result[0];
  }

  // ============================================================
  // ALERTS
  // ============================================================

  async getAlerts(
    filters?: AlertFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<AlertRow>> {
    let sql = 'SELECT * FROM alerts WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      sql += ` AND type = ANY($${paramIndex})`;
      params.push(types);
      paramIndex++;
    }

    if (filters?.severity) {
      const severities = Array.isArray(filters.severity) ? filters.severity : [filters.severity];
      sql += ` AND severity = ANY($${paramIndex})`;
      params.push(severities);
      paramIndex++;
    }

    if (filters?.device_id) {
      sql += ` AND device_id = $${paramIndex}`;
      params.push(filters.device_id);
      paramIndex++;
    }

    if (filters?.is_read !== undefined) {
      sql += ` AND is_read = $${paramIndex}`;
      params.push(filters.is_read);
      paramIndex++;
    }

    // Count total
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.adapter.queryOne<{ count: string }>(countSql, params);
    const total = parseInt(countResult?.count || '0', 10);

    // Always sort by timestamp descending
    sql += ' ORDER BY timestamp DESC';

    // Apply pagination
    const limit = pagination?.limit || 100;
    const page = pagination?.page || 1;
    const offset = pagination?.offset ?? (page - 1) * limit;

    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const data = await this.adapter.query<AlertRow>(sql, params);

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async createAlert(alert: AlertInsert): Promise<AlertRow> {
    const columns = Object.keys(alert).join(', ');
    const placeholders = Object.keys(alert).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(alert);

    const sql = `INSERT INTO alerts (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.adapter.query<AlertRow>(sql, values);
    return result[0];
  }

  async markAlertAsRead(id: string, userId: string): Promise<void> {
    const sql = 'UPDATE alerts SET is_read = true, acknowledged_by = $2, acknowledged_at = NOW() WHERE id = $1';
    await this.adapter.execute(sql, [id, userId]);
  }

  async clearAllAlerts(): Promise<void> {
    const sql = 'DELETE FROM alerts';
    await this.adapter.execute(sql);
  }

  // ============================================================
  // NETWORK TOPOLOGY
  // ============================================================

  async getNetworkNodes(): Promise<NetworkNode[]> {
    const sql = 'SELECT * FROM network_nodes';
    return await this.adapter.query<NetworkNode>(sql);
  }

  async getNetworkEdges(): Promise<NetworkEdge[]> {
    const sql = 'SELECT * FROM network_edges';
    return await this.adapter.query<NetworkEdge>(sql);
  }

  // ============================================================
  // DASHBOARD VIEWS
  // ============================================================

  async getDashboardStats(): Promise<DashboardStatsView> {
    const sql = 'SELECT * FROM vw_dashboard_stats';
    const result = await this.adapter.queryOne<DashboardStatsView>(sql);
    return result || {
      total_devices: 0,
      trusted_devices: 0,
      high_risk_devices: 0,
      active_incidents: 0,
      avg_trust_score: 0,
      unread_alerts: 0,
    };
  }

  async getHighRiskDevices(): Promise<HighRiskDeviceView[]> {
    const sql = 'SELECT * FROM vw_high_risk_devices ORDER BY trust_score ASC LIMIT 10';
    return await this.adapter.query<HighRiskDeviceView>(sql);
  }

  async getActiveIncidents(): Promise<ActiveIncidentView[]> {
    const sql = 'SELECT * FROM vw_active_incidents ORDER BY created_at DESC';
    return await this.adapter.query<ActiveIncidentView>(sql);
  }

  // ============================================================
  // REAL-TIME SUBSCRIPTIONS (if supported by adapter)
  // ============================================================

  subscribeToAlerts(callback: (alert: AlertRow) => void): (() => void) | null {
    if (!this.adapter.subscribe) return null;

    return this.adapter.subscribe<AlertRow>('alerts', (payload) => {
      if (payload.event === 'INSERT') {
        callback(payload.new);
      }
    });
  }

  subscribeToDeviceUpdates(callback: (device: DeviceRow) => void): (() => void) | null {
    if (!this.adapter.subscribe) return null;

    return this.adapter.subscribe<DeviceRow>('devices', (payload) => {
      if (payload.event === 'UPDATE') {
        callback(payload.new);
      }
    });
  }
}

// ============================================================
// EXAMPLE ADAPTERS
// ============================================================

/**
 * Mock adapter for development/testing
 * Uses localStorage to simulate a database
 */
export class MockDatabaseAdapter implements DatabaseAdapter {
  private connected = false;

  async connect(): Promise<void> {
    this.connected = true;
    console.log('MockDatabaseAdapter: Connected');
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log('MockDatabaseAdapter: Disconnected');
  }

  isConnected(): boolean {
    return this.connected;
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    console.log('MockDatabaseAdapter: Query', { sql, params });
    // In a real implementation, this would parse SQL and query localStorage
    // For now, return empty array
    return [];
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results[0] || null;
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    console.log('MockDatabaseAdapter: Execute', { sql, params });
  }

  async beginTransaction(): Promise<void> {
    console.log('MockDatabaseAdapter: Begin transaction');
  }

  async commit(): Promise<void> {
    console.log('MockDatabaseAdapter: Commit');
  }

  async rollback(): Promise<void> {
    console.log('MockDatabaseAdapter: Rollback');
  }
}

// ============================================================
// SINGLETON INSTANCE
// ============================================================

let dbServiceInstance: DatabaseService | null = null;

/**
 * Initialize the database service with a specific adapter
 */
export function initializeDatabaseService(adapter: DatabaseAdapter): DatabaseService {
  dbServiceInstance = new DatabaseService(adapter);
  return dbServiceInstance;
}

/**
 * Get the current database service instance
 */
export function getDatabaseService(): DatabaseService {
  if (!dbServiceInstance) {
    throw new Error('Database service not initialized. Call initializeDatabaseService() first.');
  }
  return dbServiceInstance;
}

/**
 * Get or create database service with mock adapter (for development)
 */
export function getMockDatabaseService(): DatabaseService {
  if (!dbServiceInstance) {
    dbServiceInstance = new DatabaseService(new MockDatabaseAdapter());
  }
  return dbServiceInstance;
}
