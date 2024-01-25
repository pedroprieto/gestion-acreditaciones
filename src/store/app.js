// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => {
    if (localStorage.getItem("peacState")) {
      let estado = JSON.parse(localStorage.getItem("peacState")).app;
      return estado;
    }
    return {
      info: {},
      candidates: [],
      sessions: [],
      activities: [],
    };
  },
});
