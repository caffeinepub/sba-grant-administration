import { useState } from 'react';
import { useGetApplicationStatus, useGetProcessingFee, useGetPaymentInstructions } from '../hooks/useApplications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '../components/status/StatusBadge';
import { Search } from 'lucide-react';
import { ApplicationStatus, AccountType } from '../backend';

export default function StatusTracker() {
  const [applicationId, setApplicationId] = useState('');
  const [searchedId, setSearchedId] = useState<bigint | null>(null);

  const { data: application, isLoading, error } = useGetApplicationStatus(searchedId);
  const { data: processingFee } = useGetProcessingFee(searchedId);
  const { data: paymentInstructions } = useGetPaymentInstructions(searchedId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = BigInt(applicationId);
    setSearchedId(id);
  };

  const isApproved = application?.status === ApplicationStatus.approved;

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Check Application Status</CardTitle>
          <CardDescription>
            Enter your Application ID to view the current status of your grant application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="appId">Application ID</Label>
                <Input
                  id="appId"
                  type="number"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="Enter your Application ID"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertDescription>Application not found. Please check your Application ID and try again.</AlertDescription>
            </Alert>
          )}

          {application && (
            <div className="mt-8 space-y-6">
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Application Details</h3>
                  <StatusBadge status={application.status} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Application ID</p>
                    <p className="font-mono font-semibold">{application.id.toString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Applicant Name</p>
                    <p className="font-semibold">{application.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-semibold">{application.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Requested Amount</p>
                    <p className="font-semibold">${application.amount.toString()}</p>
                  </div>
                </div>
              </div>

              {isApproved && (
                <>
                  <Separator />
                  
                  {processingFee !== null && processingFee !== undefined ? (
                    <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                      <h3 className="text-lg font-semibold mb-2">Processing Fee</h3>
                      <p className="text-3xl font-bold text-primary">${processingFee.toString()}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        This fee must be paid before your grant can be processed
                      </p>
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        Your application has been approved. Processing fee information will be available shortly.
                      </AlertDescription>
                    </Alert>
                  )}

                  {paymentInstructions ? (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Payment Instructions</h3>
                        <Card className="bg-muted/50">
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              {paymentInstructions.accountType === AccountType.bank ? '🏦 Bank Transfer' : '₿ Cryptocurrency'}
                            </CardTitle>
                            <CardDescription>{paymentInstructions.accountName}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <pre className="whitespace-pre-wrap text-sm font-mono bg-background p-4 rounded border">
                              {paymentInstructions.accountDetails}
                            </pre>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  ) : processingFee !== null && processingFee !== undefined ? (
                    <Alert>
                      <AlertDescription>
                        Payment instructions will be provided shortly. Please check back later.
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </>
              )}

              {application.status === ApplicationStatus.pending && (
                <Alert>
                  <AlertDescription>
                    Your application is currently under review. You will be notified once a decision has been made.
                  </AlertDescription>
                </Alert>
              )}

              {application.status === ApplicationStatus.rejected && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Unfortunately, your application has been rejected. Please contact support for more information.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
