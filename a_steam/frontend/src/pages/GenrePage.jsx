import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Gamepad2, Star, Clock, AlertCircle, RefreshCw, Loader2, Info, Heart, Edit, Trash2 } from 'lucide-react';
import gameService from '../services/gameService';

// ── Constants ─────────────────────────────────────────────────────────────────

const GENRES = [
  'Action', 'Adventure', 'RPG', 'Racing', 'Sports',
  'Horror', 'Strategy', 'Indie', 'Simulation', 'Puzzle',
  'Shooter', 'Platformer', 'Fighting', 'Casual', 'Sandbox'
];

const GENRE_ICONS = {
  Action: '⚔️', Adventure: '🗺️', RPG: '🧙', Racing: '🏎️', Sports: '⚽',
  Horror: '👻', Strategy: '♟️', Indie: '🎮', Simulation: '🏗️', Puzzle: '🧩',
  Shooter: '🎯', Platformer: '🏃', Fighting: '🥊', Casual: '🎲', Sandbox: '🌍',
};

const GENRE_COLORS = {
  Action:     'from-red-700 to-orange-700',
  Adventure:  'from-emerald-700 to-teal-700',
  RPG:        'from-purple-700 to-violet-700',
  Racing:     'from-yellow-600 to-orange-600',
  Sports:     'from-green-600 to-emerald-600',
  Horror:     'from-gray-800 to-gray-950',
  Strategy:   'from-blue-700 to-cyan-700',
  Indie:      'from-pink-600 to-rose-600',
  Simulation: 'from-sky-600 to-blue-600',
  Puzzle:     'from-indigo-600 to-purple-600',
  Shooter:    'from-orange-700 to-red-700',
  Platformer: 'from-lime-600 to-green-600',
  Fighting:   'from-red-800 to-rose-800',
  Casual:     'from-amber-500 to-yellow-500',
  Sandbox:    'from-teal-600 to-cyan-600',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const getSteamImage = (game) => {
  if (game?.headerImage) return game.headerImage;
  const id = game?.steamAppId || game?.appid;
  if (id) return `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`;
  return null;
};

// ── Game Card ─────────────────────────────────────────────────────────────────

const GameCard = ({ game }) => {
  const img   = getSteamImage(game);
  const price = game.isFree ? 'Free' : game.price > 0 ? `$${game.price.toFixed(2)}` : 'N/A';
  const genre = game.genre?.[0] || game.genres?.[0] || 'Game';
  const year  = game.release_year || (game.releaseDate ? new Date(game.releaseDate).getFullYear() : '—');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
    >
      <div className="relative h-44 overflow-hidden bg-slate-900">
        {img ? (
          <img src={img} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling?.classList?.remove('hidden'); }} />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${img ? 'hidden' : ''}`}>
          <Gamepad2 className="w-12 h-12 text-slate-600" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600/90 text-white backdrop-blur-sm border border-indigo-500/50">{genre}</span>
        </div>
        <button className="absolute top-3 right-3 p-2 bg-slate-900/50 hover:bg-rose-500 text-white backdrop-blur-md rounded-xl transition-colors opacity-0 group-hover:opacity-100">
          <Heart className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors mb-1">{game.name}</h3>
        <div className="flex items-center gap-3 mb-2 text-sm">
          <div className="flex items-center text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
            {game.averageRating > 0 ? game.averageRating.toFixed(1) : '—'}
          </div>
          <span className="text-slate-500 text-xs">•</span>
          <div className="text-slate-400 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" /> {year}
          </div>
        </div>
        <p className="text-slate-400 text-xs line-clamp-2 mb-3 flex-1">
          {game.shortDescription || game.description || 'No description available.'}
        </p>
        <div className="mt-auto pt-3 border-t border-slate-700/50 flex items-center justify-between">
          <span className={`text-base font-bold ${game.isFree ? 'text-emerald-400' : 'text-white'}`}>{price}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1">
              <Info className="w-3 h-3" /> Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-slate-800/40 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-700/60" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-700 rounded w-3/4" />
      <div className="h-3 bg-slate-700 rounded w-1/2" />
      <div className="h-3 bg-slate-700 rounded w-full" />
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

const GenrePage = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreGames, setGenreGames]       = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  const loadGenre = async (genre) => {
    if (selectedGenre === genre) return;
    setSelectedGenre(genre);
    setLoading(true);
    setError(null);
    setGenreGames([]);
    try {
      const res   = await gameService.getByGenre(genre, { limit: 20 });
      const inner = res?.data ?? res;
      const games = Array.isArray(inner?.games) ? inner.games
        : Array.isArray(inner?.data)  ? inner.data
        : Array.isArray(inner)        ? inner
        : [];
      setGenreGames(games);
    } catch (e) {
      setError(e.message || 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Tag className="w-8 h-8 text-purple-500" />
            Browse by Genre
          </h1>
          <p className="text-slate-400 mt-1">Explore games by category — click a genre to start browsing.</p>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {GENRES.map((genre, i) => (
            <motion.button
              key={genre}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => loadGenre(genre)}
              className={`relative rounded-2xl p-4 text-left overflow-hidden border-2 transition-all ${
                selectedGenre === genre
                  ? 'border-white/50 ring-2 ring-white/20 shadow-2xl'
                  : 'border-transparent hover:border-white/20'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${GENRE_COLORS[genre] || 'from-slate-700 to-slate-800'}`} />
              {selectedGenre === genre && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
              )}
              <div className="relative z-10">
                <span className="text-3xl mb-2 block">{GENRE_ICONS[genre] || '🎮'}</span>
                <p className="text-white font-bold text-sm leading-tight">{genre}</p>
              </div>
              {selectedGenre === genre && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-slate-900 text-xs font-black">✓</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        {selectedGenre && <div className="border-t border-slate-800" />}

        {/* Results */}
        <AnimatePresence mode="wait">
          {selectedGenre && (
            <motion.div
              key={selectedGenre}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Section header */}
              <div className="flex items-center gap-3">
                <span className="text-3xl">{GENRE_ICONS[selectedGenre]}</span>
                <div>
                  <h2 className="text-2xl font-extrabold text-white">{selectedGenre} Games</h2>
                  {!loading && (
                    <p className="text-slate-400 text-sm mt-0.5">
                      {genreGames.length > 0 ? `${genreGames.length} games found` : 'No games found'}
                    </p>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-900/20 border border-rose-700/40 rounded-2xl text-rose-400">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm">{error}</span>
                  <button
                    onClick={() => loadGenre(selectedGenre)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 rounded-lg text-xs font-medium transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry
                  </button>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* Empty */}
              {!loading && !error && genreGames.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                  <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No {selectedGenre} games in your database</p>
                  <p className="text-sm mt-1">Try a different genre or add games to your library.</p>
                </div>
              )}

              {/* Game grid */}
              {!loading && genreGames.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {genreGames.map((game) => (
                    <GameCard key={game._id} game={game} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompt when nothing selected */}
        {!selectedGenre && (
          <div className="text-center py-16 text-slate-600">
            <Tag className="w-14 h-14 mx-auto mb-3 opacity-20" />
            <p className="font-medium text-slate-500">Select a genre above to browse games</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenrePage;
