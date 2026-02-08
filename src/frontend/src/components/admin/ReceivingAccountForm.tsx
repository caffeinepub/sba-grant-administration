import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountType } from '../../backend';
import type { ReceivingAccount } from '../../backend';

interface ReceivingAccountFormProps {
  initialData?: ReceivingAccount;
  onSubmit: (accountType: AccountType, accountName: string, accountDetails: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function ReceivingAccountForm({ initialData, onSubmit, onCancel, isSubmitting }: ReceivingAccountFormProps) {
  const [accountType, setAccountType] = useState<'bank' | 'crypto'>(
    initialData?.accountType === AccountType.bank ? 'bank' : 'crypto'
  );
  const [accountName, setAccountName] = useState(initialData?.accountName || '');
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    swiftBic: '',
    bankAddress: '',
    reference: '',
  });
  const [cryptoDetails, setCryptoDetails] = useState({
    network: '',
    currency: '',
    walletAddress: '',
    tagMemo: '',
    reference: '',
  });

  useEffect(() => {
    if (initialData) {
      const lines = initialData.accountDetails.split('\n');
      if (initialData.accountType === AccountType.bank) {
        const details: any = {};
        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          if (key.includes('Bank Name')) details.bankName = value;
          if (key.includes('Account Holder')) details.accountHolder = value;
          if (key.includes('Account Number')) details.accountNumber = value;
          if (key.includes('SWIFT')) details.swiftBic = value;
          if (key.includes('Bank Address')) details.bankAddress = value;
          if (key.includes('Reference')) details.reference = value;
        });
        setBankDetails(details);
      } else {
        const details: any = {};
        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          if (key.includes('Network')) details.network = value;
          if (key.includes('Currency')) details.currency = value;
          if (key.includes('Wallet Address')) details.walletAddress = value;
          if (key.includes('Tag/Memo')) details.tagMemo = value;
          if (key.includes('Reference')) details.reference = value;
        });
        setCryptoDetails(details);
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let details = '';
    if (accountType === 'bank') {
      details = `Bank Name: ${bankDetails.bankName}
Account Holder: ${bankDetails.accountHolder}
Account Number/IBAN: ${bankDetails.accountNumber}
SWIFT/BIC: ${bankDetails.swiftBic}
Bank Address: ${bankDetails.bankAddress}
Reference/Memo: ${bankDetails.reference}`;
    } else {
      details = `Network: ${cryptoDetails.network}
Currency: ${cryptoDetails.currency}
Wallet Address: ${cryptoDetails.walletAddress}
Tag/Memo: ${cryptoDetails.tagMemo}
Reference Instructions: ${cryptoDetails.reference}`;
    }

    const type = accountType === 'bank' ? AccountType.bank : AccountType.crypto;
    await onSubmit(type, accountName, details);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name *</Label>
        <Input
          id="accountName"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="e.g., Primary Business Account"
          required
        />
      </div>

      <Tabs value={accountType} onValueChange={(v) => setAccountType(v as 'bank' | 'crypto')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
          <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
        </TabsList>

        <TabsContent value="bank" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name *</Label>
            <Input
              id="bankName"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              required={accountType === 'bank'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountHolder">Account Holder Name *</Label>
            <Input
              id="accountHolder"
              value={bankDetails.accountHolder}
              onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
              required={accountType === 'bank'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number/IBAN *</Label>
            <Input
              id="accountNumber"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
              required={accountType === 'bank'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="swiftBic">SWIFT/BIC Code *</Label>
            <Input
              id="swiftBic"
              value={bankDetails.swiftBic}
              onChange={(e) => setBankDetails({ ...bankDetails, swiftBic: e.target.value })}
              required={accountType === 'bank'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankAddress">Bank Address</Label>
            <Textarea
              id="bankAddress"
              value={bankDetails.bankAddress}
              onChange={(e) => setBankDetails({ ...bankDetails, bankAddress: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankReference">Reference/Memo Instructions</Label>
            <Input
              id="bankReference"
              value={bankDetails.reference}
              onChange={(e) => setBankDetails({ ...bankDetails, reference: e.target.value })}
              placeholder="e.g., Include Application ID"
            />
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="network">Network *</Label>
            <Input
              id="network"
              value={cryptoDetails.network}
              onChange={(e) => setCryptoDetails({ ...cryptoDetails, network: e.target.value })}
              placeholder="e.g., Bitcoin, Ethereum, BSC"
              required={accountType === 'crypto'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency *</Label>
            <Input
              id="currency"
              value={cryptoDetails.currency}
              onChange={(e) => setCryptoDetails({ ...cryptoDetails, currency: e.target.value })}
              placeholder="e.g., BTC, ETH, USDT"
              required={accountType === 'crypto'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Wallet Address *</Label>
            <Input
              id="walletAddress"
              value={cryptoDetails.walletAddress}
              onChange={(e) => setCryptoDetails({ ...cryptoDetails, walletAddress: e.target.value })}
              placeholder="Enter wallet address"
              required={accountType === 'crypto'}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagMemo">Tag/Memo (if applicable)</Label>
            <Input
              id="tagMemo"
              value={cryptoDetails.tagMemo}
              onChange={(e) => setCryptoDetails({ ...cryptoDetails, tagMemo: e.target.value })}
              placeholder="Enter tag or memo if required"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cryptoReference">Reference Instructions</Label>
            <Input
              id="cryptoReference"
              value={cryptoDetails.reference}
              onChange={(e) => setCryptoDetails({ ...cryptoDetails, reference: e.target.value })}
              placeholder="e.g., Include Application ID in transaction note"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Account' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
}
