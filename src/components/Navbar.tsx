import React, { useState } from 'react';
import { Gamepad2, Heart, Menu, X, Sparkles, BookOpen, Upload, Shield } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';

interface NavbarProps {
  currentView: 'welcome' | 'home' | 'favourites' | 'admin' | 'detail';
  setCurrentView: (view: 'welcome' | 'home' | 'favourites' | 'admin') => void;
  onOpenSubmitGame: () => void;
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenSubmitGame,
  onOpenAdminLogin,
}) => {
  const { favourites, isAdmin, pendingSubmissions } = useFavourites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'welcome' | 'home' | 'favourites' | 'admin') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b-2 border-[#1C1917] px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <button
          onClick={() => handleNavClick('welcome')}
          className="flex items-center gap-3 group text-left whitespace-nowrap shrink-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EA580C] border-2 border-[#1C1917] flex items-center justify-center text-white shadow-[2px_2px_0px_#1C1917] group-hover:rotate-6 transition-transform">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-marker tracking-wide text-[#1C1917]">PARTHSCRIBBLES</span>
            <span className="block text-[10px] font-sketch text-stone-600 tracking-wider">
              HAND-DRAWN INDIE SKETCHBOOK
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-700">
          <button
            onClick={() => handleNavClick('welcome')}
            className={`hover:text-[#EA580C] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              currentView === 'welcome' ? 'text-[#EA580C] underline decoration-wavy decoration-2' : ''
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Welcome Cover</span>
          </button>

          <button
            onClick={() => handleNavClick('home')}
            className={`hover:text-[#EA580C] transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'home' ? 'text-[#EA580C] underline decoration-wavy decoration-2' : ''
            }`}
          >
            Explore Arcade
          </button>

          <button
            onClick={() => {
              handleNavClick('home');
              setTimeout(() => {
                const el = document.getElementById('games-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="hover:text-[#EA580C] transition-colors whitespace-nowrap cursor-pointer"
          >
            Catalogue
          </button>

          <button
            onClick={() => handleNavClick('favourites')}
            className={`hover:text-[#EA580C] transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              currentView === 'favourites' ? 'text-[#EA580C] underline decoration-wavy decoration-2' : ''
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Favourites ({favourites.length})</span>
          </button>
        </nav>

        {/* Action Controls: Submit Game & Admin Login */}
        <div className="flex items-center gap-2.5">
          {/* Submit Game Button */}
          <button
            onClick={onOpenSubmitGame}
            className="px-3.5 py-1.5 bg-[#EA580C] text-white rounded-xl text-xs font-bold font-sketch flex items-center gap-1.5 shadow-[2px_2px_0px_#1C1917] hover:bg-orange-600 transition-colors cursor-pointer"
            title="Submit a game for admin review (Verified & Community devs)"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit Game</span>
          </button>

          {/* Admin Control */}
          {isAdmin ? (
            <button
              onClick={() => handleNavClick('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sketch flex items-center gap-1.5 border-2 border-stone-800 transition-all cursor-pointer shadow-[2px_2px_0px_#1C1917] ${
                currentView === 'admin'
                  ? 'bg-[#1C1917] text-white'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
              }`}
              title="Admin Moderation Portal (psa11@gmail.com)"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Admin</span>
              {pendingSubmissions.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#EA580C] text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingSubmissions.length}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="p-2 bg-[#FFFDF9] hover:bg-stone-100 text-stone-700 rounded-xl border-2 border-stone-800 transition-colors cursor-pointer shadow-[2px_2px_0px_#1C1917]"
              title="Admin Login (psa11@gmail.com)"
            >
              <Shield className="w-4 h-4 text-stone-700" />
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border-2 border-stone-800 bg-[#FFFDF9] text-stone-800 cursor-pointer shadow-[2px_2px_0px_#1C1917]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t-2 border-stone-200 mt-3 flex flex-col gap-2.5 font-semibold text-sm animate-fade-in">
          <button
            onClick={() => handleNavClick('welcome')}
            className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-[#EA580C]" />
            <span>Welcome Cover</span>
          </button>
          <button
            onClick={() => handleNavClick('home')}
            className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800 flex items-center gap-2"
          >
            <Gamepad2 className="w-4 h-4 text-[#EA580C]" />
            <span>Explore Arcade</span>
          </button>
          <button
            onClick={() => {
              handleNavClick('home');
              setTimeout(() => {
                const el = document.getElementById('games-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#EA580C]" />
            <span>Game Catalogue</span>
          </button>
          <button
            onClick={() => handleNavClick('favourites')}
            className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Saved Favourites ({favourites.length})</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSubmitGame();
            }}
            className="text-left px-3 py-2 rounded-lg bg-orange-50 text-[#EA580C] font-bold flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Submit a Game</span>
          </button>
          {isAdmin ? (
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-bold flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Admin Moderation Portal ({pendingSubmissions.length} pending)</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminLogin();
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-600 flex items-center gap-2 text-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Login (psa11@gmail.com)</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
