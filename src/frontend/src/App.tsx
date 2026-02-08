import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Home from './pages/Home';
import StatusTracker from './pages/StatusTracker';
import AdminDashboard from './pages/admin/AdminDashboard';
import ReceivingAccounts from './pages/admin/ReceivingAccounts';
import NotAuthorized from './pages/NotAuthorized';
import AppLayout from './components/layout/AppLayout';
import AdminGuard from './components/auth/AdminGuard';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const statusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/status',
  component: StatusTracker,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  ),
});

const accountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/accounts',
  component: () => (
    <AdminGuard>
      <ReceivingAccounts />
    </AdminGuard>
  ),
});

const notAuthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/not-authorized',
  component: NotAuthorized,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  statusRoute,
  adminRoute,
  accountsRoute,
  notAuthorizedRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
