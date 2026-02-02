'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { CgeData } from '../lib/types';
import { motion } from 'framer-motion';

export const AlertSection = ({ data }: { data: CgeData['floodPoints'] }) => {
    const isActive = data.active > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface border border-border rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden"
        >
            <div className="flex flex-col xl:flex-row items-center justify-between gap-10 relative z-10">
                <div className="flex items-center gap-8">
                    <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isActive
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                    >
                        {isActive ? <AlertTriangle size={36} /> : <CheckCircle2 size={36} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-foreground tracking-tight uppercase">Status Operacional</h2>
                            {isActive && <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}
                        </div>
                        <div className="flex items-center gap-3 text-muted">
                            <Activity size={14} />
                            <p className="text-[10px] font-bold uppercase tracking-widest italic">Sensores em monitoramento ativo</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap items-center gap-4">
                    <div className="px-8 py-5 rounded-2xl bg-background border border-border/50 text-center min-w-[160px]">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">Transitáveis</p>
                        <p className="text-3xl font-bold text-foreground tracking-tight">
                            {data.transitable.split('=')[1]?.trim() || '0'}
                        </p>
                    </div>
                    <div className="px-8 py-5 rounded-2xl bg-background border border-border/50 text-center min-w-[160px]">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">Intransitáveis</p>
                        <p className={`text-3xl font-bold tracking-tight ${isActive ? 'text-red-500' : 'text-foreground'}`}>
                            {data.intransitable.split('=')[1]?.trim() || '0'}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
