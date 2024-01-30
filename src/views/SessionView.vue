<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="store.listActivitiesBySession(session)"
  >
    <template v-slot:top>
      <v-toolbar density="compact" flat>
        <v-toolbar-title>
          Actividades del
          {{ new Date(sessionData.date).toLocaleDateString() }}
        </v-toolbar-title>
        <v-text-field
          v-model="search"
          label="Buscar"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          flat
          variant="solo-filled"
        ></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" @click="editItem()">
          <v-icon size="large" class="me-2"> mdi-plus </v-icon>
          Añadir
        </v-btn>
        <v-dialog v-model="dialog" max-width="800px">
          <template> </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form @submit.prevent="createActivity()" v-model="valid">
                  <v-autocomplete
                    label="Candidato"
                    v-model="newActivity.candidate"
                    item-title="fullName"
                    item-value="id"
                    :items="store.listActiveCandidatesFullNamesIds()"
                  ></v-autocomplete>
                  <v-select
                    label="Etapa"
                    :rules="[rules.required]"
                    v-model="newActivity.stage"
                    :items="availableStages"
                  ></v-select>
                  <v-checkbox
                    label="Con candidato"
                    v-model="newActivity.withCandidate"
                  ></v-checkbox>
                  <v-checkbox
                    label="Presencial"
                    v-model="newActivity.inPerson"
                  ></v-checkbox>
                  <v-text-field
                    label="Desplazamiento (km)"
                    type="number"
                    v-model="newActivity.km"
                  ></v-text-field>
                  <v-textarea
                    v-model="newActivity.description"
                    label="Descripción"
                  ></v-textarea>

                  <v-btn class="me-4" :type="submit" color="primary"
                    >Enviar</v-btn
                  >
                  <v-btn class="me-4" type="button" @click="close"
                    >Cancelar</v-btn
                  >
                </v-form>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >¿Desea borrar este elemento?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close"
                >Cancelar</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.candidate="{ value }">
      {{ store.getCandidateFullNameById(value) }}
    </template>
    <template v-slot:item.stage="{ value }">
      {{ store.getActivityStageTitleByValue(value) }}
    </template>
    <template v-slot:item.withCandidate="{ value }">
      {{ value ? "Sí" : "No" }}
    </template>
    <template v-slot:item.inPerson="{ value }">
      {{ value ? "Sí" : "No" }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" class="me-2" @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data> No hay actividades</template>
  </v-data-table>
</template>

<script setup>
const props = defineProps(["session"]);

import { ref, nextTick, computed } from "vue";
import { useAppStore } from "../store/app";

const store = useAppStore();

let sessionData = store.getSessionById(props.session);

let newActivity = ref({});
let valid = ref(false);
let dialog = ref(false);
let dialogDelete = ref(false);
let search = ref("");
let hide = ref(true);

let editedElement = null;
let formTitle;
let headers = [
  {
    align: "start",
    key: "candidate",
    title: "Candidato",
  },
  { key: "stage", title: "Etapa", sortable: false },
  { key: "description", title: "Descripción", sortable: false },
  { key: "withCandidate", title: "Con candidato", sortable: false },
  { key: "inPerson", title: "Presencial", sortable: false },
  { key: "km", title: "Km", sortable: false },
  { key: "actions", title: "Acciones", sortable: false, align: "end" },
];

let rules = {
  required: (value) => !!value || "Obligatorio.",
};

const availableStages = computed(() => {
  return store.getAvailableStagesByCandidateId(newActivity.value.candidate);
});

function createActivity() {
  if (valid.value) {
    if (editedElement) {
      Object.assign(editedElement, newActivity.value);
    } else {
      store.createActivity(newActivity.value, props.session);
    }
    close();
  }
}

async function close() {
  dialog.value = false;
  dialogDelete.value = false;
  await nextTick();
  editedElement = null;
  newActivity.value = {};
}

function editItem(item) {
  if (!item) {
    formTitle = "Nuevo elemento";
    editedElement = null;
    newActivity.value = {};
  } else {
    formTitle = "Editar elemento";
    editedElement = item;
    newActivity.value = Object.assign({}, item);
  }
  dialog.value = true;
}

function deleteItem(item) {
  dialogDelete.value = true;
  editedElement = item;
}

function hideItem(item) {
  item.active = !item.active;
}

function deleteItemConfirm() {
  store.deleteActivity(editedElement);
  close();
}
</script>
