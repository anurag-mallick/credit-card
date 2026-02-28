'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard as CardIcon, DollarSign, Plane, Fuel, Zap, Star, ShieldCheck, Info, X, Calculator, ArrowRight, TrendingUp } from 'lucide-react';
import { CREDIT_CARDS, LAST_UPDATED, type CreditCard } from '@/data/cards';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  { id: 'all', name: 'All Cards', icon: CardIcon },
  { id: 'Super Premium', name: 'Luxury', icon: Star },
  { id: 'Cashback', name: 'Cashback', icon: DollarSign },
  { id: 'Travel', name: 'Travel', icon: Plane },
  { id: 'Utilities', name: 'Bills', icon: Zap },
  { id: 'Fuel', name: 'Fuel', icon: Fuel },
];

const SPEND_CATEGORIES = [
  { id: 'online', name: 'Online Shopping', icon: DollarSign, description: 'Amazon, Flipkart, Zomato, etc.' },
  { id: 'travel', name: 'Travel & Hotels', icon: Plane, description: 'Flights, Hotels, MMT' },
  { id: 'dining', name: 'Dining & Others', icon: Star, description: 'Restaurants & Groceries' },
  { id: 'utilities', name: 'Utility & Bills', icon: Zap, description: 'Electricity, Rent, Mobile' },
  { id: 'fuel', name: 'Fuel', icon: Fuel, description: 'Petrol, Diesel' },
];

export default function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [spends, setSpends] = useState<Record<string, number>>({
    online: 0,
    travel: 0,
    dining: 0,
    utilities: 0,
    fuel: 0,
  });
  const [recommendation, setRecommendation] = useState<{ 
    card: CreditCard, 
    savings: number,
    breakup: Record<string, number>
  } | null>(null);

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'all') return CREDIT_CARDS;
    return CREDIT_CARDS.filter(card => card.category === selectedCategory);
  }, [selectedCategory]);

  const calculateSavings = () => {
    let bestMatch = null;
    let maxSavings = -Infinity;
    let bestBreakup: Record<string, number> = {};

    CREDIT_CARDS.forEach(card => {
      let cardBreakup: Record<string, number> = {};
      const monOnline = spends.online || 0;
      const monTravel = spends.travel || 0;
      const monDining = spends.dining || 0;
      const monUtilities = spends.utilities || 0;
      const monFuel = spends.fuel || 0;
      const monOther = 5000; 

      if (card.id === 'sbi-cashback') {
        const reward = Math.min(monOnline * 0.05, 5000);
        const other = (monOther + monTravel + monDining) * 0.01;
        cardBreakup = { 'Online (5%)': reward * 12, 'Others (1%)': other * 12 };
      } 
      else if (card.id === 'hdfc-infinia') {
        const smartBuy = Math.min((monOnline * 0.4 + monTravel * 0.8) * 0.165, 15000 * 1); // 1 RP = 1 INR
        const base = (monOnline * 0.6 + monTravel * 0.2 + monDining + monUtilities + monFuel + monOther) * 0.033;
        cardBreakup = { 'SmartBuy Multiplier': smartBuy * 12, 'Base Rewards (3.3%)': base * 12 };
      }
      else if (card.id === 'axis-atlas') {
        const travelMiles = (monTravel / 100) * 5 * 1.8;
        const otherMiles = ((monOnline + monDining + monUtilities + monFuel + monOther) / 100) * 2 * 1.8;
        cardBreakup = { 'Tiered Travel Miles': travelMiles * 12, 'Base Miles': otherMiles * 12 };
      }
      else if (card.id === 'airtel-axis') {
        const telco = Math.min(monUtilities * 0.2 + 200, 300); // 25% on Airtel
        const utils = Math.min(monUtilities * 0.1, 300);
        const food = Math.min(monDining * 0.1, 500);
        cardBreakup = { 'Airtel & Utils (25/10%)': (telco + utils) * 12, 'Food Meta (10%)': food * 12 };
      }
      else if (card.id === 'amazon-pay-icici') {
        const amz = monOnline * 0.05;
        const others = (monTravel + monDining + monUtilities + monFuel + monOther) * 0.01;
        cardBreakup = { 'Amazon Prime (5%)': amz * 12, 'Others (1%)': others * 12 };
      }
      else if (card.id === 'amex-platinum-travel') {
        const annualSpend = (monOnline + monTravel + monDining + monUtilities + monFuel + monOther) * 12;
        let milestone = 0;
        if (annualSpend >= 400000) milestone = 40000; // 40k MR + Taj voucher
        cardBreakup = { 'Milestone Reward': milestone, 'Travel Benefits': annualSpend >= 400000 ? 10000 : 0 };
      }
      else if (card.id === 'hsbc-liveplus') {
        const reward = Math.min((monDining + monOnline * 0.2) * 0.1, 1000);
        cardBreakup = { 'Dining/Grocery (10%)': reward * 12, 'Base (1.5%)': (monTravel + monOther) * 0.015 * 12 };
      }
      else if (card.id === 'sbi-bpcl-octane') {
        const fuel = Math.min(monFuel * 0.0725, 10000 * 0.0725);
        cardBreakup = { 'Fuel Returns (7.25%)': fuel * 12, 'Others (1%)': (monOther + monOnline) * 0.01 * 12 };
      }
      else {
        const base = (monOnline + monTravel + monDining + monUtilities + monFuel + monOther) * 0.015;
        cardBreakup = { 'Reward Rate (1.5%)': base * 12 };
      }

      const totalRewards = Object.values(cardBreakup).reduce((a, b) => a + b, 0);
      let fee = card.annualFee;
      const annualSpend = (monOnline + monTravel + monDining + monUtilities + monFuel + monOther) * 12;
      
      // Simple fee waiver check
      if (card.waiveCondition) {
        const match = card.waiveCondition.match(/₹(\d+)\s*Lakh|₹([\d,]+)/);
        if (match) {
           const target = match[1] ? Number(match[1]) * 100000 : Number(match[2].replace(/,/g, ''));
           if (annualSpend >= target) fee = 0;
        }
      }

      const netSavings = totalRewards - fee;
      
      if (netSavings > maxSavings) {
        maxSavings = netSavings;
        bestMatch = card;
        bestBreakup = cardBreakup;
      }
    });

    if (bestMatch) {
      setRecommendation({ 
        card: bestMatch, 
        savings: Math.round(maxSavings),
        breakup: bestBreakup
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <div className="w-full h-24 bg-zinc-900/50 flex items-center justify-center border-b border-white/5">
        <span className="text-zinc-600 text-xs font-mono uppercase tracking-widest">Sponsored Advertisement / Google Ads</span>
      </div>

      <nav className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center shadow-2xl shadow-black">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <CardIcon className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Card<span className="text-blue-500">Wise</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowQuiz(true)}
            className="hidden md:flex items-center gap-2 text-sm font-black text-blue-400 hover:text-blue-300 transition-all uppercase tracking-widest"
          >
            <Calculator className="w-4 h-4" />
            ROI Quiz
          </button>
          <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] hidden sm:block">
             Updated: <span className="text-zinc-400">{LAST_UPDATED}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        <header className="text-center mb-28 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-10 shadow-xl"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Verified Indian Credit Intelligence
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-[9rem] font-black mb-10 tracking-tighter leading-[0.8] uppercase"
          >
            Own Your <br />
            <span className="gradient-text italic">Strategy</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed mb-16 font-medium"
          >
            We've decoded reward logic for <span className="text-white font-black">20+ Indian cards</span> using 
            real data from <span className="text-blue-500 font-black">r/CreditCardsIndia</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={() => setShowQuiz(true)}
              className="w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xl shadow-[0_25px_60px_-15px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              Run ROI Engine
              <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('card-explorer');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-12 py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[2rem] font-black text-xl transition-all shadow-2xl active:scale-95"
            >
              Browse Library
            </button>
          </motion.div>
        </header>

        <div id="card-explorer" className="pt-32 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
            <div className="max-w-xl">
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-none">Card Library</h2>
              <p className="text-zinc-600 font-bold text-lg uppercase tracking-widest">Filter by verified segments.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 border",
                    selectedCategory === cat.id 
                      ? "bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/30" 
                      : "bg-zinc-900/40 border-white/5 text-zinc-600 hover:border-white/20 hover:text-white"
                  )}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card) => (
              <motion.div
                layout
                key={card.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-10 rounded-[3rem] group cursor-pointer relative flex flex-col justify-between border-white/5 hover:border-blue-500/40 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
                onClick={() => setSelectedCard(card)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] group-hover:bg-blue-600/10 transition-colors" />
                
                <div>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-3 block">
                        {card.category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black group-hover:text-blue-400 transition-colors tracking-tighter uppercase leading-none">{card.name}</h3>
                      <p className="text-sm font-bold text-zinc-700 mt-2 uppercase tracking-widest">{card.bank}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-12">
                    {card.benefits.slice(0, 3).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600/40 mt-1.5 shrink-0" />
                        <span className="text-[11px] font-bold text-zinc-500 leading-relaxed uppercase tracking-tight">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-black text-zinc-800 tracking-[0.2em] block mb-1">Entrance Fee</span>
                    <span className="text-2xl font-black tracking-tighter">
                      {card.annualFee === 0 ? 'FREE' : `₹${card.annualFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-[1.25rem] bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 shadow-2xl">
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-40 max-w-5xl mx-auto h-56 bg-zinc-900/20 rounded-[4rem] flex flex-col items-center justify-center border border-white/5 border-dashed relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full translate-y-1/2 group-hover:bg-blue-600/10 transition-colors" />
          <span className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Fintech Ecosystem / Ad Space</span>
          <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-600 text-xs font-black uppercase tracking-widest">
             Google Ads Placement
          </div>
        </div>
      </main>

      {/* Calculator Modal */}
      <AnimatePresence>
        {showQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
              onClick={() => {
                setShowQuiz(false);
                setRecommendation(null);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-6xl bg-[#080808] border border-white/5 rounded-[4rem] p-10 md:p-20 overflow-y-auto max-h-[92vh] custom-scrollbar shadow-[0_50px_150px_-30px_rgba(0,0,0,1)]"
            >
              <button 
                onClick={() => {
                  setShowQuiz(false);
                  setRecommendation(null);
                }}
                className="absolute top-12 right-12 p-5 bg-white/5 rounded-full hover:bg-white/10 transition-all z-10 hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>

              {!recommendation ? (
                <div className="max-w-4xl mx-auto">
                  <header className="text-center mb-20">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <Calculator className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-6xl md:text-7xl font-black mb-4 tracking-tighter uppercase leading-none">ROI Prediction</h2>
                    <p className="text-zinc-600 text-xl font-bold uppercase tracking-widest">Set your monthly lifestyle spends.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                    {SPEND_CATEGORIES.map((cat) => (
                      <div key={cat.id} className="bg-zinc-900/30 p-12 rounded-[3.5rem] border border-white/5 group focus-within:border-blue-500/20 transition-all hover:bg-zinc-900/50">
                        <div className="flex items-center justify-between mb-10">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-[1.5rem] bg-blue-600/5 flex items-center justify-center text-blue-500 shadow-2xl border border-white/5">
                              <cat.icon className="w-7 h-7" />
                            </div>
                            <div>
                              <p className="text-sm font-black uppercase tracking-widest text-zinc-100">{cat.name}</p>
                              <p className="text-[11px] text-zinc-700 font-black tracking-tight uppercase">{cat.description}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-8">
                           <div className="relative">
                            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-700 font-black text-2xl">₹</span>
                            <input 
                              type="number"
                              className="w-full bg-black/60 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-3xl text-white font-black focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                              value={spends[cat.id] || 0}
                              onChange={(e) => setSpends({...spends, [cat.id]: Number(e.target.value)})}
                            />
                          </div>

                          <div className="px-4">
                            <input 
                              type="range"
                              min="0"
                              max="150000"
                              step="1000"
                              className="slider-input"
                              value={spends[cat.id] || 0}
                              onChange={(e) => setSpends({...spends, [cat.id]: Number(e.target.value)})}
                            />
                            <div className="flex justify-between mt-4 text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em]">
                              <span>Conservative</span>
                              <span>Balanced</span>
                              <span>Lifestyle</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={calculateSavings}
                    className="w-full py-10 bg-blue-600 hover:bg-blue-500 text-white rounded-[3rem] font-black text-3xl shadow-[0_30px_70px_-15px_rgba(59,130,246,0.6)] transition-all active:scale-[0.98] uppercase tracking-tighter"
                  >
                    Generate Report
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-20">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl">
                      <TrendingUp className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h2 className="text-7xl md:text-8xl font-black mb-4 uppercase tracking-tighter leading-none">Recommendation</h2>
                    <p className="text-zinc-600 text-xl font-bold uppercase tracking-widest">Optimized for your verified spending patterns.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20 items-start text-left">
                    <motion.div 
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="glass p-16 rounded-[4.5rem] border-blue-500/20 w-full relative overflow-hidden shadow-2xl"
                    >
                      <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/10 blur-[120px] -z-10" />
                      
                      <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500 mb-8 block px-2">
                        🏆 Market Segment Leader
                      </span>
                      <h3 className="text-5xl font-black mb-3 tracking-tighter uppercase leading-none">{recommendation.card.name}</h3>
                      <p className="text-2xl font-bold text-zinc-700 mb-16 uppercase tracking-widest">{recommendation.card.bank}</p>
                      
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase font-black text-zinc-800 tracking-[0.4em] mb-4 px-2">Estimated Net ROI / Year</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-9xl font-black text-white tracking-tighter leading-none">
                              ₹{(recommendation.savings / 1000).toFixed(1)}
                           </span>
                           <span className="text-5xl font-black text-blue-500 uppercase tracking-tighter">K</span>
                        </div>
                        <p className="text-zinc-700 font-black mt-8 uppercase text-[10px] tracking-[0.3em] italic">Calculated after Fees & Waiver Targets</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="w-full space-y-12"
                    >
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-600 mb-8 px-4">
                           Mathematical Breakdown
                        </h4>
                        <div className="space-y-8 bg-zinc-900/40 p-14 rounded-[4rem] border border-white/5 shadow-3xl">
                          {Object.entries(recommendation.breakup).map(([label, value]) => (
                            <div key={label} className="flex justify-between items-end group border-b border-white/5 pb-6 last:border-0 last:pb-0">
                              <span className="text-xs font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{label}</span>
                              <div className="flex flex-col items-end">
                                <span className="text-3xl font-black text-zinc-100 leading-none tracking-tighter">₹{value.toLocaleString()}</span>
                                <span className="text-[10px] font-black text-zinc-800 tracking-[0.2em] uppercase mt-2">Predicted Return</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 bg-white/5 p-12 rounded-[3.5rem] border border-white/10 shadow-xl">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-3">Optimal Use</p>
                          <p className="text-sm font-black text-zinc-300 uppercase leading-snug tracking-tighter">{recommendation.card.bestFor}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-3">Fee Waiver</p>
                          <p className="text-sm font-black text-zinc-300 uppercase leading-snug tracking-tighter">{recommendation.card.waiveCondition || 'N/A'}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-8 max-w-2xl mx-auto">
                    <button 
                      onClick={() => setRecommendation(null)}
                      className="flex-1 py-7 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all border border-white/10 active:scale-95 shadow-2xl"
                    >
                      Refine Lifestyle Spends
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCard(recommendation.card);
                        setRecommendation(null);
                        setShowQuiz(false);
                      }}
                      className="flex-1 py-7 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-3xl active:scale-95 transition-all"
                    >
                      In-Depth Analysis
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-left">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
              onClick={() => setSelectedCard(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-5xl bg-[#080808] border border-white/5 rounded-[4.5rem] p-12 md:p-24 overflow-y-auto max-h-[92vh] custom-scrollbar shadow-3xl"
            >
              <button 
                onClick={() => setSelectedCard(null)}
                className="absolute top-12 right-12 p-5 bg-white/5 rounded-full hover:bg-white/10 transition-all z-20 hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-20">
                <span className="px-5 py-2 bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-10 inline-block border border-blue-500/20">
                  {selectedCard.category} Verified
                </span>
                <h2 className="text-6xl md:text-[5.5rem] font-black mb-4 tracking-tighter uppercase leading-[0.9]">{selectedCard.name}</h2>
                <p className="text-2xl font-bold text-zinc-700 uppercase tracking-widest">{selectedCard.bank}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20 px-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-10 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]" /> Core Strengths
                  </h4>
                  <ul className="space-y-6">
                    {selectedCard.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-zinc-400 font-bold uppercase tracking-tight flex items-start gap-4 group">
                        <span className="text-emerald-500 transition-transform group-hover:scale-125">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] text-rose-500 mb-10 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_15px_#f43f5e]" /> Limitations
                  </h4>
                  <ul className="space-y-6">
                    {selectedCard.cons.map((con, i) => (
                      <li key={i} className="text-sm text-zinc-500 font-bold tracking-tight uppercase flex items-start gap-4 opacity-80">
                        <span className="text-rose-500">−</span>
                        {con}
                      </li>
                    ))}
                    <li className="mt-12 p-10 bg-zinc-900/40 rounded-[3rem] border border-white/5 text-zinc-600 text-xs font-black uppercase tracking-widest leading-loose">
                      <span className="text-zinc-200 font-black block mb-3 underline decoration-blue-600 decoration-2 underline-offset-8">Reward Structure & Caps:</span>
                      {selectedCard.limits}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white/5 rounded-[4rem] p-16 grid grid-cols-1 sm:grid-cols-3 gap-16 border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full" />
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black mb-3">Yearly Maintenance</p>
                  <p className="text-4xl font-black tracking-tighter">₹{selectedCard.annualFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black mb-3">Waiver Target</p>
                  <p className="text-sm font-black text-zinc-200 uppercase leading-snug tracking-tighter">{selectedCard.waiveCondition || 'LTF'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black mb-3">Golden Rule</p>
                  <p className="text-sm font-black text-zinc-200 uppercase leading-snug tracking-tighter">{selectedCard.bestFor}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
