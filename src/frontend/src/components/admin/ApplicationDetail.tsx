import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '../status/StatusBadge';
import { useUpdateApplicationStatus, useSetProcessingFee, useRemoveProcessingFee, useGetProcessingFee, useAssignReceivingAccount, useGetAllReceivingAccounts } from '../../hooks/useAdmin';
import { CheckCircle2, XCircle, DollarSign, Trash2 } from 'lucide-react';
import { ApplicationStatus } from '../../backend';
import type { Application } from '../../backend';

interface ApplicationDetailProps {
  application: Application;
}

export default function ApplicationDetail({ application }: ApplicationDetailProps) {
  const [processingFee, setProcessingFee] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const updateStatusMutation = useUpdateApplicationStatus();
  const setFeeMutation = useSetProcessingFee();
  const removeFeeMutation = useRemoveProcessingFee();
  const assignAccountMutation = useAssignReceivingAccount();

  const { data: currentFee } = useGetProcessingFee(application.id);
  const { data: accounts } = useGetAllReceivingAccounts();

  useEffect(() => {
    if (currentFee !== null && currentFee !== undefined) {
      setProcessingFee(currentFee.toString());
    } else {
      setProcessingFee('');
    }
  }, [currentFee]);

  const handleApprove = async () => {
    await updateStatusMutation.mutateAsync({ applicationId: application.id, status: ApplicationStatus.approved });
  };

  const handleReject = async () => {
    await updateStatusMutation.mutateAsync({ applicationId: application.id, status: ApplicationStatus.rejected });
  };

  const handleSetFee = async () => {
    const fee = BigInt(processingFee);
    await setFeeMutation.mutateAsync({ appId: application.id, fee });
  };

  const handleRemoveFee = async () => {
    await removeFeeMutation.mutateAsync(application.id);
    setProcessingFee('');
  };

  const handleAssignAccount = async () => {
    if (selectedAccountId) {
      await assignAccountMutation.mutateAsync({
        applicationId: application.id,
        accountId: BigInt(selectedAccountId),
      });
    }
  };

  const isApproved = application.status === ApplicationStatus.approved;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Application Details</CardTitle>
        <CardDescription>ID: {application.id.toString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <StatusBadge status={application.status} />
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-semibold">{application.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-semibold">{application.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Country</p>
            <p className="font-semibold">{application.country}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Requested Amount</p>
            <p className="font-semibold text-lg">${application.amount.toString()}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Actions</h4>
          <div className="flex gap-2">
            <Button
              onClick={handleApprove}
              disabled={updateStatusMutation.isPending || application.status === ApplicationStatus.approved}
              className="flex-1"
              size="sm"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              onClick={handleReject}
              disabled={updateStatusMutation.isPending || application.status === ApplicationStatus.rejected}
              variant="destructive"
              className="flex-1"
              size="sm"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Processing Fee</h4>
          <div className="space-y-2">
            <Label htmlFor="fee">Fee Amount (USD)</Label>
            <div className="flex gap-2">
              <Input
                id="fee"
                type="number"
                value={processingFee}
                onChange={(e) => setProcessingFee(e.target.value)}
                placeholder="Enter fee amount"
              />
              <Button
                onClick={handleSetFee}
                disabled={setFeeMutation.isPending || !processingFee}
                size="icon"
              >
                <DollarSign className="h-4 w-4" />
              </Button>
              {currentFee !== null && currentFee !== undefined && (
                <Button
                  onClick={handleRemoveFee}
                  disabled={removeFeeMutation.isPending}
                  variant="destructive"
                  size="icon"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {isApproved && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Payment Method</h4>
              <div className="space-y-2">
                <Label htmlFor="account">Select Payment Method</Label>
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Choose payment method..." />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts?.map(([id, account]) => (
                      <SelectItem key={id.toString()} value={id.toString()}>
                        {account.accountName} ({account.accountType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAssignAccount}
                  disabled={assignAccountMutation.isPending || !selectedAccountId}
                  className="w-full"
                  size="sm"
                >
                  Assign Payment Method
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
