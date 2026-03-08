import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, Terminal, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/admin');
      } else {
        setError(data.message || 'Identifiants incorrects');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20 mx-auto mb-6">
            <Terminal className="text-accent-primary" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Administration</h1>
          <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Système de contrôle</p>
        </div>

        <form onSubmit={handleLogin} className="glass p-8 rounded-3xl space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-mono text-white/40 uppercase tracking-widest ml-1">Utilisateur</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-accent-primary outline-none transition-colors"
                placeholder="admin"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-white/40 uppercase tracking-widest ml-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-accent-primary outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent-primary text-bg font-bold rounded-xl hover:glow-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></div>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Retour au site
          </button>
        </div>
      </motion.div>
    </div>
  );
};
