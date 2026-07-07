import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Trophy, Star, Gamepad2, Clock, Trash2, Info, Heart, Edit } from 'lucide-react';
import { fetchTopRated, openDeleteModal, closeDeleteModal, deleteGame } from '../store/slices/gamesSlice';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

// ── Helpers ───────────────────────────────────────────────────────────────────

const getSteamImage = (game) => {
  if (game?.headerImage) return game.headerImage;
  const id = game?.steamAppId || game?.appid;
  if (id) return `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`;
  return null;
};

// ── Delete Modal ──────────────────────────────────────────────────────────────

const DeleteModal = ({ game, onConfirm, onCancel, isLoading }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
    >
      <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
        <Trash2 className="w-6 h-6 text-rose-500" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Delete Game?</h3>
      <p className="text-slate-400 text-sm mb-6">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-white">{game?.name}</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

const TopRatedPage = () => {
  const dispatch = useDispatch();
  const { topRated: raw, selectedGame, deleteModalOpen } = useSelector((s) => s.games);
  const topRated = Array.isArray(raw) ? raw : [];
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchTopRated({ limit: 50 }));
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedGame) return;
    setDeleteLoading(true);
    const appid = selectedGame.appid || selectedGame._id;
    await dispatch(deleteGame(appid));
    setDeleteLoading(false);
  };

  // ── Podium (top 3) ──────────────────────────────────────────────────────────

  const podiumOrder = topRated.length >= 3 ? [topRated[1], topRated[0], topRated[2]] : [];
  const podiumRanks = [2, 1, 3];
  const podiumHeights = ['h-52', 'h-72', 'h-44'];
  const podiumRingColors = [
    'ring-slate-400 shadow-slate-400/30',
    'ring-amber-400 shadow-amber-400/40',
    'ring-amber-700 shadow-amber-700/30',
  ];
  const rankBadgeColors = [
    'bg-slate-400 text-slate-900',
    'bg-amber-400 text-slate-900',
    'bg-amber-700 text-white',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            Top Rated Games
          </h1>
          <p className="text-slate-400 mt-1">The highest-rated games in your library, ranked by community score.</p>
        </div>

        {/* Loading skeleton */}
        {topRated.length === 0 && (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-800/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Podium */}
        {podiumOrder.length === 3 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🏆 Top 3 Podium
            </h2>
            <div className="grid grid-cols-3 gap-4 items-end max-w-2xl mx-auto">
              {podiumOrder.map((game, i) => {
                const img = getSteamImage(game);
                return (
                  <motion.div
                    key={game._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                    className={`relative rounded-2xl overflow-hidden ${podiumHeights[i]} ring-2 ${podiumRingColors[i]} shadow-xl`}
                  >
                    {img && (
                      <img src={img} alt={game.name} className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    )}
                    <div className={`${!img ? 'w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center' : ''}`}>
                      {!img && <Gamepad2 className="w-10 h-10 text-slate-600" />}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Rank badge */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2">
                      <div className={`w-9 h-9 rounded-full ${rankBadgeColors[i]} flex items-center justify-center font-black text-base shadow-lg border-2 border-white/20`}>
                        {podiumRanks[i]}
                      </div>
                    </div>

                    {/* Game info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-bold text-sm line-clamp-1 text-center">{game.name}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-amber-400 text-xs font-bold">{game.averageRating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full ranked list */}
        {topRated.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Full Leaderboard
              <span className="text-sm font-medium text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full ml-1">
                {topRated.length} games
              </span>
            </h2>

            <div className="space-y-2">
              {topRated.map((game, i) => {
                const img   = getSteamImage(game);
                const price = game.isFree ? 'Free' : game.price > 0 ? `$${game.price.toFixed(2)}` : 'N/A';
                const isTop3 = i < 3;

                return (
                  <motion.div
                    key={game._id}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.025, 0.5) }}
                    className={`flex items-center gap-4 rounded-2xl p-3 border transition-all group cursor-default ${
                      isTop3
                        ? 'bg-slate-800/80 border-amber-500/20 hover:border-amber-400/40'
                        : 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-800 hover:border-indigo-500/30'
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                      i === 0 ? 'bg-amber-400 text-slate-900' :
                      i === 1 ? 'bg-slate-400 text-slate-900' :
                      i === 2 ? 'bg-amber-700 text-white' :
                      'bg-slate-700/60 text-slate-400'
                    }`}>
                      {i + 1}
                    </div>

                    {/* Thumbnail */}
                    <div className="w-16 h-10 rounded-xl overflow-hidden bg-slate-700 flex-shrink-0">
                      {img ? (
                        <img src={img} alt={game.name} className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gamepad2 className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                    </div>

                    {/* Title + genre */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {game.name}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {game.genre?.[0] || game.genres?.[0] || 'Game'}
                        {game.reviewCount ? ` · ${game.reviewCount.toLocaleString()} reviews` : ''}
                      </p>
                    </div>

                    {/* Rating bar */}
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0 w-28">
                      <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-amber-400 rounded-full h-1.5 transition-all"
                          style={{ width: `${Math.min((game.averageRating / 5) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-amber-400 font-bold text-xs whitespace-nowrap">
                        {game.averageRating?.toFixed(1)}
                      </span>
                    </div>

                    {/* Star (mobile) */}
                    <div className="sm:hidden flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-amber-400 font-bold text-xs">{game.averageRating?.toFixed(1)}</span>
                    </div>

                    {/* Price */}
                    <div className={`text-sm font-bold flex-shrink-0 min-w-[52px] text-right ${game.isFree ? 'text-emerald-400' : 'text-white'}`}>
                      {price}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => dispatch(openDeleteModal(game))}
                      className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <DeleteModal
            game={selectedGame}
            onConfirm={handleDelete}
            onCancel={() => dispatch(closeDeleteModal())}
            isLoading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopRatedPage;
