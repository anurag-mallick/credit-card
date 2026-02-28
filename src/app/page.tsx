'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard as CardIcon, DollarSign, Plane, Fuel, Zap, Star, ShieldCheck, Info, X, Calculator, ArrowRight, TrendingUp, Sparkles, Trophy, Award, Landmark } from 'lucide-react';
import { CREDIT_CARDS, LAST_UPDATED, type CreditCard } from '@/data/cards';
import AdComponent from '@/components/AdComponent';
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
  { id: 'online', name: 'E-Commerce', icon: DollarSign, description: 'Amazon, Zomato, etc.', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'travel', name: 'Travel/Hotels', icon: Plane, description: 'Flights & Stays', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'dining', name: 'Lifestyle', icon: Star, description: 'Dining & Groceries', color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'utilities', name: 'Bills', icon: Zap, description: 'Rent & Utilities', color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'fuel', name: 'Fuel', icon: Fuel, description: 'Fuel & Commute', color: 'text-emerald-500', bg: 'bg-emerald-50' },
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

  const calculateSavings = () => {
    const allResults = CREDIT_CARDS.map(card => {
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
        const smartBuy = Math.min((monOnline * 0.4 + monTravel * 0.8) * 0.165, 15000);
        const base = (monOnline * 0.6 + monTravel * 0.2 + monDining + monUtilities + monFuel + monOther) * 0.033;
        cardBreakup = { 'SmartBuy Accelerator': smartBuy * 12, 'Base Rewards (3.3%)': base * 12 };
      }
      else if (card.id === 'axis-atlas') {
        const travelMiles = (monTravel / 100) * 5 * 1.8;
        const otherMiles = ((monOnline + monDining + monUtilities + monFuel + monOther) / 100) * 2 * 1.8;
        cardBreakup = { 'Travel Miles': travelMiles * 12, 'Base Miles': otherMiles * 12 };
      }
      else if (card.id === 'airtel-axis') {
        const telco = Math.min(monUtilities * 0.2, 300);
        const utils = Math.min(monUtilities * 0.1, 300);
        const food = Math.min(monDining * 0.1, 500);
        cardBreakup = { 'Bills & Utilities': (telco + utils) * 12, 'Food Meta': food * 12 };
      }
      else if (card.id === 'amazon-pay-icici') {
        const amz = monOnline * 0.05;
        const others = (monTravel + monDining + monUtilities + monFuel + monOther) * 0.01;
        cardBreakup = { 'Amazon Prime': amz * 12, 'Others': others * 12 };
      }
      else {
        const base = (monOnline + monTravel + monDining + monUtilities + monFuel + monOther) * 0.015;
        cardBreakup = { 'Reward Rate (1.5%)': base * 12 };
      }

      const totalRewards = Object.values(cardBreakup).reduce((a, b) => a + b, 0);
      let fee = card.annualFee;
      const annualSpend = (monOnline + monTravel + monDining + monUtilities + monFuel + monOther) * 12;
      
      if (card.waiveCondition) {
        const match = card.waiveCondition.match(/₹(\d+)\s*Lakh|₹([\d,]+)/);
        if (match) {
           const target = match[1] ? Number(match[1]) * 100000 : Number(match[2].replace(/,/g, ''));
           if (annualSpend >= target) fee = 0;
        }
      }

      const netSavings = totalRewards - fee;
      return { card, savings: Math.round(netSavings), breakup: cardBreakup };
    });

    const sorted = allResults.sort((a, b) => b.savings - a.savings).slice(0, 3);
    setRecommendations(sorted);
  };

  const categoryRankings = useMemo(() => {
    return SPEND_CATEGORIES.map(cat => {
      const results = CREDIT_CARDS.map(card => {
        let cardROI = 0;
        const testSpend = 50000;

        if (cat.id === 'online') {
          if (card.id === 'sbi-cashback') cardROI = Math.min(testSpend * 0.05, 5000);
          else if (card.id === 'amazon-pay-icici') cardROI = testSpend * 0.05;
          else if (card.id === 'hdfc-infinia') cardROI = testSpend * 0.10; // Simple approximation for SmartBuy
          else cardROI = testSpend * 0.02;
        } else if (cat.id === 'travel') {
           if (card.id === 'axis-atlas') cardROI = (testSpend / 100) * 5 * 1.8;
           else if (card.id === 'hdfc-infinia') cardROI = testSpend * 0.165;
           else cardROI = testSpend * 0.02;
        } else if (cat.id === 'utilities') {
           if (card.id === 'airtel-axis') cardROI = 600; // Capped max
           else cardROI = testSpend * 0.01;
        } else if (cat.id === 'fuel') {
           if (card.id === 'sbi-bpcl-octane') cardROI = testSpend * 0.0725;
           else cardROI = testSpend * 0.01;
        } else {
           cardROI = testSpend * 0.02;
        }

        return { card, roi: Math.round(cardROI) };
      });
      return {
        category: cat,
        topCards: results.sort((a, b) => b.roi - a.roi).slice(0, 3)
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100">
      {/* Top Ad Unit */}
      <div className="w-full bg-white/50 border-b border-slate-200/60 pb-1">
        <AdComponent className="h-20" format="auto" />
      </div>

      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 py-4 px-6 md:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <CardIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">Card<span className="text-indigo-600">Wise</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowQuiz(true)}
            className="flex items-center gap-2 text-[11px] font-black text-white gradient-primary hover:opacity-90 transition-all uppercase tracking-widest px-6 py-2.5 rounded-full shadow-md shadow-indigo-100"
          >
            <Calculator className="w-3.5 h-3.5" />
            Find My Best Card
          </button>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest hidden lg:block">
             Update: <span className="text-slate-900">{LAST_UPDATED}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Hero Section */}
        <header className="relative mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Concierge Level ROI Mapping
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] uppercase font-outfit"
          >
            Stop Losing <br />
            <span className="gradient-text">Real Money.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
          >
            Most Indians lose ₹15,000+ annually with the wrong credit card. 
            Our mathematical solver picks the winner for your lifestyle.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button 
              onClick={() => setShowQuiz(true)}
              className="w-full sm:w-auto px-10 py-5 gradient-primary hover:shadow-2xl hover:shadow-indigo-300 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Run ROI Engine
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('category-leaders');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-lg transition-all shadow-sm active:scale-95"
            >
              Market Rankings
            </button>
          </div>
        </header>

        {/* Category Leaders Section */}
        <section id="category-leaders" className="pt-24 mb-32 relative">
          <div className="absolute -left-24 top-24 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -z-10" />
          <div className="absolute -right-24 bottom-0 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl -z-10" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-3 leading-none font-outfit">Market Leaders</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Ranked by pure category efficiency</p>
            </div>
            <div className="h-px flex-1 mx-8 bg-slate-200 hidden md:block" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categoryRankings.map((group) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={group.category.id} 
                className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className={cn("absolute top-0 left-0 w-full h-1", group.category.color.replace('text', 'bg'))} />
                <div className="flex items-center gap-3 mb-8">
                  <div className={cn("p-2.5 rounded-xl border", group.category.bg, group.category.color.replace('text', 'border'))}>
                    <group.category.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 leading-none">{group.category.name}</span>
                </div>
                
                <div className="space-y-6">
                  {group.topCards.map((item, idx) => (
                    <div 
                      key={item.card.id} 
                      className="cursor-pointer group block"
                      onClick={() => setSelectedCard(item.card)}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={cn(
                          "text-[10px] font-black italic px-2 py-0.5 rounded-md",
                          idx === 0 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                        )}>#{idx + 1}</span>
                        <div className="flex items-center gap-1.5">
                          <Landmark className="w-2.5 h-2.5 text-slate-300" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.card.bank}</span>
                        </div>
                      </div>
                      <p className="text-[13px] font-black uppercase leading-tight group-hover:text-indigo-600 transition-colors tracking-tighter">
                        {item.card.name}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Library Filter */}
        <div id="card-explorer" className="pt-16 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-3 font-outfit">The Library</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Exhaustive repository & breakdown</p>
            </div>
            <div className="flex flex-wrap gap-2.5 bg-slate-100/50 p-2 rounded-2xl border border-slate-200/60">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                    selectedCategory === cat.id 
                      ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCards.map((card) => (
                <motion.div
                  layout
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white p-10 rounded-[3rem] group cursor-pointer relative flex flex-col justify-between border border-slate-200 hover:border-indigo-300 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100 overflow-hidden"
                  onClick={() => setSelectedCard(card)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-3 block">
                          {card.category}
                        </span>
                        <h3 className="text-2xl font-black group-hover:text-indigo-600 transition-colors tracking-tight uppercase leading-[0.9] font-outfit">{card.name}</h3>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">{card.bank}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-10">
                      {card.benefits.slice(0, 3).map((benefit, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-2 shrink-0 group-hover:bg-indigo-500 transition-colors" />
                          <span className="text-[11px] font-bold text-slate-600 leading-snug uppercase tracking-tight">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] block mb-1">Maintenance</span>
                      <span className="text-xl font-black tracking-tighter text-slate-800">
                        {card.annualFee === 0 ? 'FREE' : `₹${card.annualFee.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:gradient-primary group-hover:border-transparent group-hover:text-white transition-all duration-300 shadow-sm">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Middle Native Ad Unit */}
        <div className="mt-32 max-w-5xl mx-auto rounded-[3.5rem] bg-white border border-slate-200/80 p-6 shadow-sm overflow-hidden">
           <div className="flex justify-center items-center py-4 bg-slate-50 rounded-2xl mb-4">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Sponsored Content</span>
           </div>
           <AdComponent format="fluid" className="min-h-[250px]" />
        </div>
      </main>

      {/* ROI Engine Modal */}
      <AnimatePresence>
        {showQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
              onClick={() => {
                setShowQuiz(false);
                setRecommendations(null);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-[3.5rem] p-10 md:p-16 overflow-y-auto max-h-[90vh] custom-scrollbar shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)]"
            >
              <button 
                onClick={() => {
                  setShowQuiz(false);
                  setRecommendations(null);
                }}
                className="absolute top-10 right-10 p-4 hover:bg-slate-100 rounded-full transition-all z-10"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>

              {!recommendations ? (
                <div className="max-w-3xl mx-auto">
                  <header className="text-center mb-16">
                    <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200">
                      <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase leading-none font-outfit">ROI Solving Engine</h2>
                    <p className="text-slate-500 text-lg font-bold uppercase tracking-widest">Mathematical ranking based on monthly spends</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {SPEND_CATEGORIES.map((cat) => (
                      <div key={cat.id} className="bg-slate-50/80 p-10 rounded-[3rem] border border-slate-200/60 transition-all hover:bg-white group">
                        <div className="flex items-center gap-5 mb-8">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 transition-all group-hover:scale-110", cat.bg, cat.color)}>
                              <cat.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm font-black uppercase tracking-widest text-slate-900 leading-none mb-1">{cat.name}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{cat.description}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                           <div className="relative">
                            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl">₹</span>
                            <input 
                              type="number"
                              className="w-full bg-white border-2 border-slate-200 rounded-[1.5rem] py-5 pl-14 pr-8 text-2xl text-slate-900 font-black focus:outline-none focus:ring-8 focus:ring-indigo-100/50 transition-all"
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
                            <div className="flex justify-between mt-3 px-1">
                               <span className="text-[9px] font-black text-slate-300 uppercase">₹0</span>
                               <span className="text-[9px] font-black text-slate-300 uppercase">₹1.5L</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={calculateSavings}
                    className="w-full py-8 gradient-primary hover:shadow-2xl hover:shadow-indigo-300 text-white rounded-[2rem] font-black text-2xl shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] uppercase tracking-tighter"
                  >
                    Solve Rankings
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-16">
                    <h2 className="text-6xl font-black mb-3 uppercase tracking-tighter leading-none gradient-text transition-all font-outfit">Top Suggestions</h2>
                    <p className="text-slate-500 text-base font-black uppercase tracking-[0.3em]">Pure Net Profit (ROI) Predictions</p>
                  </div>

                  <div className="grid grid-cols-1 gap-10 mb-20 max-w-4xl mx-auto">
                    {recommendations.map((rec, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={rec.card.id}
                        className={cn(
                          "relative p-10 rounded-[3.5rem] text-left border transition-all duration-700 overflow-hidden group",
                          index === 0 
                            ? "bg-slate-900 text-white border-slate-900 shadow-[0_30px_60px_-15px_rgba(99,102,241,0.4)] scale-[1.03] z-10" 
                            : "bg-white text-slate-900 border-slate-200"
                        )}
                      >
                        {index === 0 && <div className="absolute top-0 left-0 w-full h-2 gradient-primary" />}
                        <div className="absolute top-10 right-12 flex flex-col items-end">
                           <span className={cn(
                             "text-5xl font-black uppercase tracking-tighter italic leading-none mb-1",
                             index === 0 ? "text-white/10" : "text-slate-100"
                           )}>
                              #{index + 1}
                           </span>
                           <span className={cn(
                             "text-[9px] font-black uppercase tracking-[0.3em]",
                             index === 0 ? "text-indigo-400" : "text-indigo-600"
                           )}>Ranking Score</span>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 relative z-10">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-6">
                              {index === 0 ? <Trophy className="w-5 h-5 text-indigo-400" /> : <Award className="w-5 h-5 text-indigo-600" />}
                              <span className={cn(
                                "text-xs font-black uppercase tracking-[0.3em]",
                                index === 0 ? "text-indigo-400" : "text-indigo-600"
                              )}>
                                {index === 0 ? 'Optimal Winner' : 'Highly Recommended'}
                              </span>
                            </div>
                            <h3 className="text-4xl font-black mb-2 tracking-tighter uppercase leading-none font-outfit">{rec.card.name}</h3>
                            <p className={cn(
                              "text-sm font-bold mb-10 uppercase tracking-[0.3em]",
                              index === 0 ? "text-slate-500" : "text-slate-400"
                            )}>{rec.card.bank}</p>

                            <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                              {Object.entries(rec.breakup).map(([label, value]) => (
                                <div key={label}>
                                  <p className={cn("text-[10px] font-black uppercase tracking-widest mb-2", index === 0 ? "text-slate-600" : "text-slate-400")}>{label}</p>
                                  <p className="text-2xl font-black tracking-tight">₹{value.toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className={cn(
                            "flex flex-col items-center md:items-end justify-center px-10 py-10 rounded-[2.5rem] border md:min-w-[280px] shadow-sm",
                            index === 0 ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
                          )}>
                            <span className={cn(
                              "text-xs uppercase font-black tracking-[0.3em] mb-4",
                              index === 0 ? "text-indigo-400" : "text-slate-400"
                            )}>Annual Net Savings</span>
                            <div className="flex items-baseline gap-2">
                               <span className={cn(
                                 "text-7xl font-black tracking-tighter leading-none font-outfit",
                                 index === 0 ? "text-white" : "text-slate-900"
                               )}>
                                  ₹{(rec.savings / 1000).toFixed(1)}
                               </span>
                               <span className="text-3xl font-black text-indigo-500 uppercase">K</span>
                            </div>
                            <p className={cn(
                              "font-bold mt-6 uppercase text-[10px] tracking-[0.3em]",
                              index === 0 ? "text-slate-500" : "text-slate-400"
                            )}>Net of ₹{rec.card.annualFee} Fee</p>
                          </div>
                        </div>

                        <div className="mt-12 flex flex-col sm:flex-row gap-4 relative z-10">
                           <button 
                             onClick={() => {
                               setSelectedCard(rec.card);
                               setShowQuiz(false);
                             }}
                             className={cn(
                               "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                               index === 0 
                                 ? "gradient-primary text-white hover:opacity-90" 
                                 : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                             )}
                           >
                             Detailed Evidence
                           </button>
                           <div className={cn(
                             "flex-1 px-8 py-4 rounded-2xl border flex items-center gap-3",
                             index === 0 ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50"
                           )}>
                             <Landmark className="w-5 h-5 text-indigo-500" />
                             <span className={cn("text-xs font-black uppercase tracking-widest leading-none", index === 0 ? "text-slate-400" : "text-slate-500")}>
                               Target Segment: {rec.card.category}
                             </span>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button 
                      onClick={() => setRecommendations(null)}
                      className="py-5 px-16 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 border-slate-200 active:scale-95 shadow-sm"
                    >
                      Update Spend Profile
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card Analysis Modal */}
      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
              onClick={() => setSelectedCard(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-[3.5rem] p-10 md:p-16 overflow-y-auto max-h-[90vh] custom-scrollbar shadow-2xl"
            >
              <button 
                onClick={() => setSelectedCard(null)}
                className="absolute top-10 right-10 p-4 hover:bg-slate-100 rounded-full transition-all z-20"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>

              <div className="mb-16">
                <span className="px-5 py-2 bg-indigo-50 text-indigo-600 text-[11px] font-black uppercase tracking-[0.3em] rounded-full mb-8 inline-block border border-indigo-100">
                  {selectedCard.category} Verified
                </span>
                <h2 className="text-5xl md:text-6xl font-black mb-3 tracking-tighter uppercase leading-none font-outfit">{selectedCard.name}</h2>
                <div className="flex items-center gap-3">
                   < LandMark className="w-5 h-5 text-slate-300" />
                   <p className="text-2xl font-bold text-slate-400 uppercase tracking-widest">{selectedCard.bank}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-8 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6" /> Key Advantages
                  </h4>
                  <ul className="space-y-6">
                    {selectedCard.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-slate-600 font-bold uppercase tracking-tight flex items-start gap-4">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0 text-[10px]">+</div>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-rose-500 mb-8 flex items-center gap-3">
                    <Info className="w-6 h-6" /> Criticisms
                  </h4>
                  <ul className="space-y-6">
                    {selectedCard.cons.map((con, i) => (
                      <li key={i} className="text-sm text-slate-400 font-bold tracking-tight uppercase flex items-start gap-4">
                        <div className="w-5 h-5 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 shrink-0 text-[10px]">-</div>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50/80 rounded-[3rem] p-12 grid grid-cols-1 sm:grid-cols-3 gap-12 border border-slate-200/60 shadow-inner">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black mb-3">Annual Maintenance</p>
                  <p className="text-4xl font-black tracking-tighter text-slate-900 font-outfit">₹{selectedCard.annualFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black mb-3">Waiver Condition</p>
                  <p className="text-sm font-black text-slate-700 uppercase leading-snug tracking-tighter">{selectedCard.waiveCondition || 'LTF'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black mb-3">Strategic Usage</p>
                  <p className="text-sm font-black text-slate-700 uppercase leading-snug tracking-tighter">{selectedCard.bestFor}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Fixed a component name typo in the LandMark icon usage
function LandMark({ className }: { className?: string }) {
  return <Landmark className={className} />;
}
