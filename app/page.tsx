'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { useUsername } from '@/hooks/useUsername';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight, Shield, Zap, Globe, Github, Terminal, Activity, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { isConnected, address } = useAccount();
  const { username, isLoading: isUsernameLoading } = useUsername(address);
  const router = useRouter();

  useEffect(() => {
    if (isConnected && !isUsernameLoading) {
      if (username) {
        router.push('/dashboard');
      } else {
        router.push('/register');
      }
    }
  }, [isConnected, username, isUsernameLoading, router]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden grid-pattern">
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary flex items-center justify-center rotate-3 border-2 border-black">
              <Trophy className="text-black w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-white font-display">
              MNEE<span className="text-primary">BET</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors">Protocol</Link>
            <Link href="#" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors">Manifesto</Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                PROTOCOL_STATUS: OPERATIONAL
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-7xl md:text-[120px] font-black tracking-tighter text-white font-display leading-[0.85] uppercase">
                THE <br />
                <span className="text-primary text-glow-lime italic">ARENA</span> <br />
                IS OPEN
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-400 max-w-xl font-sans leading-relaxed border-l-4 border-primary/30 pl-6">
                Direct peer-to-peer betting. No intermediaries. No limits. Verified by smart contracts. Settled in MNEE stablecoin.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Button
                  onClick={() => { }}
                  className="h-14 px-8 text-sm font-black uppercase tracking-widest bg-primary text-black hover:bg-primary/90 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  INITIALIZE CONNECTION
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Requires WalletConnect compatible provider
                </div>
              </motion.div>
            </div>

            {/* Right Status Panel */}
            <div className="lg:col-span-5">
              <motion.div
                variants={itemVariants}
                className="brutalist-card p-8 border-2 border-white/10 bg-black/40 backdrop-blur-xl space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">System_Logs</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                </div>

                <div className="font-mono text-[11px] space-y-3">
                  <div className="flex gap-4">
                    <span className="text-zinc-600">[08:42:01]</span>
                    <span className="text-zinc-300 italic">Connecting to MNEEBet_V2...</span>
                  </div>
                  <div className="flex gap-4 text-primary">
                    <span className="text-zinc-600">[08:42:02]</span>
                    <span>SUCCESS: Contract 0x3480...7a81 found.</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-zinc-600">[08:42:05]</span>
                    <span className="text-zinc-300 italic">Awaiting user identity check...</span>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <div className="text-zinc-500 mb-2 uppercase text-[9px] tracking-widest font-black">Active Stats</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 border border-white/5">
                        <div className="text-[9px] text-zinc-500 uppercase">Total_Volume</div>
                        <div className="text-lg font-black text-white">$4.2M+</div>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5">
                        <div className="text-[9px] text-zinc-500 uppercase">Live_Bets</div>
                        <div className="text-lg font-black text-primary">1,204</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Features Horizontal */}
          <section id="features" className="mt-40 border-t-2 border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/10">
              {[
                { title: 'NON-CUSTODIAL', desc: 'Immutable smart contracts govern every wager. You are the bank.', icon: Lock },
                { title: 'STABLE SETTLEMENT', desc: 'Powered by MNEE. No volatility risks. What you win is what you get.', icon: Activity },
                { title: 'PEER-TO-PEER', desc: 'No bookmakers. No house edge. Just pure logic vs logic.', icon: Globe }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 hover:bg-white/[0.02] transition-colors group"
                >
                  <feature.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-black text-white mb-4 tracking-tighter">{feature.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </main>

      {/* Background Decor */}
      <div className="fixed bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[-100px] right-[-100px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">MNEEBet © 2026. THE ARENA AWAITS.</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-zinc-600 hover:text-white transition-colors"><Github className="w-4 h-4" /></Link>
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Built for the future.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
