'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BetStatusBadge } from './BetStatusBadge';
import { formatBetAmount, formatRelativeTime, truncateAddress } from '@/lib/utils/format';
import { BetStatus } from '@/lib/constants';
import { getUsernameByAddress } from '@/hooks/useUsername';
import type { Bet } from '@/types/contract';
import { useAccount } from 'wagmi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Coins } from 'lucide-react';

interface BetCardWannabetProps {
  bet: Bet;
}

export function BetCardWannabet({ bet }: BetCardWannabetProps) {
  const { address } = useAccount();
  const isOpenBet = !bet.opponent || bet.opponent === '0x0000000000000000000000000000000000000000';
  const creatorUsername = getUsernameByAddress(bet.creator);
  const opponentUsername = bet.opponent ? getUsernameByAddress(bet.opponent) : null;
  
  const isMyBet = address && (
    address.toLowerCase() === bet.creator.toLowerCase() ||
    (bet.opponent && address.toLowerCase() === bet.opponent.toLowerCase())
  );

  const getStatusLabel = () => {
    switch (bet.status) {
      case BetStatus.Open:
        return { label: 'Open', className: 'wannabet-status-open' };
      case BetStatus.Active:
        return { label: 'Active', className: 'wannabet-status-active' };
      case BetStatus.Resolved:
        return { label: 'Completed', className: 'wannabet-status-completed' };
      default:
        return { label: 'Pending', className: 'wannabet-status-pending' };
    }
  };

  const status = getStatusLabel();

  return (
    <Link href={`/bets/${bet.betId.toString()}`}>
      <Card className="wannabet-card hover:shadow-lg transition-shadow cursor-pointer mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {creatorUsername || truncateAddress(bet.creator)}
              {!isOpenBet ? (
                <>
                  {' '}vs{' '}
                  {opponentUsername || truncateAddress(bet.opponent)}
                </>
              ) : (
                ' challenges anyone'
              )}
            </p>
          </div>
          <Badge className={status.className}>{status.label}</Badge>
        </div>

        {/* VS Layout */}
        <div className="wannabet-vs-layout">
          <Avatar className="wannabet-avatar">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bet.creator}`} />
            <AvatarFallback>{bet.creator.slice(2, 4).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">VS</span>
            <div className="flex items-center gap-1 mt-1">
              <Coins className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">{formatBetAmount(bet.amount)}</span>
              <span className="text-xs text-muted-foreground">MNEE</span>
            </div>
          </div>
          {isOpenBet ? (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground">
              <span className="text-xs text-muted-foreground">?</span>
            </div>
          ) : (
            <Avatar className="wannabet-avatar">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bet.opponent}`} />
              <AvatarFallback>{bet.opponent?.slice(2, 4).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
        </div>

        <p className="text-base font-medium mb-2 line-clamp-2">{bet.terms}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Created {new Date(Number(bet.createdAt) * 1000).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
            {bet.status === BetStatus.Open && !isOpenBet && ' • Pending acceptance'}
          </span>
          {bet.status === BetStatus.Active && (
            <span>{formatRelativeTime(bet.deadline)}</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
