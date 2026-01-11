'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BetCard } from '@/components/bet/BetCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBetCounter, useAllBets } from '@/hooks/useBets';
import { Button } from '@/components/ui/button';
import { Search, Plus, Trophy, Activity, Users, ArrowRight, Filter, Zap, Terminal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { BetStatus } from '@/lib/constants';

export default function DashboardPage() {
  const { data: betCounter, isLoading: isLoadingCount } = useBetCounter();
  const { data: bets, isLoading: isLoadingBets } = useAllBets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBets = useMemo(() => {
    if (!bets) return [];
    
    return bets.filter((bet: any) => {
      const terms = bet.terms || '';
      const creator = bet.creator || '';
      
      const matchesSearch = terms.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          creator.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (statusFilter === 'all') return matchesSearch;
      
      const statusMap: Record<string, number> = {
        'open': BetStatus.Open,
        'active': BetStatus.Active,
        'resolved': BetStatus.Resolved
      };
      
      return matchesSearch && bet.status === statusMap[statusFilter];
    });
  }, [bets, searchTerm, statusFilter]);

  const stats = [
    { label: 'NETWORK_VOLUME', value: '$4.2M+', icon: Trophy, color: 'text-primary' },
    { label: 'ACTIVE_ARENAS', value: isLoadingCount ? '...' : (betCounter?.toString() || '0'), icon: Activity, color: 'text-secondary' },
    { label: 'IDENTIFIED_USR', value: '1.2K', icon: Users, color: 'text-accent' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background grid-pattern">
      <div className="noise-overlay" />
      <div className="scanline" />
      <Header />

      <main className="flex-1 container mx-auto px-6 py-20 relative z-10">

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-24">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase">
              <Zap className="w-3.5 h-3.5" />
              MARKET_LIVE // SECTOR_01
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white font-display leading-[0.85] uppercase">
                THE <br />
                <span className="text-primary text-glow-lime italic">MARKETPLACE.</span>
              </h1>
              <p className="text-lg text-zinc-500 max-w-lg font-sans border-l-4 border-primary/30 pl-6 leading-relaxed italic">
                "Verify the terms. Stake your MNEE. Conquer the arena. Decentralized resolution via cryptographic oracles."
              </p>
            </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full lg:w-auto"
              >
                <Button className="w-full lg:w-auto h-20 px-10 bg-primary text-black font-black uppercase tracking-[0.2em] text-sm rounded-none border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all group" asChild>
                  <Link href="/create">
                    CREATE_BET
                    <Plus className="ml-4 w-5 h-5 group-hover:rotate-90 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
          </div>

          {/* Stats Grid */}
          <section className="mb-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 border-2 border-white/5 divide-y-2 sm:divide-y-0 md:divide-x-2 divide-white/5 bg-black/40 backdrop-blur-xl">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 group hover:bg-white/[0.02] transition-colors ${i === 1 ? 'sm:border-l-2 md:border-l-0' : ''} ${i === 2 ? 'sm:border-t-2 md:border-t-0 sm:col-span-2 md:col-span-1' : ''}`}
              >
                <div className={`p-4 bg-white/5 w-fit mb-6 ${stat.color} border border-white/10 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">{stat.label}</p>
                <h3 className="text-4xl font-black text-white mt-2 tracking-tighter italic">{stat.value}</h3>
              </motion.div>
            ))}
          </section>

          {/* Marketplace Section */}
          <section id="marketplace" className="space-y-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b-2 border-white/5 pb-8">
              <div className="flex items-center gap-4">
                <Terminal className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Live_Arena_Feed</h2>
              </div>

              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                <div className="relative flex-1 md:w-96 group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="FILTER_BY_TERMS..."
                    className="h-14 pl-14 pr-6 bg-white/5 border-2 border-white/10 text-white placeholder:text-zinc-800 focus:border-primary/50 focus:ring-0 rounded-none transition-all font-mono uppercase text-xs font-bold tracking-widest w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="h-14 w-full sm:w-14 rounded-none border-2 border-white/10 bg-white/5 hover:border-primary hover:text-primary transition-all">
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>

                <Tabs defaultValue="all" onValueChange={setStatusFilter} className="space-y-12">
                  <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2 sm:gap-4">
                    {[
                      { id: 'all', label: 'ALL_BATTLES', color: 'border-primary/50 text-primary bg-primary/20', active: 'data-[state=active]:bg-primary data-[state=active]:text-black' },
                      { id: 'open', label: 'OPEN_ARENAS', color: 'border-blue-500/50 text-blue-400 bg-blue-500/20', active: 'data-[state=active]:bg-blue-500 data-[state=active]:text-white' },
                      { id: 'active', label: 'ENGAGED_WARS', color: 'border-amber-500/50 text-amber-400 bg-amber-500/20', active: 'data-[state=active]:bg-amber-500 data-[state=active]:text-black' },
                      { id: 'resolved', label: 'ARCHIVED_HISTORY', color: 'border-zinc-500/50 text-zinc-500 bg-zinc-500/20', active: 'data-[state=active]:bg-zinc-500 data-[state=active]:text-white' }
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className={`flex-1 sm:flex-none border-2 ${tab.color} ${tab.active} px-4 sm:px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-none transition-all shadow-none data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] data-[state=active]:border-black hover:bg-white/10`}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={statusFilter}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[400px]"
                >
                  {isLoadingBets ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-[400px] w-full rounded-none bg-white/5 border-2 border-white/10" />
                      ))}
                    </div>
                  ) : (filteredBets && filteredBets.length > 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[...filteredBets].reverse().map((bet: any) => (
                        <BetCard key={bet.betId.toString()} bet={bet} />
                      ))}
                    </div>
                  ) : (

                  <div className="flex flex-col items-center justify-center py-40 text-center space-y-10 border-2 border-dashed border-white/10 bg-black/20 backdrop-blur-sm">
                    <div className="relative">
                      <div className="w-24 h-24 border-2 border-white/10 flex items-center justify-center bg-black rotate-12">
                        <Search className="w-10 h-10 text-zinc-800" />
                      </div>
                      <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">No_Battles_Detected</h3>
                      <p className="text-zinc-600 max-w-sm mx-auto font-medium text-sm">
                        The arena is quiet. Be the first to initiate a confrontation and stake your claim.
                      </p>
                    </div>
                    <Button className="h-16 px-10 bg-white text-black font-black uppercase tracking-widest text-xs rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(204,255,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all" asChild>
                      <Link href="/create">
                        <Plus className="mr-3 h-4 w-4" />
                        INITIATE_SECTOR_01
                      </Link>
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
