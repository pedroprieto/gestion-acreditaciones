// Utilities
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

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
  actions: {
    deleteCandidate(candidate) {
      this.candidates.splice(this.candidates.indexOf(candidate), 1);
    },
    getCandidateById(candidateId) {
      return this.candidates.find((c) => c.id == candidateId);
    },
    getCandidateByNIF(candidateNIF) {
      return this.candidates.find((c) => c.nif == candidateNIF);
    },
    createCandidate(candidateData) {
      if (this.getCandidateByNIF(candidateData.nif)) {
        let err = new Error();
        err.message = "Ya existe un candidato con este NIF";
        throw err;
      }
      let c = Object.assign({ id: uuidv4(), active: true }, candidateData);
      this.candidates.push(c);
    },
  },
});
