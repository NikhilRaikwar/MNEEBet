'use client';

import Link from 'next/link';
import { Trophy, Github, Twitter, MessageSquare, ExternalLink, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-white/5 bg-black py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-12 space-y-10">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-primary flex items-center justify-center border-2 border-black rotate-3 group-hover:rotate-0 transition-transform">
                  <Trophy className="text-black w-7 h-7" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-white font-display uppercase italic">
                  MNEE<span className="text-primary not-italic">BET</span>
                </span>
              </Link>
              <p className="text-zinc-500 max-w-sm text-lg font-sans leading-relaxed border-l-2 border-primary/20 pl-6 italic">
                "The most advanced decentralized arena for peer-to-peer wagering. Built for the bold, secured by smart contracts."
              </p>
                <div className="flex items-center gap-6">
                  <Link 
                    href="https://github.com/NikhilRaikwar/MNEEBet" 
                    target="_blank"
                    className="w-12 h-12 border-2 border-white/10 flex items-center justify-center text-zinc-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Github className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="https://x.com/NikhilRaikwarr" 
                    target="_blank"
                    className="w-12 h-12 border-2 border-white/10 flex items-center justify-center text-zinc-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </Link>
                </div>
            </div>
          </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em] flex flex-wrap items-center justify-center gap-6">
            <span>© {currentYear} MNEEBet_Terminal</span>
            <span className="h-1 w-1 bg-zinc-800 rounded-full" />
            <span>Identity_Verified</span>
            <span className="h-1 w-1 bg-zinc-800 rounded-full" />
            <span>Built_for_the_Future</span>
          </div>
          <div className="flex items-center gap-10 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            <Link href="#" className="hover:text-primary transition-colors">Privacy_Protocol</Link>
            <Link href="#" className="hover:text-primary transition-colors">Risk_Disclosure</Link>
          </div>
        </div>
      </div>

      {/* Background Text */}
      <div className="absolute -bottom-10 -right-20 text-[200px] font-black text-white/[0.02] pointer-events-none select-none font-display italic tracking-tighter uppercase leading-none">
        ARENA
      </div>
    </footer>
  );
}
