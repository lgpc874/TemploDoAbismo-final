import { useAuth } from '@/hooks/use-auth';
import { PageTransition } from '@/components/page-transition';
import MobileAdminPanel from '@/components/admin/mobile-admin-panel';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();

  // Acesso sempre permitido no ambiente Replit

  return (
    <PageTransition>
      <MobileAdminPanel />
    </PageTransition>
  );
}