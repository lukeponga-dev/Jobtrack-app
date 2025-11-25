import DashboardLayout from "../dashboard/layout";
import ProfileClient from './ProfileClient';

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="max-w-2xl text-muted-foreground">
            Manage your account and profile settings.
          </p>
        </header>
        <ProfileClient />
      </div>
    </DashboardLayout>
  );
}
