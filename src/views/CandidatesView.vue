<template>
  <v-container>
    <v-row>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="filteredCandidates"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Candidatos</v-toolbar-title>
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
            <v-switch
              v-model="hide"
              label="Ocultar desactivados"
              color="secondary"
              hide-details
            ></v-switch>
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
                    <v-form @submit.prevent="createCandidate()" v-model="valid">
                      <v-text-field
                        label="NIF"
                        v-model="newUser.nif"
                      ></v-text-field>
                      <v-select
                        label="Etapa"
                        :rules="[rules.required]"
                        :items="store.stages"
                        v-model="newUser.stage"
                      ></v-select>
                      <v-text-field
                        :rules="[rules.required]"
                        label="Nombre"
                        v-model="newUser.name"
                      ></v-text-field>
                      <v-text-field
                        label="Apellidos"
                        :rules="[rules.required]"
                        v-model="newUser.familyName"
                      ></v-text-field>
                      <v-text-field
                        label="Teléfono"
                        :rules="[rules.required]"
                        v-model="newUser.phone"
                      ></v-text-field>
                      <v-text-field
                        label="Email"
                        type="email"
                        :rules="[rules.required, rules.email]"
                        v-model="newUser.email"
                      ></v-text-field>
                      <v-combobox
                        clearable
                        label="Exclusión"
                        v-model="newUser.exclusionCause"
                        :items="store.exclusionCauses"
                      ></v-combobox>
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
        <template v-slot:item.stage="{ value }">
          {{ store.getStageTitleByValue(value) }}
        </template>
        <template v-slot:item.exclusionCause="{ value }">
          <v-icon :title="value" v-if="value" size="large" class="me-2">
            mdi-check
          </v-icon>
        </template>

        <template v-slot:item.UCs="{ item }">
          <v-icon size="large" class="me-2" @click="navToUCs(item)">
            mdi-format-list-bulleted
          </v-icon>
        </template>
        <template v-slot:item.documents="{ item }">
          <v-chip
            size="small"
            class="me-2"
            @click="store.generarCertificados('AE4', item)"
            color="indigo"
            title="Ficha de asesoramiento/evaluación"
          >
            AE4
          </v-chip>
          <v-chip
            v-if="item.stage == 20"
            size="small"
            class="me-2"
            @click="store.generarCertificados('A63', item)"
            color="teal"
            title="Informe de exclusión"
          >
            A6-3
          </v-chip>
          <v-chip
            v-if="item.stage == 20"
            size="small"
            class="me-2"
            @click="store.generarCertificados('A9', item)"
            color="teal"
            title="Informe de asesoramiento"
          >
            A9
          </v-chip>
          <v-chip
            v-if="item.stage == 20"
            size="small"
            class="me-2"
            @click="store.generarCertificados('A10', item)"
            color="teal"
            title="Comunicación del resultado del asesoramiento"
          >
            A10
          </v-chip>
          <v-chip
            v-if="item.stage == 30"
            size="small"
            class="me-2"
            @click="store.generarCertificados('E3', item)"
            color="pink"
            title="Informe de evaluación"
          >
            E3
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            title="Editar"
            size="small"
            class="me-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            title="Borrar"
            size="small"
            class="me-2"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
          <v-icon
            color="red"
            title="Mostrar"
            size="small"
            class="me-2"
            v-if="!item.active"
            @click="hideItem(item)"
          >
            mdi-eye-off</v-icon
          >
          <v-icon
            color="green"
            title="Ocultar"
            size="small"
            class="me-2"
            v-else
            @click="hideItem(item)"
          >
            mdi-eye</v-icon
          >
        </template>
        <template v-slot:no-data> No hay candidatos </template>
      </v-data-table>
    </v-row>
    <v-snackbar color="error" elevation="24" v-model="snackbar" timeout="2000">
      {{ textSnackbar }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, nextTick, computed } from "vue";
import { useAppStore } from "../store/app";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useAppStore();

let newUser = ref({});
let valid = ref(false);
let dialog = ref(false);
let dialogDelete = ref(false);
let text = ref("");
let search = ref("");
let hide = ref(true);
let snackbar = ref(false);

let editedElement = null;
let formTitle;
let textSnackbar = "";
let headers = [
  {
    align: "start",
    key: "nif",
    sortable: false,
    title: "NIF",
  },
  { key: "stage", title: "Etapa" },
  { key: "name", title: "Nombre" },
  { key: "familyName", title: "Apellidos" },
  { key: "phone", title: "Teléfono", sortable: false },
  { key: "email", title: "Email", sortable: false },
  {
    key: "exclusionCause",
    title: "Exclusión",
    sortable: false,
    align: "center",
  },
  { key: "UCs", title: "UCs", sortable: false },
  { key: "documents", title: "Documentación", sortable: false },
  { key: "actions", title: "Acciones", sortable: false, align: "end" },
];

let rules = {
  required: (value) => !!value || "Obligatorio.",
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Email no válido";
  },
};

const filteredCandidates = computed(() => {
  if (hide.value) return store.listActiveCandidates();

  return store.candidates;
});

function createCandidate() {
  if (valid.value) {
    if (editedElement) {
      Object.assign(editedElement, newUser.value);
    } else {
      try {
        store.createCandidate(newUser.value);
      } catch (e) {
        snackbar.value = true;
        textSnackbar = e.message;
      }
    }
    close();
  }
}

async function close() {
  dialog.value = false;
  dialogDelete.value = false;
  await nextTick();
  editedElement = null;
  newUser.value = {};
}

function editItem(item) {
  if (!item) {
    formTitle = "Nuevo elemento";
    editedElement = null;
    newUser.value = {};
  } else {
    formTitle = "Editar elemento";
    editedElement = item;
    newUser.value = Object.assign({}, item);
  }
  dialog.value = true;
}

function deleteItem(item) {
  dialogDelete.value = true;
  editedElement = item;
}

function hideItem(item) {
  console.log(item.active);
  item.active = !item.active;
}

function deleteItemConfirm() {
  store.deleteCandidate(editedElement);
  close();
}

function navToUCs(candidate) {
  router.push({ name: "UCs", params: { candidate: candidate.id } });
}
</script>
