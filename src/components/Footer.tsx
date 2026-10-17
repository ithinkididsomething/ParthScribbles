import React from 'react';
import { Gamepad2, Heart, ShieldCheck, Upload, Shield } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';

interface FooterProps {
  onOpenSubmitGame?: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSubmitGame, onOpenAdminLogin }) => {
  const { isAdmin } = useFavourites();

  return (
    <footer className="relative z-10 bg-[#1C1917] text-[#FFFDF9] border-t-4 border-[#292524] mt-20 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EA580C] border-2 border-[#FFFDF9] flex items-center justify-center text-white">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-lg font-marker tracking-wide">PARTHSCRIBBLES</span>
          </div>
          <p className="text-sm font-sketch text-stone-400 leading-relaxed">
            Parth's hand-drawn indie arcade sketchbook celebrating raw creativity, crayon sketches, and unforgettable browser game masterpieces with real-time community reviews and developer curation.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-stone-300 mb-4 font-marker">Featured Games</h4>
          <ul className="space-y-2 text-sm text-stone-400 font-sketch">
            <li><a href="#games-grid" className="hover:text-[#EA580C] transition-colors">GDG Runner</a></li>
            <li><a href="#games-grid" className="hover:text-[#EA580C] transition-colors">Flappy Bird Arcade</a></li>
            <li><a href="#games-grid" className="hover:text-[#EA580C] transition-colors">Punk Rock Doodle Jumper</a></li>
            <li><a href="#games-grid" className="hover:text-[#EA580C] transition-colors">Nebula Vanguard</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-stone-300 mb-4 font-marker">Developers & Creators</h4>
          <ul className="space-y-2 text-sm text-stone-400 font-sketch">
            {onOpenSubmitGame && (
              <li>
                <button
                  onClick={onOpenSubmitGame}
                  className="hover:text-[#EA580C] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Submit Your Game (Open to All)</span>
                </button>
              </li>
            )}
            {onOpenAdminLogin && (
              <li>
                <button
                  onClick={onOpenAdminLogin}
                  className="hover:text-[#EA580C] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAdmin ? 'Admin Moderation Dashboard' : 'Admin Login (psa11@gmail.com)'}</span>
                </button>
              </li>
            )}
            <li>
              <a href="#games-grid" className="hover:text-[#EA580C] transition-colors">
                Explore All Genres
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold tracking-wider uppercase text-stone-300 mb-4 font-marker">Curated Community</h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            Every submission is reviewed by admin before release. Normal gamers can publish their prototypes, and verified developers receive an official verified badge.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Moderation Queue Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-stone-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
        <p className="font-sketch text-stone-400 font-semibold">Created By Parth Saxena</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0 font-sketch">
          Crafted with <Heart className="w-3 h-3 text-[#EA580C] fill-[#EA580C]" /> for indie game artists
        </p>
      </div>
    </footer>
  );
};
