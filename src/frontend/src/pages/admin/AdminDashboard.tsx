import { useState } from 'react';
import { useGetAllApplications } from '../../hooks/useAdmin';
import ApplicationTable from '../../components/admin/ApplicationTable';
import ApplicationDetail from '../../components/admin/ApplicationDetail';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Application } from '../../backend';

export default function AdminDashboard() {
  const { data: applications, isLoading } = useGetAllApplications();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  if (isLoading) {
    return (
      <div className="py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading applications...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Review and manage grant applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ApplicationTable
            applications={applications || []}
            onSelectApplication={setSelectedApp}
            selectedAppId={selectedApp?.id}
          />
        </div>

        <div className="lg:col-span-1">
          {selectedApp ? (
            <ApplicationDetail application={selectedApp} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>Select an application to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  No application selected
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
