'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRegisterUsername } from '@/hooks/useRegisterUsername';
import { useAccount } from 'wagmi';
import { CheckCircle2, AlertCircle, User, ShieldCheck, Sparkles, ArrowRight, Fingerprint, Terminal as TerminalIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UsernameRegister() {
  const { address, isConnected } = useAccount();
  const [username, setUsername] = useState('');
  const { registerUsername, isLoading, isConfirmed, error } = useRegisterUsername();
  const router = useRouter();

  const isValidUsername = username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);

  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, router]);

  const handleRegister = () => {
    if (isValidUsername) {
      registerUsername(username);
    }
  };

  if (!isConnected) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="brutalist-card p-12 text-center border-2 border-white/10 bg-black/40 backdrop-blur-xl"
      >
        <div className="w-20 h-20 bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-8 rotate-3">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase font-display">Wallet Disconnected</h3>
        <p className="text-zinc-500 max-w-xs mx-auto mb-10 font-medium">
          Authorization required. Connect your cryptographic signature to access the identity oracle.
        </p>
        <Button className="h-14 px-10 text-sm font-black uppercase tracking-widest bg-primary text-black hover:bg-primary/90 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all">
          ESTABLISH LINK
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="brutalist-card p-10 md:p-14 border-2 border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden group"
      >
        {/* Background Visual */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <Fingerprint className="w-64 h-64 text-primary" />
        </div>

        <div className="relative z-10 space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              ORACLE_IDENTITY_SETUP
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase font-display">
              CLAIM YOUR <br />
              <span className="text-primary text-glow-lime italic">HANDLE.</span>
            </h2>
            <p className="text-zinc-400 font-medium max-w-md border-l-2 border-primary/30 pl-6">
              Your handle is your permanent identifier within THE ARENA. Choose wisely—once committed to the chain, it cannot be altered.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative group/input">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 text-zinc-500 group-focus-within/input:text-primary transition-colors">
                <TerminalIcon className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest">USR_</span>
              </div>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="ENTER_IDENTITY"
                className="h-24 pl-28 pr-8 bg-white/5 border-2 border-white/10 text-3xl font-black text-white placeholder:text-zinc-800 focus:border-primary focus:ring-0 rounded-none transition-all font-display uppercase tracking-tighter"
                disabled={isLoading || isConfirmed}
              />
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-focus-within/input:w-full transition-all duration-500" />
            </div>
            
            <AnimatePresence>
              {username && !isValidUsername && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-[10px] font-mono font-bold text-accent flex items-center gap-2 px-2 uppercase tracking-widest"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  ERROR: 3-20 CHARS // ALPHANUMERIC // UNDERSCORES_ONLY
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6 pt-4">
            <Button
              onClick={handleRegister}
              disabled={!isValidUsername || isLoading || isConfirmed}
              className={`w-full h-20 text-lg font-black rounded-none transition-all duration-500 border-2 ${
                isConfirmed 
                  ? 'bg-green-500 text-white border-black' 
                  : 'bg-primary text-black hover:bg-primary/90 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-1 active:translate-y-1'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  INITIATING_CHAIN_COMMIT...
                </div>
              ) : isConfirmed ? (
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6" />
                  IDENTITY_VERIFIED
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  COMMIT IDENTITY
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </Button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 border-2 border-accent/20 bg-accent/5 text-accent text-[11px] font-mono font-bold flex items-center gap-4 uppercase tracking-widest"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  FAIL: {error.message || 'ID_COLLISION_OR_EXECUTION_ERROR'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* System Status Indicators */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-8">
          <div className="space-y-1">
            <div className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Oracle_Status</div>
            <div className="text-[11px] text-white font-mono font-bold">STABLE.CONNECTED</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Gas_Estimate</div>
            <div className="text-[11px] text-primary font-mono font-bold">~0.002 ETH</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Protocol</div>
            <div className="text-[11px] text-white font-mono font-bold">MNEEBET_V1.4</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
