import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Star, Search, Filter, ThumbsUp, ThumbsDown, MessageSquare,
  ChevronLeft, ChevronRight, Flag, Loader2, AlertCircle, RefreshCw, MoreVertical
} from 'lucide-react';
import { fetchAllReviews, deleteReview, setPagination } from '../store/slices/reviewsSlice';

// ── Sub-components ────────────────────────────────────────────────────────────

const StarDisplay = ({ isPositive }) => (
  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
    isPositive
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
      : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
  }`}>
    {isPositive ? '👍 Positive' : '👎 Negative'}
  </span>
);

const ReviewCard = ({ review, onDelete }) => {
  const user = review.userId;
  const userName = user?.name || 'Anonymous User';
  const userAvatar = user?.avatar || `https://i.pravatar.cc/150?u=${review._id}`;
  const gameTitle = review.gameId?.name || 'Unknown Game';
  const createdAt = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-black/30 transition-shadow group"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={userAvatar}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover bg-gray-200"
            onError={(e) => { e.target.src = `https://i.pravatar.cc/150?u=${review._id}`; }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">{userName}</h4>
              {review.playtimeAtReview > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 rounded-full">
                  {review.playtimeAtReview}h played
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{createdAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => onDelete(review._id)}
            className="p-1.5 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          >
            <Flag className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <StarDisplay isPositive={review.isPositive} />
        {gameTitle !== 'Unknown Game' && (
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg truncate max-w-[180px]">
            {gameTitle}
          </span>
        )}
      </div>

      {review.text && (
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
          {review.text}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
        <span className="text-xs text-gray-400 dark:text-gray-500">Was this helpful?</span>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <ThumbsUp className="w-3.5 h-3.5" /> {review.helpfulVotes ?? 0}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
            <ThumbsDown className="w-3.5 h-3.5" /> {review.funnyVotes ?? 0}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

const Reviews = () => {
  const dispatch = useDispatch();
  const { reviews, total, page, pages, loading, error } = useSelector((s) => s.reviews);

  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('All'); // All | Positive | Negative

  useEffect(() => {
    dispatch(fetchAllReviews({ page, limit: 20 }));
  }, [dispatch, page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(id));
    }
  };

  // Client-side filter for search & sentiment
  const filtered = reviews.filter((r) => {
    const text = (r.text || '').toLowerCase();
    const userName = (r.userId?.name || '').toLowerCase();
    const gameName = (r.gameId?.name || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || text.includes(query) || userName.includes(query) || gameName.includes(query);
    const matchesSentiment =
      sentimentFilter === 'All' ||
      (sentimentFilter === 'Positive' && r.isPositive) ||
      (sentimentFilter === 'Negative' && !r.isPositive);
    return matchesSearch && matchesSentiment;
  });

  const positiveCount = reviews.filter((r) => r.isPositive).length;
  const negativeCount = reviews.filter((r) => !r.isPositive).length;
  const positivePct = reviews.length > 0 ? Math.round((positiveCount / reviews.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-indigo-500" />
            Game Reviews
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {total > 0 ? `${total.toLocaleString()} total reviews from your database` : 'Community reviews across all games.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Reviews', value: loading ? '...' : total.toLocaleString(), icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Positive', value: loading ? '...' : positiveCount, icon: ThumbsUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Negative', value: loading ? '...' : negativeCount, icon: ThumbsDown, color: 'text-rose-500', bg: 'bg-rose-500/10' },
            { label: 'Approval Rate', value: loading ? '...' : `${positivePct}%`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className={`p-3 rounded-xl ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sentiment Bar */}
        {!loading && reviews.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Overall Sentiment</h3>
            <div className="w-full h-4 rounded-full overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${positivePct}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-emerald-500"
              />
              <div className="flex-1 h-full bg-rose-400" />
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium">
              <span className="text-emerald-600 dark:text-emerald-400">{positivePct}% Positive ({positiveCount})</span>
              <span className="text-rose-600 dark:text-rose-400">{100 - positivePct}% Negative ({negativeCount})</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700/40 rounded-2xl text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm flex-1">{error}</span>
            <button
              onClick={() => dispatch(fetchAllReviews({ page, limit: 20 }))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 dark:bg-rose-600/20 hover:bg-rose-200 dark:hover:bg-rose-600/40 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews by user, game, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="All">All Reviews</option>
              <option value="Positive">Positive Only</option>
              <option value="Negative">Negative Only</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map((review) => (
              <ReviewCard key={review._id} review={review} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No reviews match your filter.</p>
            {total === 0 && !loading && (
              <p className="text-sm mt-1">Your database has no reviews yet.</p>
            )}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {pages} — {total.toLocaleString()} total reviews
            </span>
            <nav className="flex items-center gap-2">
              <button
                onClick={() => dispatch(setPagination({ page: page - 1 }))}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => dispatch(setPagination({ page: p }))}
                  className={`min-w-[36px] h-9 rounded-xl text-sm font-bold transition-colors ${
                    page === p
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => dispatch(setPagination({ page: page + 1 }))}
                disabled={page >= pages}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reviews;
