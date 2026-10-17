import React, { useRef, useState, useEffect } from 'react';
import { Game } from '../types';
import { Sparkles, Gamepad2, ArrowRight, Play, Eraser, Upload, ShieldCheck, Palette, Shield } from 'lucide-react';
import { playArcadeSound } from '../lib/arcadeAudio';
import { resolveCover } from '../lib/covers';

interface WelcomeViewProps {
  games: Game[];
  onEnterArcade: () => void;
  onPlayGame: (game: Game) => void;
  onSelectGame: (game: Game) => void;
  onSubmitGameClick: () => void;
  onOpenAdminLogin: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  games,
  onEnterArcade,
  onPlayGame,
  onSelectGame,
  onSubmitGameClick,
  onOpenAdminLogin,
}) => {
  // Mini interactive scribble pad state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeColor, setActiveColor] = useState('#EA580C');
  const [hasDoodled, setHasDoodled] = useState(false);

  // Initialize doodle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3.5;
  }, []);

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDoodled(true);
    playArcadeSound('scribble');
    draw(e);
  };

  const handleStopDraw = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 3.5;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearDoodle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    setHasDoodled(false);
    playArcadeSound('scribble');
  };

  const crayonColors = [
    { name: 'Crayon Orange', hex: '#EA580C' },
    { name: 'Blue Ink', hex: '#2563EB' },
    { name: 'Punk Magenta', hex: '#DB2777' },
    { name: 'Pine Green', hex: '#16A34A' },
    { name: 'Graphite', hex: '#1C1917' },
  ];

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* Main Sketchbook Notebook Cover Container */}
      <div className="relative bg-[#FFFDF9] border-3 border-[#1C1917] rounded-3xl shadow-[8px_8px_0px_#1C1917] overflow-hidden p-6 sm:p-10 lg:p-14">
        {/* Notebook Spiral Binding Visual along the top */}
        <div className="hidden sm:flex items-center justify-between pb-6 mb-8 border-b-2 border-stone-200">
          <div className="flex items-center gap-2">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="flex items-center">
                <div className="w-3.5 h-6 rounded-full bg-stone-300 border-2 border-stone-800 shadow-[1px_1px_0px_#1C1917]"></div>
                <div className="w-4 h-1 bg-stone-400"></div>
              </div>
            ))}
          </div>
          <span className="text-xs font-sketch font-bold tracking-wider text-stone-500 uppercase">
            SKETCHBOOK NO. 01
          </span>
        </div>

        {/* Hero Section inside Sketchbook */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* Hand-drawn Stamped Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-100 border-2 border-stone-800 text-xs font-bold text-[#EA580C] shadow-[2px_2px_0px_#1C1917] rotate-[-1deg]">
              <Sparkles className="w-4 h-4 text-[#EA580C]" />
              <span>INK · PIXELS · PLAY</span>
            </div>

            {/* Giant Title */}
            <div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-marker tracking-wide text-stone-900 leading-[1.08]">
                ParthScribbles
              </h1>

              {/* Hand-drawn scribble underline */}
              <svg className="w-64 sm:w-80 h-4 mt-1 text-[#EA580C]" viewBox="0 0 300 20" fill="none">
                <path
                  d="M5 12 Q 75 4, 150 14 T 295 10"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>

              <h2 className="text-lg sm:text-xl font-sketch text-stone-800 mt-3 font-bold">
                Small games. Wet ink. Play.
              </h2>
            </div>

            {/* Editorial Description */}
            <p className="text-base sm:text-lg font-sketch text-stone-700 leading-relaxed max-w-xl">
              Play what the margins made. Anyone can add a game — it just has to earn its page.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  playArcadeSound('pageFlip');
                  onEnterArcade();
                }}
                className="px-8 py-4 bg-[#EA580C] text-white font-bold text-lg sketchy-btn hover:bg-orange-700 transition-transform hover:scale-105 flex items-center gap-3 shadow-[4px_4px_0px_#1C1917] cursor-pointer"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Open the book</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  playArcadeSound('scribble');
                  onSubmitGameClick();
                }}
                className="px-6 py-4 bg-[#FFFDF9] text-stone-900 font-bold text-base sketchy-btn hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#1C1917]"
              >
                <Upload className="w-4 h-4 text-[#EA580C]" />
                <span>Add yours</span>
              </button>
            </div>

            {/* Hand-Drawn Notebook Badges as Clickable Login Links */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t-2 border-stone-200">
              {/* Badge 1: Live Games Count */}
              <div className="bg-amber-50/90 p-3 rounded-2xl border-2 border-stone-800 rotate-[-1deg] text-center shadow-[2px_2px_0px_#1C1917] flex flex-col justify-center items-center">
                <span className="block text-2xl font-marker text-[#EA580C]">{games.length}</span>
                <span className="text-[11px] font-sketch text-stone-700 font-bold">Games</span>
              </div>

              {/* Badge 2: Open Dev (Clickable Link to Submit Game) */}
              <button
                type="button"
                onClick={() => {
                  playArcadeSound('scribble');
                  onSubmitGameClick();
                }}
                className="bg-blue-50/90 hover:bg-blue-100 p-3 rounded-2xl border-2 border-stone-800 rotate-[1deg] text-center shadow-[2px_2px_0px_#1C1917] hover:shadow-[4px_4px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-center items-center group"
                title="Submit your game"
              >
                <span className="block text-lg sm:text-2xl font-marker text-blue-700 group-hover:scale-105 transition-transform flex items-center gap-1">
                  <span>Submit</span>
                  <Upload className="w-3.5 h-3.5 text-blue-600 hidden sm:inline" />
                </span>
                <span className="text-[11px] font-sketch text-blue-900 font-bold underline decoration-dotted">
                  Your game ↗
                </span>
              </button>

              {/* Badge 3: Admin Access (Clickable Login Link for psa11@gmail.com) */}
              <button
                type="button"
                onClick={() => {
                  playArcadeSound('score');
                  onOpenAdminLogin();
                }}
                className="bg-emerald-50/90 hover:bg-emerald-100 p-3 rounded-2xl border-2 border-stone-800 rotate-[-1deg] text-center shadow-[2px_2px_0px_#1C1917] hover:shadow-[4px_4px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-center items-center group"
                title="Admin login"
              >
                <span className="block text-lg sm:text-2xl font-marker text-emerald-800 group-hover:scale-105 transition-transform flex items-center gap-1">
                  <span>Keeper</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 hidden sm:inline" />
                </span>
                <span className="text-[11px] font-sketch text-emerald-900 font-bold underline decoration-dotted">
                  Admin login ↗
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Scribble Pad + Quick Game Doodles */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive Crayon Doodle Pad */}
            <div className="bg-[#FFFDF7] border-3 border-stone-800 rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917] relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#EA580C]" />
                  <span className="text-xs font-marker uppercase tracking-wider text-stone-900">
                    Scribble here
                  </span>
                </div>

                {hasDoodled && (
                  <button
                    onClick={clearDoodle}
                    className="text-[10px] font-sketch text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Eraser className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Drawing Canvas */}
              <div className="relative h-44 bg-[#FFFDF9] border-2 border-dashed border-stone-400 rounded-xl overflow-hidden cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleStartDraw}
                  onMouseUp={handleStopDraw}
                  onMouseMove={draw}
                  onTouchStart={handleStartDraw}
                  onTouchEnd={handleStopDraw}
                  onTouchMove={draw}
                  className="w-full h-full touch-none"
                />
                {!hasDoodled && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-stone-400 text-xs font-sketch text-center p-4">
                    <span className="font-marker text-stone-500 mb-1">✍️ Doodle your signature</span>
                    <span>Drag to draw.</span>
                  </div>
                )}
              </div>

              {/* Crayon Color Selector */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-200">
                <span className="text-[11px] font-sketch text-stone-600">Ink:</span>
                <div className="flex items-center gap-2">
                  {crayonColors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => {
                        setActiveColor(c.hex);
                        playArcadeSound('scribble');
                      }}
                      className={`w-6 h-6 rounded-full border-2 border-stone-800 transition-transform cursor-pointer ${
                        activeColor === c.hex
                          ? 'scale-125 ring-2 ring-orange-500 ring-offset-1'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Game Showcase Doodles */}
            <div className="grid grid-cols-2 gap-3">
              {games.slice(0, 4).map((game, idx) => (
                <div
                  key={game.id}
                  onClick={() => {
                    playArcadeSound('pageFlip');
                    onSelectGame(game);
                  }}
                  className={`p-3 bg-[#FFFDF9] border-2 border-stone-800 rounded-2xl hover:-translate-y-1 transition-all cursor-pointer shadow-[3px_3px_0px_#1C1917] group ${
                    idx % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'
                  }`}
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-2 border border-stone-800">
                <img
                  src={resolveCover(game.coverUrl)}
                  alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1 left-1 bg-white/90 px-1.5 py-0.5 rounded text-[9px] font-bold text-stone-800">
                      {game.genre}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#EA580C] truncate font-outfit">
                    {game.title}
                  </h4>
                  <span className="text-[10px] font-sketch text-stone-500 block truncate">
                    {game.developerName ? `By ${game.developerName}` : game.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Ribbon with direct action links */}
      <div className="mt-8 flex items-center justify-between bg-[#FFFDF9] border-2 border-stone-800 rounded-2xl p-4 shadow-[4px_4px_0px_#1C1917] flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 border-2 border-stone-800 flex items-center justify-center text-white">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-marker text-stone-900 block">Made a game?</span>
            <span className="text-[11px] font-sketch text-stone-600 block">
              Send it in. I'll take a look.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playArcadeSound('scribble');
              onSubmitGameClick();
            }}
            className="px-5 py-2.5 bg-[#EA580C] text-white font-bold text-xs sketchy-btn hover:bg-orange-600 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Submit a game</span>
          </button>

          <button
            onClick={() => {
              playArcadeSound('score');
              onOpenAdminLogin();
            }}
            className="px-5 py-2.5 bg-[#1C1917] text-white font-bold text-xs sketchy-btn hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => {
              playArcadeSound('pageFlip');
              onEnterArcade();
            }}
            className="px-4 py-2.5 bg-[#FFFDF9] text-stone-900 font-bold text-xs sketchy-btn hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#EA580C]" />
          </button>
        </div>
      </div>
    </div>
  );
};
