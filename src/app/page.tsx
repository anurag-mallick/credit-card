'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard as CardIcon, DollarSign, Plane, Fuel, Zap, Star, ShieldCheck, Info, X, Calculator, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { CREDIT_CARDS, LAST_UPDATED, type CreditCard } from '@/data/cards';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  { id: 'all', name: 'Discovery', icon: Sparkles },
  { id: 'Super Premium', name: 'Luxury', icon: Star },
  { id: 'Cashback', name: 'Cashback', icon: DollarSign },
  { id: 'Travel', name: 'Travel', icon: Plane },
  { id: 'Utilities', name: 'Bills', icon: Zap },
  { id: 'Fuel', name: 'Fuel', icon: Fuel },
];

const SPEND_CATEGORIES = [
  { id: 'online', name: 'E-Commerce', icon: DollarSign, description: 'Amazon, Zomato, etc.' },
  { id: 'travel', name: 'Travel/Hotels', icon: Plane, description: 'Flights & Stays' },
  { id: 'dining', name: 'Lifestyle', icon: Star, description: 'Dining & Groceries' },
  { id: 'utilities', name: 'Bills', icon: Zap, description: 'Rent & Utilities' },
  { id: 'fuel', name: 'Fuel', icon: Fuel, description: 'Fuel & Commute' },
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
  const [recommendations, setRecommendations] = useState<{ 
    card: CreditCard, 
    savings: number,
    breakup: Record<string, number>
  }[] | null>(null);

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'all') return CREDIT_CARDS;
    return CREDIT_CARDS.filter(card => card.category === selectedCategory);
  }, [selectedCategory]);

  const categoryRankings = useMemo(() => {
    return SPEND_CATEGORIES.map(cat => {
      const results = CREDIT_CARDS.map(card => {
        let cardBreakup: Record<string, number> = {};
        const spends: Record<string, number> = { online: 0, travel: 0, dining: 0, utilities: 0, fuel: 0 };
        spends[cat.id] = 50000; // Benchmark spend for comparison

        const monOnline = spends.online;
        const monTravel = spends.travel;
        const monDining = spends.dining;
        const monUtilities = spends.utilities;
        const monFuel = spends.fuel;
        const monOther = 0;

        if (card.id === 'sbi-cashback') {
          const reward = Math.min(monOnline * 0.05, 5000);
          cardBreakup = { 'ROI': reward };
        } 
        else if (card.id === 'hdfc-infinia') {
          const smartBuy = Math.min((monOnline * 0.4 + monTravel * 0.8) * 0.165, 15000);
          const base = (monOnline * 0.6 + monTravel * 0.2 + monDining + monUtilities + monFuel) * 0.033;
          cardBreakup = { 'ROI': smartBuy + base };
        }
        else if (card.id === 'axis-atlas') {
          const travelMiles = (monTravel / 100) * 5 * 1.8;
          const otherMiles = ((monOnline + monDining + monUtilities + monFuel) / 100) * 2 * 1.8;
          cardBreakup = { 'ROI': travelMiles + otherMiles };
        }
        else if (card.id === 'airtel-axis') {
          const telco = Math.min(monUtilities * 0.2, 300);
          const utils = Math.min(monUtilities * 0.1, 300);
          const food = Math.min(monDining * 0.1, 500);
          cardBreakup = { 'ROI': telco + utils + food };
        }
        else if (card.id === 'amazon-pay-icici') {
          const amz = monOnline * 0.05;
          const others = (monTravel + monDining + monUtilities + monFuel) * 0.01;
          cardBreakup = { 'ROI': amz + others };
        }
        else {
          const base = (monOnline + monTravel + monDining + monUtilities + monFuel) * 0.015;
          cardBreakup = { 'ROI': base };
        }

        return { card, roi: Object.values(cardBreakup)[0] || 0 };
      });
      return {
        category: cat,
        topCards: results.sort((a, b) => b.roi - a.roi).slice(0, 3)
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100">
      {/* Ad Space */}
      <div className="w-full h-16 bg-white/50 flex items-center justify-center border-b border-slate-200">
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ad-placeholder px-4 py-1 rounded">Sponsored / Ads Placeholder</span>
      </div>

      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-3 px-6 md:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <CardIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Card<span className="text-indigo-600">Wise</span></span>
        </div>
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setShowQuiz(true)}
            className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:text-indigo-500 transition-all uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl"
          >
            <Calculator className="w-3.5 h-3.5" />
            ROI Suggestion
          </button>
          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest hidden sm:block">
             Update: <span className="text-slate-600">{LAST_UPDATED}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        <header className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-8 shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            Concierge Selection
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight uppercase font-outfit"
          >
            Smarter Card <br />
            <span className="text-indigo-600">Suggestions.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
          >
            Mathematical precision meet lifestyle rewards. Discover the card 
            that maximizes your ROI based on real community data.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => setShowQuiz(true)}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-base shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              Get Suggestion
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('category-leaders');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl font-black text-base transition-all shadow-sm active:scale-95"
            >
              Category Leaders
            </button>
          </motion.div>
        </header>

        {/* Category Leaders Section */}
        <section id="category-leaders" className="pt-24 mb-24">
          <div className="mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 leading-none">Category Leaders</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Ranked by Specific Spend Efficiency</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {categoryRankings.map((group) => (
              <div key={group.category.id} className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <group.category.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{group.category.name}</span>
                </div>
                
                <div className="space-y-4">
                  {group.topCards.map((item, idx) => (
                    <div 
                      key={item.card.id} 
                      className="cursor-pointer group"
                      onClick={() => setSelectedCard(item.card)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={cn(
                          "text-[9px] font-black italic",
                          idx === 0 ? "text-indigo-600" : "text-slate-400"
                        )}>#{idx + 1}</span>
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{item.card.bank}</span>
                      </div>
                      <p className="text-[11px] font-black uppercase leading-tight group-hover:text-indigo-600 transition-colors">
                        {item.card.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div id="card-explorer" className="pt-16 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 leading-none">Market Library</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Verified by Community Experts</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
                    selectedCategory === cat.id 
                      ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200" 
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                  )}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card) => (
              <motion.div
                layout
                key={card.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white p-8 rounded-[2rem] group cursor-pointer relative flex flex-col justify-between border border-slate-200 hover:border-indigo-400 transition-all duration-500 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] overflow-hidden"
                onClick={() => setSelectedCard(card)}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2 block">
                        {card.category}
                      </span>
                      <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors tracking-tight uppercase leading-none">{card.name}</h3>
                      <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{card.bank}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {card.benefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600/20 mt-1.5 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-500 leading-snug uppercase tracking-tight">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] uppercase font-black text-slate-400 tracking-widest block mb-0.5">Annual Fee</span>
                    <span className="text-lg font-black tracking-tight text-slate-800">
                      {card.annualFee === 0 ? 'FREE' : `₹${card.annualFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-24 max-w-4xl mx-auto h-32 bg-slate-100/50 rounded-[2.5rem] flex flex-col items-center justify-center border border-slate-200 border-dashed relative overflow-hidden group">
          <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] mb-2 leading-none">Sponsored Space</span>
          <div className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">
             Google Ads Placement
          </div>
        </div>
      </main>

      {/* Calculator Modal */}
      <AnimatePresence>
        {showQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => {
                setShowQuiz(false);
                setRecommendations(null);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-[3rem] p-8 md:p-14 overflow-y-auto max-h-[90vh] custom-scrollbar shadow-2xl"
            >
              <button 
                onClick={() => {
                  setShowQuiz(false);
                  setRecommendations(null);
                }}
                className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-all z-10"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              {!recommendations ? (
                <div className="max-w-2xl mx-auto">
                  <header className="text-center mb-12">
                    <h2 className="text-4xl font-black mb-3 tracking-tighter uppercase leading-none">Recommendation Engine</h2>
                    <p className="text-slate-500 text-base font-bold uppercase tracking-widest">Input your monthly lifestyle for a perfect match.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {SPEND_CATEGORIES.map((cat) => (
                      <div key={cat.id} className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-200 transition-all hover:bg-slate-50">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                              <cat.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest text-slate-900">{cat.name}</p>
                              <p className="text-[9px] text-slate-400 font-black uppercase">{cat.description}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                           <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">₹</span>
                            <input 
                              type="number"
                              className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-6 text-xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                              value={spends[cat.id] || 0}
                              onChange={(e) => setSpends({...spends, [cat.id]: Number(e.target.value)})}
                            />
                          </div>

                          <div className="px-2">
                            <input 
                              type="range"
                              min="0"
                              max="150000"
                              step="1000"
                              className="slider-input"
                              value={spends[cat.id] || 0}
                              onChange={(e) => setSpends({...spends, [cat.id]: Number(e.target.value)})}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={calculateSavings}
                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-1.5xl font-black text-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] uppercase tracking-tighter"
                  >
                    Generate Top 3 Suggestions
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-12">
                    <h2 className="text-5xl font-black mb-2 uppercase tracking-tighter leading-none">Your Top 3 Suggestions</h2>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Ranked by Mathematical ROI</p>
                  </div>

                  <div className="grid grid-cols-1 gap-8 mb-16 max-w-4xl mx-auto">
                    {recommendations.map((rec, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={rec.card.id}
                        className={cn(
                          "relative p-8 rounded-[2.5rem] text-left border transition-all duration-500",
                          index === 0 
                            ? "bg-slate-900 text-white border-slate-900 shadow-2xl scale-[1.02] z-10" 
                            : "bg-white text-slate-900 border-slate-200 scale-[1.0]"
                        )}
                      >
                        <div className="absolute top-8 right-10">
                           <span className={cn(
                             "text-4xl font-black uppercase tracking-tighter italic opacity-20",
                             index === 0 ? "text-indigo-400" : "text-slate-400"
                           )}>
                              Rank #{index + 1}
                           </span>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                          <div className="flex-1">
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-[0.3em] mb-4 block",
                              index === 0 ? "text-indigo-400" : "text-indigo-600"
                            )}>
                              {index === 0 ? '🏆 Market Segment Leader' : '⭐ Strong Contender'}
                            </span>
                            <h3 className="text-3xl font-black mb-1 tracking-tighter uppercase leading-none">{rec.card.name}</h3>
                            <p className={cn(
                              "text-sm font-bold mb-8 uppercase tracking-widest",
                              index === 0 ? "text-slate-500" : "text-slate-400"
                            )}>{rec.card.bank}</p>

                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(rec.breakup).map(([label, value]) => (
                                <div key={label}>
                                  <p className={cn("text-[9px] font-black uppercase tracking-widest mb-1", index === 0 ? "text-slate-600" : "text-slate-400")}>{label}</p>
                                  <p className="text-base font-black">₹{value.toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col items-center md:items-end justify-center px-8 py-6 bg-white/5 rounded-3xl border border-white/10 md:min-w-[200px]">
                            <span className={cn(
                              "text-[10px] uppercase font-black tracking-[0.2em] mb-2",
                              index === 0 ? "text-slate-500" : "text-slate-400"
                            )}>Net Annual ROI</span>
                            <div className="flex items-baseline gap-1">
                               <span className={cn(
                                 "text-6xl font-black tracking-tighter leading-none",
                                 index === 0 ? "text-white" : "text-slate-900"
                               )}>
                                  ₹{(rec.savings / 1000).toFixed(1)}
                               </span>
                               <span className="text-2xl font-black text-indigo-500 uppercase">K</span>
                            </div>
                            <p className={cn(
                              "font-bold mt-4 uppercase text-[9px] tracking-[0.2em]",
                              index === 0 ? "text-slate-600" : "text-slate-500"
                            )}>After Fee: ₹{rec.card.annualFee.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                           <button 
                             onClick={() => {
                               setSelectedCard(rec.card);
                               setShowQuiz(false);
                             }}
                             className={cn(
                               "px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                               index === 0 
                                 ? "bg-indigo-600 text-white hover:bg-indigo-500" 
                                 : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                             )}
                           >
                             Full Analysis
                           </button>
                           <div className={cn(
                             "flex-1 px-6 py-3 rounded-xl border flex items-center gap-2",
                             index === 0 ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50"
                           )}>
                             <Sparkles className="w-3 h-3 text-indigo-500" />
                             <span className={cn("text-[9px] font-black uppercase tracking-widest", index === 0 ? "text-slate-400" : "text-slate-500")}>
                               Best For: {rec.card.bestFor}
                             </span>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button 
                      onClick={() => setRecommendations(null)}
                      className="py-4 px-12 bg-white hover:bg-slate-50 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border border-slate-200 active:scale-95 shadow-sm"
                    >
                      Refine Lifestyle Spends
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setSelectedCard(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-14 overflow-y-auto max-h-[90vh] custom-scrollbar shadow-2xl"
            >
              <button 
                onClick={() => setSelectedCard(null)}
                className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-all z-20"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="mb-12">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 inline-block border border-indigo-100">
                  {selectedCard.category} Segment
                </span>
                <h2 className="text-4xl md:text-5xl font-black mb-1 tracking-tighter uppercase leading-none">{selectedCard.name}</h2>
                <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">{selectedCard.bank}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Core Benefits
                  </h4>
                  <ul className="space-y-4">
                    {selectedCard.pros.map((pro, i) => (
                      <li key={i} className="text-xs text-slate-600 font-bold uppercase tracking-tight flex items-start gap-3">
                        <span className="text-emerald-500">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-6 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Observations
                  </h4>
                  <ul className="space-y-4">
                    {selectedCard.cons.map((con, i) => (
                      <li key={i} className="text-xs text-slate-400 font-bold tracking-tight uppercase flex items-start gap-3">
                        <span className="text-rose-500">−</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 rounded-[2rem] p-10 grid grid-cols-1 sm:grid-cols-3 gap-10 border border-slate-200 shadow-inner">
                <div>
                  <p className="text-[8px] text-slate-400 uppercase tracking-[0.3em] font-black mb-1.5">Maintenance</p>
                  <p className="text-2xl font-black tracking-tighter text-slate-900">₹{selectedCard.annualFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 uppercase tracking-[0.3em] font-black mb-1.5">Waiver Target</p>
                  <p className="text-xs font-black text-slate-600 uppercase leading-snug">{selectedCard.waiveCondition || 'LTF'}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 uppercase tracking-[0.3em] font-black mb-1.5">Best For</p>
                  <p className="text-xs font-black text-slate-600 uppercase leading-snug">{selectedCard.bestFor}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
