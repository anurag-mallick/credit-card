'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard as CardIcon, DollarSign, Plane, Fuel, Zap, Star, ShieldCheck, Info, X } from 'lucide-react';
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

export default function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'all') return CREDIT_CARDS;
    return CREDIT_CARDS.filter(card => card.category === selectedCategory);
  }, [selectedCategory]);

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
        <div className="text-sm text-zinc-500 font-medium">
          Data Verified: <span className="text-zinc-300">{LAST_UPDATED}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        <header className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Find Your Next <br />
            <span className="gradient-text">Power Card</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Community-verified recommendations for the Indian credit card market. 
            Compare rewards, lounge access, and capping limits instantly.
          </motion.p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border",
                selectedCategory === cat.id 
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                  : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20 hover:bg-white/10"
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card) => (
              <motion.div
                layout
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass p-6 rounded-3xl group cursor-pointer card-hover relative flex flex-col justify-between overflow-hidden"
                onClick={() => setSelectedCard(card)}
              >
                {/* Visual Flair */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full" />
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1 block">
                        {card.category}
                      </span>
                      <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{card.name}</h3>
                      <p className="text-sm text-zinc-500">{card.bank}</p>
                    </div>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-white/5 mb-6">
                    {card.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-zinc-400 flex items-start gap-2 leading-tight">
                        <ShieldCheck className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-semibold text-zinc-600">Annual Fee</span>
                    <span className="text-sm font-bold">
                      {card.annualFee === 0 ? 'Free' : `₹${card.annualFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 rounded-lg">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-zinc-200">{card.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Google Ads Placeholder (Bottom) */}
        <div className="mt-24 w-full h-48 bg-zinc-900/40 rounded-3xl flex items-center justify-center border border-white/5 border-dashed">
          <span className="text-zinc-700 text-sm font-mono uppercase tracking-[0.2em]">Vertical Ad Slot 1</span>
        </div>
      </main>

      {/* Modal / Detail View */}
      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedCard(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedCard(null)}
                className="absolute top-8 right-8 p-2 bg-white/5 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-full mb-4 inline-block">
                  {selectedCard.category}
                </span>
                <h2 className="text-4xl font-bold mb-1">{selectedCard.name}</h2>
                <p className="text-zinc-500 text-lg">{selectedCard.bank}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Pros
                  </h4>
                  <ul className="space-y-3">
                    {selectedCard.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-zinc-300 leading-relaxed font-medium">• {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-rose-500 mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Cons & Limits
                  </h4>
                  <ul className="space-y-3">
                    {selectedCard.cons.map((con, i) => (
                      <li key={i} className="text-sm text-zinc-300 leading-relaxed">• {con}</li>
                    ))}
                    <li className="text-sm text-zinc-500 italic mt-4 pt-4 border-t border-white/5">
                      Limit: {selectedCard.limits}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 flex flex-wrap gap-10">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Annual Fee</p>
                  <p className="text-xl font-bold">₹{selectedCard.annualFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Fee Waiver</p>
                  <p className="text-sm font-bold text-zinc-300">{selectedCard.waiveCondition || 'No Waiver'}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Best For</p>
                  <p className="text-sm font-bold text-zinc-300">{selectedCard.bestFor}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
