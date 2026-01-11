import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { useAcceptBet } from '@/hooks/useAcceptBet';
import { useCancelBet } from '@/hooks/useCancelBet';
import { BetStatus, Winner } from '@/lib/constants';
import { isCreator, isOpponent } from '@/lib/utils/format';
import type { Bet } from '@/types/contract';
import { useMNEETokenAllowance, useMNEETokenDecimals, useApproveMNEE } from '@/hooks/useMNEEToken';
import { formatUnits } from 'viem';

interface BetActionsProps {
  bet: Bet;
  onSuccess?: () => void;
}

export function BetActions({ bet, onSuccess }: BetActionsProps) {
  const { address } = useAccount();
  const { acceptBet, isLoading: isAccepting } = useAcceptBet();
  const { cancelBet, isLoading: isCancelling } = useCancelBet();
  const { data: allowance } = useMNEETokenAllowance(address);
  const { data: decimals } = useMNEETokenDecimals();
  const { approve, isLoading: isApproving } = useApproveMNEE();

  const handleAccept = () => {
    acceptBet(bet.betId);
    onSuccess?.();
  };

  const handleCancel = () => {
    cancelBet(bet.betId);
    onSuccess?.();
  };

  if (!address) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Connect your wallet to interact with this bet
      </div>
    );
  }

  const userIsCreator = isCreator(address, bet.creator);
  const userIsOpponent = isOpponent(address, bet.opponent);

  // Open bet - anyone can accept (except creator)
  if (bet.status === BetStatus.Open && !userIsCreator) {
    const needsApproval = allowance !== undefined && bet.amount > allowance;

    if (needsApproval) {
      return (
        <Button
          onClick={() => approve(formatUnits(bet.amount, decimals || 18), decimals)}
          disabled={isApproving}
          className="w-full h-16 bg-secondary text-black font-black uppercase tracking-widest text-xs border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all"
        >
          {isApproving ? 'AUTHORIZING_FUNDS...' : `AUTHORIZE_${formatUnits(bet.amount, decimals || 18)}_MNEE`}
        </Button>
      );
    }

    return (
      <Button
        onClick={handleAccept}
        disabled={isAccepting}
        className="w-full h-16 bg-primary text-black font-black uppercase tracking-widest text-xs border-2 border-black shadow-[6px_6px_0px_0px_rgba(204,255,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(204,255,0,1)] transition-all"
      >
        {isAccepting ? 'ACCEPTING_CHALLENGE...' : 'ACCEPT_CHALLENGE'}
      </Button>
    );
  }

  // Creator can cancel open bet
  if (bet.status === BetStatus.Open && userIsCreator) {
    return (
      <Button
        onClick={handleCancel}
        disabled={isCancelling}
        variant="destructive"
        className="w-full h-16 bg-red-500 text-white font-black uppercase tracking-widest text-xs border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all"
      >
        {isCancelling ? 'ABORTING...' : 'ABORT_OPERATION'}
      </Button>
    );
  }

  // Resolved bet - winnings paid automatically, no action needed
  if (bet.status === BetStatus.Resolved) {
    return (
      <div className="p-4 border-2 border-white/10 bg-white/5 text-center">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">STATUS_UPDATE</p>
        <p className="text-sm font-bold text-white uppercase">
          {bet.winner === Winner.Draw
            ? 'DRAW_DECLARED_//_FUNDS_RETURNED'
            : bet.winner === Winner.Creator && userIsCreator
              ? 'VICTORY_CONFIRMED_//_PAYOUT_EXECUTED'
              : bet.winner === Winner.Opponent && userIsOpponent
                ? 'VICTORY_CONFIRMED_//_PAYOUT_EXECUTED'
                : 'CONTRACT_SETTLED_//_PAYOUT_EXECUTED'}
        </p>
      </div>
    );
  }

  // Active bet - no actions available (waiting for resolution)
  if (bet.status === BetStatus.Active) {
    return (
      <div className="p-4 border-2 border-primary/20 bg-primary/5 text-center animate-pulse">
        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">STATUS_ACTIVE</p>
        <p className="text-sm font-bold text-white uppercase">PENDING_ORACLE_RESOLUTION...</p>
      </div>
    );
  }

  return null;
}
