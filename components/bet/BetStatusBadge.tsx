'use client';

import { Badge } from '@/components/ui/badge';
import { BetStatus } from '@/lib/constants';
import { getBetStatusLabel } from '@/lib/utils/format';

interface BetStatusBadgeProps {
  status: number;
  className?: string;
}

export function BetStatusBadge({ status, className }: BetStatusBadgeProps) {
  const getVariant = (status: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case BetStatus.Open:
        return 'default';
      case BetStatus.Active:
        return 'secondary';
      case BetStatus.Resolved:
        return 'outline';
      case BetStatus.Cancelled:
        return 'destructive';
      case BetStatus.Disputed:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getVariant(status)} className={className}>
      {getBetStatusLabel(status)}
    </Badge>
  );
}
