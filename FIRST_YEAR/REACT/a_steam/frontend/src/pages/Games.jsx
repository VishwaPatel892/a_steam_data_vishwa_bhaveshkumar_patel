import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2, Search, Filter, Plus, Star, Heart, Edit, Trash2,
  ChevronLeft, ChevronRight, Flame, Clock, Monitor, Smartphone,
  Award, Play, Info, Loader2, AlertCircle, RefreshCw, DollarSign
} from 'lucide-react';
import {
  fetchGames, fetchTopRated, fetchNewest, deleteGame,
  setSearch, setSort, setGenreFilter, setPagination, openDeleteModal, closeDeleteModal,
} from '../store/slices/gamesSlice';

// ── Helpers ──────────────────────────────────────────────────────────────────

const GENRES = ['All', 'Action', 'Adventure', 'RPG', 'Racing', 'Sports', 'Horror', 'Strategy', 'Indie'];
const SORT_OPTIONS = [
  { label: 'Newest',       value: '-createdAt' },
  { label: 'Most Popular', value: '-reviewCount' },
  { label: 'Top Rated',    value: '-averageRating' },
  { label: 'Price: Low',   value: 'price' },
  { label: 'Price: High',  value: '-price' },
];

/**
 * Steam CDN header image URL. Falls back to capsule then to null.
 * Format: https://cdn.akamai.steamstatic.com/steam/apps/{appid}/header.jpg
 */
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

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex items-start justify-between hover:bg-slate-800 transition-colors">
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const GameCard = ({ game, onDelete, isAdmin }) => {
  const price = game.isFree ? 'Free' : game.price > 0 ? `$${game.price.toFixed(2)}` : 'N/A';
  const genre = game.genre?.[0] || game.genres?.[0] || 'Game';
  const releaseYear = game.release_year || (game.releaseDate ? new Date(game.releaseDate).getFullYear() : '—');

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-900">
        <img
          src={getSteamImage(game) || `https://placehold.co/460x215/1e293b/a5b4fc?text=${encodeURIComponent(game.name)}`}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/460x215/1e293b/a5b4fc?text=${encodeURIComponent(game.name)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />

        {/* Genre badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600/90 text-white backdrop-blur-sm border border-indigo-500/50">
            {genre}
          </span>
        </div>

        <button className="absolute top-3 right-3 p-2 bg-slate-900/50 hover:bg-rose-500 text-white backdrop-blur-md rounded-xl transition-colors opacity-0 group-hover:opacity-100">
          <Heart className="w-4 h-4" />
        </button>

        {/* Platform icons */}
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
            {isAdmin && (
              <>
                <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(game)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1">
              <Info className="w-3 h-3" /> Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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

const Games = () => {
  const dispatch = useDispatch();
  const {
    games: rawGames, topRated: rawTopRated, newest: rawNewest,
    total, page, pages, loading, error,
    search, sort, genreFilter, selectedGame, deleteModalOpen,
  } = useSelector((state) => state.games);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  // Safety: always ensure these are arrays regardless of API shape
  const games    = Array.isArray(rawGames)    ? rawGames    : [];
  const topRated = Array.isArray(rawTopRated) ? rawTopRated : [];
  const newest   = Array.isArray(rawNewest)   ? rawNewest   : [];


  const [deleteLoading, setDeleteLoading] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Build query params from slice state
  const buildParams = useCallback(() => ({
    page,
    sort,
    ...(search && { search }),
    ...(genreFilter && genreFilter !== 'All' && { genre: genreFilter }),
  }), [page, sort, search, genreFilter]);

  // Fetch main list
  useEffect(() => {
    dispatch(fetchGames(buildParams()));
  }, [dispatch, buildParams]);

  // Fetch featured sections once
  useEffect(() => {
    dispatch(fetchTopRated({ limit: 5 }));
    dispatch(fetchNewest({ limit: 8 }));
  }, [dispatch]);

  // Auto-advance featured carousel
  const featured = topRated.slice(0, 3);
  useEffect(() => {
    if (featured.length === 0) return;
    const t = setInterval(() => setFeaturedIndex((i) => (i + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [featured.length]);

  const handleDelete = async () => {
    if (!selectedGame) return;
    setDeleteLoading(true);
    const appid = selectedGame.appid || selectedGame._id;
    await dispatch(deleteGame(appid));
    setDeleteLoading(false);
  };

  const handleSearchChange = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const currentFeatured = featured[featuredIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-indigo-500" />
              Game Library
            </h1>
            <p className="text-slate-400 mt-1">
              {total > 0 ? `${total.toLocaleString()} games in your database` : 'Manage your game collection'}
            </p>
          </div>
          {isAdmin && (
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 text-sm font-bold transition-all w-full md:w-auto justify-center">
              <Plus className="w-4 h-4" />
              Add New Game
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Games" value={total > 0 ? total.toLocaleString() : '—'} icon={Gamepad2} />
          <StatCard title="Avg. Rating" value={topRated[0] ? `${topRated[0].averageRating?.toFixed(1)}/5` : '—'} icon={Award} />
          <StatCard title="Free to Play" value={games.filter(g => g.isFree).length} icon={DollarSign} />
          <StatCard title="Top Rated" value={topRated.length > 0 ? `${topRated[0]?.averageRating?.toFixed(1)} ⭐` : '—'} icon={Flame} />
        </div>

        {/* Featured Carousel */}
        {featured.length > 0 && (
          <div className="relative w-full h-[380px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-900/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={getSteamImage(currentFeatured) || `https://placehold.co/800x400/1e293b/a5b4fc?text=${encodeURIComponent(currentFeatured?.name || 'Game')}`}
                  alt={currentFeatured?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = `https://placehold.co/800x400/1e293b/a5b4fc?text=${encodeURIComponent(currentFeatured?.name || 'Game')}`; 
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-2xl">
                  <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 w-fit mb-4">
                    ⭐ Top Rated
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight line-clamp-2">
                    {currentFeatured?.name}
                  </h2>
                  <p className="text-slate-300 mb-6 line-clamp-2 text-sm">
                    {currentFeatured?.shortDescription || currentFeatured?.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm">
                      <Play className="w-4 h-4 fill-slate-900" /> View Game
                    </button>
                    <button className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl font-bold backdrop-blur-md border border-slate-600 transition-colors flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4" /> Wishlist
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel dots */}
            {featured.length > 1 && (
              <div className="absolute bottom-5 right-6 flex gap-2">
                {featured.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFeaturedIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${featuredIndex === idx ? 'bg-indigo-500 w-7' : 'bg-slate-600 w-2.5 hover:bg-slate-400'}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sticky top-4 z-20 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search games..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Genre pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => dispatch(setGenreFilter(g))}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    genreFilter === g || (g === 'All' && !genreFilter)
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

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-900/20 border border-rose-700/40 rounded-2xl text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{error}</span>
            <button
              onClick={() => dispatch(fetchGames(buildParams()))}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Newest Section */}
        {newest.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" /> Recently Added
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {newest.slice(0, 4).map((game) => (
                <GameCard key={game._id} game={game} onDelete={(g) => dispatch(openDeleteModal(g))} isAdmin={isAdmin} />
              ))}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-emerald-400" /> All Games
              {!loading && (
                <span className="text-sm font-medium text-slate-500 ml-1 bg-slate-800 px-2 py-0.5 rounded-full">
                  {total.toLocaleString()} results
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-slate-800/40 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-slate-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-700 rounded w-1/2" />
                    <div className="h-3 bg-slate-700 rounded w-full" />
                  </div>
                </div>
              ))}
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
                <GameCard key={game._id} game={game} onDelete={(g) => dispatch(openDeleteModal(g))} isAdmin={isAdmin} />
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
