'use client';

import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UsernameSearch } from '@/components/username/UsernameSearch';
import { useCreateBet } from '@/hooks/useCreateBet';
import { useApproveMNEE, useMNEETokenAllowance, useMNEETokenBalance, useMNEETokenDecimals } from '@/hooks/useMNEEToken';
import { useAccount, useSimulateContract } from 'wagmi';
import { MNEEBET_CONTRACT } from '@/lib/contract';
import { parseUnits, formatUnits } from 'viem';
import { useRouter } from 'next/navigation';
import { Coins, Calendar, User, Gavel, FileText, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, Zap, Terminal, ShieldAlert } from 'lucide-react';
import { BetSuccessModal } from './BetSuccessModal';
import { motion, AnimatePresence } from 'framer-motion';

interface WizardData {
  opponent: `0x${string}` | undefined;
  opponentUsername: string;
  judge: `0x${string}` | undefined;
  judgeUsername: string;
  terms: string;
  amount: string;
  deadline: string;
}

const STEPS = [
  { id: 1, title: 'TARGET', icon: User, desc: 'Identify the opponent' },
  { id: 2, title: 'JUDGE', icon: Gavel, desc: 'Select the arbiter' },
  { id: 3, title: 'CLAUSE', icon: FileText, desc: 'Define contract terms' },
  { id: 4, title: 'STAKE', icon: Coins, desc: 'Commit MNEE assets' },
  { id: 5, title: 'EXPIRY', icon: Calendar, desc: 'Set temporal limit' },
];

export function CreateBetWizard() {
  const router = useRouter();
  const { address } = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    opponent: undefined,
    opponentUsername: '',
    judge: undefined,
    judgeUsername: '',
    terms: '',
    amount: '',
    deadline: '',
  });

  // Initialize deadline on client side to avoid hydration mismatch
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    // Format: YYYY-MM-DDThh:mm
    const localIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    setData(prev => ({ ...prev, deadline: localIso }));
  }, []);

  const { data: decimals } = useMNEETokenDecimals();
  const { data: balance } = useMNEETokenBalance(address);
  const { data: allowance, isLoading: isAllowanceLoading } = useMNEETokenAllowance(address);
  const queryClient = useQueryClient();
  const { approve, isLoading: isApproving, isConfirmed: isApproved } = useApproveMNEE();
  const { createBet, isLoading: isCreating, isConfirmed: isCreated, hash, error: createError } = useCreateBet();
  const [showSuccess, setShowSuccess] = useState(false);
  const createdBetIdRef = useRef<bigint | undefined>(undefined);

  const safeDecimals = decimals ?? 18;
  const balanceDisplay = balance ? formatUnits(balance, safeDecimals) : '0';
  const needsApproval = data.amount && allowance !== undefined
    ? allowance < parseUnits(data.amount, safeDecimals)
    : false;

  // Prepare simulation arguments
  const deadlineDate = data.deadline ? new Date(data.deadline) : new Date();
  const deadlineTimestamp = BigInt(Math.floor(deadlineDate.getTime() / 1000));
  const amountWei = data.amount ? parseUnits(data.amount, safeDecimals) : 0n;
  const opponentAddress = data.opponent || '0x0000000000000000000000000000000000000000';

  // Simulate contract call to catch errors early
  const { error: simulationError, isError: isSimulationError } = useSimulateContract({
    ...MNEEBET_CONTRACT,
    functionName: 'createBet',
    args: [
      opponentAddress,
      amountWei,
      data.terms,
      deadlineTimestamp,
      data.judge || '0x0000000000000000000000000000000000000000',
    ],
    query: {
      enabled: currentStep === 5 && !!data.amount && !!data.terms && !!data.judge && !needsApproval,
    }
  });

  useEffect(() => {
    if (isCreated) {
      queryClient.invalidateQueries();
      setShowSuccess(true);
    }
  }, [isCreated, queryClient]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!address || !decimals || !data.amount || !data.terms || !data.deadline || !data.judge) return;
    // Convert deadline string (local time) to timestamp (UTC)
    const deadlineDate = new Date(data.deadline);
    const deadlineTimestamp = BigInt(Math.floor(deadlineDate.getTime() / 1000));

    // Ensure deadline is in the future (add 60s buffer for block time)
    if (deadlineTimestamp < BigInt(Math.floor(Date.now() / 1000) + 60)) {
      alert("Deadline must be in the future");
      return;
    }

    createBet({
      opponent: data.opponent,
      amount: data.amount,
      terms: data.terms,
      deadline: deadlineTimestamp,
      judge: data.judge,
      decimals: safeDecimals,
    });
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push('/dashboard');
  };

  const StepIcon = STEPS[currentStep - 1].icon;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Progress Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="brutalist-card p-8 border-2 border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="space-y-8">
              {STEPS.map((step) => (
                <div key={step.id} className="flex items-center gap-6 group relative">
                  <div className={`w-12 h-12 flex items-center justify-center border-2 transition-all duration-300 relative z-10 ${step.id < currentStep ? 'bg-primary border-black text-black rotate-3' :
                    step.id === currentStep ? 'bg-white border-black text-black scale-110 shadow-[4px_4px_0px_0px_rgba(204,255,0,1)]' :
                      'bg-white/5 border-white/10 text-zinc-600'
                    }`}>
                    {step.id < currentStep ? <ShieldCheck className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                  </div>
                  {step.id < STEPS.length && (
                    <div className="absolute left-6 top-12 w-[2px] h-8 bg-white/5" />
                  )}
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.id === currentStep ? 'text-primary' : 'text-zinc-600'}`}>PHASE_0{step.id}</span>
                    <span className={`text-sm font-black uppercase tracking-tighter ${step.id === currentStep ? 'text-white' : 'text-zinc-500'}`}>{step.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="brutalist-card p-8 border-2 border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">
              <span>MNEE_STAKE_CAPITAL</span>
              <Coins className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-black text-white italic tracking-tighter">
              {parseFloat(balanceDisplay).toFixed(2)}
              <span className="text-xs text-zinc-600 not-italic ml-2">MNEE</span>
            </div>
          </div>
        </div>

        {/* Step Form */}
        <div className="lg:col-span-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="brutalist-card p-8 md:p-12 border-2 border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden min-h-[550px] flex flex-col"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <StepIcon className="w-64 h-64 text-white" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col space-y-12">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    STEP_0{currentStep} // {STEPS[currentStep - 1].title}
                  </div>
                  <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.9] uppercase italic font-display">

                  {STEPS[currentStep - 1].desc}
                </h2>
              </div>

              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      <UsernameSearch
                        onSelect={(address, username) => {
                          setData({ ...data, opponent: address, opponentUsername: username || '' });
                        }}
                        placeholder="SEARCH_BY_IDENTITY_HANDLE..."
                      />
                      <div className="p-6 border-2 border-dashed border-white/10 bg-white/5 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                        // LEAVING_BLANK_INITIATES_OPEN_CHALLENGE <br />
                        // VISIBLE_TO_ALL_MARKET_PARTICIPANTS
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      <UsernameSearch
                        onSelect={(address, username) => {
                          setData({ ...data, judge: address, judgeUsername: username || '' });
                        }}
                        placeholder="SELECT_ARBITRATION_ENTITY..."
                      />
                      <div className="p-6 border-2 border-accent/20 bg-accent/5 text-accent text-[10px] font-black uppercase tracking-[0.2em] flex items-start gap-4">
                        <Gavel className="w-5 h-5 flex-shrink-0" />
                        CRITICAL: THE_JUDGE_IS_THE_ONLY_ENTITY_CAPABLE_OF_SETTLING_CLAIMS. VERIFY_NEUTRALITY.
                      </div>
                      {data.judge && address && data.judge.toLowerCase() === address.toLowerCase() && (
                        <div className="p-6 border-2 border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-start gap-4 animate-pulse">
                          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                          ERROR: IDENTITY_CONFLICT. CREATOR_CANNOT_BE_JUDGE. SELECT_THIRD_PARTY.
                        </div>
                      )}
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      <Textarea
                        value={data.terms}
                        onChange={(e) => setData({ ...data, terms: e.target.value })}
                        placeholder="DESCRIBE_THE_WAGER_CONDITIONS_IN_DETAIL..."
                        className="min-h-[250px] bg-white/5 border-2 border-white/10 text-xl font-bold text-white placeholder:text-zinc-800 focus:border-primary/50 rounded-none uppercase tracking-tighter"
                      />
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-primary italic">$</div>
                        <Input
                          type="number"
                          value={data.amount}
                          onChange={(e) => setData({ ...data, amount: e.target.value })}
                          placeholder="0.00"
                          className="h-28 pl-16 pr-24 bg-white/5 border-2 border-white/10 text-6xl font-black text-white placeholder:text-zinc-900 rounded-none focus:border-primary transition-all tracking-tighter"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase">MNEE_STABLE</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {['50', '100', '500', '1000'].map((amt) => (
                          <Button
                            key={amt}
                            variant="outline"
                            onClick={() => setData({ ...data, amount: amt })}
                            className={`h-14 rounded-none border-2 font-black tracking-widest uppercase text-xs transition-all ${data.amount === amt
                              ? 'bg-primary text-black border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-[-2px] translate-y-[-2px]'
                              : 'border-white/10 text-zinc-500 hover:border-primary/50'
                              }`}
                          >
                            {amt}_MNEE
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                      <Input
                        type="datetime-local"
                        value={data.deadline}
                        onChange={(e) => setData({ ...data, deadline: e.target.value })}
                        className="h-24 bg-white/5 border-2 border-white/10 text-2xl font-black text-white rounded-none focus:border-primary uppercase"
                      />
                        <div className="p-8 border-2 border-white/5 bg-white/[0.02] space-y-6">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">CONTRACT_MANIFEST_SUMMARY</h4>
                            <div className="space-y-4 overflow-hidden">
                              <div className="flex justify-between items-start pb-2 border-b border-white/5 gap-4">
                                <span className="text-[10px] font-black text-zinc-500 uppercase shrink-0">Terms_Clause</span>
                                <span className="text-sm font-bold text-white uppercase italic break-words text-right">{data.terms || 'UNDEFINED'}</span>
                              </div>
                              <div className="flex justify-between items-end pb-2 border-b border-white/5 gap-4">
                                <span className="text-[10px] font-black text-zinc-500 uppercase shrink-0">Capital_Stake</span>
                                <span className="text-2xl font-black text-primary italic tracking-tighter shrink-0">{data.amount || '0'} MNEE</span>
                              </div>
                              <div className="flex justify-between items-end gap-4">
                                <span className="text-[10px] font-black text-zinc-500 uppercase shrink-0">Arbiter_ID</span>
                                <span className="text-sm font-bold text-white uppercase tracking-widest truncate">{data.judgeUsername || 'UNSPECIFIED'}</span>
                              </div>
                            </div>
                        </div>

                        {/* Protocol Security Notice - Only shown at final step */}
                        <div className="p-6 border-2 border-accent/20 bg-accent/5 flex items-start gap-4">
                          <ShieldAlert className="w-6 h-6 text-accent flex-shrink-0" />
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Protocol_Security_Notice</h4>
                            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase tracking-wider">
                              ALL STAKES ARE LOCKED IN ESCROW. ENSURE THE CHOSEN JUDGE IS TRUSTWORTHY. MNEEBET PROTOCOL CANNOT REVERSE TRANSACTIONS ONCE SETTLED.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-10 flex gap-6">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className={`flex-1 h-20 rounded-none border-2 border-white/10 font-black uppercase tracking-widest text-xs hover:border-primary transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                  <ArrowLeft className="mr-3 w-5 h-5" />
                  PHASE_PREV
                </Button>

                {currentStep === STEPS.length ? (
                  needsApproval && !isApproved ? (
                    <Button
                      onClick={() => approve(data.amount, safeDecimals)}
                      disabled={isApproving}
                      className="flex-[2] h-20 rounded-none bg-secondary text-black font-black uppercase tracking-widest text-xs border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all"
                    >
                      {isApproving ? 'AUTHORIZING_ASSETS...' : `AUTHORIZE_${data.amount}_MNEE`}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isCreating || isAllowanceLoading || needsApproval || !data.judge || (!!address && data.judge.toLowerCase() === address.toLowerCase())}
                      className="flex-[2] h-20 rounded-none bg-primary text-black font-black uppercase tracking-widest text-xs border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {data.judge === address ? 'CANNOT_JUDGE_OWN_BET' :
                        (isSimulationError ? 'INVALID_PARAMETERS' :
                          (isCreating ? 'DEPLOYING_CONTRACT...' : 'FINALIZE_&_EXECUTE'))}
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={handleNext}
                    className="flex-[2] h-20 rounded-none bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black shadow-[6px_6px_0px_0px_rgba(204,255,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(204,255,0,1)] transition-all"
                    disabled={(currentStep === 1 && data.opponentUsername !== '' && !data.opponent) || (currentStep === 2 && !data.judge) || (currentStep === 3 && data.terms.length < 5)}
                  >
                    PHASE_NEXT
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Debug Console / Error Display */}
          {currentStep === 5 && (
            <div className="lg:col-span-12">
              {(simulationError || createError) && (
                <div className="p-4 border-2 border-red-500/20 bg-red-500/5 text-red-400 font-mono text-xs break-all">
                  <p className="font-bold mb-2">ERROR_LOG:</p>
                  {simulationError?.message || createError?.message}
                </div>
              )}
            </div>
          )}
      </div>

      <BetSuccessModal
        betId={createdBetIdRef.current}
        open={showSuccess}
        onClose={handleSuccessClose}
      />
    </div>
  );
}
