# IoT Sentinel - Complete Dashboard Requirements & Connections

> Generated: March 9, 2026
> Status: Full inventory of every screen, feature, component, data connection, and interaction in the IoT Sentinel dashboard.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Routing & Navigation](#2-routing--navigation)
3. [Theme System](#3-theme-system)
4. [Landing Page](#4-landing-page)
5. [Login Page](#5-login-page)
6. [Dashboard Layout (Shell)](#6-dashboard-layout-shell)
7. [Dashboard Page - Security Overview Tab](#7-dashboard-page---security-overview-tab)
8. [Dashboard Page - Security Posture Tab](#8-dashboard-page---security-posture-tab)
9. [Device Inventory Page](#9-device-inventory-page)
10. [Device Detail Page](#10-device-detail-page)
11. [Incidents (Investigations) Page](#11-incidents-investigations-page)
12. [Incident Detail Page](#12-incident-detail-page)
13. [Live Alerts Page](#13-live-alerts-page)
14. [Network Topology Page](#14-network-topology-page)
15. [Settings (Configure) Page](#15-settings-configure-page)
16. [Shared Components](#16-shared-components)
17. [Mock Data Schema](#17-mock-data-schema)
18. [CSS & Design Tokens](#18-css--design-tokens)
19. [External Dependencies](#19-external-dependencies)
20. [Future / Backend Connections](#20-future--backend-connections)

---

## 1. Architecture Overview

| Item | Detail |
|------|--------|
| Framework | React 18 + TypeScript |
| Routing | `react-router` v7 (Data mode with `createBrowserRouter` + `RouterProvider`) |
| Styling | Tailwind CSS v4 + custom CSS variables in `/src/styles/fonts.css` |
| Charts | Recharts (PieChart, BarChart, AreaChart, LineChart) |
| Animation | Motion (motion/react) for page transitions and scroll effects |
| Icons | lucide-react |
| UI Library | shadcn/ui components in `/src/app/components/ui/` |
| State | React `useState` + Context API (ThemeContext) |
| Persistence | `localStorage` for theme preference |
| Entry Point | `/src/app/App.tsx` (default export, wraps `ThemeProvider` > `RouterProvider`) |

---

## 2. Routing & Navigation

**File:** `/src/app/routes.ts`

| Route | Component | Parent | Description |
|-------|-----------|--------|-------------|
| `/` | `LandingPage` | None | Public marketing/info page |
| `/login` | `LoginPage` | None | Authentication screen |
| `/dashboard` | `Layout` (shell) | None | Dashboard wrapper with top nav + sidebar |
| `/dashboard` (index) | `DashboardPage` | Layout | Security Overview / Security Posture tabs |
| `/dashboard/devices` | `DevicesPage` | Layout | Device inventory list |
| `/dashboard/devices/:id` | `DeviceDetailPage` | Layout | Single device deep-dive |
| `/dashboard/incidents` | `IncidentsPage` | Layout | Incident review table |
| `/dashboard/incidents/:id` | `IncidentDetailPage` | Layout | Single incident investigation |
| `/dashboard/alerts` | `AlertsPage` | Layout | Live streaming alerts |
| `/dashboard/topology` | `TopologyPage` | Layout | Canvas-based network graph |
| `/dashboard/settings` | `SettingsPage` | Layout | System configuration |

### Navigation Items (in Layout shell)

| Label | Route | Icon | Notes |
|-------|-------|------|-------|
| Security Posture | `/dashboard` | LayoutDashboard | `end: true` (exact match) |
| Device Inventory | `/dashboard/devices` | Cpu | |
| Investigations | `/dashboard/incidents` | AlertTriangle | |
| Live Alerts | `/dashboard/alerts` | Bell | |
| Network Topology | `/dashboard/topology` | Network | |
| Configure | `/dashboard/settings` | Settings | |

---

## 3. Theme System

**File:** `/src/app/contexts/ThemeContext.tsx`

| Feature | Detail |
|---------|--------|
| Themes | `dark`, `light`, `system` |
| Table Density | `compact`, `comfortable`, `spacious` |
| Persistence | `localStorage` key: `iot-sentinel-theme` |
| Resolved Theme | Computes actual `dark`/`light` from system preference when `system` is selected |
| CSS Class | Applies `.dark` or `.light` class to `document.documentElement` |
| Note | Appearance controls (Theme + Density) intentionally removed from Settings UI; ThemeContext still functional |

### CSS Variables (theme-aware)

| Variable | Dark Value | Light Value |
|----------|-----------|-------------|
| `--splunk-bg` | `#0C0C0C` | `#F5F5F7` |
| `--splunk-surface` | `#111111` | `#FFFFFF` |
| `--splunk-card` | `#1A1A2E` | `#FFFFFF` |
| `--splunk-border` | `#2A2A3A` | `#E0E0E5` |
| `--splunk-muted` | `#8B8FA3` | `#6B6B7B` |
| `--splunk-text` | `#FFFFFF` | `#1A1A2E` |

### Constant Brand Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--splunk-orange` | `#FF6B35` | Primary accent |
| `--splunk-pink` | `#E8478C` | Secondary accent |
| `--splunk-gold` | `#FFB347` | Medium risk / warnings |
| `--splunk-green` | `#4BDE80` | Trusted / success |
| `--splunk-red` | `#FF4C4C` | Critical / error |

---

## 4. Landing Page

**File:** `/src/app/pages/LandingPage.tsx`

### Sections

| Section | Content | Interactions |
|---------|---------|--------------|
| Navbar | Logo, Platform dropdown (mega-menu), Security, Observability, Industries, Resources links, Support dropdown, user avatar, calendar, search, "Access Dashboard" button | Logo scrolls to top; nav links scroll to top; Support dropdown has GitHub + Email links; "Access Dashboard" navigates to `/login` |
| Hero | H1 "Security and observability at enterprise scale", subtitle, "Request a demo" CTA, dashboard screenshot image | "Request a demo" opens `RequestAccessModal` |
| Stats | 4 metric cards (10K+ Devices, 99.7% Threats Blocked, <30s Alert Response, 500+ SOC Teams) | Motion scroll-into-view animation |
| Device Scroll | Animated IoT device cards orbiting a central hub on scroll | Scroll-linked parallax via `motion/react` |
| Features | 6 feature cards in 3-column grid | Motion scroll-into-view animation |
| Resources | 1 featured card + 3 smaller resource cards with images | Unsplash images; scroll-to-top on CTAs |
| Footer | 4-column link grid (Company, Product, Learn, Resources), social links (GitHub, LinkedIn, Twitter/X, YouTube), copyright | Product links navigate to `/login`; social links scroll to top |

### Mega Menu (Platform dropdown)

| Column | Items |
|--------|-------|
| Products | Real-Time Device Monitoring, Incident Investigation, Live Alert Stream |
| Use Cases | Network Topology, Device Isolation, Threat Intelligence |
| Promo Card | "See IoT Sentinel in action" with findings preview |
| Bottom Banner | "Build digital resilience with Sentinel AI" |

### Support Dropdown

| Item | Destination |
|------|-------------|
| GitHub | `https://github.com/Fnc-Jit` (external) |
| Email Support | `mailto:jitrajesh5@gmail.com` |

### RequestAccessModal

**File:** `/src/app/components/RequestAccessModal.tsx`

| Field | Validation |
|-------|-----------|
| Name | Required |
| Email | Required, email format |
| Phone | Optional |
| Submit | Shows loading spinner, then success state |

---

## 5. Login Page

**File:** `/src/app/pages/LoginPage.tsx`

| Feature | Detail |
|---------|--------|
| Email field | Pre-filled: `analyst@iot-sentinel.io` |
| Password field | Show/hide toggle |
| Login button | Simulated 1200ms delay, then navigates to `/dashboard` |
| Forgot password | Toggle to forgot mode |
| Error handling | "Please enter your credentials" if fields empty |
| Back button | Navigates to `/` |
| Design | Dark theme, centered card, gradient bar, glow effects |

---

## 6. Dashboard Layout (Shell)

**File:** `/src/app/components/Layout.tsx`

### Top Bar Row 1 (Header)

| Element | Detail |
|---------|--------|
| Logo | Shield icon + "iot sentinel" text, navigates to `/` |
| Apps dropdown | Text "Apps" with chevron (desktop only) |
| Mobile hamburger | Toggles mobile menu (md breakpoint) |
| Status indicator | Green "Online" pulse (lg screens) |
| Admin badge | Red "Administrator" badge |
| Messages | Navigates to `/dashboard/alerts` |
| Settings | Navigates to `/dashboard/settings` |
| Activity | Navigates to `/dashboard` |
| Help dropdown | GitHub + Email links (same as Support) |
| User avatar | "SA" initials with gradient |
| Logout | Navigates to `/` |
| Search icon | Opens search modal overlay |

### Top Bar Row 2 (Navigation Tabs)

| Feature | Detail |
|---------|--------|
| Tab items | 6 navigation items (see Section 2) |
| Active indicator | Green (#4BDE80) underline |
| Enterprise Security badge | Shield icon with label (xl screens) |

### Search Modal

| Feature | Detail |
|---------|--------|
| Trigger | Search icon in header |
| Results | Quick actions linking to: Devices, Incidents, Alerts, Topology, Settings |
| Empty state | "Start typing to search..." |
| Close | Click backdrop or X button |

### Mobile Navigation

| Feature | Detail |
|---------|--------|
| Top dropdown | Full nav items + Sign Out (toggled by hamburger) |
| Bottom tab bar | First 5 nav items with icons, green active indicator |

---

## 7. Dashboard Page - Security Overview Tab

**File:** `/src/app/pages/DashboardPage.tsx` (activeTab: `'overview'`)

### KPI Cards (4-column grid)

| Card | Value Source | Icon | Color |
|------|-------------|------|-------|
| Total Devices | `dashboardStats.totalDevices` | Cpu | `#FF6B35` |
| Trusted Devices | `dashboardStats.trustedDevices` | Shield | `#4BDE80` |
| High Risk Devices | `dashboardStats.highRiskDevices` | AlertTriangle | `#FF6B35` |
| Active Incidents | `dashboardStats.activeIncidents` | Activity | `#FF4C4C` |

### Charts

| Chart | Type | Data | Library |
|-------|------|------|---------|
| Risk Distribution | Donut (PieChart) | `riskDistribution` array (5 risk levels) | Recharts |
| Average Trust Score Trend | Area chart | `trendData` (7 days, Mar 3-9) | Recharts |

### Bottom Panels

| Panel | Content | Actions |
|-------|---------|---------|
| High Risk Devices | Top 5 devices with risk level `high` or `critical` | Click row navigates to `/dashboard/devices/:id`; "View All" to `/dashboard/devices` |
| Active Incidents | Open + Investigating incidents (up to 4) | Click row navigates to `/dashboard/incidents/:id`; "View All" to `/dashboard/incidents` |

---

## 8. Dashboard Page - Security Posture Tab

**File:** `/src/app/pages/DashboardPage.tsx` (activeTab: `'posture'`, DEFAULT)

### Executive Summary Header

| Feature | Detail |
|---------|--------|
| Title | "Executive Summary" |
| Time Range Filters | `24h`, `7d` (default), `30d`, `90d`, `1y` toggle buttons |

### Key Metrics (3-column grid)

| Metric | Value | Change |
|--------|-------|--------|
| Mean Time to Triage | 106 min | +106 |
| Mean Time to Resolution | 187 min | +187 |
| Investigations Created | 1 | +1 |

### Charts

| Chart | Type | Data Source | Dimensions |
|-------|------|-----------|------------|
| Notables Distribution by Urgency | Stacked Bar | `notablesByUrgency` (12 time slots) | critical, high, medium, low, info |
| Notables by Domain | Grouped Bar | `notablesByDomain` (5 days) | endpoint, network, access, threat |
| Untriaged Notables by Domain | Grouped Bar | `untriagedByDomain` (5 days) | endpoint, network, access, threat |
| Top 10 Untriaged by Source | Donut (PieChart) | `topUntriagedSources` (5 sources) | Firewall, EDR, Cloud, IAM, Other |
| Untriaged Notables by Type | Donut (PieChart) | `untriagedByType` (5 types) | Malware, Phishing, Anomaly, Policy Violation, Other |

### Tab Button Animation

| Feature | Detail |
|---------|--------|
| "Security Posture" tab | Has `blink-animation` CSS class |
| Animation | Defined in `fonts.css` as `blink-button` keyframes (2s ease-in-out infinite, pulsing opacity 0.4-1.0) |

---

## 9. Device Inventory Page

**File:** `/src/app/pages/DevicesPage.tsx`

| Feature | Detail |
|---------|--------|
| Search bar | Filters by device name, ID, vendor, class |
| Risk filter tabs | All, Trusted, Low, Medium, High, Critical |
| Sort options | By ID, Name, Trust Score, Last Seen (asc/desc toggle) |
| Export CSV | Download button (stub) |
| Device table | Responsive table/card view |
| Trust bar | Visual progress bar colored by score |
| Row click | Navigates to `/dashboard/devices/:id` |

### Table Columns

| Column | Data Field |
|--------|-----------|
| Device ID | `device.id` |
| Device Name | `device.name` |
| Class | `device.class` |
| Vendor | `device.vendor` |
| Trust Score | `device.trustScore` (with visual bar) |
| Risk Level | `device.riskLevel` (RiskBadge) |
| Status | `device.status` (StatusBadge) |
| Last Seen | `device.lastSeen` (formatted) |

---

## 10. Device Detail Page

**File:** `/src/app/pages/DeviceDetailPage.tsx`

| Section | Content |
|---------|---------|
| Back navigation | Arrow + "Back to Device Inventory" |
| Hero Trust Panel | Large trust score number, risk badge, trend indicator |
| Device Info | Vendor, Device Class, MAC address, IP address, Last Seen |
| Score Breakdown | 4 horizontal bars: Behavioral, Policy, Drift, Threat Intelligence |
| Trust History Chart | Line chart (30-day history) with risk boundary reference lines |
| Evidence Panel | Evidence cards with violation type, severity, timestamp, details |
| Device Actions | Clear Violations, Toggle Maintenance, Isolate Device buttons |

### Data Connection

| Field | Source |
|-------|--------|
| Device data | `getDeviceById(id)` from `mockData.ts` |
| History data | `device.history[]` (30 entries, generated) |
| Evidence data | `device.evidence[]` |

### Chart Details

| Feature | Detail |
|---------|--------|
| Type | LineChart with reference lines |
| Risk boundaries | Horizontal lines at score thresholds (80=Trusted, 60=Low, 40=Medium, 20=High) |
| Tooltip | Custom tooltip showing date + score |
| Gradient | Orange gradient fill under line |

---

## 11. Incidents (Investigations) Page

**File:** `/src/app/pages/IncidentsPage.tsx`

| Feature | Detail |
|---------|--------|
| Summary charts | 2 donut charts: By Urgency, By Status |
| Search | Filter by incident ID, device ID, action |
| Filters | Status dropdown, Severity dropdown |
| Incident table | Sortable, clickable rows |
| Row click | Navigates to `/dashboard/incidents/:id` |

### Chart Data

| Chart | Categories |
|-------|-----------|
| By Urgency | Critical, High, Medium, Low, Informational, Unknown |
| By Status | New (open), In Progress (investigating), Pending, Resolved, Closed |

### Table Columns

| Column | Data Field |
|--------|-----------|
| Incident ID | `incident.id` |
| Device ID | `incident.deviceId` |
| Risk Level | `incident.riskLevel` (badge) |
| Severity | `incident.severity` (badge) |
| Status | `incident.status` (badge) |
| Recommended Action | `incident.recommendedAction` |
| Created | `incident.createdAt` (formatted) |

---

## 12. Incident Detail Page

**File:** `/src/app/pages/IncidentDetailPage.tsx`

| Section | Content |
|---------|---------|
| Back navigation | Arrow + "Back to Investigations" |
| Risk Summary | Risk level, Trust score, Confidence level |
| Device Context | Device ID, Vendor, Current IP, link to device detail |
| Incident Narrative | Plain-English description |
| Evidence Section | List of triggering events |
| Recommended Action | Action text (e.g., "VLAN Isolation + Firewall Block") |
| Adjacent Devices | List of potentially affected devices |
| Timeline | Vertical timeline of chronological events |
| Analyst Notes | Text input + submitted notes list |
| Status Control | Dropdown to change incident status |

### Data Connection

| Field | Source |
|-------|--------|
| Incident data | `getIncidentById(id)` from `mockData.ts` |
| Device context | `getDeviceById(incident.deviceId)` |
| Timeline | `incident.timeline[]` |
| Evidence | `incident.evidence[]` |
| Adjacent devices | `incident.adjacentDevices[]` |

### Interactive Features

| Feature | Detail |
|---------|--------|
| Status change | Local state update (dropdown) |
| Analyst notes | Add/view notes (local state) |
| Device link | Navigate to `/dashboard/devices/:deviceId` |

---

## 13. Live Alerts Page

**File:** `/src/app/pages/AlertsPage.tsx`

| Feature | Detail |
|---------|--------|
| Alert stream | Auto-generating new alerts on interval |
| Pause/Resume | Toggle button to stop/start stream |
| Clear alerts | Remove all alerts |
| Alert types | trust_update, policy_violation, status_change, graph_anomaly, new_incident |
| Severity levels | critical, warning, info |
| Auto-scroll | Ref-based scroll to latest alert |

### Alert Type Config

| Type | Icon | Color | Label |
|------|------|-------|-------|
| trust_update | TrendingDown | `#FF6B35` | Trust Update |
| policy_violation | Shield | `#E8478C` | Policy Violation |
| status_change | Cpu | `#FFB347` | Status Change |
| graph_anomaly | Network | `#FF4C4C` | Graph Anomaly |
| new_incident | AlertTriangle | `#FF4C4C` | New Incident |

### Severity Config

| Level | Color | Background | Border |
|-------|-------|-----------|--------|
| critical | `#FF4C4C` | `rgba(255,76,76,0.06)` | `rgba(255,76,76,0.15)` |
| warning | `#FF6B35` | `rgba(255,107,53,0.06)` | `rgba(255,107,53,0.15)` |
| info | `#8B8FA3` | `rgba(139,143,163,0.04)` | `rgba(139,143,163,0.08)` |

### Data Connection

| Source | Detail |
|--------|--------|
| Initial alerts | `initialAlerts` from `mockData.ts` (12 alerts) |
| Generated alerts | `generateNewAlert()` function creates random alerts from device pool |
| Interval | Configurable timer (auto-paused on user action) |

---

## 14. Network Topology Page

**File:** `/src/app/pages/TopologyPage.tsx`

| Feature | Detail |
|---------|--------|
| Rendering | HTML5 Canvas (direct canvas API, not a library) |
| Nodes | 13 nodes (1 Gateway + 12 devices) |
| Edges | Connections between devices, some marked suspicious |
| Edge types | normal, trusted, monitored |
| Risk coloring | Node colors match risk level |
| Controls | Zoom In, Zoom Out, Fit to Screen |
| Info panel | Click node to see device details |
| Node click | Navigate option to device detail page |

### Node Data

| Node | Position | Risk | Trust Score |
|------|----------|------|-------------|
| GATEWAY | Center (400, 260) | trusted | 100 |
| DEV-001 to DEV-012 | Pre-defined x,y coords | From device data | From device data |

### Edge Data

| Connection | Suspicious | Label |
|-----------|-----------|-------|
| GATEWAY to all devices | Various | Normal/Trusted/Monitored |
| DEV-004 to DEV-012 | Yes | "Lateral Movement" |
| DEV-005 to DEV-010 | Yes | "Suspicious" |

### Canvas Rendering

| Element | Style |
|---------|-------|
| Nodes | Circles with risk-colored fills, pulsing animation for suspicious |
| Edges | Lines with dashes for suspicious, solid for normal |
| Labels | Device name below node |
| Tooltip panel | Slide-in panel on node click |

---

## 15. Settings (Configure) Page

**File:** `/src/app/pages/SettingsPage.tsx`

### Maintenance Mode Section

| Control | Type | Detail |
|---------|------|--------|
| Enable Maintenance | Toggle | On/Off switch |
| Duration | Dropdown | Duration selector (e.g., 1h, 4h, 8h, 24h) |

### Notification Settings Section

| Control | Type | Detail |
|---------|------|--------|
| Email Alerts | Toggle | Enable/disable email notifications |
| Push Notifications | Toggle | Enable/disable push notifications |
| Alert Threshold | Selector | Minimum severity for notifications |

### Data Management Section

| Control | Detail |
|---------|--------|
| Data retention | Configuration option |
| Export data | Stub functionality |

### Note

> Appearance section (Theme + Table Density controls) was intentionally removed from the Settings page UI. The ThemeContext still functions for programmatic theme changes.

---

## 16. Shared Components

### `/src/app/components/RiskBadge.tsx`

| Component | Props | Usage |
|-----------|-------|-------|
| `RiskBadge` | `level: RiskLevel`, `size: 'sm' | 'md' | 'lg'` | Color-coded risk level pill |
| `StatusBadge` | `status: string`, `size: 'sm' | 'md'` | Device/incident status pill |

### `/src/app/components/DeviceScrollSection.tsx`

| Feature | Detail |
|---------|--------|
| Purpose | Parallax scroll section on landing page |
| Devices | 11+ device cards orbiting a central "Sentinel Core" |
| Animation | `useScroll` + `useTransform` from motion/react |
| Icons | Camera, Thermometer, Lock, Activity, Wifi, Cpu, Radio, Monitor, Server, Zap, Globe, AlertTriangle, Network |

### `/src/app/components/RequestAccessModal.tsx`

| Feature | Detail |
|---------|--------|
| Trigger | "Request a demo", "Get free trial" CTAs on landing page |
| Fields | Name (required), Email (required, validated), Phone (optional) |
| States | Form, Loading (spinner), Success (checkmark) |
| Animation | AnimatePresence from motion/react |

### `/src/app/components/ui/` (shadcn/ui)

48 UI primitive components available:

accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle-group, toggle, tooltip, use-mobile, utils

---

## 17. Mock Data Schema

**File:** `/src/app/data/mockData.ts`

### Types

```typescript
type RiskLevel = 'trusted' | 'low' | 'medium' | 'high' | 'critical';
type DeviceStatus = 'active' | 'isolated' | 'maintenance';
type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
```

### Device Interface

| Field | Type | Description |
|-------|------|-------------|
| id | string | e.g., "DEV-001" |
| name | string | Human-readable name |
| class | string | HVAC, Surveillance, OT/ICS, Medical, Access Control, etc. |
| vendor | string | Manufacturer |
| trustScore | number | 0-100 |
| riskLevel | RiskLevel | Computed risk category |
| status | DeviceStatus | Current operational status |
| lastSeen | string | ISO timestamp |
| mac | string | MAC address |
| ip | string | IP address |
| behavioral | number | Behavioral sub-score (0-100) |
| policy | number | Policy compliance sub-score (0-100) |
| drift | number | Configuration drift sub-score (0-100) |
| threat | number | Threat intelligence sub-score (0-100) |
| history | `{date, score}[]` | 30-day trust score history |
| evidence | `Evidence[]` | Security evidence entries |

### Devices (12 total)

| ID | Name | Class | Vendor | Trust | Risk | Status |
|----|------|-------|--------|-------|------|--------|
| DEV-001 | Smart Thermostat | HVAC | Nest | 94 | trusted | active |
| DEV-002 | IP Camera - Lobby | Surveillance | Hikvision | 71 | low | active |
| DEV-003 | Industrial PLC #1 | OT/ICS | Siemens | 55 | medium | active |
| DEV-004 | Medical Monitor | Medical | Philips | 28 | high | active |
| DEV-005 | Smart Lock - Server Room | Access Control | Schlage | 11 | critical | isolated |
| DEV-006 | Conference Room Display | AV/Display | Samsung | 88 | trusted | active |
| DEV-007 | Industrial PLC #2 | OT/ICS | Rockwell | 47 | medium | maintenance |
| DEV-008 | HVAC Controller | HVAC | Honeywell | 79 | low | active |
| DEV-009 | Network Printer | Peripheral | HP | 63 | low | active |
| DEV-010 | Smart Elevator Panel | Building Mgmt | KONE | 38 | high | active |
| DEV-011 | VoIP Gateway | Telephony | Cisco | 85 | trusted | active |
| DEV-012 | Infusion Pump | Medical | Baxter | 22 | critical | isolated |

### Incident Interface

| Field | Type | Description |
|-------|------|-------------|
| id | string | e.g., "INC-001" |
| deviceId | string | Reference to device |
| riskLevel | RiskLevel | Incident risk |
| severity | IncidentSeverity | Incident severity |
| status | IncidentStatus | Workflow status |
| recommendedAction | string | SOC recommendation |
| createdAt | string | ISO timestamp |
| narrative | string | Plain-English description |
| evidence | string[] | List of evidence strings |
| timeline | `{time, event}[]` | Chronological events |
| adjacentDevices | string[] | Affected device IDs |
| trustScore | number | Device trust at time of incident |
| confidence | number | AI confidence (0-100) |
| vendor | string | Device vendor |
| ip | string | Device IP at time |

### Incidents (6 total)

| ID | Device | Risk | Severity | Status | Action |
|----|--------|------|----------|--------|--------|
| INC-001 | DEV-005 | critical | critical | investigating | VLAN Isolation + Firewall Block |
| INC-002 | DEV-004 | high | high | open | Network Segmentation + Traffic Inspection |
| INC-003 | DEV-012 | critical | critical | open | Immediate Isolation + Factory Reset |
| INC-004 | DEV-010 | high | high | investigating | Config Rollback + Access Review |
| INC-005 | DEV-003 | medium | medium | resolved | Firmware Update Required |
| INC-006 | DEV-002 | low | low | closed | Monitor + Traffic Filtering |

### Alert Interface

| Field | Type | Description |
|-------|------|-------------|
| id | string | e.g., "ALT-001" |
| type | trust_update / policy_violation / status_change / graph_anomaly / new_incident | Alert category |
| deviceId | string | Reference to device |
| message | string | Alert description |
| timestamp | string | ISO timestamp |
| severity | info / warning / critical | Alert severity |

### Initial Alerts (12 total)

Pre-loaded alerts covering all 5 alert types and 3 severity levels.

### Computed Exports

| Export | Computation |
|--------|------------|
| `riskColors` | Map of RiskLevel to hex color |
| `riskLabels` | Map of RiskLevel to display label |
| `getDeviceById(id)` | Lookup device by ID |
| `getIncidentById(id)` | Lookup incident by ID |
| `dashboardStats` | Computed totals (totalDevices, trustedDevices, highRiskDevices, activeIncidents) |
| `riskDistribution` | Array of {name, value, color} for donut chart |

---

## 18. CSS & Design Tokens

**File:** `/src/styles/fonts.css`

### Fonts

| Font | Usage |
|------|-------|
| Inter (400-900) | Primary UI font |
| JetBrains Mono (400-500) | Code/mono elements |

### Custom CSS Classes

| Class | Purpose |
|-------|---------|
| `.splunk-gradient-bar` | Animated gradient bar (orange > pink > gold, 4s loop) |
| `.splunk-gradient-text` | Gradient text effect (orange to pink) |
| `.splunk-subheader` | Uppercase, tracked, small text headers |
| `.blink-animation` | Pulsing opacity animation for Security Posture tab (2s loop) |

### Custom Scrollbar

| Element | Style |
|---------|-------|
| Width | 5px |
| Track | Transparent |
| Thumb | `var(--splunk-border)` |
| Thumb hover | `var(--splunk-muted)` |

---

## 19. External Dependencies

### Runtime Dependencies

| Package | Version | Usage |
|---------|---------|-------|
| react-router | 7.13.0 | Client-side routing (Data mode) |
| recharts | 2.15.2 | All charts (Pie, Bar, Area, Line) |
| motion | 12.23.24 | Page animations, scroll effects |
| lucide-react | 0.487.0 | All icons throughout the app |
| sonner | 2.0.3 | Toast notifications |
| tailwind-merge | 3.2.0 | Tailwind class merging |
| clsx | 2.1.1 | Conditional classnames |
| class-variance-authority | 0.7.1 | Component variants |
| date-fns | 3.6.0 | Date formatting |
| @radix-ui/* | Various | shadcn/ui primitives |
| @mui/material | 7.3.5 | Material UI components |
| @emotion/react | 11.14.0 | MUI peer dependency |
| @emotion/styled | 11.14.1 | MUI peer dependency |
| react-dnd | 16.0.1 | Drag and drop |
| react-dnd-html5-backend | 16.0.1 | DnD HTML5 backend |
| react-hook-form | 7.55.0 | Form handling |
| react-slick | 0.31.0 | Carousel |
| react-responsive-masonry | 2.7.1 | Masonry layouts |
| vaul | 1.1.2 | Drawer component |

### Dev Dependencies

| Package | Version | Usage |
|---------|---------|-------|
| tailwindcss | 4.1.12 | Utility CSS framework |
| @tailwindcss/vite | 4.1.12 | Tailwind Vite plugin |
| vite | 6.3.5 | Build tool |
| @vitejs/plugin-react | 4.7.0 | React Vite plugin |

---

## 20. Future / Backend Connections

These features currently use mock data and local state. For production, they would require backend connections:

### API Endpoints Needed

| Endpoint | Method | Purpose | Current Mock |
|----------|--------|---------|-------------|
| `/api/devices` | GET | Fetch all devices | `devices` array in mockData.ts |
| `/api/devices/:id` | GET | Fetch single device | `getDeviceById()` |
| `/api/devices/:id/isolate` | POST | Isolate a device | Button stub |
| `/api/devices/:id/maintenance` | POST | Toggle maintenance | Button stub |
| `/api/devices/:id/clear` | POST | Clear violations | Button stub |
| `/api/incidents` | GET | Fetch all incidents | `incidents` array in mockData.ts |
| `/api/incidents/:id` | GET | Fetch single incident | `getIncidentById()` |
| `/api/incidents/:id/status` | PATCH | Update incident status | Local state |
| `/api/incidents/:id/notes` | POST | Add analyst note | Local state |
| `/api/alerts` | GET | Fetch alerts | `initialAlerts` array |
| `/api/alerts/stream` | WebSocket | Real-time alert stream | `generateNewAlert()` timer |
| `/api/auth/login` | POST | Authenticate user | Simulated delay |
| `/api/auth/logout` | POST | End session | Navigate to `/` |
| `/api/settings` | GET/PATCH | Read/update settings | Local state |
| `/api/topology` | GET | Fetch network graph | Hardcoded nodes/edges |
| `/api/export/devices` | GET | Export CSV | Stub |
| `/api/search` | GET | Global search | Static quick actions |

### WebSocket Connections

| Channel | Purpose | Current Implementation |
|---------|---------|----------------------|
| `alerts` | Real-time alert streaming | `setInterval` + `generateNewAlert()` |
| `devices` | Device status updates | Static mock data |
| `topology` | Network graph changes | Static canvas render |

### Authentication

| Feature | Current | Production |
|---------|---------|-----------|
| Login | Simulated (any credentials work) | OAuth2 / SAML / SSO |
| Session | None (no token) | JWT / Session cookie |
| Authorization | None (no roles) | RBAC (Analyst, Admin, Viewer) |
| Logout | Navigate to landing | Invalidate session |

### Data Persistence

| Feature | Current Storage | Production |
|---------|----------------|-----------|
| Theme preference | localStorage | localStorage (fine as-is) |
| Incident notes | React state (lost on refresh) | Database (Supabase/PostgreSQL) |
| Incident status changes | React state (lost on refresh) | Database |
| Settings configuration | React state (lost on refresh) | Database |
| Alert history | React state (lost on refresh) | Database + time-series |
| Device actions (isolate/maintenance) | Button stubs | API calls to network controller |
| Export CSV | Stub | Server-side generation |
| Search | Static quick actions | Full-text search (Elasticsearch/Supabase) |
| Request Access form | Local state only | Email service / CRM integration |

---

## Summary

The IoT Sentinel dashboard is a fully functional frontend application with:

- **10 screens** (Landing, Login, Dashboard, Devices, Device Detail, Incidents, Incident Detail, Alerts, Topology, Settings)
- **12 mock IoT devices** across 10 device classes
- **6 mock incidents** with full investigation data
- **12 pre-loaded alerts** with real-time generation
- **13 topology nodes** with suspicious edge detection
- **3 theme modes** (Dark, Light, System) with CSS variable system
- **48 shadcn/ui components** available
- **Canvas-based network visualization**
- **Motion-powered animations** on landing page
- **Splunk-inspired design language** with gradient bar, mega-menu, and green active indicators

All data is currently mocked. Production deployment would require Supabase or equivalent backend for authentication, data persistence, real-time streaming, and device management API integration.
