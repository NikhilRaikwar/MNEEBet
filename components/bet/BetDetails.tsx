'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BetStatusBadge } from './BetStatusBadge';
import { BetActions } from './BetActions';
import { formatBetAmount, formatDate, getWinnerLabel, truncateAddress } from '@/lib/utils/format';
import { Winner } from '@/lib/constants';
import type { Bet } from '@/types/contract';
import { useAccount } from 'wagmi';
import Link from 'next/link';

interface BetDetailsProps {
  bet: Bet;
  onUpdate?: () => void;
}

export function BetDetails({ bet, onUpdate }: BetDetailsProps) {
  const { address } = useAccount();
  const isOpenBet = !bet.opponent || bet.opponent === '0x0000000000000000000000000000000000000000';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{bet.terms}</CardTitle>
              <CardDescription>Bet ID: {bet.betId.toString()}</CardDescription>
            </div>
            <BetStatusBadge status={bet.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Amount</p>
              <p className="text-lg font-semibold">{formatBetAmount(bet.amount)} MNEE</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Pot</p>
              <p className="text-lg font-semibold">{formatBetAmount(bet.amount * BigInt(2))} MNEE</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Creator</p>
              <Link
                href={`https://etherscan.io/address/${bet.creator}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm hover:underline"
              >
                {truncateAddress(bet.creator)}
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Opponent</p>
              {isOpenBet ? (
                <Badge variant="outline">Open Bet</Badge>
              ) : (
                <Link
                  href={`https://etherscan.io/address/${bet.opponent}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm hover:underline"
                >
                  {truncateAddress(bet.opponent)}
                </Link>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Deadline</p>
              <p className="text-sm">{formatDate(bet.deadline)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Created</p>
              <p className="text-sm">{formatDate(bet.createdAt)}</p>
            </div>
            {bet.status === 3 && bet.resolvedAt > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Resolved</p>
                <p className="text-sm">{formatDate(bet.resolvedAt)}</p>
              </div>
            )}
            {bet.status === 3 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Winner</p>
                <Badge variant={bet.winner === Winner.Draw ? 'secondary' : 'default'}>
                  {getWinnerLabel(bet.winner)}
                </Badge>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Judge</p>
              {bet.judge && bet.judge !== '0x0000000000000000000000000000000000000000' ? (
                <Link
                  href={`https://etherscan.io/address/${bet.judge}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm hover:underline"
                >
                  {truncateAddress(bet.judge)}
                </Link>
              ) : (
                <Badge variant="outline">No Judge</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <BetActions bet={bet} onSuccess={onUpdate} />
        </CardContent>
      </Card>
    </div>
  );
}
