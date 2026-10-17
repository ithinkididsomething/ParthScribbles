import React, { useState } from 'react';
import { Sparkles, Gamepad2, Play, Upload, Shield } from 'lucide-react';
import { FavouritesProvider, useFavourites } from './context/FavouritesContext';
import { Game } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GameGrid } from './components/GameGrid';
import { GameDetailView } from './components/GameDetailView';
import { PlayModal } from './components/PlayModal';
import { FavouritesView } from './components/FavouritesView';
import { WelcomeView } from './components/WelcomeView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { SubmitGameModal } from './components/SubmitGameModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SketchbookLiveBackground } from './components/SketchbookLiveBackground';
import heroBanner from './assets/images/arcade_hero_banner_1792188189129.jpg';

function MainApp() {
  const { reviews, games, isAdmin } = useFavourites();
  const [currentView, setCurrentView] = useState<'welcome' | 'home' | 'favourites' | 'admin'>('welcome');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [playingGame, setPlayingGame] = useState<Game | null>(null);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayGame = (game: Game) => {
    setPlayingGame(game);
  };

  const handleEnterArcade = () => {
    setSelectedGame(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminPortal = () => {
    if (isAdmin) {
      setSelectedGame(null);
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowAdminLoginModal(true);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FDFBF7] text-[#1C1917] font-outfit selection:bg-orange-500 selection:text-white">
      {/* Live Animated Sketchbook Background */}
      <SketchbookLiveBackground />

      {/* Top Navbar */}
      <Navbar
        currentView={selectedGame ? 'detail' : currentView}
        setCurrentView={(view) => {
          setSelectedGame(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSubmitGame={() => setShowSubmitModal(true)}
        onOpenAdminLogin={handleOpenAdminPortal}
      />

      {/* Main Content Router */}
      <main className="relative z-10 flex-grow">
        {selectedGame ? (
          <GameDetailView
            game={selectedGame}
            reviews={reviews}
            onBack={() => {
              setSelectedGame(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPlayGame={handlePlayGame}
          />
        ) : currentView === 'admin' ? (
          <AdminDashboardView
            onBack={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPlayGame={handlePlayGame}
          />
        ) : currentView === 'welcome' ? (
          <WelcomeView
            games={games}
            onEnterArcade={handleEnterArcade}
            onPlayGame={handlePlayGame}
            onSelectGame={handleSelectGame}
            onSubmitGameClick={() => setShowSubmitModal(true)}
            onOpenAdminLogin={handleOpenAdminPortal}
          />
        ) : currentView === 'favourites' ? (
          <FavouritesView
            games={games}
            reviews={reviews}
            onBack={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectGame={handleSelectGame}
            onPlayGame={handlePlayGame}
          />
        ) : (
          <>
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-16">
              <div className="paper-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-12 bg-[#FFFDF9] items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100 border-2 border-stone-800 text-xs font-bold text-[#EA580C] shadow-[2px_2px_0px_#1C1917]">
                    <Sparkles className="w-4 h-4" />
                    <span>Hand-Drawn Indie Arcade & Dev Platform</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-marker tracking-wide text-stone-900 leading-tight">
                    Play Indie Arcade Masterpieces in Living Ink.
                  </h1>

                  <p className="text-base sm:text-lg font-sketch text-stone-700 leading-relaxed max-w-xl">
                    Welcome to <strong>ParthScribbles</strong> — an indie games platform where anyone can play, and normal gamers & verified developers can submit their games for admin review.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => {
                        const el = document.getElementById('games-grid');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3.5 bg-[#EA580C] text-white font-bold text-base sketchy-btn hover:bg-orange-700 transition-transform hover:scale-105 flex items-center gap-2.5 shadow-[4px_4px_0px_#1C1917] cursor-pointer"
                    >
                      <Gamepad2 className="w-5 h-5" />
                      <span>Explore Catalogue</span>
                    </button>

                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="px-6 py-3.5 bg-[#FFFDF9] text-stone-900 font-bold text-base sketchy-btn hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#1C1917]"
                    >
                      <Upload className="w-4 h-4 text-[#EA580C]" />
                      <span>Open Dev · Submit Game</span>
                    </button>
                  </div>

                  {/* Interactive Action Badges & Quick Login Links */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t-2 border-stone-200">
                    <div className="bg-amber-50/80 p-3 rounded-2xl border-2 border-stone-800 text-center shadow-[2px_2px_0px_#1C1917] flex flex-col justify-center items-center">
                      <span className="block text-2xl font-marker text-[#EA580C]">
                        {games.length}
                      </span>
                      <span className="text-xs font-sketch text-stone-700 font-bold">Active Games</span>
                    </div>

                    {/* Open Dev Clickable Link */}
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(true)}
                      className="bg-blue-50/80 hover:bg-blue-100 p-3 rounded-2xl border-2 border-stone-800 text-center shadow-[2px_2px_0px_#1C1917] hover:shadow-[3px_3px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-center items-center"
                      title="Open Dev: Click to submit your game"
                    >
                      <span className="block text-xl sm:text-2xl font-marker text-blue-700 flex items-center justify-center gap-1 group-hover:scale-105 transition-transform">
                        <span>Open Dev</span>
                        <Upload className="w-3.5 h-3.5 text-blue-600 hidden sm:inline" />
                      </span>
                      <span className="text-xs font-sketch text-blue-900 font-bold underline decoration-dotted">
                        Submit Game ↗
                      </span>
                    </button>

                    {/* Admin Access Clickable Login Link */}
                    <button
                      type="button"
                      onClick={handleOpenAdminPortal}
                      className="bg-emerald-50/80 hover:bg-emerald-100 p-3 rounded-2xl border-2 border-stone-800 text-center shadow-[2px_2px_0px_#1C1917] hover:shadow-[3px_3px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-center items-center"
                      title="Admin Access: Click to log in (psa11@gmail.com)"
                    >
                      <span className="block text-xl sm:text-2xl font-marker text-emerald-800 flex items-center justify-center gap-1 group-hover:scale-105 transition-transform">
                        <span>Admin Access</span>
                        <Shield className="w-3.5 h-3.5 text-emerald-600 hidden sm:inline" />
                      </span>
                      <span className="text-xs font-sketch text-emerald-900 font-bold underline decoration-dotted">
                        Admin Login ↗
                      </span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden border-3 border-stone-800 shadow-[6px_6px_0px_#1C1917] bg-stone-200 aspect-[16/9] lg:aspect-[4/3]">
                    <img
                      src={heroBanner}
                      alt="ParthScribbles Sketchbook"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                      <div className="text-white">
                        <span className="text-xs font-marker text-amber-300">PARTHSCRIBBLES PLATFORM</span>
                        <h4 className="text-lg font-bold">Community & Verified Devs</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Game Grid Catalogue */}
            <GameGrid
              games={games}
              reviews={reviews}
              onSelectGame={handleSelectGame}
              onPlayGame={handlePlayGame}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenSubmitGame={() => setShowSubmitModal(true)}
        onOpenAdminLogin={handleOpenAdminPortal}
      />

      {/* Play Modal */}
      {playingGame && (
        <PlayModal
          game={playingGame}
          onClose={() => setPlayingGame(null)}
        />
      )}

      {/* Submit Game Modal */}
      {showSubmitModal && (
        <SubmitGameModal
          onClose={() => setShowSubmitModal(false)}
        />
      )}

      {/* Admin Login Modal (psa11@gmail.com / psa11) */}
      {showAdminLoginModal && (
        <AdminLoginModal
          onClose={() => setShowAdminLoginModal(false)}
          onLoginSuccess={() => {
            setSelectedGame(null);
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <FavouritesProvider>
      <MainApp />
    </FavouritesProvider>
  );
}
