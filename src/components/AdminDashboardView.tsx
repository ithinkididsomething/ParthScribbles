import React, { useState } from 'react';
import { useFavourites } from '../context/FavouritesContext';
import { Game } from '../types';
import { Shield, CheckCircle, XCircle, ExternalLink, Play, ArrowLeft, LogOut, Clock, Award, Filter, Sparkles, RefreshCw } from 'lucide-react';
import { playArcadeSound } from '../lib/arcadeAudio';
import { resolveCover } from '../lib/covers';

interface AdminDashboardViewProps {
  onBack: () => void;
  onPlayGame: (game: Game) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onBack, onPlayGame }) => {
  const {
    allSubmissions,
    pendingSubmissions,
    games,
    approveGame,
    rejectGame,
    toggleVerification,
    adminEmail,
    logoutAdmin,
  } = useFavourites();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (gameId: string) => {
    setProcessingId(gameId);
    playArcadeSound('score');
    await approveGame(gameId);
    setProcessingId(null);
  };

  const handleReject = async (gameId: string) => {
    setProcessingId(gameId);
    playArcadeSound('hit');
    await rejectGame(gameId);
    setProcessingId(null);
  };

  const handleToggleVerify = async (gameId: string, currentType?: 'verified' | 'community') => {
    setProcessingId(gameId);
    playArcadeSound('bounce');
    await toggleVerification(gameId, currentType);
    setProcessingId(null);
  };

  const displayedList =
    activeTab === 'pending'
      ? pendingSubmissions
      : activeTab === 'approved'
      ? allSubmissions.filter((g) => g.status === 'approved')
      : allSubmissions;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 animate-fade-in text-stone-900">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-stone-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-[#FFFDF9] hover:bg-stone-100 rounded-xl border-2 border-stone-800 transition-colors cursor-pointer shadow-[2px_2px_0px_#1C1917]"
            title="Return to Arcade"
          >
            <ArrowLeft className="w-4 h-4 text-stone-800" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-marker tracking-wide">The desk</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-800 text-[10px] font-bold text-emerald-800 uppercase">
                Keeper
              </span>
            </div>
            <span className="text-xs font-sketch text-stone-600 block mt-0.5">
              Logged in as <strong className="font-mono text-stone-900">{adminEmail || 'psa11@gmail.com'}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              logoutAdmin();
              onBack();
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-stone-800 rounded-xl text-xs font-bold font-sketch flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#1C1917]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="paper-card p-5 bg-[#FFFDF9] flex items-center justify-between">
          <div>
            <span className="text-xs font-sketch text-stone-500 uppercase block font-bold">In the queue</span>
            <span className="text-3xl font-marker text-[#EA580C] mt-1 block">
              {pendingSubmissions.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-orange-100 border-2 border-stone-800 flex items-center justify-center text-[#EA580C]">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="paper-card p-5 bg-[#FFFDF9] flex items-center justify-between">
          <div>
            <span className="text-xs font-sketch text-stone-500 uppercase block font-bold">Live</span>
            <span className="text-3xl font-marker text-emerald-700 mt-1 block">
              {games.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 border-2 border-stone-800 flex items-center justify-center text-emerald-700">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="paper-card p-5 bg-[#FFFDF9] flex items-center justify-between">
          <div>
            <span className="text-xs font-sketch text-stone-500 uppercase block font-bold">Submitted</span>
            <span className="text-3xl font-marker text-blue-700 mt-1 block">
              {allSubmissions.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-100 border-2 border-stone-800 flex items-center justify-center text-blue-700">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Queue Filter Tabs */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-xs font-bold sketchy-btn transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-[#1C1917] text-[#FFFDF9] shadow-[2px_2px_0px_#EA580C]'
                : 'bg-[#FFFDF9] text-stone-800 hover:bg-stone-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({pendingSubmissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 text-xs font-bold sketchy-btn transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'approved'
                ? 'bg-[#1C1917] text-[#FFFDF9] shadow-[2px_2px_0px_#EA580C]'
                : 'bg-[#FFFDF9] text-stone-800 hover:bg-stone-100'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Approved</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-bold sketchy-btn transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#1C1917] text-[#FFFDF9] shadow-[2px_2px_0px_#EA580C]'
                : 'bg-[#FFFDF9] text-stone-800 hover:bg-stone-100'
            }`}
          >
            All ({allSubmissions.length})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {displayedList.length > 0 ? (
        <div className="space-y-6">
          {displayedList.map((sub) => {
            const isProcessing = processingId === sub.id;
            return (
              <div
                key={sub.id}
                className="paper-card p-6 bg-[#FFFDF9] border-2 border-stone-800 shadow-[4px_4px_0px_#1C1917] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Artwork + Details */}
                <div className="flex items-start gap-5 min-w-0">
                  <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden border-2 border-stone-800 shrink-0 bg-stone-200 shadow-[2px_2px_0px_#1C1917]">
                                      <img
                    src={resolveCover(sub.coverUrl)}
                    alt={sub.title} className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 bg-white/95 px-1.5 py-0.5 rounded text-[9px] font-bold text-stone-800">
                      {sub.genre}
                    </span>
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-lg font-bold text-stone-900 truncate font-outfit">
                        {sub.title}
                      </h4>
                      
                      {/* Status Tag */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          sub.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : sub.status === 'rejected'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {sub.status ? sub.status.toUpperCase() : 'PENDING'}
                      </span>

                      {/* Developer Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                          sub.developerType === 'verified'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                      >
                        {sub.developerType === 'verified' && <Award className="w-3 h-3 text-blue-600" />}
                        <span>{sub.developerType === 'verified' ? 'Verified' : 'Community'}</span>
                      </span>
                    </div>

                    <p className="text-xs font-sketch text-stone-600 line-clamp-2 max-w-xl">
                      {sub.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-sketch text-stone-500 pt-1">
                      <span>Dev: <strong className="text-stone-800">{sub.developerName || 'Anonymous'}</strong></span>
                      <span>·</span>
                      <span>Submitted: {new Date(sub.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <a
                        href={sub.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#EA580C] hover:underline flex items-center gap-1"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-200">
                  {/* Test Play in Arcade */}
                  <button
                    onClick={() => onPlayGame(sub)}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Launch and test"
                  >
                    <Play className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Test</span>
                  </button>

                  {/* Toggle Verification */}
                  <button
                    disabled={isProcessing}
                    onClick={() => handleToggleVerify(sub.id, sub.developerType)}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl border border-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Toggle verified badge"
                  >
                    <Award className="w-3 h-3" />
                    <span>{sub.developerType === 'verified' ? 'Unverify' : 'Verify'}</span>
                  </button>

                  {/* Approve */}
                  {sub.status !== 'approved' && (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleApprove(sub.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold sketchy-btn flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#1C1917]"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {/* Reject */}
                  {sub.status !== 'rejected' && (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleReject(sub.id)}
                      className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-xl border border-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="paper-card p-12 text-center bg-[#FFFDF9]">
          <div className="w-14 h-14 bg-stone-100 border-2 border-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-stone-500">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h4 className="text-xl font-marker text-stone-900 mb-1">All clear</h4>
          <p className="text-xs font-sketch text-stone-600">
            Nothing waiting. New submissions land here live.
          </p>
        </div>
      )}

    </div>
  );
};
