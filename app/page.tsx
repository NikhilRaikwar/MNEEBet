'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { useUsername } from '@/hooks/useUsername';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight, Shield, Zap, Globe, Github, Terminal, Activity, Lock, Twitter, ExternalLink, UserCheck, Edit3, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

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
    <div className="relative min-h-screen bg-[#050505] grid-pattern overflow-x-hidden">
      <div className="noise-overlay" />
      <div className="scanline" />

      <Header />

      <main className="relative z-10 pt-12 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-12 text-center space-y-10">
                  <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border-2 border-primary/20 text-primary text-[10px] font-black tracking-[0.3em] uppercase italic">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    MNEE: The Stablecoin Built for Trust
                  </motion.div>
  
                  <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-[110px] font-black tracking-tighter text-white font-display leading-[0.8] uppercase">
                    Peer-to-peer betting <br />
                    with <span className="text-primary text-glow-lime italic">MNEE</span> <br />
                    stablecoin
                  </motion.h1>
    
                  <motion.p variants={itemVariants} className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto font-sans leading-relaxed border-y-2 border-primary/20 py-8 italic">
                   Stake MNEE. Trust math, not intermediaries. <br /> Judge-resolved settlements on ETH.
                  </motion.p>
    
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                    {!isConnected ? (
                      <ConnectButton.Custom>
                        {({ openConnectModal, connectModalOpen }) => (
                          <Button
                            onClick={openConnectModal}
                            disabled={connectModalOpen}
                            className="w-full sm:w-auto h-20 px-8 sm:px-12 text-sm sm:text-base font-black uppercase tracking-[0.2em] bg-primary text-black hover:bg-primary/90 rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(163,251,46,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(163,251,46,0.5)] active:shadow-none active:translate-x-2 active:translate-y-2 transition-all group"
                          >
                            INITIALIZE_WALLET
                            <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                          </Button>
                        )}
                      </ConnectButton.Custom>
                    ) : (
                      <Button
                        asChild
                        className="w-full sm:w-auto h-20 px-8 sm:px-12 text-sm sm:text-base font-black uppercase tracking-[0.2em] bg-primary text-black hover:bg-primary/90 rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(163,251,46,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(163,251,46,0.5)] active:shadow-none active:translate-x-2 active:translate-y-2 transition-all group"
                      >
                        <Link href="/create">
                          CREATE_BET
                          <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                      </Button>
                    )}
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] max-w-[200px] leading-tight text-left">
                      ESTABLISHING SECURE P2P CHANNEL VIA WALLETCONNECT_V2
                    </div>
                  </motion.div>
                </div>
            </div>
          </motion.div>
        </section>

        {/* Project Flow / Features Section */}
        <section id="features" className="container mx-auto px-6 mb-40">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">PROTOCOL_WORKFLOW</h2>
            <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic">HOW IT WORKS</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-white/10 divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/10 bg-black/20">
            {[
              { 
                step: "01", 
                title: 'Claim Identity', 
                desc: 'Secure your unique on-chain username to build your reputation in the arena.', 
                icon: UserCheck 
              },
              { 
                step: "02", 
                title: 'Create Bet', 
                desc: 'Define your terms, set stakes in MNEE, and select a trusted judge to oversee the wager.', 
                icon: Edit3 
              },
              { 
                step: "03", 
                title: 'Bets Market', 
                desc: 'Browse active wagers, accept challenges from other users, and prove your foresight.', 
                icon: ShoppingBag 
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 hover:bg-white/[0.03] transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 text-6xl font-black text-white/5 italic select-none group-hover:text-primary/10 transition-colors">
                  {feature.step}
                </div>
                <feature.icon className="w-12 h-12 text-primary mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Token Information Section */}
        <section className="bg-primary/5 border-y-2 border-primary/20 py-32 mb-40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="w-24 h-24 bg-primary flex items-center justify-center border-4 border-black rotate-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <Zap className="w-12 h-12 text-black" />
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
                  POWERED BY <br />
                  <span className="text-primary text-glow-lime">MNEE STABLECOIN</span>
                </h2>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed italic">
                  "USD-backed stablecoin, $1.00 price, No volatility." <br />
                  Settle your bets with confidence using institutional-grade stable value.
                </p>
                <div className="flex gap-4">
                   <Button variant="outline" className="h-12 border-2 border-white/10 rounded-none font-black uppercase text-[10px] tracking-widest hover:border-primary hover:text-primary" asChild>
                     <Link href="https://etherscan.io/token/0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" target="_blank">
                       VIEW ON MAINNET <ExternalLink className="ml-2 w-3 h-3" />
                     </Link>
                   </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="p-8 border-2 border-white/10 bg-black/80 backdrop-blur-xl space-y-6 group hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Mainnet_Asset</span>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-black uppercase border border-green-500/20">Live</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono text-zinc-600">TOKEN_ADDRESS:</div>
                    <div className="text-sm font-mono text-white break-all bg-white/5 p-4 border border-white/5">
                      0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
                    </div>
                  </div>
                </div>

                <div className="p-8 border-2 border-white/10 bg-black/80 backdrop-blur-xl space-y-6 group hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sepolia_Mock_Asset</span>
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase border border-blue-500/20">Testnet</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono text-zinc-600">TOKEN_ADDRESS:</div>
                    <div className="text-sm font-mono text-white break-all bg-white/5 p-4 border border-white/5">
                      0xb8B51876429980d20ed20796B1C4294f1Fc75145
                    </div>
                  </div>
                  <Link 
                    href="https://sepolia.etherscan.io/token/0xb8b51876429980d20ed20796b1c4294f1fc75145" 
                    target="_blank"
                    className="inline-flex items-center text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                  >
                    View on Sepolia Etherscan <ExternalLink className="ml-1.5 w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contract Info Banner */}
        <section className="container mx-auto px-6 mb-40">
          <div className="p-1 border-2 border-primary/30 bg-black overflow-hidden relative group">
            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
              <div className="flex items-center gap-8">
                <div className="hidden md:flex p-4 border-2 border-primary/50 text-primary">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">CURRENT_DEPLOYMENT</span>
                    <span className="h-[1px] w-12 bg-primary/30" />
                  </div>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight">Sepolia Testnet Protocol</h4>
                  <p className="text-zinc-500 font-mono text-[11px] break-all">ADDR: 0x3480874a63D459046993915b52e612ee69947a81</p>
                </div>
              </div>
              <Button variant="outline" className="w-full md:w-auto h-14 border-2 border-white/10 rounded-none bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase text-xs tracking-[0.2em]" asChild>
                <Link href="https://sepolia.etherscan.io/address/0x3480874a63D459046993915b52e612ee69947a81" target="_blank">
                  VIEW_PROTOCOL_ON_ETHERSCAN
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Background Decor */}
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-50" />
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-50" />
    </div>
  );
}
