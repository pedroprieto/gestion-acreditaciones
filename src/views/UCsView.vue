<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="store.listUCsByCandidateId(candidate)"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>
          UCs de {{ candidateData.name }} -
          {{ candidateData.familyName }}
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
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" class="me-2" @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data> No hay UCs</template>
  </v-data-table>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form @submit.prevent="createUC()" v-model="valid">
            <v-autocomplete
              v-if="!editedElement"
              label="UC"
              v-model="newUCId"
              item-title="fullName"
              item-value="id"
              :items="store.listUCsAsesorablesFullNamesIds()"
            ></v-autocomplete>
            <v-textarea
              v-model="newUC.evidence"
              label="Evidencias"
            ></v-textarea>
            <v-autocomplete
              label="Resultado"
              v-model="newUC.result"
              item-title="description"
              item-value="id"
              :items="store.listResultsByStage(candidateData.stage)"
            ></v-autocomplete>
            <v-textarea
              v-model="newUC.proposal"
              label="Observaciones / Propuesta formativa"
            ></v-textarea>
            <v-btn class="me-4" type="submit" color="primary">Enviar</v-btn>
            <v-btn class="me-4" type="button" @click="close">Cancelar</v-btn>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
  <DialogDelete
    @close="close"
    @accept="deleteItemConfirm"
    v-model="dialogDelete"
  ></DialogDelete>
</template>

<script setup>
const props = defineProps(["candidate"]);

import { ref, nextTick, computed } from "vue";
import { useAppStore } from "../store/app";
import DialogDelete from "../components/DialogDelete";

const store = useAppStore();

let candidateData = store.getCandidateById(props.candidate);

let newUC = ref({});
let valid = ref(false);
let dialog = ref(false);
let dialogDelete = ref(false);
let search = ref("");
let hide = ref(true);
let newUCId = ref("");

let editedElement = null;
let formTitle;
let headers = [
  {
    align: "start",
    key: "code",
    title: "Código UC",
  },
  { key: "name", title: "Nombre UC", sortable: false },
  { key: "proposal", title: "Propuesta", sortable: false },
  { key: "result", title: "Resultado", sortable: false },
  { key: "evidence", title: "Evidencias", sortable: false },
  { key: "actions", title: "Acciones", sortable: false, align: "end" },
];

let rules = {
  required: (value) => !!value || "Obligatorio.",
};

function createUC() {
  if (valid.value) {
    if (editedElement) {
      Object.assign(editedElement, newUC.value);
    } else {
      let UCData = store.getUCAsesorableById(newUCId.value);
      newUC.value.code = UCData.code;
      newUC.value.name = UCData.name;
      newUC.value.qualys = UCData.qualys;
      store.createUC(newUC.value, props.candidate);
    }
    close();
  }
}

async function close() {
  dialog.value = false;
  dialogDelete.value = false;
  await nextTick();
  editedElement = null;
  newUC.value = {};
  newUCId.value = "";
}

function editItem(item) {
  if (!item) {
    formTitle = "Nuevo elemento";
    editedElement = null;
    newUC.value = {};
  } else {
    formTitle = "Editar elemento";
    editedElement = item;
    newUC.value = Object.assign({}, item);
  }
  dialog.value = true;
}

function deleteItem(item) {
  dialogDelete.value = true;
  editedElement = item;
}

function deleteItemConfirm() {
  store.deleteUC(editedElement);
  close();
}
</script>
