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
    deleteSession(session) {
      this.sessions.splice(this.sessions.indexOf(session), 1);
    },
    createSession(sessionData) {
      let c = Object.assign({ id: uuidv4(), active: true }, sessionData);
      this.sessions.push(c);
    },
    getSessionById(sessionId) {
      return this.sessions.find((s) => s.id == sessionId);
    },
    listAllCandidates() {
      return this.candidates;
    },
    listActiveCandidates() {
      return this.candidates.filter((c) => c.active == true);
    },
    listActiveCandidatesFullNamesIds() {
      return this.listActiveCandidates().map((c) => {
        return { fullName: `${c.name} ${c.familyName}`, id: c.id };
      });
    },
    createActivity(activityData, sessionId) {
      let c = Object.assign({ id: uuidv4(), sessionId }, activityData);
      this.activities.push(c);
    },
    listActivitiesBySession(sessionId) {
      return this.activities.filter((a) => a.sessionId == sessionId);
    },
    deleteActivity(activity) {
      this.activities.splice(this.activities.indexOf(activity), 1);
    },
  },
});
