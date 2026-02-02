'use client';

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getPlaces, addPlace, removePlace, updatePlace } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, Calendar, MapPin, Plus, Trash2, Navigation, Sparkles, Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const REGIONS = [
    'ZONA SUL', 'ZONA LESTE', 'ZONA OESTE', 'ZONA NORTE', 'CENTRO',
    'MARGINAL PINHEIROS', 'MARGINAL TIETE'
];

const TYPES = [
    { id: 'CASA', icon: Home, label: 'Casa' },
    { id: 'TRABALHO', icon: Briefcase, label: 'Trabalho' },
    { id: 'EVENTO', icon: Calendar, label: 'Evento' },
    { id: 'OUTRO', icon: MapPin, label: 'Outro' },
];

export const PlaceManagement = ({ currentRisks }: { currentRisks?: any[] }) => {
    const { data: places, error } = useSWR('auth-places', getPlaces);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [type, setType] = useState('CASA');
    const [region, setRegion] = useState(REGIONS[0]);

    const handleAdd = async () => {
        if (!name) return toast.error('Nome é obrigatório');
        try {
            await addPlace({ name, type, region });
            mutate('auth-places');
            resetForm();
            toast.success('Lugar adicionado!');
        } catch (err) {
            toast.error('Erro ao adicionar lugar');
        }
    };

    const handleUpdate = async (id: number) => {
        if (!name) return toast.error('Nome é obrigatório');
        try {
            await updatePlace(id, { name, type, region });
            mutate('auth-places');
            resetForm();
            toast.success('Lugar atualizado!');
        } catch (err) {
            toast.error('Erro ao atualizar lugar');
        }
    };

    const handleRemove = async (id: number) => {
        try {
            await removePlace(id);
            mutate('auth-places');
            toast.success('Lugar removido');
        } catch (err) {
            toast.error('Erro ao remover lugar');
        }
    };

    const startEdit = (place: any) => {
        setEditingId(place.id);
        setName(place.name);
        setType(place.type);
        setRegion(place.region);
        setIsAdding(false);
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setName('');
        setType('CASA');
        setRegion(REGIONS[0]);
    };

    if (error) return <div className="text-muted py-20 text-center font-bold uppercase tracking-widest text-xs">Erro ao carregar locais.</div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
                <div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight uppercase">Locais Monitorados</h3>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Gestão de zonas de interesse pessoal</p>
                </div>
                {!isAdding && !editingId && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="h-12 px-8 rounded-xl bg-primary text-white hover:bg-blue-600 transition-all flex items-center gap-3 shadow-lg shadow-primary/20 text-[11px] font-bold uppercase tracking-wider"
                    >
                        <Plus size={16} />
                        <span>Novo Local</span>
                    </button>
                )}
            </div>

            <AnimatePresence>
                {(isAdding || editingId) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-background border border-primary/20 rounded-2xl p-6 md:p-8 space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Nome do Local</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Minha Casa"
                                    className="w-full h-12 bg-surface border border-border rounded-xl px-4 text-foreground text-sm font-medium focus:border-primary transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Categoria</label>
                                <div className="flex gap-2">
                                    {TYPES.map((t) => {
                                        const Icon = t.icon;
                                        const isActive = type === t.id;
                                        return (
                                            <button
                                                key={t.id}
                                                onClick={() => setType(t.id)}
                                                className={`flex-1 h-12 rounded-xl border transition-all flex items-center justify-center ${isActive ? 'bg-primary border-primary text-white' : 'bg-surface border-border text-muted hover:border-border/80'
                                                    }`}
                                            >
                                                <Icon size={18} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Região CGE</label>
                                <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="w-full h-12 bg-surface border border-border rounded-xl px-4 text-foreground text-xs font-bold focus:border-primary transition-all outline-none cursor-pointer"
                                >
                                    {REGIONS.map(r => <option key={r} value={r} className="bg-surface">{r}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-end">
                            <button onClick={resetForm} className="h-12 px-6 rounded-xl text-[10px] font-bold text-muted uppercase tracking-widest hover:text-foreground transition-all">Cancelar</button>
                            <button
                                onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                                className="h-12 px-8 rounded-xl bg-primary text-white hover:bg-blue-600 transition-all text-[10px] font-bold uppercase tracking-widest"
                            >
                                {editingId ? 'Atualizar' : 'Salvar'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places?.map((place: any) => {
                    const typeInfo = TYPES.find(t => t.id === place.type) || TYPES[3];
                    const Icon = typeInfo.icon;

                    // Check for active risks in this region
                    const regionalRisks = currentRisks?.find(z => z.name.toUpperCase().includes(place.region.toUpperCase()));
                    const activePoints = regionalRisks?.neighborhoods.reduce((acc: number, n: any) => acc + n.points.length, 0) || 0;

                    return (
                        <div key={place.id} className={`bg-background border ${activePoints > 0 ? 'border-red-500/50' : 'border-border'} hover:border-primary/30 p-6 rounded-3xl group transition-all relative`}>
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => startEdit(place)}
                                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleRemove(place.id)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className={`w-14 h-14 rounded-2xl ${activePoints > 0 ? 'bg-red-500/10 text-red-500' : 'bg-surface text-primary'} border border-border flex items-center justify-center transition-transform`}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1 min-w-0 pr-12">
                                    <h4 className="text-lg font-bold text-foreground leading-tight mb-1 break-words">
                                        {place.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-muted">
                                        <Navigation size={12} className="text-primary/50" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] truncate">{place.region}</span>
                                    </div>
                                </div>
                            </div>

                            {activePoints > 0 ? (
                                <div className="mt-6 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                    <div className="flex items-center gap-2 text-red-500 mb-2">
                                        <AlertTriangle size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Risco Detectado</span>
                                    </div>
                                    <div className="space-y-1">
                                        {regionalRisks?.neighborhoods.slice(0, 2).map((n: any, i: number) => (
                                            <p key={i} className="text-[10px] text-foreground/80 font-medium">
                                                • {n.name}: {n.points.length} ponto(s)
                                            </p>
                                        ))}
                                        {regionalRisks?.neighborhoods.length > 2 && (
                                            <p className="text-[9px] text-muted font-bold italic">+{regionalRisks.neighborhoods.length - 2} bairros afetados</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        Seguro no momento
                                    </div>
                                    <Sparkles size={14} className="text-primary/20" />
                                </div>
                            )}
                        </div>
                    );
                })}

                {(!places || places.length === 0) && !isAdding && (
                    <div className="col-span-full py-20 text-center bg-surface/30 rounded-3xl border border-dashed border-border flex flex-col items-center">
                        <MapPin size={48} className="text-muted/20 mb-6" />
                        <h4 className="text-xl font-bold text-muted uppercase tracking-tight mb-2">Sem locais salvos</h4>
                        <p className="text-xs text-muted/60 uppercase tracking-widest mb-8">Adicione locais para alertas personalizados.</p>
                        <button onClick={() => setIsAdding(true)} className="h-12 px-8 rounded-xl bg-primary text-white hover:bg-blue-600 transition-all text-[11px] font-bold uppercase tracking-widest">Começar Agora</button>
                    </div>
                )}
            </div>
        </div>
    );
};
