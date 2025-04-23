import { create } from "zustand";
import axios from 'axios';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  // Fetch from backend API
  fetchNotifications: async () => {
    try {
      const res = await axios.get('/api/v1/notifications/new');
      const items = res.data.notifications;
      set({
        notifications: items,
        unreadCount: items.filter((n) => !n.read).length,
      });
      console.log('Notifications loaded:', items);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  },

  markAsRead: (id) =>
    set((state) => {
      const list = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications: list, unreadCount: list.filter((n) => !n.read).length };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => {
      const list = state.notifications.filter((n) => n.id !== id);
      return { notifications: list, unreadCount: list.filter((n) => !n.read).length };
    }),

  clearAllNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
