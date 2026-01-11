'use client';

import { motion } from 'framer-motion';
import { Terminal, Shield, Zap, Globe, Lock, ArrowRight, Wallet, Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ArchitecturePage() {
  const steps = [
    {
      title: 'Identification',
      desc: 'Users register unique on-chain usernames to establish identity and reputation.',
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Wager Creation',
      desc: 'Creator defines terms, stakes MNEE, and selects a trusted judge.',
      icon: Wallet,
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: 'Escrow Lock',
      desc: 'Funds are securely locked in the smart contract. Non-custodial and transparent.',
      icon: Lock,
      color: 'bg-yellow-500/10 text-yellow-500',
    },
    {
      title: 'Counterparty Match',
      desc: 'Opponent accepts the terms and matches the stake. Bet becomes ACTIVE.',
      icon: Zap,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Resolution',
      desc: 'Judge verifies the outcome. Full pot is paid to the winner automatically.',
      icon: CheckCircle2,
      color: 'bg-green-500/10 text-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] grid-pattern">
      <div className="noise-overlay" />
      <div className="scanline" />
      <Header />

      <main className="relative z-10 pt-32 pb-40 container mx-auto px-6 max-w-6xl">
        <div className="space-y-24">
          {/* Header */}
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border-2 border-primary/20 text-primary text-[10px] font-black tracking-[0.3em] uppercase italic">
              PROTOCOL_SPEC_V1.0
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white font-display uppercase italic">
              ARENA <span className="text-primary text-glow-lime not-italic">PROTOCOL</span>
            </h1>
            <p className="text-xl text-zinc-400 font-medium italic leading-relaxed max-w-3xl mx-auto border-x-2 border-primary/20 px-8">
              "The technical architecture behind the world's most transparent peer-to-peer wagering engine."
            </p>
          </div>

          {/* Process Visualization */}
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 hidden lg:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/[0.02] border-2 border-white/5 p-8 space-y-6 hover:border-primary/50 transition-all group relative"
                >
                  <div className={`w-14 h-14 ${step.color} border-2 border-current/20 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-zinc-500 tracking-widest uppercase italic">Step_0{index + 1}</div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">{step.title}</h3>
                  </div>
                  <p className="text-zinc-400 font-medium italic leading-relaxed text-sm">
                    {step.desc}
                  </p>
                  {index < steps.length - 1 && (
                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 hidden lg:block">
                      <ArrowRight className="w-8 h-8 text-primary/20" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Technical Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="p-12 border-2 border-white/5 bg-white/[0.01] space-y-8 relative overflow-hidden">
               <div className="flex items-center gap-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Smart Contract Security</h2>
               </div>
               <div className="space-y-6">
                  <div className="flex gap-4 p-4 border-l-4 border-primary bg-primary/5">
                    <div className="text-primary font-black italic">01</div>
                    <div className="text-zinc-300 font-medium italic">ReentrancyGuard implementation on all fund-moving functions.</div>
                  </div>
                  <div className="flex gap-4 p-4 border-l-4 border-zinc-700 bg-white/5">
                    <div className="text-zinc-500 font-black italic">02</div>
                    <div className="text-zinc-300 font-medium italic">Atomic settlement ensures payouts happen instantly on judge resolution.</div>
                  </div>
                  <div className="flex gap-4 p-4 border-l-4 border-zinc-700 bg-white/5">
                    <div className="text-zinc-500 font-black italic">03</div>
                    <div className="text-zinc-300 font-medium italic">Access control restricts judge powers to specifically assigned bets.</div>
                  </div>
               </div>
            </div>

            <div className="p-12 border-2 border-primary/20 bg-primary/5 space-y-8 relative overflow-hidden">
               <div className="flex items-center gap-4">
                  <Terminal className="w-6 h-6 text-primary" />
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Stack & Infrastructure</h2>
               </div>
               <div className="grid grid-cols-2 gap-8 font-mono">
                  <div className="space-y-2">
                    <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase italic">NETWORK</div>
                    <div className="text-white font-black italic">ETHEREUM_L1/L2</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase italic">STABLECOIN</div>
                    <div className="text-white font-black italic">MNEE_ERC20</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase italic">FRONTEND</div>
                    <div className="text-white font-black italic">NEXT.JS_16.1</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase italic">STATE</div>
                    <div className="text-white font-black italic">WAGMI_V2</div>
                  </div>
               </div>
               <div className="pt-8 border-t border-primary/10">
                 <div className="flex items-center gap-3 text-primary">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-[10px] font-black tracking-widest uppercase italic">PRODUCTION_NOTICE</span>
                 </div>
                 <p className="mt-2 text-zinc-400 text-sm font-medium italic">
                   "This protocol is currently running on the Sepolia testnet for evaluation. Mainnet deployment is scheduled for Q1 2026."
                 </p>
               </div>
            </div>
          </div>

            {/* Roadmap Section */}
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <Globe className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Strategic Roadmap</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Phase 1 */}
                <div className="p-8 border-2 border-primary bg-primary/5 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 bg-primary text-black font-black text-[10px] uppercase tracking-widest italic">
                    COMPLETED
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-primary tracking-widest uppercase italic">PHASE_01</div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">MVP Launch</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'P2P Betting Engine',
                      'MNEE Escrow System',
                      'Judge Resolution Flow',
                      'Sepolia Testnet Live'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm font-medium italic">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Phase 2 */}
                <div className="p-8 border-2 border-white/5 bg-white/[0.02] space-y-6">
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-zinc-500 tracking-widest uppercase italic">PHASE_02</div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Mainnet Expansion</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'ETH Mainnet Deployment',
                      'MNEE Real-Token Integration',
                      'Full Protocol Audit',
                      'Tournament Support'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-400 text-sm font-medium italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 text-[10px] font-black text-zinc-600 tracking-widest uppercase italic">ETA: Q2 2026</div>
                </div>

                {/* Phase 3 */}
                <div className="p-8 border-2 border-white/5 bg-white/[0.02] space-y-6">
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-zinc-500 tracking-widest uppercase italic">PHASE_03</div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Automation & AI</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'AI Resolution Assistant',
                      'Chainlink Oracle Integration',
                      'Mobile PWA App',
                      'DAO Governance'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-400 text-sm font-medium italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 text-[10px] font-black text-zinc-600 tracking-widest uppercase italic">ETA: Q4 2026+</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center space-y-8">

            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Want to see the source?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button className="h-16 px-10 bg-primary text-black font-black uppercase tracking-widest rounded-none border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]" asChild>
                  <Link href="https://github.com" target="_blank">EXPLORE_CORE_CONTRACTS</Link>
                </Button>
                <Button variant="outline" className="h-16 px-10 border-2 border-white/10 text-white font-black uppercase tracking-widest rounded-none hover:border-primary hover:text-primary transition-all" asChild>
                  <Link href="/faq">READ_THE_FAQ</Link>
                </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
