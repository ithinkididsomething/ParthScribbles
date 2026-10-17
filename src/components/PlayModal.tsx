import React, { useState } from 'react';
import { X, ExternalLink, Maximize2, Minimize2, Gamepad2, Volume2, VolumeX, ShieldAlert, Monitor, Sparkles } from 'lucide-react';
import { Game } from '../types';
import { ArcadeCabinetGame } from './ArcadeCabinetGame';

interface PlayModalProps {
  game: Game;
  onClose: () => void;
}

export const PlayModal: React.FC<PlayModalProps> = ({ game, onClose }) => {
  const [playMode, setPlayMode] = useState<'canvas' | 'iframe'>('canvas');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div
        className={`paper-card bg-[#FFFDF9] flex flex-col overflow-hidden transition-all duration-300 w-full ${
          isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-5xl h-[92vh]'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#1C1917] text-[#FFFDF9] px-4 sm:px-6 py-3.5 flex items-center justify-between border-b-2 border-stone-800 shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EA580C] border border-white flex items-center justify-center text-white shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-marker tracking-wide truncate max-w-[180px] sm:max-w-xs">
                {game.title}
              </h3>
              <span className="text-[10px] font-sketch text-stone-400 block -mt-0.5">
                {playMode === 'canvas' ? '🎨 Hand-Drawn Sketch Arcade' : '🌐 External Live Host'}
              </span>
            </div>
          </div>

          {/* Controls & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mode Switcher */}
            <div className="bg-stone-800 p-0.5 rounded-lg border border-stone-700 hidden sm:flex items-center text-xs">
              <button
                onClick={() => setPlayMode('canvas')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  playMode === 'canvas'
                    ? 'bg-[#EA580C] text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sketch Arcade</span>
              </button>
              <button
                onClick={() => {
                  setPlayMode('iframe');
                  setIframeError(false);
                }}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  playMode === 'iframe'
                    ? 'bg-[#EA580C] text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>External App</span>
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors hidden sm:block cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* External New Tab link */}
            <a
              href={game.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#EA580C] text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Launch directly in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Open New Tab</span>
            </a>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer ml-1"
              title="Close Arcade"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative flex-grow bg-stone-900 overflow-hidden flex items-center justify-center">
          {playMode === 'canvas' ? (
            <ArcadeCabinetGame game={game} isMuted={isMuted} />
          ) : !iframeError ? (
            <iframe
              src={game.externalUrl}
              title={game.title}
              className="w-full h-full border-0 bg-[#FFFDF9]"
              onError={() => setIframeError(true)}
              allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope"
            />
          ) : (
            <div className="text-center p-8 max-w-md bg-[#FFFDF9] rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0px_#1C1917] mx-4">
              <ShieldAlert className="w-12 h-12 text-[#EA580C] mx-auto mb-4" />
              <h4 className="text-xl font-marker text-stone-900 mb-2">Direct Embedding Restricted</h4>
              <p className="text-sm font-sketch text-stone-600 mb-6">
                This external server enforces framing security policies. Switch back to our built-in Sketch Arcade or launch directly in a new browser tab!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setPlayMode('canvas')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#EA580C] text-white font-bold text-xs sketchy-btn hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  Play Sketch Arcade
                </button>
                <a
                  href={game.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#1C1917] text-white font-bold text-xs sketchy-btn hover:bg-stone-800 transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch in Tab</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar: Controls Reminder */}
        <div className="bg-[#FFFDF9] px-4 sm:px-6 py-2.5 border-t-2 border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs font-sketch text-stone-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-marker">Controls:</span>
            <span>{game.controls.join(' · ')}</span>
          </div>
          <div className="text-stone-500 hidden sm:block">
            Tip: Press 'P' to pause/resume during play
          </div>
        </div>
      </div>
    </div>
  );
};
