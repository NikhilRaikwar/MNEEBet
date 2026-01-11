'use client';

import Link from 'next/link';
import { formatEther } from 'viem';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Trophy, Users, ArrowRight, Zap, ShieldCheck, AlertCircle, Gavel, Circle } from 'lucide-react';
import { BetStatus, BET_STATUS_LABELS } from '@/lib/constants';
import { motion } from 'framer-motion';

interface BetCardProps {
  bet: any;
}

export function BetCard({ bet }: BetCardProps) {
  const isExpired = Number(bet.deadline) * 1000 < Date.now();
  const amount = bet.amount ? formatEther(bet.amount) : '0';

  const statusConfig = {
    [BetStatus.Open]: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: Zap },
    [BetStatus.Active]: { color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', icon: Zap },
    [BetStatus.Resolved]: { color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', icon: ShieldCheck },
    [BetStatus.Cancelled]: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle },
    [BetStatus.Disputed]: { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', icon: Gavel },
    [BetStatus.PendingResolve]: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Clock },
  }[bet.status as BetStatus] || { color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', icon: Circle };

  const Config = statusConfig;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="h-full group"
    >
      <div className="brutalist-card h-full flex flex-col bg-black/40 backdrop-blur-md border-2 border-white/10 hover:border-primary transition-all overflow-hidden">
        <div className="p-8 flex flex-col h-full space-y-8 relative z-10">
          
          <div className="flex justify-between items-start">
            <div className={`inline-flex items-center gap-2 px-3 py-1 border-2 ${Config.border} ${Config.bg} ${Config.color} text-[10px] font-black uppercase tracking-[0.2em]`}>
              <Config.icon className="w-3.5 h-3.5" />
              {BET_STATUS_LABELS[bet.status as BetStatus]}
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
                <span className="text-glow-lime">{amount}</span>
                <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mt-2">MNEE</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <h3 className="font-display text-2xl font-black text-white leading-[0.9] uppercase tracking-tighter line-clamp-3 group-hover:text-primary transition-colors italic">
              {bet.terms}
            </h3>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5 font-mono">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Opponent_Nexus</p>
                <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate">
                    {bet.opponent === '0x0000000000000000000000000000000000000000' ? 'PUBLIC_ARENA' : 'DUAL_COMBAT'}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-right">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Expiration_Date</p>
                <div className={`flex items-center justify-end gap-2 font-bold text-[10px] ${isExpired ? 'text-accent' : 'text-zinc-400'}`}>
                  <span>{new Date(Number(bet.deadline) * 1000).toLocaleDateString()}</span>
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button className="w-full h-16 bg-white text-black hover:bg-primary hover:text-black font-black uppercase tracking-widest text-xs rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(204,255,0,0)] group-hover:shadow-[4px_4px_0px_0px_rgba(204,255,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none" asChild>
              <Link href={`/bets/${bet.betId}`}>
                ENTER_ARENA
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Background Visuals */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/20 transition-all" />
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <Trophy className="w-24 h-24 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
