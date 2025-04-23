// store/uiStore.js
import { create } from "zustand";

export const useUIStore = create((set) => ({
  darkMode: localStorage.getItem("darkMode") === "true",
  lang: localStorage.getItem("lang") || "vi",
  toggleDark: () =>
    set((s) => {
      const next = !s.darkMode;
      localStorage.setItem("darkMode", next);
      return { darkMode: next };
    }),
  setLang: (l) =>
    set(() => {
      localStorage.setItem("lang", l);
      return { lang: l };
    }),
}));
