import React from 'react';
import { Heart, ArrowLeft, Gamepad2, Play, Trash2 } from 'lucide-react';
import { Game, Review } from '../types';
import { useFavourites } from '../context/FavouritesContext';

interface FavouritesViewProps {
  games: Game[];
  reviews: Review[];
  onBack: () => void;
  onSelectGame: (game: Game) => void;
  onPlayGame: (game: Game) => void;
}

export const FavouritesView: React.FC<FavouritesViewProps> = ({
  games,
  reviews,
  onBack,
  onSelectGame,
  onPlayGame,
}) => {
  const { favourites, toggleFavourite } = useFavourites();
  const favouriteGames = games.filter(g => favourites.includes(g.id));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      
      <button
        onClick={onBack}
        className="mb-8 px-4 py-2 bg-[#FFFDF9] text-stone-800 text-sm font-bold sketchy-btn hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Arcade Catalogue</span>
      </button>

      {/* Header */}
      <div className="paper-card p-8 bg-[#FFFDF9] mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 border-2 border-stone-800 flex items-center justify-center text-white shadow-[3px_3px_0px_#1C1917]">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-marker text-stone-900">Saved Favourites Cache</h1>
            <p className="text-xs font-sketch text-stone-600 mt-1">
              Stored offline in your browser's localStorage cache ({favouriteGames.length} games saved).
            </p>
          </div>
        </div>
      </div>

      {favouriteGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favouriteGames.map((game) => (
            <div key={game.id} className="paper-card p-5 bg-[#FFFDF9] flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={game.coverUrl}
                  alt={game.title}
                  className="w-20 h-20 rounded-xl border-2 border-stone-800 object-cover shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">{game.genre}</span>
                  <h4
                    onClick={() => onSelectGame(game)}
                    className="text-base font-bold text-stone-900 truncate hover:text-[#EA580C] cursor-pointer"
                  >
                    {game.title}
                  </h4>
                  <p className="text-xs font-sketch text-stone-600 line-clamp-1 mt-1">{game.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => onPlayGame(game)}
                  className="px-4 py-2 bg-[#EA580C] text-white text-xs font-bold sketchy-btn hover:bg-orange-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Play Game</span>
                </button>

                <button
                  onClick={() => toggleFavourite(game.id)}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-stone-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="paper-card p-12 text-center bg-[#FFFDF9] max-w-lg mx-auto">
          <div className="w-16 h-16 bg-rose-100 border-2 border-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-marker text-stone-900 mb-2">No Favourites Cached Yet</h3>
          <p className="text-sm font-sketch text-stone-600 mb-6">
            Click the heart icon on any game card while browsing the catalogue to save it to your offline cache.
          </p>
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-[#EA580C] text-white font-bold text-sm sketchy-btn hover:bg-orange-600 transition-colors cursor-pointer"
          >
            Explore Arcade Games
          </button>
        </div>
      )}

    </div>
  );
};
