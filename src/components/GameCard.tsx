import React from 'react';
import { Play, Heart, Star, Sparkles } from 'lucide-react';
import { Game, Review } from '../types';
import { useFavourites } from '../context/FavouritesContext';

interface GameCardProps {
  game: Game;
  reviews: Review[];
  onSelectGame: (game: Game) => void;
  onPlayGame: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  reviews,
  onSelectGame,
  onPlayGame,
}) => {
  const { favourites, toggleFavourite } = useFavourites();
  const isFavourite = favourites.includes(game.id);

  const gameReviews = reviews.filter(r => r.gameId === game.id);
  const avgRating = gameReviews.length > 0
    ? (gameReviews.reduce((acc, r) => acc + r.rating, 0) / gameReviews.length).toFixed(1)
    : '4.8';

  return (
    <div className="paper-card group flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1">
      
      {/* Cover Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200 border-b-2 border-stone-800">
        <img
          src={game.coverUrl}
          alt={game.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Floating Genre Tag */}
        <div className="absolute top-3 left-3 bg-[#FFFDF9]/95 border-2 border-stone-800 px-3 py-1 rounded-lg text-xs font-bold text-stone-900 shadow-[2px_2px_0px_#1C1917]">
          {game.genre}
        </div>

        {/* Favourite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(game.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-xl border-2 border-stone-800 flex items-center justify-center transition-colors shadow-[2px_2px_0px_#1C1917] cursor-pointer ${
            isFavourite ? 'bg-rose-500 text-white' : 'bg-[#FFFDF9] text-stone-700 hover:bg-stone-100'
          }`}
          title={isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
        >
          <Heart className={`w-4 h-4 ${isFavourite ? 'fill-white' : ''}`} />
        </button>

        {/* Quick Play overlay button on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => onPlayGame(game)}
            className="px-4 py-2.5 bg-[#EA580C] text-white font-bold rounded-xl border-2 border-white shadow-[3px_3px_0px_black] hover:bg-orange-600 transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4 bg-[#FFFDF9]">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 font-sketch">
            <span>{game.playCount.toLocaleString()} plays</span>
            <div className="flex items-center gap-1 font-bold text-amber-700">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              <span>{avgRating}</span>
              <span className="text-stone-400 font-normal">({gameReviews.length})</span>
            </div>
          </div>

          <h3
            onClick={() => onSelectGame(game)}
            className="text-lg font-bold text-stone-900 group-hover:text-[#EA580C] transition-colors cursor-pointer line-clamp-1"
          >
            {game.title}
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] font-sketch text-stone-600 mt-0.5">
            <span>By {game.developerName || 'Parth'}</span>
            {game.developerType === 'verified' && (
              <span className="inline-flex items-center gap-0.5 text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200" title="Verified Developer">
                ✓ <span className="text-[9px]">Verified</span>
              </span>
            )}
          </div>

          <p className="text-sm text-stone-600 font-sketch line-clamp-2 mt-1">
            {game.description}
          </p>
        </div>

        {/* Card Actions */}
        <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={() => onSelectGame(game)}
            className="text-xs font-bold text-stone-800 hover:text-[#EA580C] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Details</span>
            <span>→</span>
          </button>

          <button
            onClick={() => onPlayGame(game)}
            className="px-3.5 py-1.5 bg-[#1C1917] text-[#FFFDF9] text-xs font-bold sketchy-btn hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#EA580C]" />
            <span>Play</span>
          </button>
        </div>

      </div>

    </div>
  );
};
