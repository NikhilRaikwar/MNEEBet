'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { MNEE_TOKEN } from '@/lib/contract';
import { MNEEBET_CONTRACT_ADDRESS } from '@/lib/constants';

export function useMNEETokenBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    ...MNEE_TOKEN,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useMNEETokenDecimals() {
  return useReadContract({
    ...MNEE_TOKEN,
    functionName: 'decimals',
  });
}

export function useMNEETokenAllowance(owner: `0x${string}` | undefined) {
  return useReadContract({
    ...MNEE_TOKEN,
    functionName: 'allowance',
    args: owner && MNEEBET_CONTRACT_ADDRESS ? [owner, MNEEBET_CONTRACT_ADDRESS as `0x${string}`] : undefined,
    query: {
      enabled: !!owner && !!MNEEBET_CONTRACT_ADDRESS,
    },
  });
}

export function useApproveMNEE() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = (amount: string, decimals: number = 18) => {
    // Hard fallback just to be absolutely safe
    const spender = MNEEBET_CONTRACT_ADDRESS;
    console.log('Approving MNEE usage for spender:', spender);

    writeContract({
      ...MNEE_TOKEN,
      functionName: 'approve',
      args: [spender as `0x${string}`, parseUnits(amount, decimals)],
    });
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isLoading: isPending || isConfirming,
    error,
  };
}
