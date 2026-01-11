'use client';

import { useReadContract } from 'wagmi';
import { useMemo } from 'react';
import { MNEEBET_CONTRACT } from '@/lib/contract';

export function useUsername(address: `0x${string}` | undefined) {
  const { data: username, isLoading, error, refetch } = useReadContract({
    ...MNEEBET_CONTRACT,
    functionName: 'getUsernameByAddress',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as {
    data: string | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };

  return {
    username: username && username.length > 0 ? username : undefined,
    isLoading,
    error,
    refetch,
  };
}

export function useAddressByUsername(username: string | undefined) {
  const { data: address, isLoading, error, refetch } = useReadContract({
    ...MNEEBET_CONTRACT,
    functionName: 'getAddressByUsername',
    args: username ? [username] : undefined,
    query: {
      enabled: !!username && username.length > 0,
    },
  }) as {
    data: `0x${string}` | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };

  return {
    address,
    isLoading,
    error,
    refetch,
  };
}

// Helper function for synchronous username lookup (uses cached data)
export function getUsernameByAddress(address: string): string | null {
  // This is a placeholder - in practice, you'd use React Query cache or context
  return null;
}
