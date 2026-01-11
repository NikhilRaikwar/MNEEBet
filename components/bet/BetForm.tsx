'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateBet } from '@/hooks/useCreateBet';
import { useApproveMNEE, useMNEETokenAllowance, useMNEETokenBalance, useMNEETokenDecimals } from '@/hooks/useMNEEToken';
import { useAccount } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { UsernameSearch } from '@/components/username/UsernameSearch';
import { useState } from 'react';

const betSchema = z.object({
  opponent: z.string().optional(),
  judge: z.string().min(1, 'Judge is required'),
  terms: z.string().min(10, 'Terms must be at least 10 characters'),
  amount: z.string().min(1, 'Amount is required'),
  deadline: z.string().min(1, 'Deadline is required'),
});

type BetFormData = z.infer<typeof betSchema>;

export function BetForm() {
  const { address } = useAccount();
  const { data: decimals } = useMNEETokenDecimals();
  const { data: balance } = useMNEETokenBalance(address);
  const { data: allowance } = useMNEETokenAllowance(address);
  const { approve, isLoading: isApproving, isConfirmed: isApproved } = useApproveMNEE();
  const { createBet, isLoading: isCreating, isConfirmed: isCreated } = useCreateBet();
  
  const [opponentAddress, setOpponentAddress] = useState<`0x${string}` | undefined>();
  const [judgeAddress, setJudgeAddress] = useState<`0x${string}` | undefined>();

  const form = useForm<BetFormData>({
    resolver: zodResolver(betSchema),
    defaultValues: {
      opponent: '',
      judge: '',
      terms: '',
      amount: '',
      deadline: '',
    },
  });

  const balanceDisplay = balance && decimals ? formatUnits(balance, decimals) : '0';
  const amount = form.watch('amount');
  const needsApproval = amount && decimals && allowance 
    ? allowance < parseUnits(amount, decimals) 
    : false;

  const onSubmit = (data: BetFormData) => {
    if (!address || !decimals || !judgeAddress) return;

    const deadlineTimestamp = BigInt(Math.floor(new Date(data.deadline).getTime() / 1000));

    createBet({
      opponent: opponentAddress,
      amount: data.amount,
      terms: data.terms,
      deadline: deadlineTimestamp,
      judge: judgeAddress,
      decimals,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Bet</CardTitle>
        <CardDescription>
          Create a peer-to-peer bet using MNEE stablecoin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="opponent">Opponent (Optional)</Label>
            <UsernameSearch
              onSelect={(address) => setOpponentAddress(address)}
              placeholder="Search username or enter address"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to allow anyone to accept
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="judge">Judge *</Label>
            <UsernameSearch
              onSelect={(address) => {
                setJudgeAddress(address);
                form.setValue('judge', address || '');
              }}
              placeholder="Search username or enter judge address"
            />
            {form.formState.errors.judge && (
              <p className="text-sm text-destructive">{form.formState.errors.judge.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Bet Terms *</Label>
            <Textarea
              id="terms"
              {...form.register('terms')}
              placeholder="I will run 30 miles next week"
              rows={4}
            />
            {form.formState.errors.terms && (
              <p className="text-sm text-destructive">{form.formState.errors.terms.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (MNEE) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...form.register('amount')}
              placeholder="100"
            />
            <p className="text-xs text-muted-foreground">
              Balance: {parseFloat(balanceDisplay).toFixed(2)} MNEE
            </p>
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline *</Label>
            <Input
              id="deadline"
              type="datetime-local"
              {...form.register('deadline')}
            />
            {form.formState.errors.deadline && (
              <p className="text-sm text-destructive">{form.formState.errors.deadline.message}</p>
            )}
          </div>

          {needsApproval && !isApproved ? (
            <Button
              type="button"
              onClick={() => approve(amount, decimals)}
              disabled={isApproving || !amount}
              className="w-full"
            >
              {isApproving ? 'Approving...' : `Approve ${amount} MNEE`}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isCreating || needsApproval || !judgeAddress}
              className="w-full"
            >
              {isCreating ? 'Creating Bet...' : 'Create Bet'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
