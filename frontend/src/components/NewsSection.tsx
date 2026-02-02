'use client';

import React from 'react';
import { Newspaper, ChevronRight, ExternalLink, Calendar } from 'lucide-react';
import { CgeData } from '../lib/types';
import { motion } from 'framer-motion';

export const NewsSection = ({ data }: { data: CgeData['news'] }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-surface border border-border rounded-3xl p-8 flex flex-col h-full shadow-lg"
        >
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Newspaper size={20} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight uppercase">Notícias</h2>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Portal CGE São Paulo</p>
                </div>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {data.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group p-5 rounded-2xl bg-background border border-border/50 hover:border-primary/40 transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar size={12} className="text-primary/60" />
                            <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{item.dateTime}</span>
                        </div>
                        <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors mb-3 line-clamp-3">
                            {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                            LEIA MAIS <ChevronRight size={14} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="mt-8 py-4 w-full bg-background border border-border/50 rounded-2xl text-[11px] font-bold text-muted uppercase tracking-[0.2em] hover:bg-surface hover:text-foreground transition-all flex items-center justify-center gap-2 group">
                Ver Arquivo Completo
                <ExternalLink size={14} className="group-hover:rotate-12 transition-transform" />
            </button>
        </motion.div>
    );
};
