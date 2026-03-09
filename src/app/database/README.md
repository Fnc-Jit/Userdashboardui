# IoT Sentinel Database Layer

Complete database schema, types, and connection layer for the IoT Sentinel dashboard.

## 📁 Files

### `schema.sql`
PostgreSQL database schema with complete table definitions, indexes, triggers, and views.

**Tables:**
- `users` - User authentication and roles
- `devices` - IoT device inventory
- `device_trust_history` - Historical trust score tracking (30-day trends)
- `evidence` - Security violations and anomalies
- `incidents` - Security incidents requiring investigation
- `incident_evidence` - Evidence linked to incidents
- `incident_timeline` - Chronological event timeline
- `incident_adjacent_devices` - Lateral movement tracking
- `analyst_notes` - SOC analyst investigation notes
- `alerts` - Real-time alert stream
- `network_nodes` - Network topology node positions
- `network_edges` - Network connections and anomalies
- `system_settings` - Application configuration
- `user_notification_settings` - Per-user notification preferences
- `audit_log` - Complete audit trail

**Views:**
- `vw_high_risk_devices` - Active high/critical risk devices with evidence counts
- `vw_active_incidents` - Open incidents with device context
- `vw_dashboard_stats` - Aggregated KPI metrics

### `types.ts`
TypeScript type definitions for all database tables, rows, inserts, updates, filters, and API responses.

**Key Types:**
- `DeviceRow`, `DeviceInsert`, `DeviceUpdate`, `DeviceFilters`
- `IncidentRow`, `IncidentInsert`, `IncidentUpdate`, `IncidentFilters`
- `AlertRow`, `AlertInsert`, `AlertFilters`
- `EvidenceRow`, `AnalystNote`, `NetworkNode`, `NetworkEdge`
- `PaginatedResponse<T>`, `ApiResponse<T>`

### `connection.ts`
Database service layer with adapter pattern for backend flexibility.

**Features:**
- `DatabaseAdapter` interface for backend abstraction
- `DatabaseService` class with complete CRUD operations
- Pagination and filtering support
- Real-time subscription support (for compatible backends)
- Mock adapter for development/testing

**Service Methods:**
```typescript
// Devices
await db.getDevices(filters, pagination, sort)
await db.getDeviceById(id)
await db.createDevice(device)
await db.updateDevice(id, updates)
await db.getDeviceTrustHistory(deviceId, days)

// Incidents
await db.getIncidents(filters, pagination, sort)
await db.getIncidentById(id)
await db.createIncident(incident)
await db.updateIncident(id, updates)
await db.getIncidentTimeline(incidentId)
await db.getIncidentNotes(incidentId)

// Alerts
await db.getAlerts(filters, pagination)
await db.createAlert(alert)
await db.markAlertAsRead(id, userId)
await db.clearAllAlerts()

// Dashboard
await db.getDashboardStats()
await db.getHighRiskDevices()
await db.getActiveIncidents()

// Real-time (if supported)
db.subscribeToAlerts(callback)
db.subscribeToDeviceUpdates(callback)
```

### `seed.ts`
Database seeding script to populate with mock data from `mockData.ts`.

**Functions:**
- `seedDatabase(db)` - Populates all tables with initial data
- `clearDatabase(db)` - Removes all data from tables

## 🚀 Quick Start

### Option 1: Supabase (Recommended for Production)

1. **Create a Supabase project** at https://supabase.com

2. **Run the schema:**
   ```sql
   -- Copy and run schema.sql in Supabase SQL Editor
   ```

3. **Install Supabase client:**
   ```bash
   npm install @supabase/supabase-js
   ```

4. **Create Supabase adapter:**
   ```typescript
   // /src/app/database/adapters/supabase.ts
   import { createClient, SupabaseClient } from '@supabase/supabase-js';
   import type { DatabaseAdapter } from '../connection';

   export class SupabaseDatabaseAdapter implements DatabaseAdapter {
     private client: SupabaseClient;
     private connected = false;

     constructor(supabaseUrl: string, supabaseKey: string) {
       this.client = createClient(supabaseUrl, supabaseKey);
     }

     async connect(): Promise<void> {
       this.connected = true;
     }

     async disconnect(): Promise<void> {
       this.connected = false;
     }

     isConnected(): boolean {
       return this.connected;
     }

     async query<T>(sql: string, params?: any[]): Promise<T[]> {
       const { data, error } = await this.client.rpc('execute_sql', {
         query: sql,
         params: params || []
       });
       if (error) throw error;
       return data as T[];
     }

     async queryOne<T>(sql: string, params?: any[]): Promise<T | null> {
       const results = await this.query<T>(sql, params);
       return results[0] || null;
     }

     async execute(sql: string, params?: any[]): Promise<void> {
       await this.query(sql, params);
     }

     async beginTransaction(): Promise<void> {
       await this.execute('BEGIN');
     }

     async commit(): Promise<void> {
       await this.execute('COMMIT');
     }

     async rollback(): Promise<void> {
       await this.execute('ROLLBACK');
     }

     subscribe<T>(
       table: string,
       callback: (payload: any) => void
     ): () => void {
       const subscription = this.client
         .channel(`${table}_changes`)
         .on(
           'postgres_changes',
           { event: '*', schema: 'public', table },
           callback
         )
         .subscribe();

       return () => {
         subscription.unsubscribe();
       };
     }
   }
   ```

5. **Initialize in your app:**
   ```typescript
   import { initializeDatabaseService } from './database/connection';
   import { SupabaseDatabaseAdapter } from './database/adapters/supabase';
   import { seedDatabase } from './database/seed';

   const adapter = new SupabaseDatabaseAdapter(
     process.env.SUPABASE_URL!,
     process.env.SUPABASE_ANON_KEY!
   );

   const db = initializeDatabaseService(adapter);
   await db.connect();

   // Seed initial data (run once)
   await seedDatabase(db);
   ```

### Option 2: PostgreSQL (node-postgres)

1. **Install pg:**
   ```bash
   npm install pg @types/pg
   ```

2. **Create PostgreSQL adapter:**
   ```typescript
   // /src/app/database/adapters/postgres.ts
   import { Pool } from 'pg';
   import type { DatabaseAdapter } from '../connection';

   export class PostgresDatabaseAdapter implements DatabaseAdapter {
     private pool: Pool;
     private connected = false;

     constructor(connectionString: string) {
       this.pool = new Pool({ connectionString });
     }

     async connect(): Promise<void> {
       await this.pool.connect();
       this.connected = true;
     }

     async disconnect(): Promise<void> {
       await this.pool.end();
       this.connected = false;
     }

     isConnected(): boolean {
       return this.connected;
     }

     async query<T>(sql: string, params?: any[]): Promise<T[]> {
       const result = await this.pool.query(sql, params);
       return result.rows as T[];
     }

     async queryOne<T>(sql: string, params?: any[]): Promise<T | null> {
       const results = await this.query<T>(sql, params);
       return results[0] || null;
     }

     async execute(sql: string, params?: any[]): Promise<void> {
       await this.pool.query(sql, params);
     }

     async beginTransaction(): Promise<void> {
       await this.execute('BEGIN');
     }

     async commit(): Promise<void> {
       await this.execute('COMMIT');
     }

     async rollback(): Promise<void> {
       await this.execute('ROLLBACK');
     }
   }
   ```

### Option 3: REST API Backend

1. **Create REST adapter:**
   ```typescript
   // /src/app/database/adapters/rest-api.ts
   import type { DatabaseAdapter } from '../connection';

   export class RestApiDatabaseAdapter implements DatabaseAdapter {
     private baseUrl: string;
     private apiKey: string;
     private connected = false;

     constructor(baseUrl: string, apiKey: string) {
       this.baseUrl = baseUrl;
       this.apiKey = apiKey;
     }

     async connect(): Promise<void> {
       this.connected = true;
     }

     async disconnect(): Promise<void> {
       this.connected = false;
     }

     isConnected(): boolean {
       return this.connected;
     }

     async query<T>(sql: string, params?: any[]): Promise<T[]> {
       const response = await fetch(`${this.baseUrl}/query`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${this.apiKey}`
         },
         body: JSON.stringify({ sql, params })
       });
       const data = await response.json();
       return data.results as T[];
     }

     async queryOne<T>(sql: string, params?: any[]): Promise<T | null> {
       const results = await this.query<T>(sql, params);
       return results[0] || null;
     }

     async execute(sql: string, params?: any[]): Promise<void> {
       await this.query(sql, params);
     }

     async beginTransaction(): Promise<void> {}
     async commit(): Promise<void> {}
     async rollback(): Promise<void> {}
   }
   ```

## 📊 Database Schema Diagram

```
users
├── id (PK)
├── email (UNIQUE)
└── role

devices                          device_trust_history
├── id (PK)                     ├── device_id (FK) ──┐
├── name                        ├── trust_score       │
├── trust_score                 ├── recorded_at       │
├── risk_level                  └── ...               │
└── ...                                               │
    │                                                 │
    │                           evidence              │
    ├───────────────────────────├── device_id (FK) ──┤
    │                           ├── type              │
    │                           └── severity          │
    │                                                 │
    │                           incidents             │
    ├───────────────────────────├── device_id (FK) ──┘
    │                           ├── status
    │                           ├── severity
    │                           └── ...
    │                               │
    │                               ├── incident_evidence
    │                               ├── incident_timeline
    │                               ├── incident_adjacent_devices
    │                               └── analyst_notes
    │
    │                           alerts
    └───────────────────────────├── device_id (FK)
                                ├── type
                                └── severity

network_nodes                    network_edges
├── id (PK)                     ├── source_id (FK) ──┐
├── position_x                  ├── target_id (FK) ──┼─→ network_nodes
└── risk_level                  └── is_suspicious    │
```

## 🔧 Environment Variables

Create a `.env` file in your project root:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/iot_sentinel

# REST API
API_BASE_URL=https://api.yourbackend.com
API_KEY=your-api-key
```

## 📝 Usage Examples

### Fetching High-Risk Devices
```typescript
import { getDatabaseService } from './database/connection';

const db = getDatabaseService();

const { data: devices } = await db.getDevices(
  { risk_level: ['high', 'critical'], status: 'active' },
  { page: 1, limit: 10 },
  { sort_by: 'trust_score', sort_order: 'asc' }
);
```

### Creating an Incident
```typescript
const incident = await db.createIncident({
  id: 'INC-007',
  device_id: 'DEV-001',
  risk_level: 'high',
  severity: 'high',
  status: 'open',
  recommended_action: 'Investigate unusual traffic',
  narrative: 'Device showing abnormal behavior...',
  trust_score: 45,
  confidence: 87,
  vendor: 'Nest',
  ip_address: '192.168.1.101'
});
```

### Real-Time Alert Subscription
```typescript
const unsubscribe = db.subscribeToAlerts((alert) => {
  console.log('New alert:', alert);
  // Update UI with new alert
});

// Later, clean up
unsubscribe();
```

### Dashboard Stats
```typescript
const stats = await db.getDashboardStats();
console.log(stats);
// {
//   total_devices: 12,
//   trusted_devices: 3,
//   high_risk_devices: 4,
//   active_incidents: 4,
//   avg_trust_score: 58,
//   unread_alerts: 12
// }
```

## 🔐 Security Considerations

1. **Never commit credentials** - Use environment variables
2. **Use Row Level Security (RLS)** - Enable in Supabase for multi-tenant security
3. **Validate inputs** - Sanitize all user inputs before database queries
4. **Audit logging** - All critical operations are logged in `audit_log` table
5. **Parameterized queries** - All queries use parameter binding to prevent SQL injection

## 🧪 Testing

Use the mock adapter for development and testing:

```typescript
import { getMockDatabaseService } from './database/connection';

const db = getMockDatabaseService();
await db.connect();

// Mock data is logged to console
await db.getDevices();
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres Documentation](https://node-postgres.com/)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl.html)

## 🤝 Contributing

When adding new features:

1. Update `schema.sql` with new tables/columns
2. Add TypeScript types to `types.ts`
3. Implement service methods in `connection.ts`
4. Update seed data in `seed.ts` if needed
5. Document changes in this README

## 📄 License

Part of the IoT Sentinel project.
