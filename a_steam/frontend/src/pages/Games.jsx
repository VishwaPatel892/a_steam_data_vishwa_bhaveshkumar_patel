import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2, Search, Filter, Star, Heart, Edit, Trash2,
  ChevronLeft, ChevronRight, Flame, Clock, Monitor, Smartphone,
  Award, Play, Info, Loader2, AlertCircle, RefreshCw, DollarSign,
  Trophy, LayoutGrid, Tag, ListFilter, TrendingUp, Zap, ChevronDown
} from 'lucide-react';
import {
  fetchGames, fetchTopRated, fetchNewest, deleteGame,
  setSearch, setSort, setGenreFilter, setPagination, openDeleteModal, closeDeleteModal,
} from '../store/slices/gamesSlice';
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
  Action: 'from-red-600 to-orange-600',
  Adventure: 'from-emerald-600 to-teal-600',
  RPG: 'from-purple-600 to-violet-600',
  Racing: 'from-yellow-500 to-orange-500',
  Sports: 'from-green-500 to-emerald-500',
  Horror: 'from-gray-700 to-gray-900',
  Strategy: 'from-blue-600 to-cyan-600',
  Indie: 'from-pink-500 to-rose-500',
  Simulation: 'from-sky-500 to-blue-500',
  Puzzle: 'from-indigo-500 to-purple-500',
  Shooter: 'from-orange-600 to-red-600',
  Platformer: 'from-lime-500 to-green-500',
  Fighting: 'from-red-700 to-rose-700',
  Casual: 'from-amber-400 to-yellow-400',
  Sandbox: 'from-teal-500 to-cyan-500',
};

const SORT_OPTIONS = [
  { label: 'Newest',       value: '-createdAt' },
  { label: 'Most Popular', value: '-reviewCount' },
  { label: 'Top Rated',    value: '-averageRating' },
  { label: 'Price: Low',   value: 'price' },
  { label: 'Price: High',  value: '-price' },
];

const TABS = [
  { id: 'all',      label: 'All Games',  icon: LayoutGrid },
  { id: 'genre',    label: 'By Genre',   icon: Tag },
  { id: 'toprated', label: 'Top Rated',  icon: Trophy },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const getSteamImage = (game) => {
  if (game?.headerImage) return game.headerImage;
  const id = game?.steamAppId || game?.appid;
  if (id) return `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`;
  return null;
};

const PlatformIcons = ({ platforms }) => {
  if (!platforms) return null;
  return (
    <div className="flex items-center gap-1.5">
      {platforms.windows && <Monitor className="w-3.5 h-3.5 text-slate-300" title="Windows" />}
      {platforms.mac && <Monitor className="w-3.5 h-3.5 text-slate-300" title="Mac" />}
      {platforms.linux && <Smartphone className="w-3.5 h-3.5 text-slate-300" title="Linux" />}
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const StatCard = ({ title, value, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    amber:  'bg-amber-500/10 text-amber-400',
    emerald:'bg-emerald-500/10 text-emerald-400',
    rose:   'bg-rose-500/10 text-rose-400',
  };
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex items-start justify-between hover:bg-slate-800 transition-colors cursor-default"
    >
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </motion.div>
  );
};

const GameCard = ({ game, onDelete, rank }) => {
  const price = game.isFree ? 'Free' : game.price > 0 ? `$${game.price.toFixed(2)}` : 'N/A';
  const genre = game.genre?.[0] || game.genres?.[0] || 'Game';
  const releaseYear = game.release_year || (game.releaseDate ? new Date(game.releaseDate).getFullYear() : '—');
  const img = getSteamImage(game);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -6 }}
      className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-900">
        {img ? (
          <img
            src={img}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling?.classList?.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${img ? 'hidden' : ''}`}>
          <Gamepad2 className="w-12 h-12 text-slate-600" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

        {/* Rank badge */}
        {rank && (
          <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-xs font-black text-white shadow-lg">
            {rank}
          </div>
        )}
        {!rank && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600/90 text-white backdrop-blur-sm border border-indigo-500/50">
              {genre}
            </span>
          </div>
        )}

        <button className="absolute top-3 right-3 p-2 bg-slate-900/50 hover:bg-rose-500 text-white backdrop-blur-md rounded-xl transition-colors opacity-0 group-hover:opacity-100">
          <Heart className="w-4 h-4" />
        </button>

        <div className="absolute bottom-3 left-3">
          <PlatformIcons platforms={game.platforms} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors mb-1">
          {game.name}
        </h3>

        <div className="flex items-center gap-3 mb-2 text-sm">
          <div className="flex items-center text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
            {game.averageRating > 0 ? game.averageRating.toFixed(1) : '—'}
          </div>
          <span className="text-slate-500 text-xs">•</span>
          <div className="text-slate-400 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" /> {releaseYear}
          </div>
        </div>

        <p className="text-slate-400 text-xs line-clamp-2 mb-3 flex-1">
          {game.shortDescription || game.description || 'No description available.'}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-slate-700/50 flex items-center justify-between">
          <span className={`text-base font-bold ${game.isFree ? 'text-emerald-400' : 'text-white'}`}>
            {price}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(game)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
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

const SkeletonCard = () => (
  <div className="bg-slate-800/40 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-700/60" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-700 rounded w-3/4" />
      <div className="h-3 bg-slate-700 rounded w-1/2" />
      <div className="h-3 bg-slate-700 rounded w-full" />
      <div className="h-3 bg-slate-700 rounded w-2/3" />
    </div>
  </div>
);

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
        Are you sure you want to delete <span className="font-semibold text-white">{game?.name}</span>? This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors text-sm">
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

// ── Featured Carousel ─────────────────────────────────────────────────────────

const FeaturedCarousel = ({ games }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!games.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % games.length), 5000);
    return () => clearInterval(t);
  }, [games.length]);

  const current = games[idx];
  if (!current) return null;

  return (
    <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-900/20">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {getSteamImage(current) ? (
            <img
              src={getSteamImage(current)}
              alt={current.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center">
              <Gamepad2 className="w-24 h-24 text-slate-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />

          <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-end max-w-2xl">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block mb-3">
                ⭐ Featured — Top Rated
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight line-clamp-2">
                {current.name}
              </h2>
              <p className="text-slate-300 mb-5 line-clamp-2 text-sm md:text-base max-w-lg">
                {current.shortDescription || current.description}
              </p>
              <div className="flex items-center gap-4">
                <button className="px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm shadow-lg">
                  <Play className="w-4 h-4 fill-slate-900" /> View Game
                </button>
                <button className="px-6 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl font-bold backdrop-blur-md border border-slate-600 transition-colors flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4" /> Wishlist
                </button>
                {current.averageRating > 0 && (
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Star className="w-5 h-5 fill-amber-400" />
                    <span className="text-lg">{current.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      {games.length > 1 && (
        <div className="absolute bottom-5 right-6 flex gap-2">
          {games.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? 'bg-white w-7' : 'bg-slate-500 w-2.5 hover:bg-slate-300'}`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      <button
        onClick={() => setIdx((i) => (i - 1 + games.length) % games.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-slate-900/60 hover:bg-slate-800 text-white rounded-xl backdrop-blur-md border border-slate-700 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setIdx((i) => (i + 1) % games.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-900/60 hover:bg-slate-800 text-white rounded-xl backdrop-blur-md border border-slate-700 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// ── Top Rated Tab ─────────────────────────────────────────────────────────────

const TopRatedTab = ({ onDelete }) => {
  const dispatch = useDispatch();
  const { topRated: raw } = useSelector((s) => s.games);
  const topRated = Array.isArray(raw) ? raw : [];

  useEffect(() => {
    dispatch(fetchTopRated({ limit: 20 }));
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* Podium - top 3 */}
      {topRated.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 items-end">
          {[topRated[1], topRated[0], topRated[2]].map((game, i) => {
            const podiumRank = [2, 1, 3][i];
            const heights = ['h-48', 'h-64', 'h-40'];
            const colors = ['bg-slate-400', 'bg-amber-400', 'bg-amber-600'];
            const img = getSteamImage(game);
            return (
              <motion.div
                key={game._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl overflow-hidden ${heights[i]} border-2 ${
                  podiumRank === 1 ? 'border-amber-400 shadow-2xl shadow-amber-500/30' :
                  podiumRank === 2 ? 'border-slate-400' : 'border-amber-700'
                }`}
              >
                {img && <img src={img} alt={game.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                <div className="absolute top-3 left-1/2 -translate-x-1/2">
                  <div className={`w-8 h-8 rounded-full ${colors[i]} flex items-center justify-center text-slate-900 text-sm font-black shadow-lg`}>
                    {podiumRank}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-sm line-clamp-1">{game.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-amber-400 text-xs font-bold">{game.averageRating?.toFixed(1)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Ranked list */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-5">
          <Trophy className="w-5 h-5 text-amber-400" /> Full Top Rated List
        </h2>
        <div className="space-y-3">
          {topRated.map((game, i) => {
            const img = getSteamImage(game);
            const price = game.isFree ? 'Free' : game.price > 0 ? `$${game.price.toFixed(2)}` : 'N/A';
            return (
              <motion.div
                key={game._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/40 rounded-2xl p-3 hover:bg-slate-800 hover:border-indigo-500/30 transition-all group"
              >
                {/* Rank */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                  i === 0 ? 'bg-amber-500 text-white' :
                  i === 1 ? 'bg-slate-400 text-slate-900' :
                  i === 2 ? 'bg-amber-700 text-white' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {i + 1}
                </div>

                {/* Thumbnail */}
                <div className="w-16 h-11 rounded-xl overflow-hidden bg-slate-700 flex-shrink-0">
                  {img ? (
                    <img src={img} alt={game.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">{game.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                    {game.genre?.[0] || game.genres?.[0] || 'Game'} • {game.reviewCount || 0} reviews
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-amber-400 font-bold text-sm">{game.averageRating?.toFixed(1)}</span>
                </div>

                {/* Price */}
                <div className={`text-sm font-bold flex-shrink-0 min-w-[52px] text-right ${game.isFree ? 'text-emerald-400' : 'text-white'}`}>
                  {price}
                </div>

                {/* Action */}
                <button
                  onClick={() => onDelete(game)}
                  className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Genre Tab ─────────────────────────────────────────────────────────────────

const GenreTab = ({ onDelete }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreGames, setGenreGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadGenre = async (genre) => {
    setSelectedGenre(genre);
    setLoading(true);
    setError(null);
    try {
      const res = await gameService.getByGenre(genre, { limit: 12 });
      const inner = res?.data ?? res;
      const games = Array.isArray(inner?.games) ? inner.games
        : Array.isArray(inner?.data) ? inner.data
        : Array.isArray(inner) ? inner : [];
      setGenreGames(games);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Genre grid */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-5">
          <Tag className="w-5 h-5 text-purple-400" /> Browse by Genre
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {GENRES.map((genre) => (
            <motion.button
              key={genre}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => loadGenre(genre)}
              className={`relative rounded-2xl p-4 text-left overflow-hidden border transition-all ${
                selectedGenre === genre
                  ? 'border-white/40 shadow-xl ring-2 ring-white/20'
                  : 'border-transparent hover:border-white/20'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${GENRE_COLORS[genre] || 'from-slate-700 to-slate-800'} opacity-90`} />
              <div className="relative z-10">
                <span className="text-2xl mb-2 block">{GENRE_ICONS[genre] || '🎮'}</span>
                <p className="text-white font-bold text-sm leading-tight">{genre}</p>
              </div>
              {selectedGenre === genre && (
                <motion.div
                  layoutId="genre-selected"
                  className="absolute inset-0 border-2 border-white/50 rounded-2xl"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Genre games */}
      {selectedGenre && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">{GENRE_ICONS[selectedGenre]}</span>
            <h2 className="text-xl font-bold text-white">{selectedGenre} Games</h2>
            {!loading && (
              <span className="text-sm text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                {genreGames.length} shown
              </span>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-900/20 border border-rose-700/40 rounded-2xl text-rose-400 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
              <button onClick={() => loadGenre(selectedGenre)} className="ml-auto text-xs bg-rose-600/20 hover:bg-rose-600/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : genreGames.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Gamepad2 className="w-14 h-14 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No games found for {selectedGenre}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {genreGames.map((game) => (
                <GameCard key={game._id} game={game} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedGenre && (
        <div className="text-center py-12 text-slate-500">
          <Tag className="w-14 h-14 mx-auto mb-3 opacity-20" />
          <p className="font-medium">Select a genre above to browse games</p>
        </div>
      )}
    </div>
  );
};

// ── All Games Tab ─────────────────────────────────────────────────────────────

const AllGamesTab = ({ onDelete }) => {
  const dispatch = useDispatch();
  const {
    games: rawGames, newest: rawNewest, topRated: rawTopRated,
    total, page, pages, loading, error, search, sort, genreFilter,
  } = useSelector((s) => s.games);

  const games    = Array.isArray(rawGames)    ? rawGames    : [];
  const newest   = Array.isArray(rawNewest)   ? rawNewest   : [];
  const topRated = Array.isArray(rawTopRated) ? rawTopRated : [];

  const buildParams = useCallback(() => ({
    page,
    sort,
    ...(search && { search }),
    ...(genreFilter && genreFilter !== 'All' && { genre: genreFilter }),
  }), [page, sort, search, genreFilter]);

  useEffect(() => {
    dispatch(fetchGames(buildParams()));
  }, [dispatch, buildParams]);

  useEffect(() => {
    dispatch(fetchTopRated({ limit: 5 }));
    dispatch(fetchNewest({ limit: 8 }));
  }, [dispatch]);

  return (
    <div className="space-y-10">
      {/* Featured carousel */}
      {topRated.length > 0 && <FeaturedCarousel games={topRated.slice(0, 5)} />}

      {/* Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sticky top-4 z-20 shadow-lg backdrop-blur-md">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Genre pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
            {['All', 'Action', 'Adventure', 'RPG', 'Indie', 'Horror', 'Strategy', 'Racing'].map((g) => (
              <button
                key={g}
                onClick={() => dispatch(setGenreFilter(g === 'All' ? '' : g))}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  (g === 'All' && !genreFilter) || genreFilter === g
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/50'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative shrink-0">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => dispatch(setSort(e.target.value))}
              className="pl-9 pr-8 py-2.5 border border-slate-700 bg-slate-800 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-900/20 border border-rose-700/40 rounded-2xl text-rose-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
          <button onClick={() => dispatch(fetchGames(buildParams()))} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 rounded-lg text-xs font-medium transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Newest Section */}
      {newest.length > 0 && !search && !genreFilter && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" /> Recently Added
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newest.slice(0, 4).map((game) => (
              <GameCard key={game._id} game={game} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-emerald-400" />
            {search ? `Results for "${search}"` : genreFilter ? `${genreFilter} Games` : 'All Games'}
            {!loading && (
              <span className="text-sm font-medium text-slate-500 ml-1 bg-slate-800 px-2 py-0.5 rounded-full">
                {total.toLocaleString()} results
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No games found</p>
            <p className="text-sm mt-1">Try adjusting your search or genre filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game._id} game={game} onDelete={onDelete} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => dispatch(setPagination({ page: page - 1 }))}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => dispatch(setPagination({ page: p }))}
                    className={`min-w-[40px] h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-colors ${
                      page === p
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                        : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              {pages > 5 && <span className="text-slate-500">...</span>}
              <button
                onClick={() => dispatch(setPagination({ page: page + 1 }))}
                disabled={page >= pages}
                className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const Games = () => {
  const dispatch = useDispatch();
  const { topRated: rawTopRated, total } = useSelector((s) => s.games);
  const topRated = Array.isArray(rawTopRated) ? rawTopRated : [];
  const { selectedGame, deleteModalOpen } = useSelector((s) => s.games);

  const [activeTab, setActiveTab] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedGame) return;
    setDeleteLoading(true);
    const appid = selectedGame.appid || selectedGame._id;
    await dispatch(deleteGame(appid));
    setDeleteLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-indigo-500" />
              Game Library
            </h1>
            <p className="text-slate-400 mt-1">
              {total > 0 ? `${total.toLocaleString()} games in your database` : 'Browse your game collection'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Games"  value={total > 0 ? total.toLocaleString() : '—'} icon={Gamepad2}  color="indigo" />
          <StatCard title="Top Rated"    value={topRated[0]?.averageRating ? `${topRated[0].averageRating.toFixed(1)} ⭐` : '—'} icon={Trophy}   color="amber" />
          <StatCard title="Genres"       value={GENRES.length}  icon={Tag}        color="rose" />
          <StatCard title="Trending"     value="This Week"      icon={TrendingUp} color="emerald" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-1 w-fit backdrop-blur-md">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'all'      && <AllGamesTab  onDelete={(g) => dispatch(openDeleteModal(g))} />}
            {activeTab === 'genre'    && <GenreTab     onDelete={(g) => dispatch(openDeleteModal(g))} />}
            {activeTab === 'toprated' && <TopRatedTab  onDelete={(g) => dispatch(openDeleteModal(g))} />}
          </motion.div>
        </AnimatePresence>
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

export default Games;
