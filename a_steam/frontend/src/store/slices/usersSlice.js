import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';
import { toast } from './uiSlice';

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers(params);
      return response; // { users, total, page, limit, pages }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      dispatch(toast.success('User created successfully'));
      return response.user;
    } catch (error) {
      dispatch(toast.error(error.message || 'Failed to create user'));
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id, data);
      dispatch(toast.success('User updated successfully'));
      return response;
    } catch (error) {
      dispatch(toast.error(error.message || 'Failed to update user'));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      dispatch(toast.success('User deleted successfully'));
      return id;
    } catch (error) {
      dispatch(toast.error(error.message || 'Failed to delete user'));
      return rejectWithValue(error.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  users: [],
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
  search: '',
  sort: '-createdAt',
  loading: false,
  error: null,
  
  // Modals state
  createModalOpen: false,
  editModalOpen: false,
  deleteModalOpen: false,
  selectedUser: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPagination: (state, action) => {
      if (action.payload.page !== undefined) state.page = action.payload.page;
      if (action.payload.limit !== undefined) state.limit = action.payload.limit;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1; // reset page on search
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.page = 1;
    },
    openCreateModal: (state) => {
      state.createModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.createModalOpen = false;
    },
    openEditModal: (state, action) => {
      state.selectedUser = action.payload;
      state.editModalOpen = true;
    },
    closeEditModal: (state) => {
      state.editModalOpen = false;
      state.selectedUser = null;
    },
    openDeleteModal: (state, action) => {
      state.selectedUser = action.payload;
      state.deleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.deleteModalOpen = false;
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        // The page and limit are also returned by the backend, 
        // but we already manage them in the Redux state, so we keep them synchronized
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createUser
      .addCase(createUser.fulfilled, (state, action) => {
        state.createModalOpen = false;
        // We could unshift to array, but since pagination is server-side,
        // it's better to just refetch from the component.
        // Or we just fetch again in the component after promise resolves.
      })
      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        state.editModalOpen = false;
        state.selectedUser = null;
        // Update user in array for immediate UI update without refetch
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteModalOpen = false;
        state.selectedUser = null;
        // Remove from array for immediate UI update, though total count won't update
        // Component will refetch after this resolves to get correct pagination
      });
  },
});

export const {
  setPagination,
  setSearch,
  setSort,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openDeleteModal,
  closeDeleteModal,
} = usersSlice.actions;

export default usersSlice.reducer;
