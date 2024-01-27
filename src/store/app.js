// Utilities
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useAppStore = defineStore("app", {
  state: () => {
    let stages = [
      { title: "Asesoramiento (+Pre)", value: 20 },
      { title: "Evaluación", value: 30 },
    ];

    let activityStages = [
      { title: "Preasesoramiento", value: 10 },
      { title: "Asesoramiento", value: 20 },
      { title: "Evaluación", value: 30 },
    ];

    let estado;

    if (localStorage.getItem("peacState")) {
      estado = JSON.parse(localStorage.getItem("peacState")).app;
    } else {
      estado = {
        info: {},
        candidates: [],
        sessions: [],
        activities: [],
        UCs: [],
        UCsAsesorables: [],
      };
    }

    estado.stages = stages;
    estado.activityStages = activityStages;
    return estado;
  },
  actions: {
    getStageTitleByValue(value) {
      return this.stages.find((el) => el.value == value).title;
    },
    deleteCandidate(candidate) {
      this.candidates.splice(this.candidates.indexOf(candidate), 1);
    },
    getCandidateById(candidateId) {
      return this.candidates.find((c) => c.id == candidateId);
    },
    getCandidateFullNameById(candidateId) {
      let c = this.candidates.find((c) => c.id == candidateId);
      return `${c.name} ${c.familyName}`;
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
      let c = Object.assign(
        {
          id: uuidv4(),
          active: true,
        },
        candidateData,
      );
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
    createUC(UCData, candidateId) {
      let c = Object.assign(
        {
          id: uuidv4(),
          candidateId,
          date: new Date().toISOString().substring(0, 10),
        },
        UCData,
      );
      this.UCs.push(c);
    },
    listUCsByCandidateId(candidateId) {
      return this.UCs.filter((uc) => uc.candidateId == candidateId);
    },
    deleteUC(UC) {
      this.UCs.splice(this.UCs.indexOf(UC), 1);
    },
    createUCAsesorable(UCData) {
      let c = Object.assign(
        {
          id: uuidv4(),
        },
        UCData,
      );
      this.UCsAsesorables.push(c);
    },
    listUCsAsesorables() {
      return this.UCsAsesorables;
    },
    getUCAsesorableById(UCId) {
      return this.UCsAsesorables.find((uc) => uc.id == UCId);
    },
    listUCsAsesorablesFullNamesIds() {
      return this.listUCsAsesorables().map((uc) => {
        return { fullName: `${uc.code} ${uc.name}`, id: uc.id };
      });
    },
    getActivityStageTitleByValue(value) {
      return this.activityStages.find((el) => el.value == value).title;
    },
    getAvailableStagesByCandidateId(candidateId) {
      let selectedCandidate = this.getCandidateById(candidateId);
      if (selectedCandidate) {
        if (selectedCandidate.stage == 20) {
          return this.activityStages.filter((a) => a.value != 30);
        } else {
          return this.activityStages.filter((a) => a.value == 30);
        }
      } else {
        return [];
      }
    },
  },
});
