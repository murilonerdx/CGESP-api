import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, MapPin, Loader2, X } from 'lucide-react';
import { login, signup, loginWithGoogle } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        region: 'ZONA SUL',
    });

    const regions = ['CENTRO', 'ZONA NORTE', 'ZONA SUL', 'ZONA LESTE', 'ZONA OESTE'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const data = await login({ email: formData.email, password: formData.password });
                // In a real app, you'd fetch /me here, but for now we'll mock the user from token-sub
                setAuth({ id: 1, email: formData.email, region: 'ZONA SUL' }, data.accessToken);
                toast.success('Bem-vindo de volta!');
            } else {
                await signup(formData);
                toast.success('Conta criada! Faça login agora.');
                setIsLogin(true);
            }
            if (isLogin) onClose();
        } catch (error: any) {
            toast.error(error.message || 'Ocorreu um erro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md glass-panel p-10 rounded-[2.5rem] shadow-4xl overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                                {isLogin ? 'Bem-vindo' : 'Criar Conta'}
                            </h2>
                            <p className="text-sm text-white/40 font-bold tracking-tight">
                                {isLogin ? 'Acesse seu monitoramento pessoal' : 'Monitore sua região em tempo real'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Seu e-mail"
                                        required
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        placeholder="Sua senha"
                                        required
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                {!isLogin && (
                                    <div className="relative group">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <select
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-bold outline-none focus:border-blue-500/50 transition-all appearance-none"
                                            value={formData.region}
                                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        >
                                            {regions.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Entrar' : 'Cadastrar')}
                            </button>
                        </form>

                        <div className="mt-8 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#0f172a] px-4 text-white/20 font-black">Ou continue com</span></div>
                            </div>

                            <button
                                onClick={() => loginWithGoogle()}
                                className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-4 text-sm font-black shadow-xl"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sm font-bold text-white/20 hover:text-white transition-colors"
                            >
                                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
