'use client';

import { motion } from 'framer-motion';
import { UsernameRegister } from '@/components/username/UsernameRegister';
import { Trophy, Terminal } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function RegisterUsernamePage() {
  return (
    <div className="min-h-screen bg-background grid-pattern flex flex-col">
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Mini Nav */}
      <nav className="h-16 border-b border-white/5 flex items-center px-6 justify-between bg-black/40 backdrop-blur-md relative z-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary flex items-center justify-center rotate-3 border border-black">
            <Trophy className="text-black w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-black tracking-tight text-white font-display">
            MNEE<span className="text-primary">BET</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Gateway_Secure</span>
          </div>
          <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <UsernameRegister />
        </motion.div>
      </main>

      <footer className="py-6 border-t border-white/5 text-center relative z-10">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          SYSTEM_VERSION: 1.0.4 // IDENTITY_ORACLE_ACTIVE
        </p>
      </footer>
    </div>
  );
}
