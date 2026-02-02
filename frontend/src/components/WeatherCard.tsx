'use client';

import React from 'react';
import { Droplets, Thermometer, Calendar, MapPin, Cloudy } from 'lucide-react';
import { CgeData } from '../lib/types';
import { motion } from 'framer-motion';

export const WeatherCard = ({ data }: { data: CgeData['forecast'] }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-3xl overflow-hidden shadow-lg"
        >
            <div className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                    {/* Main Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                    <Calendar size={12} />
                                    {data.date}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted">
                                <MapPin size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">São Paulo, BR</span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-5xl font-bold text-foreground tracking-tight mb-2">
                                Previsão do Dia
                            </h2>
                            <p className="text-muted text-sm font-medium tracking-wide">Monitoramento Climático - CGE</p>
                        </div>
                    </div>

                    {/* Temp & Humidity */}
                    <div className="flex items-center gap-10">
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Céu</p>
                            <Cloudy size={32} className="text-primary mx-auto mb-2" />
                            <span className="text-sm font-bold text-foreground">SP</span>
                        </div>

                        <div className="h-12 w-[1px] bg-border" />

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="text-primary/70">
                                    <Thermometer size={18} />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Mín / Máx</p>
                                    <span className="text-lg font-bold text-foreground">{data.minTemp} / {data.maxTemp}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-primary/70">
                                    <Droplets size={18} />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Umidade</p>
                                    <span className="text-lg font-bold text-foreground">{data.minHumidity} - {data.maxHumidity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Grid - Fixed Layout */}
                <div className="mt-12 pt-8 border-t border-border">
                    <h3 className="text-[11px] font-bold text-muted uppercase tracking-[0.3em] mb-8 text-center">Evolução por Período</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {data.periods.map((period, idx) => (
                            <div
                                key={idx}
                                className="bg-background border border-border/50 rounded-2xl p-6 transition-all hover:border-primary/30"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{period.period}</span>
                                    <img src={period.image} alt="" className="w-10 h-10 object-contain" />
                                </div>
                                <p className="text-md font-bold text-foreground leading-snug mb-4 h-[3rem] line-clamp-2 overflow-hidden">
                                    {period.condition}
                                </p>
                                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${period.potential.toLowerCase() === 'baixo'
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-orange-500/10 text-orange-400'
                                    }`}>
                                    PT: {period.potential}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
