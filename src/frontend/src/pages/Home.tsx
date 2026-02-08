import { useState } from 'react';
import { useCreateApplication } from '../hooks/useApplications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Copy, Check } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    amount: '',
  });
  const [validationError, setValidationError] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState<bigint | null>(null);
  const [copied, setCopied] = useState(false);

  const createMutation = useCreateApplication();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const amount = parseInt(formData.amount);
    if (isNaN(amount) || amount < 5000 || amount > 50000) {
      setValidationError('Requested amount must be between $5,000 and $50,000');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.country) {
      setValidationError('Please fill in all required fields');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        name: formData.fullName,
        email: formData.email,
        amount: BigInt(amount),
        country: formData.country,
      });
      setSubmittedAppId(result.id);
      setFormData({ fullName: '', email: '', country: '', amount: '' });
    } catch (error: any) {
      setValidationError(error.message || 'Failed to submit application');
    }
  };

  const handleCopy = () => {
    if (submittedAppId) {
      navigator.clipboard.writeText(submittedAppId.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (submittedAppId) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl">Application Submitted Successfully</CardTitle>
            <CardDescription>Your grant application has been received and is under review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Application ID</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl font-bold font-mono">{submittedAppId.toString()}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Alert>
              <AlertDescription>
                Please save this Application ID. You will need it to check your application status and view payment instructions once approved.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => setSubmittedAppId(null)}
              variant="outline"
              className="w-full"
            >
              Submit Another Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Grant Application Form</CardTitle>
          <CardDescription>
            Complete the form below to apply for a grant between $5,000 and $50,000
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full legal name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Enter your country of residence"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Requested Amount (USD) *</Label>
              <Input
                id="amount"
                type="number"
                min="5000"
                max="50000"
                step="1000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount between $5,000 and $50,000"
                required
              />
              <p className="text-xs text-muted-foreground">Minimum: $5,000 | Maximum: $50,000</p>
            </div>

            {validationError && (
              <Alert variant="destructive">
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
