'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BetActions } from './BetActions';
import { formatBetAmount, formatDate, truncateAddress } from '@/lib/utils/format';
import { Winner, BetStatus, BET_STATUS_LABELS } from '@/lib/constants';
import type { Bet } from '@/types/contract';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Coins, ExternalLink, Calendar, Clock, Trophy, ShieldCheck, Zap, Gavel, ArrowRight, User, Terminal, Swords, ShieldAlert } from 'lucide-react';
import { UsernameDisplay } from '@/components/username/UsernameDisplay';
import { useUsername } from '@/hooks/useUsername';
import { MNEEBET_CONTRACT_ADDRESS } from '@/lib/constants';
import { MNEEBET_CONTRACT } from '@/lib/contract';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BetDetailsWannabetProps {
  bet: Bet;
  onUpdate?: () => void;
}

export function BetDetailsWannabet({ bet, onUpdate }: BetDetailsWannabetProps) {
  const { address } = useAccount();
  const isOpenBet = !bet.opponent || bet.opponent === '0x0000000000000000000000000000000000000000';
  const { username: judgeUsername } = useUsername(
    bet.judge && bet.judge !== '0x0000000000000000000000000000000000000000'
      ? (bet.judge as `0x${string}`)
      : undefined
  );
  const isJudge = address && address.toLowerCase() === bet.judge?.toLowerCase();
  const [selectedWinner, setSelectedWinner] = useState<string>('');

  const { writeContract, data: hash, isPending: isResolving } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleResolve = () => {
    if (!selectedWinner) return;
    const winnerEnum = selectedWinner === 'creator' ? 1 : selectedWinner === 'opponent' ? 2 : 3;
    writeContract({
      ...MNEEBET_CONTRACT,
      functionName: 'resolveWithJudge',
      args: [bet.betId, winnerEnum],
    });
  };

  const statusConfig = {
    [BetStatus.Open]: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: Zap },
    [BetStatus.Active]: { color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', icon: Zap },
    [BetStatus.Resolved]: { color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', icon: ShieldCheck },
    [BetStatus.Cancelled]: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: ShieldAlert },
    [BetStatus.Disputed]: { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', icon: Gavel },
    [BetStatus.PendingResolve]: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Clock },
  }[bet.status as BetStatus] || { color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', icon: Trophy };

  const Config = statusConfig;

  return (
    <div className="space-y-12">
      {/* Terms Display Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="brutalist-card p-12 md:p-16 border-2 border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
          <Terminal className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 space-y-10">
          <div className="flex flex-wrap items-center gap-4">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 border-2 ${Config.border} ${Config.bg} ${Config.color} text-[10px] font-black uppercase tracking-[0.2em]`}>
              <Config.icon className="w-4 h-4" />
              {BET_STATUS_LABELS[bet.status as BetStatus]}
            </div>
            <div className="px-4 py-1.5 border-2 border-white/10 bg-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              ID: {bet.betId.toString().padStart(6, '0')}
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] max-w-5xl uppercase font-display italic">
            {bet.terms}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Stake_Capital</p>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary border-2 border-black rotate-3">
                  <Coins className="w-6 h-6 text-black" />
                </div>
                <p className="text-3xl font-black text-white italic tracking-tighter">
                  {formatBetAmount(bet.amount)} <span className="text-xs text-zinc-600 not-italic">MNEE</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Expiration_Target</p>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white border-2 border-black -rotate-3">
                  <Calendar className="w-6 h-6 text-black" />
                </div>
                <p className="text-2xl font-black text-white italic tracking-tighter">{formatDate(bet.deadline)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Arbiter_Entity</p>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent border-2 border-black rotate-6">
                  <Gavel className="w-6 h-6 text-black" />
                </div>
                <p className="text-sm font-bold text-white uppercase tracking-widest truncate">{judgeUsername || 'UNRESOLVED_ORACLE'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Confrontation Arena */}
        <div className="lg:col-span-8 space-y-12">
          <div className="brutalist-card p-10 md:p-16 border-2 border-white/10 bg-black/40 backdrop-blur-xl relative">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-zinc-800 uppercase tracking-[0.4em] select-none">
              COMBAT_VECTORS
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-16 py-8">
              {/* Creator Entity */}
              <div className="flex flex-col items-center gap-8 group flex-1">
                <div className="relative">
                  <div className="absolute inset-[-4px] bg-primary border-2 border-black -z-10 rotate-6 group-hover:rotate-0 transition-transform" />
                  <Avatar className="w-40 h-40 rounded-none border-2 border-black">
                    <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${bet.creator}`} />
                    <AvatarFallback className="bg-zinc-900 font-display text-4xl">C</AvatarFallback>
                  </Avatar>
                  {bet.status === BetStatus.Resolved && bet.winner === 1 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-4 -right-4 w-12 h-12 bg-primary border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                    >
                      <Trophy className="text-black w-6 h-6" />
                    </motion.div>
                  )}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">INITIATOR</p>
                  <UsernameDisplay address={bet.creator as `0x${string}`} showAvatar={false} className="text-2xl font-black text-white uppercase tracking-tighter" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <Swords className="w-16 h-16 text-zinc-800 animate-pulse" />
                  <div className="absolute inset-0 blur-xl bg-primary/10 -z-10" />
                </div>
                <div className="h-24 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              </div>

              {/* Opponent Entity */}
              <div className="flex flex-col items-center gap-8 group flex-1">
                {isOpenBet ? (
                  <div className="flex flex-col items-center gap-8 opacity-20 group-hover:opacity-40 transition-opacity">
                    <div className="w-40 h-40 border-4 border-dashed border-white/10 flex items-center justify-center rotate-[-6deg]">
                      <User className="w-16 h-16 text-zinc-700" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">TAKER</p>
                      <p className="text-2xl font-black text-zinc-600 uppercase tracking-tighter">WAITING...</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-8 group">
                    <div className="relative">
                      <div className="absolute inset-[-4px] bg-secondary border-2 border-black -z-10 rotate-[-6deg] group-hover:rotate-0 transition-transform" />
                      <Avatar className="w-40 h-40 rounded-none border-2 border-black">
                        <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${bet.opponent}`} />
                        <AvatarFallback className="bg-zinc-900 font-display text-4xl">O</AvatarFallback>
                      </Avatar>
                      {bet.status === BetStatus.Resolved && bet.winner === 2 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-4 -right-4 w-12 h-12 bg-secondary border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                        >
                          <Trophy className="text-black w-6 h-6" />
                        </motion.div>
                      )}
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] italic">OPPONENT</p>
                      <UsernameDisplay address={bet.opponent as `0x${string}`} showAvatar={false} className="text-2xl font-black text-white uppercase tracking-tighter" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="brutalist-card p-12 border-2 border-white/10 bg-white/5 backdrop-blur-md">
            <h3 className="text-xl font-black text-white mb-10 uppercase tracking-tighter flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              SYSTEM_ACTIONS
            </h3>
            <BetActions bet={bet} onSuccess={onUpdate} />
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Resolution Control */}
          <AnimatePresence>
            {bet.status === BetStatus.Active && isJudge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="brutalist-card p-8 border-2 border-primary bg-primary/5 space-y-8"
              >
                <div className="flex items-center gap-3 text-primary">
                  <Gavel className="w-6 h-6" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">ORACLE_RESOLUTION_REQUIRED</h3>
                </div>

                <p className="text-xs text-zinc-500 font-bold uppercase leading-relaxed">
                  // SELECT_WINNER_ENTITY <br />
                  // IRREVERSIBLE_TRANSACTION_WARNING
                </p>

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedWinner('creator')}
                    className={`w-full h-16 rounded-none border-2 font-black uppercase tracking-widest text-xs transition-all ${selectedWinner === 'creator'
                        ? 'bg-primary text-black border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
                        : 'border-white/10 text-zinc-500 hover:border-primary/50'
                      }`}
                  >
                    CREATOR_VICTORY
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedWinner('opponent')}
                    disabled={isOpenBet}
                    className={`w-full h-16 rounded-none border-2 font-black uppercase tracking-widest text-xs transition-all ${selectedWinner === 'opponent'
                        ? 'bg-secondary text-black border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
                        : 'border-white/10 text-zinc-500 hover:border-secondary/50'
                      }`}
                  >
                    OPPONENT_VICTORY
                  </Button>
                </div>

                <Button
                  onClick={handleResolve}
                  disabled={!selectedWinner || isResolving || isConfirming || (Date.now() / 1000 < Number(bet.deadline))}
                  className="w-full h-20 bg-white text-black font-black uppercase tracking-[0.2em] rounded-none border-2 border-black shadow-[6px_6px_0px_0px_rgba(204,255,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(204,255,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                  {Date.now() / 1000 < Number(bet.deadline)
                    ? `LOCKED UNTIL ${new Date(Number(bet.deadline) * 1000).toLocaleString()}`
                    : (isResolving || isConfirming ? 'INITIATING_RESOLUTION...' : 'COMMIT_SETTLEMENT')}
                </Button>
                {Date.now() / 1000 < Number(bet.deadline) && (
                  <p className="text-[10px] text-zinc-500 font-bold text-center uppercase">
                    WAIT_FOR_EVENT_CONCLUSION_TO_SETTLE_WAGER
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Registry Info */}
          <div className="brutalist-card p-8 border-2 border-white/10 bg-black/40 backdrop-blur-xl space-y-8">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">BLOCKCHAIN_REGISTRY</h3>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-zinc-700 uppercase">PROTOCOL_ENTRY</p>
                <Link href={`https://etherscan.io/address/${MNEEBET_CONTRACT_ADDRESS}`} target="_blank" className="text-xs font-mono font-bold text-primary flex items-center gap-2 hover:underline group">
                  {truncateAddress(MNEEBET_CONTRACT_ADDRESS)}
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-zinc-700 uppercase">TIMESTAMP_UTC</p>
                <p className="text-xs font-mono font-bold text-white uppercase">{formatDate(bet.createdAt)}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-zinc-700 uppercase">NETWORK_ID</p>
                <p className="text-xs font-mono font-bold text-white uppercase">SEPOLIA_TESTNET_V1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
