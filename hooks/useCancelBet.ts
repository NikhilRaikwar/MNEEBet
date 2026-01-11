'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MNEEBET_CONTRACT } from '@/lib/contract';

export function useCancelBet() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelBet = (betId: bigint) => {
    writeContract({
      ...MNEEBET_CONTRACT,
      functionName: 'cancelBet',
      args: [betId],
    });
  };

  return {
    cancelBet,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isLoading: isPending || isConfirming,
    error,
  };
}
