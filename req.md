# IoT Sentinel Web Dashboard — API Requirements

All endpoints needed to replace mock data with live backend. Currently **0 of 30** endpoints are connected — the entire app runs on local mock data.

---

## Status: ❌ = Not Connected | 🟡 = Stub Only | ✅ = Active

---

## 🔐 Authentication

| Status | Method | Endpoint | File | Notes |
|--------|--------|----------|------|-------|
| ❌ | `POST` | `/api/auth/login` | `LoginPage.tsx:15` | Simulated 1.2s delay, hardcoded success |
| ❌ | `POST` | `/api/auth/logout` | `Layout.tsx` | Not yet wired |
| ❌ | `GET` | `/api/auth/me` | — | Needed for session validation |
| ❌ | `POST` | `/api/auth/2fa/verify` | `SettingsPage.tsx:158` | 2FA toggle exists, no backend |

---

## 📱 Devices

| Status | Method | Endpoint | File | Notes |
|--------|--------|----------|------|-------|
| ❌ | `GET` | `/api/devices` | `DevicesPage.tsx:4` | Uses `devices` from mockData |
| ❌ | `GET` | `/api/devices/:id` | `DeviceDetailPage.tsx:8` | Uses `getDeviceById()` from mockData |
| ❌ | `POST` | `/api/devices/:id/clear` | `DeviceDetailPage.tsx:158` | `handleAction('clear')` — local alert only |
| ❌ | `POST` | `/api/devices/:id/maintenance` | `DeviceDetailPage.tsx:169` | `handleAction('maintenance')` — local alert only |
| ❌ | `POST` | `/api/devices/:id/isolate` | `DeviceDetailPage.tsx:180` | `handleAction('isolate')` — local alert only |
| ❌ | `GET` | `/api/devices/:id/trust-history` | `DeviceDetailPage.tsx` | Trust score chart uses hardcoded data |

---

## 🚨 Incidents

| Status | Method | Endpoint | File | Notes |
|--------|--------|----------|------|-------|
| ❌ | `GET` | `/api/incidents` | `IncidentsPage.tsx:11` | Uses `incidents` from mockData |
| ❌ | `GET` | `/api/incidents/:id` | `IncidentDetailPage.tsx:7` | Uses `getIncidentById()` from mockData |
| ❌ | `POST` | `/api/incidents/:id/notes` | `IncidentDetailPage.tsx` | Analyst notes — local state only |
| ❌ | `PATCH` | `/api/incidents/:id/status` | `IncidentDetailPage.tsx` | Status change — local state only |

---

## ⚠️ Alerts & Real-Time Events

| Status | Method | Endpoint | File | Notes |
|--------|--------|----------|------|-------|
| ❌ | `WS` | `/ws/alerts/stream` | `AlertsPage.tsx:52` | Uses `setInterval` + `generateNewAlert()` |
| ❌ | `GET` | `/api/alerts` | `AlertsPage.tsx:7` | Uses `initialAlerts` from mockData |
| ❌ | `POST` | `/api/alerts/clear` | `AlertsPage.tsx` | Clears local array only |
| ❌ | `PATCH` | `/api/alerts/:id/acknowledge` | — | Not yet implemented |

---

## 📊 Dashboard

| Status | Method | Endpoint | File | Notes |
|--------|--------|----------|------|-------|
| ❌ | `GET` | `/api/dashboard/stats` | `DashboardPage.tsx:9` | Uses `dashboardStats` from mockData |
| ❌ | `GET` | `/api/dashboard/risk-distribution` | `DashboardPage.tsx:9` | Uses `riskDistribution` from mockData |
| ❌ | `GET` | `/api/dashboard/trend?range=7d` | `DashboardPage.tsx:12` | Hardcoded `trendData` array |
| ❌ | `GET` | `/api/dashboard/posture?range=7d` | `DashboardPage.tsx:19-64` | All posture charts use hardcoded data |
| ❌ | `GET` | `/api/dashboard/notables/urgency` | `DashboardPage.tsx:19` | `notablesByUrgency` hardcoded |
| ❌ | `GET` | `/api/dashboard/notables/domain` | `DashboardPage.tsx:34` | `notablesByDomain` hardcoded |
| ❌ | `GET` | `/api/dashboard/untriaged/source` | `DashboardPage.tsx:50` | `topUntriagedSources` hardcoded |
| ❌ | `GET` | `/api/dashboard/untriaged/type` | `DashboardPage.tsx:58` | `untriagedByType` hardcoded |

---

## 🗺️ Network Topology

| Status | Method | Endpoint | File | Notes |
|--------|--------|----------|------|-------|
| ❌ | `GET` | `/api/topology/graph` | `TopologyPage.tsx:4` | Uses `devices` from mockData + hardcoded nodes |

---

## ⚙️ Settings

| Status | Method | Endpoint | File | Notes |
|--------|--------|----------|------|-------|
| ❌ | `GET` | `/api/settings` | `SettingsPage.tsx:54` | All toggles are local `useState` |
| ❌ | `PATCH` | `/api/settings` | `SettingsPage.tsx:65` | `handleSave()` — shows "Saved!" but no backend call |
| ❌ | `POST` | `/api/settings/api-key/rotate` | `SettingsPage.tsx:177` | Rotate button exists, no action |

---

## 📝 Summary

| Category | Total Endpoints | Connected | Remaining |
|----------|----------------|-----------|-----------|
| Auth | 4 | 0 | **4** |
| Devices | 6 | 0 | **6** |
| Incidents | 4 | 0 | **4** |
| Alerts/WS | 4 | 0 | **4** |
| Dashboard | 8 | 0 | **8** |
| Topology | 1 | 0 | **1** |
| Settings | 3 | 0 | **3** |
| **Total** | **30** | **0** | **30** |

---

## 🛠️ Mock Data Dependencies

All screens import from `src/app/data/mockData.ts`:

| Import | Used By |
|--------|---------|
| `devices` | DevicesPage, DashboardPage, TopologyPage |
| `incidents` | IncidentsPage, DashboardPage |
| `initialAlerts` | AlertsPage |
| `dashboardStats` | DashboardPage |
| `riskDistribution` | DashboardPage |
| `getDeviceById()` | DeviceDetailPage, IncidentDetailPage |
| `getIncidentById()` | IncidentDetailPage |
| `riskColors` | All pages (styling only — keep as-is) |

---

## 🔌 Database Layer (Ready but Unused)

The project includes a prepared database layer at `src/app/database/`:

| File | Status | Purpose |
|------|--------|---------|
| `schema.sql` | ✅ Ready | Full PostgreSQL schema for devices, incidents, alerts |
| `connection.ts` | ✅ Ready | `DatabaseAdapter` interface + `MockDatabaseAdapter` |
| `types.ts` | ✅ Ready | `ApiResponse<T>`, `ApiError`, all data models |
| `seed.ts` | ✅ Ready | Seeds DB from mockData on first run |
| `adapters/supabase.example.ts` | ✅ Ready | Example Supabase adapter implementation |

> The database layer is fully designed but no page currently calls it. All pages import directly from `mockData.ts`.
