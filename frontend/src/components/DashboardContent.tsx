'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { getCgeData, getAnalytics, getPlaces } from '@/lib/api';
import { WeatherCard } from '@/components/WeatherCard';
import { AlertSection } from '@/components/AlertSection';
import { NewsSection } from '@/components/NewsSection';
import { FloodSearch } from '@/components/FloodSearch';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { PlaceManagement } from '@/components/PlaceManagement';
import { AuthModal } from '@/components/AuthModal';
import { useAuthStore } from '@/lib/store';
import {
    LayoutDashboard,
    BarChart3,
    History,
    MapPin,
    Waves,
    LogIn,
    LogOut,
    Bell,
    User as UserIcon,
    Sparkles,
    Shield,
    Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const TABS_CONFIG = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'places', label: 'Monitor', icon: MapPin, requiresAuth: true },
    { id: 'history', label: 'Busca', icon: History },
];

export const DashboardContent = ({ initialData }: { initialData: any }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { user, logout } = useAuthStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { data: currentData } = useSWR('cge-data', getCgeData, {
        refreshInterval: 300000,
        fallbackData: initialData,
    });

    const { data: analyticsData } = useSWR('cge-analytics', getAnalytics, {
        refreshInterval: 3600000,
    });

    const { data: userPlaces } = useSWR(user ? 'auth-places' : null, getPlaces);

    const visibleTabs = useMemo(() =>
        TABS_CONFIG.filter(tab => !tab.requiresAuth || (user && user.id)),
        [user]);

    useEffect(() => {
        if (!user && activeTab === 'places') {
            setActiveTab('dashboard');
        }
    }, [user, activeTab]);

    useEffect(() => {
        const handleGoogleToken = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            if (token) {
                try {
                    const res = await fetch('http://localhost:3000/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!res.ok) throw new Error('Token validation failed');
                    const userData = await res.json();
                    useAuthStore.getState().setAuth(userData, token);
                    window.history.replaceState({}, document.title, window.location.pathname);
                    toast.success('Login Google realizado!', { description: `Bem-vindo, ${userData.email}` });
                } catch (err) {
                    toast.error('Erro no login social');
                }
            }
        };

        handleGoogleToken();

        if (currentData && user && userPlaces) {
            const monitoredRegions = userPlaces.map((p: any) => p.region.toUpperCase());
            const details = currentData.floodPoints.details || [];

            details.forEach((zone: any) => {
                const zoneName = zone.name.toUpperCase();
                // Check if this zone is being monitored
                if (monitoredRegions.some((region: string) => zoneName.includes(region))) {
                    zone.neighborhoods.forEach((nb: any) => {
                        nb.points.forEach((pt: any) => {
                            // Only notify for active intransitable or transitable points
                            if (pt.statusClass.includes('ativo')) {
                                toast.error(`ALERTA: Alagamento em ${zone.name}`, {
                                    description: `${pt.street} - ${pt.status}`,
                                    duration: 10000,
                                });
                            }
                        });
                    });
                }
            });
        }
    }, [currentData, user, userPlaces]);

    return (
        <main className="min-h-screen bg-background relative overflow-x-hidden page-transition">
            {/* Subtle background overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#1e293b_0%,transparent_50%)]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 mb-32">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Waves className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground tracking-tight">CGE<span className="text-primary">SP</span></h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1 flex items-center gap-2">
                                <Sparkles size={12} className="text-primary" />
                                Monitoramento Operacional
                            </p>
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4 bg-surface px-4 py-2 rounded-2xl border border-border/50">
                                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted overflow-hidden">
                                    {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : <UserIcon size={18} />}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[11px] font-bold text-foreground leading-none">{user.email}</p>
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-wider mt-1">{user.region || 'SP'}</p>
                                </div>
                                <button onClick={logout} className="ml-2 p-2 rounded-xl hover:bg-red-500/10 text-muted hover:text-red-500 transition-all">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsAuthModalOpen(true)} className="h-12 px-8 rounded-xl bg-primary text-white hover:bg-blue-600 transition-all text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                                Conectar
                            </button>
                        )}
                        <button className="w-12 h-12 rounded-xl bg-surface border border-border text-muted hover:text-foreground transition-all flex items-center justify-center relative">
                            <Bell size={20} />
                            {currentData?.floodPoints.active > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />}
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                        {activeTab === 'dashboard' && (
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    <div className="lg:col-span-8 space-y-8">
                                        <WeatherCard data={currentData.forecast} />
                                        <AlertSection data={currentData.floodPoints} />
                                    </div>
                                    <div className="lg:col-span-4">
                                        <NewsSection data={currentData.news} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { label: 'Ocorrências', value: currentData.floodPoints.totalToday, icon: Waves, color: 'text-primary' },
                                        { label: 'Transitáveis', value: currentData.floodPoints.transitable, icon: Map, color: 'text-accent' },
                                        { label: 'Críticos', value: currentData.floodPoints.intransitable, icon: Shield, color: 'text-red-500' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-surface border border-border/50 p-6 rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">{stat.label}</p>
                                                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                            </div>
                                            <stat.icon className={`${stat.color} opacity-20`} size={40} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'places' && user && (
                            <div className="max-w-4xl mx-auto py-8">
                                <div className="text-center mb-10">
                                    <h2 className="text-4xl font-bold text-foreground uppercase tracking-tight">Meus Lugares</h2>
                                    <p className="text-muted text-sm mt-3">Monitore pontos de alagamento em seus locais de interesse.</p>
                                </div>
                                <div className="bg-surface p-6 rounded-3xl border border-border shadow-xl">
                                    <PlaceManagement currentRisks={currentData?.floodPoints.details} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-10 py-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-foreground tracking-tight">Busca Histórica</h2>
                                    <p className="text-muted text-sm mt-2">Pesquise registros retroativos por data específica.</p>
                                </div>
                                <div className="bg-surface p-6 rounded-3xl border border-border shadow-xl">
                                    <FloodSearch />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Dock Navigation */}
            <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-lg">
                <div className="bg-surface/80 backdrop-blur-xl p-2 rounded-2xl border border-border/50 shadow-2xl flex items-center justify-between">
                    {visibleTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:text-foreground'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </main>
    );
};
