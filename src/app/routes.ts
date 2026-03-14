import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import DeviceDetailPage from './pages/DeviceDetailPage';
import IncidentsPage from './pages/IncidentsPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import AlertsPage from './pages/AlertsPage';
import TopologyPage from './pages/TopologyPage';
import SettingsPage from './pages/SettingsPage';
import ThreatIntelPage from './pages/ThreatIntelPage';
import UEBAPage from './pages/UEBAPage';
import KillChainPage from './pages/KillChainPage';
import LogExplorerPage from './pages/LogExplorerPage';
import CompliancePage from './pages/CompliancePage';
import SOCWorkbenchPage from './pages/SOCWorkbenchPage';
import CLIPage from './pages/CLIPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/dashboard',
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'devices', Component: DevicesPage },
      { path: 'devices/:id', Component: DeviceDetailPage },
      { path: 'incidents', Component: IncidentsPage },
      { path: 'incidents/:id', Component: IncidentDetailPage },
      { path: 'alerts', Component: AlertsPage },
      { path: 'topology', Component: TopologyPage },
      { path: 'log-explorer', Component: LogExplorerPage },
      { path: 'ueba', Component: UEBAPage },
      { path: 'kill-chain', Component: KillChainPage },
      { path: 'threat-intel', Component: ThreatIntelPage },
      { path: 'compliance', Component: CompliancePage },
      { path: 'soc', Component: SOCWorkbenchPage },
      { path: 'cli', Component: CLIPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
]);

