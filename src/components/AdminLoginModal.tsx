import React, { useState } from 'react';
import { X, Shield, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';
import { playArcadeSound } from '../lib/arcadeAudio';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const { loginAdmin } = useFavourites();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = loginAdmin(email, password);
    if (success) {
      playArcadeSound('score');
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
        onClose();
      }, 700);
    } else {
      setErrorMsg('Nope. Wrong email or password.');
      playArcadeSound('hit');
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('psa11@gmail.com');
    setPassword('psa11');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="paper-card w-full max-w-md bg-[#FFFDF9] p-6 sm:p-8 relative border-3 border-stone-900 shadow-[8px_8px_0px_#1C1917]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 border-2 border-stone-800 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#1C1917] border-2 border-stone-800 flex items-center justify-center text-white shadow-[2px_2px_0px_#EA580C]">
            <Shield className="w-6 h-6 text-[#EA580C]" />
          </div>
          <div>
            <h3 className="text-xl font-marker text-stone-900">Admin</h3>
            <span className="text-xs font-sketch text-stone-600 block">
              The keeper's door
            </span>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-marker text-stone-900">Welcome back</h4>
            <p className="text-xs font-sketch text-stone-600">Opening the desk...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sketch">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border-2 border-rose-600 rounded-xl font-bold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block font-bold uppercase text-stone-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  className="paper-input w-full pl-9 pr-3 py-2.5 text-xs text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="paper-input w-full pl-9 pr-3 py-2.5 text-xs text-stone-900"
                />
              </div>
            </div>

            {/* Quick autofill helper */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="text-[11px] text-[#EA580C] hover:underline font-bold cursor-pointer"
              >
                Autofill
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#1C1917] text-white font-bold text-sm sketchy-btn hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#EA580C]"
              >
                <Shield className="w-4 h-4 text-[#EA580C]" />
                <span>Enter</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
