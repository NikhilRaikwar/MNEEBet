'use client';

import { motion } from 'framer-motion';
import { Trophy, Shield, Zap, Lock, Eye, Users, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ManifestoPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-[#050505] grid-pattern">
      <div className="noise-overlay" />
      <div className="scanline" />
      <Header />

      <main className="relative z-10 pt-32 pb-40 container mx-auto px-6 max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-24"
        >
          {/* Header */}
          <section className="space-y-8 text-center">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border-2 border-primary/20 text-primary text-[10px] font-black tracking-[0.3em] uppercase italic">
              MANIFESTO_V1.0
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter text-white font-display uppercase italic">
              The <span className="text-primary text-glow-lime not-italic">MNEEBet</span> <br /> Manifesto
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto italic border-x-2 border-primary/20 px-8">
              "We are building a world where the house doesn't exist. Where code is the judge, and stable value is the law."
            </motion.p>
          </section>

          {/* We Believe In */}
          <section className="space-y-12">
            <motion.h2 variants={itemVariants} className="text-4xl font-black text-white tracking-tight uppercase italic border-l-8 border-primary pl-6">
              We Believe In:
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Decentralization', desc: 'Over centralization. No gatekeepers, no censorship, no permission required.', icon: Zap },
                { title: 'Code Over Trust', desc: 'Immutable smart contracts replace human error and platform bias.', icon: Lock },
                { title: 'Users as the Bank', desc: 'You control your funds. Non-custodial by design. You are the house.', icon: Shield },
                { title: 'Stable Settlement', desc: 'USD-backed value (MNEE) ensures what you win is what you get.', icon: Trophy },
                { title: 'Transparency', desc: 'An immutable, public record of every wager ever placed.', icon: Eye },
              ].map((belief, i) => (
                <motion.div key={i} variants={itemVariants} className="p-8 border-2 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                  <belief.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tighter">{belief.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium italic">{belief.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* The Problem */}
          <section className="space-y-12 p-12 border-2 border-red-500/20 bg-red-500/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/30" />
            <motion.h2 variants={itemVariants} className="text-4xl font-black text-white tracking-tight uppercase italic">
              The Problem:
            </motion.h2>
            <motion.div variants={itemVariants} className="space-y-6 text-zinc-400 font-medium italic leading-relaxed text-lg">
              <p>Traditional betting platforms are broken. They operate in shadows, taking massive "house cuts" and charging hidden fees that erode your winnings.</p>
              <p>They require you to trust them with your capital, yet they can freeze your account, delay payouts, or manipulate odds at will. You aren't playing against another user; you're playing against a machine designed to make you lose.</p>
            </motion.div>
          </section>

          {/* Our Solution */}
          <section className="space-y-12 p-12 border-2 border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
            <motion.h2 variants={itemVariants} className="text-4xl font-black text-white tracking-tight uppercase italic">
              Our Solution:
            </motion.h2>
            <motion.div variants={itemVariants} className="space-y-6 text-zinc-300 font-medium italic leading-relaxed text-lg">
              <p>MNEEBet fixes the game by removing the platform from the equation. We use smart contracts as immutable, automated judges and the MNEE stablecoin for trust-minimized settlement.</p>
              <p>By leveraging USD-backed stable value, we eliminate the volatility risk inherent in crypto betting. If you win $100, you receive $100 in value, not a fluctuating token that could crash tomorrow.</p>
            </motion.div>
          </section>

          {/* Key Principles */}
          <section className="space-y-12">
            <motion.h2 variants={itemVariants} className="text-4xl font-black text-white tracking-tight uppercase italic border-l-8 border-primary pl-6">
              Key Principles:
            </motion.h2>
            <div className="space-y-4">
              {[
                'NO HOUSE EDGE: 100% of the pot goes to the winner.',
                'INSTANT PAYOUTS: Settlements occur the moment a decision is rendered.',
                'HUMAN-VERIFIED DISPUTES: Choose a judge you trust to resolve wagers.',
                'NON-CUSTODIAL ARCHITECTURE: Your wallet is the only vault.',
              ].map((principle, i) => (
                <motion.div key={i} variants={itemVariants} className="p-6 border-2 border-white/5 bg-black text-zinc-400 font-black uppercase tracking-widest text-xs flex items-center gap-4 group hover:border-primary/50 transition-colors">
                   <div className="w-2 h-2 bg-primary group-hover:scale-150 transition-transform" />
                   {principle}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Future Vision */}
          <section className="space-y-12 text-center pb-20 border-b-2 border-white/5">
            <motion.h2 variants={itemVariants} className="text-4xl font-black text-white tracking-tight uppercase italic">
              The Future Vision
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-zinc-500 font-medium italic leading-relaxed max-w-3xl mx-auto">
              This is just the beginning. MNEEBet is built to scale beyond simple wagers into global tournaments, multi-party bets, and real-world event prediction markets. We are building the foundational infrastructure for the next century of peer-to-peer competition.
            </motion.p>
            <motion.div variants={itemVariants} className="pt-10">
               <Button className="h-16 px-12 bg-primary text-black font-black uppercase tracking-[0.2em] rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all" asChild>
                  <Link href="/dashboard">
                    ENTER_THE_ARENA <ArrowRight className="ml-4 w-5 h-5" />
                  </Link>
               </Button>
            </motion.div>
          </section>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
