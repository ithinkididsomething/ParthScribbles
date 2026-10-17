import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldCheck, Gamepad2, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';
import { playArcadeSound } from '../lib/arcadeAudio';
import { Game } from '../types';
import { PRESET_COVERS } from '../lib/covers';

interface SubmitGameModalProps {
  onClose: () => void;
}

export const SubmitGameModal: React.FC<SubmitGameModalProps> = ({ onClose }) => {
  const { submitGame } = useFavourites();

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<Game['genre']>('Arcade');
  const [developerName, setDeveloperName] = useState('');
  const [developerType, setDeveloperType] = useState<'verified' | 'community'>('community');
  const [verificationCode, setVerificationCode] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [controls, setControls] = useState('Spacebar: Action, Arrow Keys: Move, P: Pause');
  const [externalUrl, setExternalUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState(PRESET_COVERS[0].url);
  const [customCover, setCustomCover] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !developerName.trim() || !description.trim() || !externalUrl.trim()) {
      setErrorMsg('Please fill in all required fields (Title, Developer Name, Description, and Game URL).');
      return;
    }

    if (!externalUrl.startsWith('http://') && !externalUrl.startsWith('https://')) {
      setErrorMsg('Game URL must be a valid web link starting with https:// or http://');
      return;
    }

    setIsSubmitting(true);

    const controlsList = controls
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const effectiveCover = customCover.trim() || coverUrl;

    const res = await submitGame({
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: title.trim(),
      genre,
      developerName: developerName.trim(),
      developerType,
      description: description.trim(),
      longDescription: longDescription.trim() || description.trim(),
      controls: controlsList.length ? controlsList : ['Click / Tap to Play'],
      externalUrl: externalUrl.trim(),
      coverUrl: effectiveCover,
    });

    setIsSubmitting(false);

    if (res.success) {
      playArcadeSound('score');
      setSubmittedSuccess(true);
    } else {
      setErrorMsg(res.error || 'Failed to submit game. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="paper-card w-full max-w-2xl bg-[#FFFDF9] p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto border-3 border-stone-900 shadow-[8px_8px_0px_#1C1917]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 border-2 border-stone-800 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EA580C] border-2 border-stone-800 flex items-center justify-center text-white shadow-[3px_3px_0px_#1C1917] shrink-0">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-marker text-stone-900">Add your game</h3>
            <span className="text-xs font-sketch text-stone-600 block">
              Anyone can submit. It waits for a keeper's nod.
            </span>
          </div>
        </div>

        {submittedSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-600 text-emerald-600 flex items-center justify-center mx-auto shadow-[3px_3px_0px_#1C1917]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h4 className="text-2xl font-marker text-stone-900">In the queue</h4>
            
            <p className="text-sm font-sketch text-stone-700 max-w-md mx-auto leading-relaxed">
              <strong>"{title}"</strong> is in. Once Parth reads it over, it'll take its page.
            </p>

            <div className="pt-4 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#EA580C] text-white font-bold text-sm sketchy-btn hover:bg-orange-600 transition-colors cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm font-sketch">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border-2 border-rose-600 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Developer Type Selection */}
            <div className="bg-orange-50/80 p-4 rounded-2xl border-2 border-stone-800 space-y-3">
              <label className="block text-xs font-bold uppercase font-marker text-stone-900">
                You are
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeveloperType('community')}
                  className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    developerType === 'community'
                      ? 'bg-white border-stone-900 shadow-[2px_2px_0px_#1C1917]'
                      : 'bg-stone-50 border-stone-300 text-stone-500 hover:bg-white'
                  }`}
                >
                  <span className="block font-bold text-xs text-stone-900">🎮 Hobbyist</span>
                  <span className="text-[11px] text-stone-600 block mt-0.5">
                    Gamers, students, first-timers. No login needed.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeveloperType('verified')}
                  className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    developerType === 'verified'
                      ? 'bg-white border-stone-900 shadow-[2px_2px_0px_#1C1917]'
                      : 'bg-stone-50 border-stone-300 text-stone-500 hover:bg-white'
                  }`}
                >
                  <span className="block font-bold text-xs text-[#EA580C] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Developer</span>
                  </span>
                  <span className="text-[11px] text-stone-600 block mt-0.5">
                    Ask for the blue check.
                  </span>
                </button>
              </div>

              {developerType === 'verified' && (
                <div className="pt-2 border-t border-orange-200">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Proof (optional)
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Portfolio, GitHub, dev token…"
                    className="paper-input w-full p-2 text-xs text-stone-900 bg-white"
                  />
                </div>
              )}
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Super Doodle Quest"
                  className="paper-input w-full p-2.5 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Dev name *
                </label>
                <input
                  type="text"
                  required
                  value={developerName}
                  onChange={(e) => setDeveloperName(e.target.value)}
                  placeholder="Alex Studio"
                  className="paper-input w-full p-2.5 text-xs text-stone-900"
                />
              </div>
            </div>

            {/* Genre and Game URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Genre *
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as Game['genre'])}
                  className="paper-input w-full p-2.5 text-xs font-bold text-stone-800"
                >
                  <option value="Arcade">Arcade</option>
                  <option value="Runner">Runner</option>
                  <option value="Platformer">Platformer</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Puzzle">Puzzle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Game URL *
                </label>
                <input
                  type="url"
                  required
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://mygame.itch.io/play or https://..."
                  className="paper-input w-full p-2.5 text-xs text-stone-900"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Short blurb *
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A high-speed sketchbook runner through notebook margins..."
                className="paper-input w-full p-2.5 text-xs text-stone-900"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Longer pitch
              </label>
              <textarea
                rows={3}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Mechanics, story, what made you build it…"
                className="paper-input w-full p-2.5 text-xs text-stone-900"
              />
            </div>

            {/* Controls */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Controls
              </label>
              <input
                type="text"
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                placeholder="Spacebar: Jump, Arrow Keys: Steer, P: Pause"
                className="paper-input w-full p-2.5 text-xs text-stone-900"
              />
            </div>

            {/* Cover Image Picker */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Cover
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {PRESET_COVERS.map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => {
                      setCoverUrl(preset.url);
                      setCustomCover('');
                    }}
                    className={`p-1 rounded-xl border-2 text-left cursor-pointer overflow-hidden transition-all ${
                      coverUrl === preset.url && !customCover
                        ? 'border-[#EA580C] shadow-[2px_2px_0px_#EA580C]'
                        : 'border-stone-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-14 object-cover rounded-lg" />
                    <span className="text-[10px] font-bold text-stone-800 block truncate mt-1">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={customCover}
                onChange={(e) => setCustomCover(e.target.value)}
                placeholder="Or paste an image URL"
                className="paper-input w-full p-2 text-xs text-stone-900"
              />
            </div>

            {/* Note on Moderation */}
            <div className="p-3 bg-stone-100 border-2 border-stone-800 rounded-xl text-xs text-stone-600 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
              <span>
                <strong>The rule:</strong> every game is read before it goes up. Verified devs skip to the front of the line.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#EA580C] text-white font-bold text-sm sketchy-btn hover:bg-orange-600 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending…' : 'Submit'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
