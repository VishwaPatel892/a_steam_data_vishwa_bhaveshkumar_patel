/**
 * uiSlice — Global UI state
 *
 * Manages:
 *   • globalLoading  — driven by the API interceptor's pending request counter
 *   • toasts         — push/dismiss toast notifications
 */

import { createSlice } from '@reduxjs/toolkit';

let toastId = 0;

const initialState = {
  globalLoading: false,
  toasts: [],          // [{ id, type, title, message, duration }]
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /** Called by the Axios interceptor — not dispatched manually in components */
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },

    /**
     * Push a toast notification.
     * @param {{ type: 'success'|'error'|'warning'|'info', title?: string, message: string, duration?: number }} payload
     */
    pushToast: (state, action) => {
      const { type = 'info', title, message, duration = 4000 } = action.payload;
      state.toasts.push({ id: ++toastId, type, title, message, duration });
    },

    /** Remove a specific toast by id */
    dismissToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },

    /** Remove all toasts at once */
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { setGlobalLoading, pushToast, dismissToast, clearToasts } = uiSlice.actions;
export default uiSlice.reducer;

// ── Convenience action creators ────────────────────────────────────────────
export const toast = {
  success: (message, title = 'Success') =>
    pushToast({ type: 'success', title, message }),
  error: (message, title = 'Error') =>
    pushToast({ type: 'error', title, message }),
  warning: (message, title = 'Warning') =>
    pushToast({ type: 'warning', title, message }),
  info: (message, title = 'Info') =>
    pushToast({ type: 'info', title, message }),
};
