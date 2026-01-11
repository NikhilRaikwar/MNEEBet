'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MNEEBET_CONTRACT } from '@/lib/contract';

export function useRegisterUsername() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const registerUsername = (username: string) => {
    writeContract({
      ...MNEEBET_CONTRACT,
      functionName: 'registerUsername',
      args: [username],
    });
  };

  return {
    registerUsername,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isLoading: isPending || isConfirming,
    error,
  };
}
