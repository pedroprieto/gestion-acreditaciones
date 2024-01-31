<template>
  <v-toolbar density="compact" flat>
    <v-toolbar-title
      >Actuaciones con {{ selectedCandidateFullName }}</v-toolbar-title
    >
  </v-toolbar>
  <v-data-table
    :headers="headersActivities"
    :items="selectedCandidateWithActivities"
  >
  </v-data-table>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "../store/app";

const store = useAppStore();

const props = defineProps(["candidate"]);

const selectedCandidateWithActivities = computed(() => {
  return store.listActivitiesByCandidateId(props.candidate);
});

const selectedCandidateFullName = computed(() => {
  return store.getCandidateFullNameById(props.candidate);
});

let headersActivities = [
  { key: "date", title: "Fecha" },
  { key: "stage", title: "Etapa", sortable: false },
  { key: "description", title: "Descripción", sortable: false },
  { key: "withCandidate", title: "Con candidato", sortable: false },
  { key: "inPerson", title: "Presencial", sortable: false },
  { key: "km", title: "Km", sortable: false },
];
</script>
