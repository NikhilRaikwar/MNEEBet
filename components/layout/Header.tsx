'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Trophy, Menu, X, Rocket, LayoutDashboard, PlusCircle, BarChart3, Terminal, HelpCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { isConnected } = useAccount();

  const publicRoutes = ['/', '/manifesto', '/faq'];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/bets/');

  useEffect(() => {
    if (!isConnected && !isPublicRoute) {
      router.push('/');
    }
  }, [isConnected, isPublicRoute, router]);

  const navLinks = isConnected ? [
    { name: 'THE_ARENA', href: '/dashboard', icon: LayoutDashboard },
    { name: 'CREATE_BET', href: '/create', icon: PlusCircle },
  ] : [
    { name: 'MANIFESTO', href: '/manifesto', icon: FileText },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'h-16 bg-[#050505]/90 backdrop-blur-xl border-b-2 border-primary/20' : 'h-24 bg-transparent'
    }`}>
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center bg-primary border-2 border-black rotate-3 group-hover:rotate-0 transition-transform">
              <Trophy className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tight text-white font-display uppercase italic">
              MNEE<span className="text-primary not-italic">BET</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`relative py-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all group ${
                  pathname === link.href ? 'text-primary' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.name}
                </span>
                {pathname === link.href && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 font-mono">
            <ConnectButton showBalance={false} accountStatus="address" chainStatus="none" />
            {isConnected && (
              <Button
                className="bg-primary text-black hover:bg-primary/90 font-black rounded-none px-6 h-10 border-2 border-black shadow-[4px_4px_0px_0px_rgba(163,251,46,0.3)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(163,251,46,0.5)] active:translate-x-0 active:translate-y-0 active:shadow-none uppercase text-xs tracking-widest"
                asChild
              >
                <Link href="/create">
                  CREATE_BET
                </Link>
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-primary rounded-none border-2 border-primary/20 h-10 w-10 hover:bg-primary/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[100] lg:hidden bg-[#050505] flex flex-col p-10 pt-32"
              >
              <nav className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-4xl font-black uppercase tracking-tighter ${
                      pathname === link.href ? 'text-primary italic' : 'text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pt-10 border-t-2 border-white/5 flex flex-col gap-6">
                <ConnectButton showBalance={true} />
                {isConnected && (
                  <Button className="w-full h-16 bg-primary text-black font-black text-xl rounded-none border-2 border-black uppercase shadow-[8px_8px_0px_0px_rgba(163,251,46,0.3)] active:shadow-none transition-all" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link href="/create">CREATE_BET</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </header>
  );
}
