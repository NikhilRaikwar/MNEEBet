'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CreateBetWizard } from '@/components/bet/CreateBetWizard';
import { motion } from 'framer-motion';
import { Zap, ShieldAlert, Terminal } from 'lucide-react';

export default function CreateBetPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background grid-pattern overflow-x-hidden">
      <div className="noise-overlay" />
      <div className="scanline" />
      <Header />
      
      <main className="flex-1 container py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase">
            <Terminal className="w-3.5 h-3.5" />
            PROTOCOL_TX_INITIATOR // SECTOR_02
          </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase font-display italic">
              CREATE <span className="text-primary text-glow-lime not-italic">BET.</span>
            </h1>
          <p className="text-zinc-500 font-sans border-l-4 border-primary/30 pl-6 max-w-2xl leading-relaxed">
            Configure the parameters of your wager. Once deployed, the terms are immutable. Settlement is handled by your chosen judge or decentralized oracle.
          </p>
        </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CreateBetWizard />
          </motion.div>
        </main>
      </div>
    );
  }

