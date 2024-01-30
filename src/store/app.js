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
    estado.results = results;
    estado.exclusionCauses = exclusionCauses;
    return estado;
  },
  actions: {
    listResultsByStage(stageId) {
      return this.results.filter((r) => r.stage == stageId);
    },
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
      let session = this.getSessionById(sessionId);
      c.date = session.date;
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

    generarCertificados(tipo, candidate) {
      let url = `${import.meta.env.BASE_URL}office_templates/${tipo}.docx`;
      var generation_date = new Date().toLocaleDateString("es");

      let candidateFullName = `${candidate.name} ${candidate.familyName}`;
      PizZipUtils.getBinaryContent(url, (err, content) => {
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        let activities = listActivitiesByCandidateId(candidate.id);
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
});
