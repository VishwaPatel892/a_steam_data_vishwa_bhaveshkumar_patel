import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/reviewService';
import { toast } from './uiSlice';

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchReviewsByGame = createAsyncThunk(
  'reviews/fetchReviewsByGame',
  async ({ gameId, params }, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviewsByGame(gameId, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllReviews = createAsyncThunk(
  'reviews/fetchAllReviews',
  async (params, { rejectWithValue }) => {
    try {
      // Use a wildcard game fetch to get all reviews — backend supports /reviews/game/:gameId
      // For a global admin view we fetch via the games reviews endpoint with no filter
      const response = await reviewService.getReviewsByGame('all', params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await reviewService.deleteReview(id);
      dispatch(toast.success('Review deleted successfully'));
      return id;
    } catch (error) {
      dispatch(toast.error(error.message || 'Failed to delete review'));
      return rejectWithValue(error.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  reviews: [],
  total: 0,
  page: 1,
  pages: 0,
  loading: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setPagination: (state, action) => {
      if (action.payload.page !== undefined) state.page = action.payload.page;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByGame.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const inner = payload?.data ?? payload;
        state.reviews = Array.isArray(inner?.reviews) ? inner.reviews
          : Array.isArray(inner?.data) ? inner.data
          : Array.isArray(inner) ? inner
          : [];
        state.total = inner?.total ?? payload?.total ?? 0;
        state.pages = inner?.pages ?? payload?.pages ?? 0;
      })
      .addCase(fetchReviewsByGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const inner = payload?.data ?? payload;
        state.reviews = Array.isArray(inner?.reviews) ? inner.reviews
          : Array.isArray(inner?.data) ? inner.data
          : Array.isArray(inner) ? inner
          : [];
        state.total = inner?.total ?? payload?.total ?? 0;
        state.pages = inner?.pages ?? payload?.pages ?? 0;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      });
  },
});

export const { setPagination } = reviewsSlice.actions;

export default reviewsSlice.reducer;
