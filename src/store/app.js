// Utilities
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";

export const useAppStore = defineStore("app", {
  state: () => {
    let exclusionCauses = [
      "No acreditar la residencia en la Comunitat Valenciana",
      "No poseer la nacionalidad española, haber obtenido el certificado de registro de ciudadanía comunitaria o la tarjeta de familiar de ciudadano o ciudadana de la Unión, o ser titular de una autorización de residencia o, de residencia y trabajo en España en vigor, en los términos establecidos en la normativa española de extranjería e inmigración.",
      "No tener 18 años cumplidos en el momento de realizar la inscripción, cuando se trate de unidades de competencia correspondientes a cualificaciones de nivel I y 20 años para los niveles II y III.",
      "No tener la experiencia laboral y/o formación no formal mínima requerida, relacionada con el sector profesional en el que quiere se le reconozca la competencia profesional.",
      "No tener la experiencia laboral mínima requerida, relacionada con el sector profesional en el que quiere se le reconozca la competencia profesional.\n • Unidades de competencia nivel II y III, más de 3 años con un mínimo de 2.000 horas trabajadas en los últimos 15 años.\n • Unidades de competencia de nivel I, más de 2 años y un mínimo de 1200 horas.",
      "No tener la formación no formal mínima requerida, relacionada con el sector profesional en el que quiere se le reconozca la competencia profesional. • Unidades de competencia nivel II y III, más de 300 horas cursadas en los últimos 10 años. • Unidades de competencia nivel I, más de 200 horas cursadas en los últimos 10 años.",
      "No presentarse a la cita sin justificar ausencia",
      "No acreditar el pago o la exención de tasas",
      "No conseguir contactar con el candidato/a",
    ];
    let stages = [
      { title: "Asesoramiento", value: 20 },
      { title: "Evaluación", value: 30 },
    ];

    let activityStages = [
      { title: "Preasesoramiento", value: 10 },
      { title: "Asesoramiento", value: 20 },
      { title: "Evaluación", value: 30 },
    ];

    let periods = [1, 2];
    let years = [];
    let currentYear = new Date().getFullYear();
    for (let y = 2015; y <= currentYear; y++) {
      years.push(y);
    }

    let results = [
      {
        id: "FED",
        description: "Favorable para contraste por evidencias directas",
        stage: 20,
      },
      {
        id: "FEI",
        description: "Favorable para contraste por evidencias indirectas",
        stage: 20,
      },
      { id: "D", description: "Desfavorable", stage: 20 },
      { id: "A", description: "Adquirida", stage: 30 },
      { id: "NA", description: "No adquirida", stage: 30 },
    ];

    let estado;
    try {
      let existingData = JSON.parse(localStorage.getItem("peacState"));
      if (!existingData) {
        estado = {
          info: {},
          candidates: [],
          sessions: [],
          activities: [],
          UCs: [],
          UCsAsesorables: [],
        };
      } else {
        let existingState = existingData.app;
        estado = {
          info: existingState.info || {},
          candidates: existingState.candidates || [],
          sessions: existingState.sessions || [],
          activities: existingState.activities || [],
          UCs: existingState.UCs || [],
          UCsAsesorables: existingState.UCsAsesorables || [],
        };
      }
    } catch (e) {
      alert(
        "Ha ocurrido un error cargando los datos. Se reseteará la aplicación. Por favor, restaure los datos de una copia de seguridad válida.",
      );
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
    estado.results = results;
    estado.exclusionCauses = exclusionCauses;
    estado.periods = periods;
    estado.years = years;
    estado.year = currentYear;
    estado.period = 1;
    estado.error = false;
    estado.errorText = "";
    return estado;
  },
  actions: {
    updateSelectedPeriodYear(period, year) {
      if (this.years.includes(year)) {
        this.year = year;
      } else {
        this.year = this.getCurrentYear();
      }
      if (this.periods.includes(period)) {
        this.period = period;
      } else {
        this.period = this.getCurrentPeriod();
      }
    },
    getNCByStageYearPeriod(year, period, stage) {
      function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
      }
      return this.activities
        .filter((a) => {
          let d = new Date(a.date);
          return (
            d >= this.getBeginDate(year, period) &&
            d <= this.getEndDate(year, period) &&
            a.stage == stage
          );
        })
        .map((el) => el.candidate)
        .filter(onlyUnique);
    },
    getUCsForCandidateIdList(candidateIdsArray) {
      let numUCs = 0;
      for (let c of candidateIdsArray) {
        numUCs += this.listUCsByCandidateId(c).length;
      }
      return numUCs;
    },
    getSessionsByYearPeriod(year, period) {
      return this.sessions.filter((a) => {
        let d = new Date(a.date);
        return (
          d >= this.getBeginDate(year, period) &&
          d <= this.getEndDate(year, period)
        );
      });
    },

    getCurrentYear() {
      let today = new Date();
      return today.getFullYear();
    },
    getCurrentPeriod() {
      let today = new Date();
      let curMonth = today.getMonth();
      let curDay = today.getDate();
      // > 15/06
      if (curMonth > 5 || (curMonth == 5 && curDay > 15)) return 2;
      return 1;
    },
    getBeginDate(year, period) {
      let beginDate;
      if (period == 1) {
        beginDate = new Date(`${year}-01-01`);
      } else {
        beginDate = new Date(`${year}-06-16`);
      }
      return beginDate;
    },
    getEndDate(year, period) {
      let endDate;
      if (period == 1) {
        endDate = new Date(`${year}-06-15`);
      } else {
        endDate = new Date(`${year}-12-31`);
      }
      return endDate;
    },

    listResultsByStage(stageId) {
      return this.results.filter((r) => r.stage == stageId);
    },
    getStageTitleByValue(value) {
      return this.stages.find((el) => el.value == value).title;
    },
    deleteCandidate(candidate) {
      for (let ac of this.listActivitiesByCandidateId(candidate.id)) {
        this.activities.splice(this.activities.indexOf(ac), 1);
      }
      for (let uc of this.listUCsByCandidateId(candidate.id)) {
        this.UCs.splice(this.activities.indexOf(uc), 1);
      }
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
        this.error = true;
        this.errorText = "Ya existe un candidato con este NIF";
        return;
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
      for (let ac of this.listActivitiesBySession(session.id)) {
        this.activities.splice(this.activities.indexOf(ac), 1);
      }
      this.sessions.splice(this.sessions.indexOf(session), 1);
    },
    updateSession(session, newSessionData) {
      for (let ac of this.listActivitiesBySession(session.id)) {
        ac.date = newSessionData.date;
      }
      Object.assign(session, newSessionData);
    },
    createSession(sessionData) {
      if (this.getSessionByDate(sessionData.date)) {
        this.error = true;
        this.errorText = "Ya existe una sesión creada en esa fecha";
        return;
      }

      let c = Object.assign({ id: uuidv4(), active: true }, sessionData);
      c.activities = [
        { stage: 10, numSessions: 0 },
        { stage: 20, numSessions: 0 },
        { stage: 30, numSessions: 0 },
      ];
      this.sessions.push(c);
    },
    getSessionById(sessionId) {
      return this.sessions.find((s) => s.id == sessionId);
    },
    getSessionByDate(date) {
      return this.sessions.find((s) => s.date == date);
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
      let session = this.getSessionById(sessionId);
      let stage = session.activities.find(
        (el) => el.stage == activityData.stage,
      );
      stage.numSessions += 1;
      session.activities.sort((a, b) => {
        return b.numSessions - a.numSessions;
      });
      c.date = session.date;
      this.activities.push(c);
    },
    listActivitiesBySession(sessionId) {
      return this.activities.filter((a) => a.sessionId == sessionId);
    },
    deleteActivity(activity) {
      let session = this.getSessionById(activity.sessionId);
      let stage = session.activities.find((el) => el.stage == activity.stage);
      stage.numSessions -= 1;
      session.activities.sort((a, b) => {
        return b.numSessions - a.numSessions;
      });

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
      c.qualys = c.qualys.split(",");
      this.UCs.push(c);
    },
    listUCsByCandidateId(candidateId) {
      return this.UCs.filter((uc) => uc.candidateId == candidateId);
    },
    listActivitiesByCandidateId(candidateId) {
      return this.activities
        .filter((ac) => ac.candidate == candidateId)
        .map((ac) => ({
          stage: this.getActivityStageTitleByValue(ac.stage),
          date: new Date(ac.date).toLocaleDateString(),
          withCandidate: ac.withCandidate ? "Sí" : "No",
          inPerson: ac.inPerson ? "Sí" : "No",
          km: ac.km || "-",
          description: ac.description,
        }));
    },

    groupUCsByQualy(UCs) {
      return UCs.reduce((acc, UC) => {
        for (let qualy of UC.qualys) {
          let q = acc.find((el) => el.name == qualy);
          if (!q) {
            q = { name: qualy, UCs: [] };
            acc.push(q);
          }
          q.UCs.push(UC);
        }
        return acc;
      }, []);
    },
    deleteUC(UC) {
      this.UCs.splice(this.UCs.indexOf(UC), 1);
    },
    createUCAsesorable(UCData) {
      if (this.getUCAsesorableByCode(UCData.code)) {
        this.error = true;
        this.errorText = "Ya hay una UC dada de alta con ese código";
        return;
      }
      let c = Object.assign(
        {
          id: uuidv4(),
        },
        UCData,
      );
      this.UCsAsesorables.push(c);
    },
    deleteUCAsesorable(UC) {
      this.UCsAsesorables.splice(this.UCsAsesorables.indexOf(UC), 1);
    },
    listUCsAsesorables() {
      return this.UCsAsesorables;
    },
    getUCAsesorableById(UCId) {
      return this.UCsAsesorables.find((uc) => uc.id == UCId);
    },
    getUCAsesorableByCode(code) {
      return this.UCsAsesorables.find((uc) => uc.code == code);
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
    restoreData(backupData) {
      localStorage.setItem("peacState", backupData);
    },
    backupData() {
      let data = localStorage.getItem("peacState");
      let today = new Date();
      var blob = new Blob([data], {
        type: "application/json;charset=utf-8",
      });
      saveAs(
        blob,
        `${today.toISOString()}-${this.info.name}_${this.info.familyName}.json`,
      );
    },

    generarCertificados(tipo, candidate) {
      let url = `${import.meta.env.BASE_URL}/office_templates/${tipo}.docx`;
      var generation_date = new Date().toLocaleDateString("es");

      let candidateFullName = `${candidate.name} ${candidate.familyName}`;
      PizZipUtils.getBinaryContent(url, (err, content) => {
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        let activities = this.listActivitiesByCandidateId(candidate.id);
        let candidateUCs = this.listUCsByCandidateId(candidate.id);
        let candidateQualys = this.groupUCsByQualy(candidateUCs);
        let UCsPass = candidateUCs.filter((uc) => uc.result != "D");
        let UCsFail = candidateUCs.filter((uc) => uc.result == "D");
        doc.setData({
          qualifications: candidateQualys,
          generation_date: generation_date,
          candidateFullName,
          activities,
          asesorRole: this.getStageTitleByValue(candidate.stage),
          asesorFullName: `${this.info.name} ${this.info.familyName}`,
          endDate: new Date().toLocaleDateString(),
          familiaProfesional: this.info.familiaProfesional,
          UCs: candidateUCs,
          city: this.info.city,
          sede: this.info.sede,
          UCsPass,
          UCsFail,
          hasUCsPass: UCsPass.length > 0,
          hasUCsFail: UCsFail.length > 0,
          exclusionCause: candidate.exclusionCause,
          changeCommissionFamiliaProfesional:
            candidate.changeCommissionFamiliaProfesional,
          changeCommissionIES: candidate.changeCommissionIES,
          changeCommissionCity: candidate.changeCommissionCity,
          changeCommissionProvince: candidate.changeCommissionProvince,
        });
        doc.render();

        const out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Output the document using Data-URI
        saveAs(out, `${tipo}-${candidate.familyName}_${candidate.name}.docx`);
      });
    },
  },
  getters: {
    calculatedSessions: (state) => {
      let NCPA, NCA, NCE;
      let NUCA, NUCE;
      let SMA, SME;
      let SPA, SA, SE;

      let PAcandidateList = state.getNCByStageYearPeriod(
        state.year,
        state.period,
        10,
      );
      let AcandidateList = state.getNCByStageYearPeriod(
        state.year,
        state.period,
        20,
      );
      let EcandidateList = state.getNCByStageYearPeriod(
        state.year,
        state.period,
        30,
      );

      NCPA = PAcandidateList.length;
      NCA = AcandidateList.length;
      NCE = EcandidateList.length;

      NUCA = state.getUCsForCandidateIdList(AcandidateList);
      NUCE = state.getUCsForCandidateIdList(EcandidateList);

      SMA = NUCA / 2;
      SME = NUCE / 2;

      let sessions = state.getSessionsByYearPeriod(state.year, state.period);
      let sessionRest = { 10: NCPA, 20: SMA, 30: SME };
      let sessionCur = { 10: 0, 20: 0, 30: 0 };

      for (let session of sessions) {
        let end = false;
        for (let ac of session.activities) {
          if (sessionRest[ac.stage] > 0) {
            sessionCur[ac.stage] += 1;
            sessionRest[ac.stage] -= 1;
            end = true;
            break;
          }
        }
        if (!end) {
          sessionCur[session.activities[0].stage] += 1;
          sessionRest[session.activities[0].stage] -= 1;
        }
      }
      SPA = sessionCur[10];
      SA = sessionCur[20];
      SE = sessionCur[30];

      return {
        NCPA,
        NCA,
        NCE,
        NUCA,
        NUCE,
        SMA,
        SME,
        SPA,
        SA,
        SE,
      };
    },
  },
});
