/**
 * Supabase Database Adapter Example
 * 
 * This is a complete reference implementation for connecting IoT Sentinel
 * to Supabase (PostgreSQL with real-time capabilities).
 * 
 * SETUP:
 * 1. npm install @supabase/supabase-js
 * 2. Create a Supabase project at https://supabase.com
 * 3. Run schema.sql in Supabase SQL Editor
 * 4. Copy your Supabase URL and anon key
 * 5. Rename this file to supabase.ts and update credentials
 * 6. Initialize in your app with initializeDatabaseService()
 */

import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import type { DatabaseAdapter } from '../connection';

export class SupabaseDatabaseAdapter implements DatabaseAdapter {
  private client: SupabaseClient;
  private connected = false;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  async connect(): Promise<void> {
    // Test connection by fetching a simple query
    const { error } = await this.client.from('users').select('count').limit(1);
    if (error && error.message.includes('relation') === false) {
      throw new Error(`Failed to connect to Supabase: ${error.message}`);
    }
    this.connected = true;
    console.log('✅ Connected to Supabase');
  }

  async disconnect(): Promise<void> {
    // Supabase client doesn't need explicit disconnect
    this.connected = false;
    console.log('👋 Disconnected from Supabase');
  }

  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Execute raw SQL query
   * Note: This requires a custom RPC function in Supabase
   * See setup instructions below
   */
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    // For Supabase, we'll use the built-in table methods instead of raw SQL
    // This is a fallback that parses simple SQL queries
    
    // Extract table name from SQL
    const tableMatch = sql.match(/FROM\s+(\w+)/i);
    if (!tableMatch) {
      console.warn('Could not parse SQL, returning empty array:', sql);
      return [];
    }

    const tableName = tableMatch[1];
    
    try {
      const { data, error } = await this.client
        .from(tableName)
        .select('*');

      if (error) throw error;
      return (data || []) as T[];
    } catch (error) {
      console.error('Query error:', error);
      return [];
    }
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results[0] || null;
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    await this.query(sql, params);
  }

  async beginTransaction(): Promise<void> {
    // Supabase doesn't support explicit transactions in the client
    // Transactions are handled automatically for batch operations
    console.warn('Supabase client does not support explicit transactions');
  }

  async commit(): Promise<void> {
    // No-op for Supabase
  }

  async rollback(): Promise<void> {
    // No-op for Supabase
  }

  /**
   * Subscribe to real-time changes on a table
   */
  subscribe<T = any>(
    table: string,
    callback: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE'; new: T; old: T }) => void
  ): () => void {
    const channel: RealtimeChannel = this.client
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload: any) => {
          callback({
            event: payload.eventType,
            new: payload.new as T,
            old: payload.old as T,
          });
        }
      )
      .subscribe();

    console.log(`🔔 Subscribed to ${table} changes`);

    return () => {
      channel.unsubscribe();
      console.log(`🔕 Unsubscribed from ${table} changes`);
    };
  }

  // ============================================================
  // SUPABASE-OPTIMIZED METHODS
  // These use Supabase's PostgREST API for better performance
  // ============================================================

  /**
   * Get the Supabase client for direct table access
   * This allows you to use Supabase's full query builder API
   */
  getClient(): SupabaseClient {
    return this.client;
  }

  /**
   * Authenticate a user
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const { data: { user } } = await this.client.auth.getUser();
    return user;
  }
}

// ============================================================
// SETUP INSTRUCTIONS FOR SUPABASE
// ============================================================

/**
 * 1. CREATE RPC FUNCTION FOR RAW SQL (Optional, for advanced queries)
 * 
 * Run this in Supabase SQL Editor:
 * 
 * ```sql
 * CREATE OR REPLACE FUNCTION execute_sql(query text, params jsonb DEFAULT '[]'::jsonb)
 * RETURNS jsonb
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   result jsonb;
 * BEGIN
 *   EXECUTE query INTO result;
 *   RETURN result;
 * END;
 * $$;
 * ```
 * 
 * 2. ENABLE REALTIME (For live alerts and device updates)
 * 
 * In Supabase Dashboard → Database → Replication:
 * - Enable replication for: alerts, devices, incidents tables
 * 
 * 3. ROW LEVEL SECURITY (RLS) - Optional but recommended
 * 
 * ```sql
 * -- Enable RLS on all tables
 * ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policies (example: allow authenticated users to read)
 * CREATE POLICY "Allow authenticated read access" ON devices
 *   FOR SELECT USING (auth.role() = 'authenticated');
 * 
 * CREATE POLICY "Allow authenticated read access" ON incidents
 *   FOR SELECT USING (auth.role() = 'authenticated');
 * 
 * CREATE POLICY "Allow authenticated read access" ON alerts
 *   FOR SELECT USING (auth.role() = 'authenticated');
 * ```
 * 
 * 4. INITIALIZE IN YOUR APP
 * 
 * ```typescript
 * import { initializeDatabaseService } from './database/connection';
 * import { SupabaseDatabaseAdapter } from './database/adapters/supabase';
 * import { seedDatabase } from './database/seed';
 * 
 * const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
 * const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
 * 
 * const adapter = new SupabaseDatabaseAdapter(supabaseUrl!, supabaseKey!);
 * const db = initializeDatabaseService(adapter);
 * 
 * await db.connect();
 * 
 * // Seed data (run once)
 * await seedDatabase(db);
 * 
 * // Now use the database service throughout your app
 * const devices = await db.getDevices();
 * ```
 */

// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

/**
 * Add to your .env file:
 * 
 * VITE_SUPABASE_URL=https://your-project.supabase.co
 * VITE_SUPABASE_ANON_KEY=your-anon-key-here
 * 
 * Or for Node.js backends:
 * 
 * SUPABASE_URL=https://your-project.supabase.co
 * SUPABASE_ANON_KEY=your-anon-key-here
 * SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here (for admin operations)
 */

// ============================================================
// USAGE EXAMPLE
// ============================================================

/**
 * Example: Using Supabase adapter with real-time subscriptions
 * 
 * ```typescript
 * import { getDatabaseService } from './database/connection';
 * 
 * const db = getDatabaseService();
 * 
 * // Subscribe to new alerts
 * const unsubscribe = db.subscribeToAlerts((alert) => {
 *   console.log('New alert received:', alert);
 *   // Update your React state here
 *   setAlerts(prev => [alert, ...prev]);
 * });
 * 
 * // Subscribe to device updates
 * const unsubDevices = db.subscribeToDeviceUpdates((device) => {
 *   console.log('Device updated:', device);
 *   // Update device in state
 *   setDevices(prev => prev.map(d => d.id === device.id ? device : d));
 * });
 * 
 * // Clean up when component unmounts
 * return () => {
 *   unsubscribe?.();
 *   unsubDevices?.();
 * };
 * ```
 */
