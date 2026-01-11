'use client';

import { useReadContract } from 'wagmi';
import { useMemo } from 'react';
import { MNEEBET_CONTRACT } from '@/lib/contract';
import type { Bet } from '@/types/contract';

export function useBetCounter() {
  return useReadContract({
    ...MNEEBET_CONTRACT,
    functionName: 'betCounter',
  });
}

export function useAllBets() {
  const { data: count } = useBetCounter();

  return useReadContract({
    ...MNEEBET_CONTRACT,
    functionName: 'getBetsInRange',
    args: count !== undefined ? [0n, count] : undefined,
    query: {
      enabled: count !== undefined,
    }
  });
}

export function useBet(betId: bigint | undefined) {
  return useReadContract({
    ...MNEEBET_CONTRACT,
    functionName: 'getBet',
    args: betId !== undefined ? [betId] : undefined,
    query: {
      enabled: betId !== undefined,
    },
  }) as {
    data: Bet | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
}

// Note: useBets and useUserBets hooks that fetch multiple bets
// will need to be implemented differently due to React hooks rules
// Consider fetching bet IDs first, then fetching individual bets in components
