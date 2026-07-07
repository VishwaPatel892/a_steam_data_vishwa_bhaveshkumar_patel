import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gameService from '../../services/gameService';
import { toast } from './uiSlice';

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (params, { rejectWithValue }) => {
    try {
      const response = await gameService.getAllGames(params);
      return response; // { games, total, page, limit, pages }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTopRated = createAsyncThunk(
  'games/fetchTopRated',
  async (params, { rejectWithValue }) => {
    try {
      const response = await gameService.getTopRated(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNewest = createAsyncThunk(
  'games/fetchNewest',
  async (params, { rejectWithValue }) => {
    try {
      const response = await gameService.getNewest(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createGame = createAsyncThunk(
  'games/createGame',
  async (gameData, { dispatch, rejectWithValue }) => {
    try {
      const response = await gameService.createGame(gameData);
      dispatch(toast.success('Game added successfully'));
      return response.game;
    } catch (error) {
      dispatch(toast.error(error.message || 'Failed to add game'));
      return rejectWithValue(error.message);
    }
  }
);

export const updateGame = createAsyncThunk(
  'games/updateGame',
  async ({ appid, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await gameService.updateGame(appid, data);
      dispatch(toast.success('Game updated successfully'));
      return response;
    } catch (error) {
      dispatch(toast.error(error.message || 'Failed to update game'));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteGame = createAsyncThunk(
  'games/deleteGame',
  async (appid, { dispatch, rejectWithValue }) => {
    try {
      await gameService.deleteGame(appid);
      dispatch(toast.success('Game deleted successfully'));
      return appid;
    } catch (error) {
      dispatch(toast.error(error.message || 'Failed to delete game'));
      return rejectWithValue(error.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  games: [],
  topRated: [],
  newest: [],
  total: 0,
  page: 1,
  limit: 20,
  pages: 0,
  search: '',
  sort: '-createdAt',
  genreFilter: '',
  loading: false,
  error: null,

  // Modal state
  selectedGame: null,
  deleteModalOpen: false,
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setPagination: (state, action) => {
      if (action.payload.page !== undefined) state.page = action.payload.page;
      if (action.payload.limit !== undefined) state.limit = action.payload.limit;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.page = 1;
    },
    setGenreFilter: (state, action) => {
      state.genreFilter = action.payload;
      state.page = 1;
    },
    openDeleteModal: (state, action) => {
      state.selectedGame = action.payload;
      state.deleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.deleteModalOpen = false;
      state.selectedGame = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchGames
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        // Backend: { success, message, data: { games, total, page, limit, pages } }
        const inner = payload?.data ?? payload;
        state.games = Array.isArray(inner?.games) ? inner.games
          : Array.isArray(inner?.data) ? inner.data
          : Array.isArray(inner) ? inner
          : [];
        state.total = inner?.total ?? payload?.total ?? 0;
        state.pages = inner?.pages ?? payload?.pages ?? 0;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchTopRated
      .addCase(fetchTopRated.fulfilled, (state, action) => {
        const payload = action.payload;
        const inner = payload?.data ?? payload;
        state.topRated = Array.isArray(inner?.games) ? inner.games
          : Array.isArray(inner?.data) ? inner.data
          : Array.isArray(inner) ? inner
          : [];
      })
      // fetchNewest
      .addCase(fetchNewest.fulfilled, (state, action) => {
        const payload = action.payload;
        const inner = payload?.data ?? payload;
        state.newest = Array.isArray(inner?.games) ? inner.games
          : Array.isArray(inner?.data) ? inner.data
          : Array.isArray(inner) ? inner
          : [];
      })
      // deleteGame
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.deleteModalOpen = false;
        state.selectedGame = null;
        state.games = state.games.filter(
          (g) => g._id !== action.payload && g.appid !== action.payload
        );
      })
      // updateGame
      .addCase(updateGame.fulfilled, (state, action) => {
        const index = state.games.findIndex((g) => g._id === action.payload._id);
        if (index !== -1) state.games[index] = action.payload;
      });
  },
});

export const {
  setPagination,
  setSearch,
  setSort,
  setGenreFilter,
  openDeleteModal,
  closeDeleteModal,
} = gamesSlice.actions;

export default gamesSlice.reducer;
