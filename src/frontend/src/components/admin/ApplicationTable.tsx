import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '../status/StatusBadge';
import { Search } from 'lucide-react';
import type { Application } from '../../backend';

interface ApplicationTableProps {
  applications: [bigint, Application][];
  onSelectApplication: (app: Application) => void;
  selectedAppId?: bigint;
}

export default function ApplicationTable({ applications, onSelectApplication, selectedAppId }: ApplicationTableProps) {
  const [searchId, setSearchId] = useState('');

  const filteredApps = applications.filter(([id]) => 
    searchId === '' || id.toString().includes(searchId)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription>Review and manage submitted applications</CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Application ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredApps.map(([id, app]) => (
                  <TableRow
                    key={id.toString()}
                    className={`cursor-pointer ${selectedAppId?.toString() === id.toString() ? 'bg-muted' : ''}`}
                    onClick={() => onSelectApplication(app)}
                  >
                    <TableCell className="font-mono">{id.toString()}</TableCell>
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.country}</TableCell>
                    <TableCell>${app.amount.toString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
