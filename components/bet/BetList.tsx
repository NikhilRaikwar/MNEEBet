'use client';

import { useEffect, useState } from 'react';
import { BetCard } from './BetCard';
import { useBetCounter, useBet } from '@/hooks/useBets';
import type { Bet } from '@/types/contract';

interface BetListProps {
  filter?: (bet: Bet) => boolean;
}

export function BetList({ filter }: BetListProps) {
  const { data: betCounter, isLoading } = useBetCounter();
  const [betIds, setBetIds] = useState<bigint[]>([]);

  useEffect(() => {
    if (betCounter) {
      setBetIds(Array.from({ length: Number(betCounter) }, (_, i) => BigInt(i)));
    }
  }, [betCounter]);

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading bets...</div>;
  }

  if (betIds.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No bets found
      </div>
    );
  }

  // For now, show message - in production, use BetCardList component that fetches individual bets
  return (
    <div className="text-center py-12 text-muted-foreground">
      Loading bets... ({betIds.length} bet{betIds.length !== 1 ? 's' : ''} found)
      <p className="text-xs mt-2">
        Individual bet viewing available via direct links
      </p>
    </div>
  );
}
