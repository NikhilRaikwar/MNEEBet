'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PartyPopper, Trophy, ExternalLink, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { MNEEBET_CONTRACT_ADDRESS } from '@/lib/constants';
import { motion } from 'framer-motion';

interface BetSuccessModalProps {
  betId?: bigint;
  open: boolean;
  onClose: () => void;
}

export function BetSuccessModal({ betId, open, onClose }: BetSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-2 border-primary p-0 overflow-hidden rounded-none shadow-[10px_10px_0px_0px_rgba(204,255,0,1)]">
        <div className="noise-overlay opacity-10" />
        <div className="scanline" />
        
        <div className="p-8 md:p-12 relative z-10 space-y-10">
          <div className="flex justify-center">
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 3 }}
              className="w-24 h-24 bg-primary border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              <Trophy className="w-12 h-12 text-black" />
            </motion.div>
          </div>

          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <Zap className="w-3.5 h-3.5" />
              DEPLOYMENT_SUCCESSFUL
            </div>
            <DialogTitle className="text-4xl font-black text-white uppercase tracking-tighter italic font-display">
              ARENA <span className="text-primary not-italic text-glow-lime">LIVE.</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
              YOUR PEER-TO-PEER SMART CONTRACT HAS BEEN COMMITTED TO THE BLOCKCHAIN REGISTRY.
            </DialogDescription>
          </div>

          <div className="flex flex-col gap-4">
            {betId !== undefined && (
              <Button className="h-16 bg-white text-black hover:bg-primary font-black uppercase tracking-widest text-xs rounded-none border-2 border-black transition-all active:translate-x-1 active:translate-y-1" asChild>
                <Link href={`/bets/${betId.toString()}`}>
                  ENTER ARENA
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Link>
              </Button>
            )}
            
            <Link
              href={`https://etherscan.io/address/${MNEEBET_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="outline" className="w-full h-14 border-2 border-white/10 text-zinc-500 hover:text-white hover:border-primary/50 font-black uppercase tracking-widest text-[10px] rounded-none transition-all">
                VERIFY_ON_EXPLORER
                <ExternalLink className="w-3.5 h-3.5 ml-3" />
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full h-10 text-zinc-700 hover:text-zinc-400 font-black uppercase tracking-widest text-[9px] hover:bg-transparent"
            >
              CLOSE_OVERLAY
            </Button>
          </div>
        </div>

        <div className="bg-primary/5 border-t border-white/5 p-4 flex items-center justify-center gap-4">
          <ShieldCheck className="w-4 h-4 text-primary opacity-50" />
          <span className="text-[9px] font-mono text-zinc-600 font-bold uppercase tracking-[0.2em]">PROTOCOL_V1.4 // SECURE_SETTLEMENT_ACTIVE</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
