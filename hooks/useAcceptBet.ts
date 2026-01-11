'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MNEEBET_CONTRACT } from '@/lib/contract';

export function useAcceptBet() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const acceptBet = (betId: bigint) => {
    writeContract({
      ...MNEEBET_CONTRACT,
      functionName: 'acceptBet',
      args: [betId],
    });
  };

  return {
    acceptBet,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isLoading: isPending || isConfirming,
    error,
  };
}
