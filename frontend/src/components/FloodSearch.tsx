'use client';

import React, { useState } from 'react';
import { Search, Calendar, Loader2, Filter, Archive, MapPin } from 'lucide-react';
import { getFloodDetails } from '../lib/api';
import { FloodDetailsResponse } from '../lib/types';
import { FloodDetailCard } from './FloodDetailCard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const FloodSearch = () => {
    const [date, setDate] = useState('02/02/2026');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<FloodDetailsResponse | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const data = await getFloodDetails(date);
            setResults(data);
            toast.success('Histórico recuperado com sucesso');
        } catch (error) {
            console.error(error);
            toast.error('Erro na busca. Use DD/MM/AAAA');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto"
            >
                <div className="bg-surface border border-border rounded-2xl p-2 flex items-center shadow-lg focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <div className="flex-1 flex items-center gap-4 px-4">
                        <Calendar size={18} className="text-muted" />
                        <div className="flex-1">
                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Data Histórica</p>
                            <input
                                type="text"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="DD/MM/AAAA"
                                className="bg-transparent border-none outline-none text-foreground font-bold placeholder:text-muted/30 w-full py-1 text-lg"
                            />
                        </div>
                    </div>
                    <button
                        onClick={(e) => handleSearch(e as unknown as React.FormEvent)}
                        disabled={loading}
                        className="h-12 px-8 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-xs uppercase tracking-wider"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                        <span>{loading ? 'Buscando' : 'Pesquisar'}</span>
                    </button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {results && (
                    <motion.div
                        key={date}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-10"
                    >
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Ativos Trans.', value: results.summary.active.transitable, color: 'text-primary' },
                                { label: 'Ativos Intrans.', value: results.summary.active.intransitable, color: 'text-red-500' },
                                { label: 'Encerrados Tr.', value: results.summary.inactive.transitable, color: 'text-muted' },
                                { label: 'Encerrados In.', value: results.summary.inactive.intransitable, color: 'text-muted' }
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="bg-surface border border-border/50 p-6 rounded-xl text-center"
                                >
                                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-surface border border-border rounded-2xl p-4 shadow-xl">
                            <FloodDetailCard zones={results.zones} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
