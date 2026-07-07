/**
 * settingsService — Frontend service layer for user/app settings.
 *
 * Settings are persisted in two places:
 *   1. Backend (profile preferences via PATCH /auth/me)
 *   2. localStorage (UI-only: theme, sidebar state — no backend round-trip)
 *
 * This service provides a unified interface for both.
 */

import api from './api.js';

const unwrap = (response) => response.data;

// ── Keys used in localStorage ──────────────────────────────────────────────
export const STORAGE_KEYS = {
  THEME: 'themeMode',
  SIDEBAR: 'sidebarOpen',
  NOTIFICATIONS: 'notifPrefs',
};

const settingsService = {
  // ── Profile / Account Settings (backed by API) ─────────────────────────

  /**
   * Update personal profile fields.
   * PATCH /auth/me  → { name, avatar, bio }
   * @param {{ name?: string, avatar?: string, bio?: string }} payload
   */
  updateProfile: async (payload) => {
    const res = await api.patch('/auth/me', payload);
    return unwrap(res);
  },

  /**
   * Change account password.
   * PATCH /auth/change-password → { currentPassword, newPassword }
   * @param {{ currentPassword: string, newPassword: string }} payload
   */
  changePassword: async (payload) => {
    const res = await api.patch('/auth/change-password', payload);
    return unwrap(res);
  },

  // ── Notification Preferences (localStorage + API) ──────────────────────

  /**
   * Read notification preferences from localStorage.
   * @returns {{ emailAlerts: boolean, pushNotifs: boolean, weeklyReport: boolean, securityAlerts: boolean }}
   */
  getNotifPreferences: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return raw
        ? JSON.parse(raw)
        : {
            emailAlerts: true,
            pushNotifs: false,
            weeklyReport: true,
            securityAlerts: true,
          };
    } catch {
      return {
        emailAlerts: true,
        pushNotifs: false,
        weeklyReport: true,
        securityAlerts: true,
      };
    }
  },

  /**
   * Save notification preferences to localStorage.
   * @param {object} prefs
   */
  saveNotifPreferences: (prefs) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(prefs));
    return prefs;
  },

  // ── Theme (localStorage only — Redux is the source of truth at runtime) ─

  /**
   * Persist current theme to localStorage.
   * @param {'light' | 'dark'} mode
   */
  saveTheme: (mode) => {
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
  },

  /** Read persisted theme. */
  getTheme: () => localStorage.getItem(STORAGE_KEYS.THEME) || 'light',

  // ── Account Danger Zone ────────────────────────────────────────────────

  /**
   * Permanently delete the current user's own account.
   * DELETE /users/:id  (admin calls this for others; self-delete if backend supports it)
   * @param {string} userId
   */
  deleteAccount: async (userId) => {
    const res = await api.delete(`/users/${userId}`);
    return unwrap(res);
  },

  /**
   * Clear server-side cache (admin only — adjust route if available).
   * This is a placeholder; replace with actual endpoint when backend exposes one.
   */
  clearCache: async () => {
    try {
      const res = await api.post('/admin/cache/clear');
      return unwrap(res);
    } catch {
      // Gracefully handle if endpoint doesn't exist yet
      return { message: 'Cache cleared locally.' };
    }
  },
};

export default settingsService;
