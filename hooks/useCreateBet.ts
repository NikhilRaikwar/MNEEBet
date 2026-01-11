'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { MNEEBET_CONTRACT } from '@/lib/contract';

interface CreateBetParams {
  opponent: `0x${string}` | undefined;
  amount: string;
  terms: string;
  deadline: bigint;
  judge: `0x${string}`;
  decimals: number;
}

export function useCreateBet() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  const createBet = ({
    opponent,
    amount,
    terms,
    deadline,
    judge,
    decimals,
  }: CreateBetParams) => {
    // Debug log
    console.log('Creating bet with:', { opponent, amount, terms, deadline, judge, decimals });

    // Ensure 0x prefix is present or use Zero Address
    const opponentAddress: `0x${string}` = opponent ? opponent : '0x0000000000000000000000000000000000000000';

    const amountWei = parseUnits(amount, decimals);

    writeContract({
      ...MNEEBET_CONTRACT,

      functionName: 'createBet',
      args: [
        opponentAddress,
        amountWei,
        terms,
        deadline,
        judge,
      ],
    });
  };

  return {
    createBet,
    hash,
    receipt,
    isPending,
    isConfirming,
    isConfirmed,
    isLoading: isPending || isConfirming,
    error,
  };
}
