'use client';

import React from 'react';
import { MapPin, Clock, Navigation, Info } from 'lucide-react';
import { ZoneFlood } from '../lib/types';
import { motion } from 'framer-motion';

export const FloodDetailCard = ({ zones }: { zones: ZoneFlood[] }) => {
    if (zones.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center"
            >
                <div className="w-20 h-20 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Info className="text-muted/30" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground uppercase tracking-tight mb-2">Sem registros para esta data</h3>
                <p className="text-muted text-sm max-w-sm mx-auto tracking-wide">
                    O CGE não reportou nenhum ponto de alagamento significativo no período selecionado.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-16">
            {zones.map((zone, zIdx) => (
                <div key={zIdx} className="space-y-8">
                    <div className="flex items-center gap-6 px-2">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight uppercase">
                            {zone.name}
                        </h2>
                        <div className="h-[1px] flex-1 bg-border" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {zone.neighborhoods.map((nb, nIdx) => (
                            <div
                                key={nIdx}
                                className="bg-background border border-border rounded-3xl p-8 transition-all hover:border-primary/20 group"
                            >
                                <div className="flex justify-between items-center mb-10 pb-6 border-b border-border/50">
                                    <h3 className="text-xl font-bold text-primary tracking-tight leading-tight">
                                        {nb.name}
                                    </h3>
                                    <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/20 uppercase tracking-widest">
                                        {nb.totalPoints}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {nb.points.map((pt, pIdx) => (
                                        <div
                                            key={pIdx}
                                            className="bg-surface/50 border border-border/50 rounded-2xl p-6 transition-all hover:bg-surface border-l-4 border-l-primary/20 hover:border-l-primary"
                                        >
                                            <div className="space-y-4 mb-6">
                                                <div className="flex items-start gap-4">
                                                    <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${pt.statusClass?.includes('ativo-intransitavel')
                                                            ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                                            : pt.statusClass?.includes('ativo-transitavel')
                                                                ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                                                                : 'bg-muted/40'
                                                        }`} />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-lg font-bold text-foreground leading-snug break-words mb-1.5">
                                                            {pt.street}
                                                        </h4>
                                                        <p className="text-[10px] text-primary font-bold uppercase tracking-[0.15em]">{pt.status}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pb-6 mb-6 border-b border-border/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-background rounded-lg text-primary/70">
                                                        <Clock size={14} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-0.5">Duração</p>
                                                        <p className="text-xs font-bold text-foreground truncate">{pt.timeRange}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-background rounded-lg text-primary/70">
                                                        <Navigation size={14} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-0.5">Direção</p>
                                                        <p className="text-xs font-bold text-foreground truncate">{pt.direction || '---'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-background rounded-lg text-primary/70 mt-1">
                                                    <MapPin size={14} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-1">Referência</p>
                                                    <p className="text-[11px] text-foreground font-medium leading-relaxed italic break-words">
                                                        {pt.reference || 'Sem referência disponível'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
