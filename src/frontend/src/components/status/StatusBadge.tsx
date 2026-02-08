import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '../../backend';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.pending:
        return { label: 'Pending', variant: 'secondary' as const };
      case ApplicationStatus.underReview:
        return { label: 'Under Review', variant: 'secondary' as const };
      case ApplicationStatus.approved:
        return { label: 'Approved', variant: 'default' as const };
      case ApplicationStatus.rejected:
        return { label: 'Rejected', variant: 'destructive' as const };
      case ApplicationStatus.processing:
        return { label: 'Processing', variant: 'secondary' as const };
      case ApplicationStatus.completed:
        return { label: 'Completed', variant: 'default' as const };
      default:
        return { label: 'Unknown', variant: 'outline' as const };
    }
  };

  const config = getStatusConfig(status);

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
