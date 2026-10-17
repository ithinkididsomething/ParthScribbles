import React, { useState, useMemo } from 'react';
import { Search, Filter, Gamepad2 } from 'lucide-react';
import { Game, Review } from '../types';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: Game[];
  reviews: Review[];
  onSelectGame: (game: Game) => void;
  onPlayGame: (game: Game) => void;
}

type GenreFilter = 'All' | 'Arcade' | 'Runner' | 'Platformer' | 'Sci-Fi';
type SortOption = 'popular' | 'rating' | 'newest';

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  reviews,
  onSelectGame,
  onPlayGame,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        const matchesSearch =
          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.genre.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === 'All' || game.genre === selectedGenre;
        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.playCount - a.playCount;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // Rating sort
        const aReviews = reviews.filter(r => r.gameId === a.id);
        const bReviews = reviews.filter(r => r.gameId === b.id);
        const aRating = aReviews.length ? aReviews.reduce((sum, r) => sum + r.rating, 0) / aReviews.length : 0;
        const bRating = bReviews.length ? bReviews.reduce((sum, r) => sum + r.rating, 0) / bReviews.length : 0;
        return bRating - aRating;
      });
  }, [games, reviews, searchQuery, selectedGenre, sortBy]);

  const genres: GenreFilter[] = ['All', 'Arcade', 'Runner', 'Platformer', 'Sci-Fi'];

  return (
    <section id="games-grid" className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 pb-6 border-b-2 border-stone-800">
        <div>
          <span className="text-xs font-marker tracking-widest text-[#EA580C] uppercase">SKETCHBOOK CATALOGUE</span>
          <h2 className="text-3xl font-marker text-stone-900 mt-1">Explore Indie Arcade Games</h2>
          <p className="text-sm font-sketch text-stone-600 mt-1">
            Browse hand-drawn arcade classics, platformers, and space odysseys.
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-stone-700 whitespace-nowrap">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="paper-input px-3 py-2 text-xs font-bold text-stone-800 cursor-pointer"
          >
            <option value="popular">Most Played</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 mb-10">
        
        {/* Search Bar */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            placeholder="Search games by title, genre, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="paper-input w-full pl-11 pr-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 font-sketch"
          />
        </div>

        {/* Genre Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-stone-600 mr-1" />
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 text-xs font-bold sketchy-btn transition-colors cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-[#1C1917] text-[#FFFDF9] shadow-[2px_2px_0px_#EA580C]'
                  : 'bg-[#FFFDF9] text-stone-800 hover:bg-stone-100'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

      </div>

      {/* Games Grid or Empty State */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              reviews={reviews}
              onSelectGame={onSelectGame}
              onPlayGame={onPlayGame}
            />
          ))}
        </div>
      ) : (
        <div className="paper-card p-12 text-center max-w-lg mx-auto bg-[#FFFDF9]">
          <div className="w-16 h-16 bg-amber-100 border-2 border-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#EA580C]">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-marker text-stone-900 mb-2">No Sketchbook Games Found</h3>
          <p className="text-sm font-sketch text-stone-600 mb-6">
            We couldn't find any games matching "{searchQuery}" under genre "{selectedGenre}". Try adjusting your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('All');
            }}
            className="px-5 py-2.5 bg-[#EA580C] text-white font-bold text-sm sketchy-btn hover:bg-orange-600 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

    </section>
  );
};
