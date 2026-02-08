import { useState } from 'react';
import { useGetAllReceivingAccounts, useCreateReceivingAccount, useUpdateReceivingAccount } from '../../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReceivingAccountForm from '../../components/admin/ReceivingAccountForm';
import { Plus, Edit } from 'lucide-react';
import { AccountType } from '../../backend';
import type { ReceivingAccount } from '../../backend';

export default function ReceivingAccounts() {
  const { data: accounts, isLoading } = useGetAllReceivingAccounts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ReceivingAccount | null>(null);

  const createMutation = useCreateReceivingAccount();
  const updateMutation = useUpdateReceivingAccount();

  const handleCreate = async (accountType: AccountType, accountName: string, accountDetails: string) => {
    await createMutation.mutateAsync({ accountType, accountName, accountDetails });
    setIsCreateOpen(false);
  };

  const handleUpdate = async (accountType: AccountType, accountName: string, accountDetails: string) => {
    if (editingAccount) {
      await updateMutation.mutateAsync({
        accountId: editingAccount.id,
        accountType,
        accountName,
        accountDetails,
      });
      setEditingAccount(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading payment methods...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <p className="text-muted-foreground mt-2">Manage payment accounts for receiving fees</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Payment Method</DialogTitle>
              <DialogDescription>Add a new bank or cryptocurrency account for receiving payments</DialogDescription>
            </DialogHeader>
            <ReceivingAccountForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateOpen(false)}
              isSubmitting={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts?.map(([id, account]) => (
          <Card key={id.toString()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {account.accountType === AccountType.bank ? '🏦' : '₿'}
                    {account.accountName}
                  </CardTitle>
                  <CardDescription className="capitalize">
                    {account.accountType} Account
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingAccount(account)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap bg-muted p-3 rounded font-mono">
                {account.accountDetails}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>

      {accounts?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No payment methods configured yet</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Payment Method
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!editingAccount} onOpenChange={(open) => !open && setEditingAccount(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
            <DialogDescription>Update payment account details</DialogDescription>
          </DialogHeader>
          {editingAccount && (
            <ReceivingAccountForm
              initialData={editingAccount}
              onSubmit={handleUpdate}
              onCancel={() => setEditingAccount(null)}
              isSubmitting={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
