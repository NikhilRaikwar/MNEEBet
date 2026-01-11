'use client';

import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Terminal, Shield, Zap, Globe, Lock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: 'Technical Questions',
      items: [
        {
          q: 'What is MNEE?',
          a: 'A USD-backed stablecoin worth $1.00. It provides a stable unit of account for betting without the volatility of traditional crypto assets. Real token address: 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF',
        },
        {
          q: 'Is this on mainnet or testnet?',
          a: 'Currently, the demo is deployed on the Sepolia testnet using mock MNEE. However, the protocol is architected for immediate mainnet deployment.',
        },
        {
          q: 'What blockchain is this on?',
          a: 'MNEEBet is built on the Ethereum network. We utilize L1/L2 solutions for maximum security and transparency.',
        },
        {
          q: 'How do I get testnet ETH and MNEE?',
          a: 'You can use the Sepolia faucet for ETH and our built-in mock MNEE faucet on the registration page to get started.',
        },
      ],
    },
    {
      category: 'How It Works',
      items: [
        {
          q: 'How do I create a bet?',
          a: '1. Connect your wallet. 2. Register a unique username. 3. Navigate to "Create Bet". 4. Define terms, set the stake in MNEE, and select a judge you trust.',
        },
        {
          q: 'How are disputes resolved?',
          a: 'Every bet includes a human judge selected at creation. This judge is responsible for verifying the outcome and rendering a final decision on the winner.',
        },
        {
          q: 'Can I lose more than I bet?',
          a: 'No. The protocol is non-custodial and stakes are locked in the smart contract. You can never lose more than the amount you explicitly stake.',
        },
        {
          q: 'How long do bets take to resolve?',
          a: 'Resolution is instant. Once the judge submits their decision, the funds are immediately available for the winner to withdraw in the same transaction.',
        },
      ],
    },
    {
      category: 'Safety & Security',
      items: [
        {
          q: 'Is my money safe?',
          a: 'Our smart contracts are built using industry-standard security patterns, including ReentrancyGuard and Ownable patterns. Funds are held in escrow by the contract, not by any centralized entity.',
        },
        {
          q: 'Does the platform take fees?',
          a: 'No. MNEEBet is a pure P2P protocol. 100% of the pot goes to the winner. We do not charge platform fees or take a house cut.',
        },
        {
          q: 'Can the contract be paused?',
          a: 'The contract includes an emergency pause function accessible only by the owner in case of critical vulnerabilities. There are no backdoors for fund extraction.',
        },
      ],
    },
    {
      category: 'Network/Deployment',
      items: [
        {
          q: 'What are the deployed contract addresses?',
          a: 'Protocol (Sepolia): 0x3480874a63D459046993915b52e612ee69947a81. Mock MNEE (Sepolia): 0xb8B51876429980d20ed20796B1C4294f1Fc75145.',
        },
        {
          q: 'When will this be on mainnet?',
          a: 'We are currently in the final audit and testing phase on Sepolia. Mainnet launch will follow once we have finalized the deployment capital and security reviews.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] grid-pattern">
      <div className="noise-overlay" />
      <div className="scanline" />
      <Header />

      <main className="relative z-10 pt-32 pb-40 container mx-auto px-6 max-w-4xl">
        <div className="space-y-16">
          {/* Header */}
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border-2 border-primary/20 text-primary text-[10px] font-black tracking-[0.3em] uppercase italic">
              KNOWLEDGE_BASE_V2
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white font-display uppercase italic">
              ARENA <span className="text-primary text-glow-lime not-italic">FAQ</span>
            </h1>
            <p className="text-xl text-zinc-400 font-medium italic leading-relaxed max-w-2xl mx-auto border-x-2 border-primary/20 px-8">
              "Everything you need to know about the most advanced wagering protocol on Ethereum."
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-20">
            {faqs.map((section, sIndex) => (
              <div key={sIndex} className="space-y-8">
                <div className="flex items-center gap-4">
                  <Terminal className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic border-b-2 border-primary/20 pb-2 flex-1">
                    {section.category}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((item, iIndex) => {
                    const currentIndex = sIndex * 10 + iIndex;
                    const isOpen = openIndex === currentIndex;

                    return (
                      <div
                        key={iIndex}
                        className={`border-2 transition-all duration-300 ${
                          isOpen ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : currentIndex)}
                          className="w-full p-6 text-left flex items-center justify-between group"
                        >
                          <span className={`text-lg font-black uppercase tracking-tight transition-colors ${isOpen ? 'text-primary' : 'text-zinc-200 group-hover:text-white'}`}>
                            {item.q}
                          </span>
                          {isOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
                        </button>
                        
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="px-6 pb-6"
                          >
                            <div className="pt-4 border-t-2 border-primary/10 text-zinc-400 font-medium italic leading-relaxed">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Banner */}
          <div className="p-12 border-2 border-primary/20 bg-primary/5 text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Still Have Questions?</h2>
            <p className="text-zinc-400 italic font-medium max-w-lg mx-auto">
              Our community is active 24/7. Join the arena discussions and get real-time support from the developers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
               <Button className="h-14 px-8 bg-primary text-black font-black uppercase tracking-widest rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" asChild>
                  <Link href="https://twitter.com" target="_blank">TWITTER_ARENA</Link>
               </Button>
               <Button variant="outline" className="h-14 px-8 border-2 border-white/10 text-white font-black uppercase tracking-widest rounded-none hover:border-primary hover:text-primary transition-all" asChild>
                  <Link href="https://github.com" target="_blank">GITHUB_CORE</Link>
               </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
