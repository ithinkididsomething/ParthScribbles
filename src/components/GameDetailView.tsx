import React, { useState } from 'react';
import { Play, Heart, Star, ArrowLeft, Send, Sparkles, Gamepad2, ShieldCheck } from 'lucide-react';
import { Game, Review } from '../types';
import { useFavourites } from '../context/FavouritesContext';
import { resolveCover } from '../lib/covers';

interface GameDetailViewProps {
  game: Game;
  reviews: Review[];
  onBack: () => void;
  onPlayGame: (game: Game) => void;
}

export const GameDetailView: React.FC<GameDetailViewProps> = ({
  game,
  reviews,
  onBack,
  onPlayGame,
}) => {
  const { favourites, toggleFavourite, addReview } = useFavourites();
  const isFavourite = favourites.includes(game.id);

  const gameReviews = reviews.filter(r => r.gameId === game.id);
  const avgRating = gameReviews.length > 0
    ? (gameReviews.reduce((acc, r) => acc + r.rating, 0) / gameReviews.length).toFixed(1)
    : '4.8';

  const [ratingInput, setRatingInput] = useState<number>(5);
  const [nameInput, setNameInput] = useState<string>('SketchPlayer');
  const [commentInput, setCommentInput] = useState<string>('');
  const [reviewError, setReviewError] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      setReviewError('Say something first.');
      return;
    }

    setIsSubmitting(true);
    await addReview(game.id, ratingInput, commentInput, nameInput.trim() || 'SketchPlayer');
    setIsSubmitting(false);
    setCommentInput('');
    setReviewError('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-8 px-4 py-2 bg-[#FFFDF9] text-stone-800 text-sm font-bold sketchy-btn hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Hero Header Card */}
      <div className="paper-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-10 mb-12 bg-[#FFFDF9]">
        
        {/* Cover Artwork */}
        <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-stone-800 shadow-[4px_4px_0px_#1C1917]">
          <img
            src={resolveCover(game.coverUrl)}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-[#FFFDF9] border-2 border-stone-800 px-3 py-1 rounded-lg text-xs font-bold text-stone-900 shadow-[2px_2px_0px_#1C1917]">
            {game.genre}
          </div>
        </div>

        {/* Game Details Info */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sketch text-stone-500">{game.playCount.toLocaleString()} total plays</span>
              <div className="flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 border border-amber-300 px-3 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                <span>{avgRating}</span>
                <span className="text-stone-500 font-normal">({gameReviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-marker text-stone-900 mb-1">{game.title}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-sketch text-stone-600">
                Created by <strong className="text-stone-900">{game.developerName || 'Parth Saxena'}</strong>
              </span>
              {game.developerType === 'verified' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  <span>✓ Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center text-[11px] font-sketch text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  Community
                </span>
              )}
            </div>

            <p className="text-base font-sketch text-stone-700 leading-relaxed mb-6">
              {game.longDescription}
            </p>

            {/* Controls Guide */}
            <div className="bg-stone-100 border-2 border-stone-800 rounded-2xl p-4 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 flex items-center gap-1.5 font-marker">
                <Gamepad2 className="w-4 h-4 text-[#EA580C]" />
                <span>Controls</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sketch text-stone-700">
                {game.controls.map((ctrl, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EA580C]"></span>
                    <span>{ctrl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onPlayGame(game)}
              className="px-6 py-3 bg-[#EA580C] text-white font-bold text-base sketchy-btn hover:bg-orange-700 transition-transform hover:scale-105 flex items-center gap-2.5 shadow-[4px_4px_0px_#1C1917] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Play</span>
            </button>

            <button
              onClick={() => toggleFavourite(game.id)}
              className={`px-5 py-3 sketchy-btn font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer ${
                isFavourite
                  ? 'bg-rose-500 text-white border-stone-800'
                  : 'bg-[#FFFDF9] text-stone-800 hover:bg-stone-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavourite ? 'fill-white' : ''}`} />
              <span>{isFavourite ? 'Saved' : 'Save'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Reviews & Ratings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2 border-stone-800">
            <h3 className="text-2xl font-marker text-stone-900">Reviews</h3>
            <span className="text-xs font-sketch text-stone-600">{gameReviews.length}</span>
          </div>

          {gameReviews.length > 0 ? (
            <div className="space-y-4">
              {gameReviews.map((rev) => (
                <div key={rev.id} className="paper-card p-5 bg-[#FFFDF9] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-10 h-10 rounded-full border-2 border-stone-800 object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">{rev.userName}</h4>
                        <span className="text-[10px] font-sketch text-stone-500">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm font-sketch text-stone-700 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="paper-card p-8 text-center bg-[#FFFDF9]">
              <p className="text-sm font-sketch text-stone-600">No reviews yet.</p>
            </div>
          )}
        </div>

        {/* Right Column: Write a Review Form */}
        <div className="lg:col-span-5">
          <div className="paper-card p-6 bg-[#FFFDF9] sticky top-24">
            <h3 className="text-xl font-marker text-stone-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#EA580C]" />
              <span>Drop a review</span>
            </h3>
            <p className="text-xs font-sketch text-stone-600 mb-6">
              Say what it felt like.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 border-2 border-emerald-600 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Inked. Thanks.</span>
                </div>
              )}

              {reviewError && (
                <div className="p-3 bg-rose-50 border-2 border-rose-600 rounded-xl text-xs font-bold text-rose-800">
                  {reviewError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="SketchPlayer"
                  className="paper-input w-full p-2.5 text-sm text-stone-900 font-sketch"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingInput(star)}
                      className="p-1 focus:outline-none cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= ratingInput ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-stone-800">{ratingInput} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Thoughts</label>
                <textarea
                  rows={4}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="What did it feel like?"
                  className="paper-input w-full p-3 text-sm text-stone-900 font-sketch"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#1C1917] text-[#FFFDF9] font-bold text-sm sketchy-btn hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-[#EA580C]" />
                <span>{isSubmitting ? 'Inking...' : 'Post'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
