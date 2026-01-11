'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { BetCard } from '@/components/bet/BetCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { MNEEBET_CONTRACT } from '@/lib/contract';
import { BetStatus } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { useBet } from '@/hooks/useBets';
import type { Bet } from '@/types/contract';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MyBetsPage() {
  const { address, isConnected } = useAccount();
  const [betIds, setBetIds] = useState<bigint[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('all');

  const { data: fetchedBetIds, isLoading: isLoadingUserBets } = useReadContract({
    ...MNEEBET_CONTRACT,
    functionName: 'getUserBets',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as {
    data: bigint[] | undefined;
    isLoading: boolean;
  };

  useEffect(() => {
    if (fetchedBetIds) {
      setBetIds(fetchedBetIds);
    }
  }, [fetchedBetIds]);

  // Fetch individual bets
  const betsData = betIds.map((betId) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useBet(betId);
    return data;
  }).filter(Boolean) as Bet[];

  const filteredBets = useMemo(() => {
    if (selectedTab === 'all') return betsData;
    const status = parseInt(selectedTab) as BetStatus;
    return betsData.filter((bet) => bet.status === status);
  }, [betsData, selectedTab]);

  const openBets = betsData.filter((bet) => bet.status === BetStatus.Open);
  const activeBets = betsData.filter((bet) => bet.status === BetStatus.Active);
  const resolvedBets = betsData.filter((bet) => bet.status === BetStatus.Resolved);

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Please connect your wallet to view your bets</p>
              <Link href="/">
                <Button>Go to Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container py-8 px-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Bets</h1>
            <p className="text-muted-foreground">
              View and manage all your betting activity
            </p>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All ({betsData.length})</TabsTrigger>
              <TabsTrigger value={BetStatus.Open.toString()}>Open ({openBets.length})</TabsTrigger>
              <TabsTrigger value={BetStatus.Active.toString()}>Active ({activeBets.length})</TabsTrigger>
              <TabsTrigger value={BetStatus.Resolved.toString()}>Resolved ({resolvedBets.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoadingUserBets ? (
                <div className="text-center py-12 text-muted-foreground">Loading your bets...</div>
              ) : filteredBets.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">You haven't created or accepted any bets yet.</p>
                    <Link href="/create">
                      <Button>Create Your First Bet</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBets.map((bet) => (
                    <BetCard key={bet.betId.toString()} bet={bet} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value={BetStatus.Open.toString()} className="mt-6">
              {openBets.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No open bets
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {openBets.map((bet) => (
                    <BetCard key={bet.betId.toString()} bet={bet} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value={BetStatus.Active.toString()} className="mt-6">
              {activeBets.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No active bets
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeBets.map((bet) => (
                    <BetCard key={bet.betId.toString()} bet={bet} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value={BetStatus.Resolved.toString()} className="mt-6">
              {resolvedBets.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No resolved bets
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resolvedBets.map((bet) => (
                    <BetCard key={bet.betId.toString()} bet={bet} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
