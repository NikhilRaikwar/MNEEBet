'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddressByUsername } from '@/hooks/useUsername';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, User, X, Check, Terminal, Fingerprint } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface UsernameSearchProps {
  onSelect?: (address: `0x${string}` | undefined, username?: string) => void;
  placeholder?: string;
  showAvatar?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function UsernameSearch({ 
  onSelect, 
  placeholder = 'SEARCH_BY_IDENTITY_OR_ADDRESS...', 
  showAvatar = true,
  value: controlledValue,
  onChange: controlledOnChange
}: UsernameSearchProps) {
  const [searchValue, setSearchValue] = useState(controlledValue || '');
  const [isAddress, setIsAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<`0x${string}` | undefined>();
  const [selectedUsername, setSelectedUsername] = useState<string>('');

  const checkIsAddress = (val: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(val);
  };

  const actualValue = controlledValue !== undefined ? controlledValue : searchValue;
  
  const handleInputChange = (val: string) => {
    if (controlledOnChange) {
      controlledOnChange(val);
    } else {
      setSearchValue(val);
    }
    setIsAddress(checkIsAddress(val));
    setSelectedAddress(undefined);
    setSelectedUsername('');
    if (val === '') onSelect?.(undefined);
  };

  const { address, isLoading, error } = useAddressByUsername(
    !checkIsAddress(actualValue) && actualValue.length > 0 ? actualValue : undefined
  );

  const displayAddress = isAddress ? (actualValue as `0x${string}`) : address;
  const displayUsername = isAddress ? undefined : actualValue;

  const handleSelect = () => {
    if (displayAddress) {
      setSelectedAddress(displayAddress);
      setSelectedUsername(displayUsername || '');
      onSelect?.(displayAddress, displayUsername);
    }
  };

  const handleClear = () => {
    handleInputChange('');
    setSelectedAddress(undefined);
    setSelectedUsername('');
    onSelect?.(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 text-zinc-600 group-focus-within:text-primary transition-colors">
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">QUERY_</span>
        </div>
        <Input
          value={actualValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="h-20 pl-28 pr-12 bg-white/5 border-2 border-white/10 text-xl font-black text-white placeholder:text-zinc-800 focus:border-primary/50 focus:ring-0 rounded-none transition-all font-display uppercase tracking-tighter"
        />
        {actualValue && (
          <button 
            onClick={handleClear}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 text-zinc-600 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {(selectedAddress || displayAddress) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className={`brutalist-card p-6 border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-6 ${
              selectedAddress ? 'border-primary bg-primary/5 shadow-[4px_4px_0px_0px_rgba(204,255,0,1)]' : 'border-white/10 bg-black/40'
            }`}>
              <div className="flex items-center gap-6 flex-1 w-full">
                {showAvatar && (
                  <div className="relative">
                    <div className="absolute inset-[-2px] bg-primary/20 rotate-6" />
                    <Avatar className="w-16 h-16 rounded-none border-2 border-black relative z-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${selectedAddress || displayAddress}`} />
                      <AvatarFallback className="bg-zinc-900 font-black">ID</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Identity_Oracle_Result</span>
                  </div>
                  <div className="flex flex-col mt-1">
                    {(selectedUsername || displayUsername) && !isAddress && (
                      <p className="text-2xl font-black text-white tracking-tighter uppercase font-display italic leading-none">
                        {selectedUsername || displayUsername}
                      </p>
                    )}
                    <p className="text-[11px] font-mono font-bold text-zinc-400 mt-1">
                      {selectedAddress || displayAddress}
                    </p>
                  </div>
                </div>
              </div>

              {!selectedAddress && (
                <Button 
                  onClick={handleSelect} 
                  className="h-14 px-8 bg-white text-black hover:bg-primary font-black uppercase tracking-widest text-xs rounded-none border-2 border-black transition-all group/btn"
                >
                  LINK_IDENTITY
                  <Check className="ml-2 w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                </Button>
              )}
              
              {selectedAddress && (
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary text-primary text-[10px] font-black uppercase tracking-widest italic shadow-[2px_2px_0px_0px_rgba(204,255,0,1)]">
                  LINK_ESTABLISHED
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && actualValue && !isAddress && !displayAddress && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-6 text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest animate-pulse"
          >
            <div className="w-3 h-3 border-2 border-zinc-700 border-t-primary rounded-full animate-spin" />
            SYNCHRONIZING_ORACLE...
          </motion.div>
        )}
        {error && actualValue && !isAddress && !displayAddress && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-6 text-[10px] font-mono font-bold text-accent uppercase tracking-widest"
          >
            <Terminal className="w-4 h-4" />
            ERROR: IDENTITY_NOT_RECOGNIZED
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
