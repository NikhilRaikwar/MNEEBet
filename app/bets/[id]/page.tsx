'use client';

import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BetDetailsWannabet } from '@/components/bet/BetDetailsWannabet';
import { Card, CardContent } from '@/components/ui/card';
import { useBet } from '@/hooks/useBets';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Terminal, AlertTriangle } from 'lucide-react';

export default function BetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const betId = params?.id ? BigInt(params.id as string) : undefined;

  const { data: bet, isLoading, error, refetch } = useBet(betId);

  const handleUpdate = () => {
    refetch();
    setTimeout(() => {
      router.refresh();
    }, 2000);
  };

  if (!betId) {
    return (
      <div className="flex min-h-screen flex-col bg-background grid-pattern">
        <div className="noise-overlay" />
        <Header />
        <main className="flex-1 container flex items-center justify-center py-20 px-6 relative z-10">
          <div className="brutalist-card p-12 text-center border-2 border-white/10 bg-black/40 backdrop-blur-xl max-w-md">
            <div className="p-6 bg-accent/10 w-fit mx-auto mb-6 rotate-12 border border-accent/20">
              <AlertTriangle className="w-12 h-12 text-accent" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">ID_NOT_FOUND</h3>
            <p className="text-zinc-500 mb-10 font-medium">The requested arena identifier could not be resolved within the MNEE protocol index.</p>
            <Button className="h-16 px-10 bg-primary text-black font-black uppercase rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all" asChild>
              <Link href="/dashboard">RETURN_TO_MARKET</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background grid-pattern">
        <div className="noise-overlay" />
        <Header />
        <main className="flex-1 container py-20 px-6 flex items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-none animate-spin" />
            <p className="text-primary font-black uppercase tracking-[0.3em] text-xs animate-pulse font-mono">SYNCHRONIZING_CHAIN_STATE...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !bet) {
    return (
      <div className="flex min-h-screen flex-col bg-background grid-pattern">
        <div className="noise-overlay" />
        <Header />
        <main className="flex-1 container flex items-center justify-center py-20 px-6 relative z-10">
          <div className="brutalist-card p-12 text-center border-2 border-white/10 bg-black/40 backdrop-blur-xl max-w-md">
            <div className="p-6 bg-red-500/10 w-fit mx-auto mb-6 -rotate-12 border border-red-500/20">
              <Terminal className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">ACCESS_ERROR</h3>
            <p className="text-zinc-500 mb-10 font-medium italic">"The requested battle sector is currently unreachable or has been purged from the active registry."</p>
            <Button className="h-16 px-10 bg-white text-black font-black uppercase rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(204,255,0,1)] transition-all" asChild>
              <Link href="/dashboard">EXIT_ARENA</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background grid-pattern">
      <div className="noise-overlay" />
      <div className="scanline" />
      <Header />
      
      <main className="flex-1 container py-16 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12 flex items-center justify-between"
        >
          <Button variant="ghost" className="text-zinc-500 hover:text-primary hover:bg-white/5 font-black uppercase tracking-widest text-[10px] gap-3 group" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              BACK_TO_MARKETPLACE
            </Link>
          </Button>

          <div className="hidden md:flex items-center gap-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              LIVE_DATA
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <span>SECTOR: ARENA_{betId.toString().padStart(4, '0')}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BetDetailsWannabet bet={bet} onUpdate={handleUpdate} />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
