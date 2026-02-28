'use client';

import { useState, useMemo, useEffect } from 'react';
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
  { id: 'online', name: 'Online Shopping', icon: DollarSign, description: 'Amazon, Flipkart, Myntra, etc.' },
  { id: 'travel', name: 'Travel & Hotels', icon: Plane, description: 'Flights, Hotels, MMT, etc.' },
  { id: 'dining', name: 'Dining & Food', icon: Star, description: 'Restaurants, Swiggy, Zomato' },
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
  const [recommendation, setRecommendation] = useState<{ card: CreditCard, savings: number } | null>(null);

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'all') return CREDIT_CARDS;
    return CREDIT_CARDS.filter(card => card.category === selectedCategory);
  }, [selectedCategory]);

  const calculateSavings = () => {
    let bestMatch = null;
    let maxSavings = -1;

    CREDIT_CARDS.forEach(card => {
      let annualSavings = 0;
      const monthlyOnline = spends.online;
      const monthlyTravel = spends.travel;
      const monthlyDining = spends.dining;
      const monthlyUtilities = spends.utilities;
      const monthlyFuel = spends.fuel;
      const totalMonthlyOther = 10000; // Average base spend

      if (card.id === 'sbi-cashback') {
        annualSavings = (Math.min(monthlyOnline * 0.05, 5000) + (totalMonthlyOther * 0.01)) * 12;
      } else if (card.id === 'hdfc-infinia') {
        // Simple simplified version for demo
        annualSavings = (monthlyOnline * 0.10 + monthlyTravel * 0.15 + totalMonthlyOther * 0.033) * 12;
      } else if (card.id === 'amazon-pay-icici') {
        annualSavings = (monthlyOnline * 0.05 + totalMonthlyOther * 0.01) * 12;
      } else if (card.id === 'airtel-axis') {
        annualSavings = (Math.min(monthlyUtilities * 0.10, 300) + Math.min(monthlyDining * 0.10, 500)) * 12;
      } else if (card.id === 'axis-atlas') {
        annualSavings = (monthlyTravel * 0.10 + totalMonthlyOther * 0.02) * 12;
      } else {
        // Generic reward rate
        annualSavings = (Object.values(spends).reduce((a, b) => a + b, 0) * 0.02) * 12;
      }

      // Subtract fee
      const netSavings = annualSavings - card.annualFee;
      
      if (netSavings > maxSavings) {
        maxSavings = netSavings;
        bestMatch = card;
      }
    });

    if (bestMatch) {
      setRecommendation({ card: bestMatch, savings: Math.round(maxSavings) });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Google Ads Placeholder (Top) */}
      <div className="w-full h-24 bg-zinc-900/50 flex items-center justify-center border-b border-white/5">
        <span className="text-zinc-600 text-xs font-mono uppercase tracking-widest">Sponsored Advertisement / Google Ads</span>
      </div>

      <nav className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <CardIcon className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Card<span className="text-blue-500">Wise</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowQuiz(true)}
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Savings Calculator
          </button>
          <div className="text-sm text-zinc-500 font-medium hidden sm:block">
            Verified: <span className="text-zinc-300">{LAST_UPDATED}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        <header className="text-center mb-20 relative">
          {/* Decorative element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-blue-400 mb-8"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Empowering 50,000+ Indian Spenders
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]"
          >
            MASTER YOUR <br />
            <span className="gradient-text">CREDIT CARDS</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Community-verified data from <span className="text-white font-semibold">r/CreditCardsIndia</span>. 
            Stop guessing, start saving ₹50,000+ annually with the right card.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => setShowQuiz(true)}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              Start Savings Quiz
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('card-explorer');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all"
            >
              Explore Cards
            </button>
          </motion.div>
        </header>

        {/* Section Divider */}
        <div id="card-explorer" className="pt-24 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Card Explorer</h2>
              <p className="text-zinc-500">Filter through our verified database of the best cards.</p>
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border",
                    selectedCategory === cat.id 
                      ? "bg-blue-600 border-blue-500 text-white" 
                      : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20 hover:text-white"
                  )}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card) => (
              <motion.div
                layout
                key={card.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-6 rounded-[2rem] group cursor-pointer relative flex flex-col justify-between border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                onClick={() => setSelectedCard(card)}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2 block">
                        {card.category}
                      </span>
                      <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors tracking-tight">{card.name}</h3>
                      <p className="text-sm font-medium text-zinc-500">{card.bank}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {card.benefits.slice(0, 3).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span className="text-xs font-medium text-zinc-400 leading-tight">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider">Net Annual Fee</span>
                    <span className="text-lg font-black tracking-tight">
                      {card.annualFee === 0 ? 'FREE' : `₹${card.annualFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Google Ads Placeholder (Bottom) */}
        <div className="mt-24 w-full h-48 bg-zinc-900/40 rounded-[2.5rem] flex items-center justify-center border border-white/5 border-dashed">
          <span className="text-zinc-700 text-sm font-mono uppercase tracking-[0.2em]">Vertical Ad Slot 1</span>
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
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => {
                setShowQuiz(false);
                setRecommendation(null);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => {
                  setShowQuiz(false);
                  setRecommendation(null);
                }}
                className="absolute top-8 right-8 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!recommendation ? (
                <div className="max-w-2xl mx-auto">
                  <header className="text-center mb-12">
                    <Calculator className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-black mb-2 tracking-tight uppercase">Savings Quiz</h2>
                    <p className="text-zinc-500">Enter your monthly spend in each category to find your perfect card.</p>
                  </header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    {SPEND_CATEGORIES.map((cat) => (
                      <div key={cat.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 focus-within:border-blue-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <cat.icon className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-bold uppercase tracking-wider">{cat.name}</p>
                            <p className="text-[10px] text-zinc-500">{cat.description}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₹</span>
                          <input 
                            type="number"
                            placeholder="0"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-8 pr-4 text-white font-bold placeholder:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={spends[cat.id] || ''}
                            onChange={(e) => setSpends({...spends, [cat.id]: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={calculateSavings}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-600/20 transition-all"
                  >
                    Calculate My Savings
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-8">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <TrendingUp className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Your Perfect Match</h2>
                    <p className="text-zinc-500 mb-10">Based on your spending, this card will yield the highest returns.</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
                    <div className="glass p-8 rounded-[2.5rem] border-blue-500/30 text-left max-w-sm w-full">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2 block">
                        {recommendation.card.category}
                      </span>
                      <h3 className="text-2xl font-bold mb-1 tracking-tight">{recommendation.card.name}</h3>
                      <p className="text-zinc-500 font-medium mb-6">{recommendation.card.bank}</p>
                      
                      <div className="space-y-3 mb-8">
                        {recommendation.card.pros.slice(0, 2).map((pro, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span className="text-sm font-medium text-zinc-300 leading-tight">{pro}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="mb-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Estimated Net Savings</p>
                        <p className="text-6xl font-black text-emerald-400 tracking-tighter">₹{recommendation.savings.toLocaleString()}</p>
                        <p className="text-zinc-600 font-medium italic mt-1 pb-6 border-b border-white/5 text-sm">per year, after annual fees</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Best Strategy</p>
                          <p className="text-sm font-bold text-zinc-300">{recommendation.card.bestFor}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Annual Fee</p>
                          <p className="text-sm font-bold text-zinc-300">₹{recommendation.card.annualFee.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                    <button 
                      onClick={() => setRecommendation(null)}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10"
                    >
                      Recalculate
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCard(recommendation.card);
                        setRecommendation(null);
                        setShowQuiz(false);
                      }}
                      className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal / Detail View */}
      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedCard(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-16 overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedCard(null)}
                className="absolute top-10 right-10 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-12">
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 inline-block">
                  {selectedCard.category}
                </span>
                <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter uppercase">{selectedCard.name}</h2>
                <p className="text-zinc-500 text-lg font-medium">{selectedCard.bank}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Verified Pros
                  </h4>
                  <ul className="space-y-4">
                    {selectedCard.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-zinc-300 leading-relaxed font-semibold flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-rose-500 mb-6 flex items-center gap-2">
                    <Info className="w-5 h-5" /> Cons & Capping
                  </h4>
                  <ul className="space-y-4">
                    {selectedCard.cons.map((con, i) => (
                      <li key={i} className="text-sm text-zinc-400 leading-relaxed flex items-start gap-2">
                        <span className="text-rose-500 mt-0.5">-</span>
                        {con}
                      </li>
                    ))}
                    <li className="text-xs bg-white/5 p-4 rounded-2xl border border-white/5 text-zinc-500 font-medium mt-6 line-clamp-3 overflow-hidden">
                      <span className="text-zinc-300 font-bold block mb-1">Capping Details:</span>
                      {selectedCard.limits}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white/5 rounded-[2rem] p-8 flex flex-wrap gap-12 border border-white/5">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2">Annual Fee</p>
                  <p className="text-2xl font-black tracking-tight">₹{selectedCard.annualFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2">Fee Waiver</p>
                  <p className="text-sm font-bold text-zinc-200">{selectedCard.waiveCondition || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2">Primary Use</p>
                  <p className="text-sm font-bold text-zinc-200">{selectedCard.bestFor}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
