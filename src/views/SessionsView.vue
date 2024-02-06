<template>
  <v-container>
    <v-row justify="end">
      <v-col cols="2">
        <v-select
          @update:modelValue="navigate()"
          v-model="store.year"
          :items="store.years"
          density="compact"
          label="Año"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          @update:modelValue="navigate()"
          v-model="store.period"
          :items="store.periods"
          density="compact"
          label="Período"
        ></v-select>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col>
        <v-card>
          <v-card-item>
            <v-row>
              <v-col>
                <v-card-title>Preasesoramiento</v-card-title>
              </v-col>
            </v-row>
            <v-row>
              <v-col>NCPA</v-col>
              <v-col>SPA</v-col>
            </v-row>
            <v-row class="text-h2">
              <v-col>{{ store.calculatedSessions.NCPA }} </v-col>
              <v-col>{{ store.calculatedSessions.SPA }}</v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-item>
            <v-row>
              <v-col>
                <v-card-title>Asesoramiento</v-card-title>
              </v-col>
            </v-row>
            <v-row>
              <v-col>NCA</v-col>
              <v-col>NUCA</v-col>
              <v-col>SA</v-col>
              <v-col>SMA</v-col>
            </v-row>
            <v-row class="text-h2">
              <v-col>{{ store.calculatedSessions.NCA }}</v-col>
              <v-col>{{ store.calculatedSessions.NUCA }}</v-col>
              <v-col>{{ store.calculatedSessions.SA }}</v-col>
              <v-col>{{ store.calculatedSessions.SMA }}</v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-item>
            <v-row>
              <v-col>
                <v-card-title>Evaluación</v-card-title>
              </v-col>
            </v-row>
            <v-row>
              <v-col>NCE</v-col>
              <v-col>NUCE</v-col>
              <v-col>SE</v-col>
              <v-col>SME</v-col>
            </v-row>
            <v-row class="text-h2">
              <v-col>{{ store.calculatedSessions.NCE }}</v-col>
              <v-col>{{ store.calculatedSessions.NUCE }}</v-col>
              <v-col>{{ store.calculatedSessions.SE }}</v-col>
              <v-col>{{ store.calculatedSessions.SME }}</v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          show-select
          select-strategy="single"
          :search="search"
          :headers="headers"
          :items="store.getSessionsByYearPeriod(store.year, store.period)"
          v-model="selectedItem"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Sesiones</v-toolbar-title>
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
          <template v-slot:item.date="{ item }">
            {{ new Date(item.date).toLocaleDateString() }}</template
          >
          <template v-slot:item.activities="{ item }">
            <v-chip size="small" class="me-2" color="red" variant="outlined">
              PA: {{ getNumActivitiesByStage(item.activities, 10) }}</v-chip
            >
            <v-chip size="small" class="me-2" color="green" variant="outlined">
              A: {{ getNumActivitiesByStage(item.activities, 20) }}</v-chip
            >
            <v-chip size="small" class="me-2" variant="outlined">
              E: {{ getNumActivitiesByStage(item.activities, 30) }}</v-chip
            >
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="me-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="small" class="me-2" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data> No hay sesiones</template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-if="selectedItem && selectedItem.length">
      <v-col>
        <v-divider thickness="5" color="primary" class="mt-5 mb-5"></v-divider>
        <v-card elevation="10">
          <router-view />
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form @submit.prevent="createSession()" v-model="valid">
              <v-text-field
                label="Fecha"
                type="Date"
                :rules="[rules.required]"
                v-model="newSession.date"
              ></v-text-field>
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
  </v-container>
</template>

<script setup>
import { ref, nextTick, computed, watch } from "vue";
import { useAppStore } from "../store/app";
import { useRouter, useRoute } from "vue-router";
import DialogDelete from "../components/DialogDelete";

const router = useRouter();
const route = useRoute();

const store = useAppStore();

let newSession = ref({});
let valid = ref(false);
let dialog = ref(false);
let dialogDelete = ref(false);
let text = ref("");
let search = ref("");
let hide = ref(true);
let selectedItem = ref([]);

store.updateSelectedPeriodYear(
  parseInt(route.query.period),
  parseInt(route.query.year),
);

let editedElement = null;
let formTitle;
let headers = [
  {
    align: "start",
    key: "date",
    title: "Fecha",
  },
  {
    key: "activities",
    title: "Nº Actividades",
    sortable: false,
    align: "end",
  },
  { key: "actions", title: "Acciones", sortable: false, align: "end" },
];

let rules = {
  required: (value) => !!value || "Obligatorio.",
};

watch(selectedItem, async (newValue, oldValue) => {
  if (newValue.length) {
    router.push({ name: "session", params: { session: newValue[0] } });
  } else {
    router.push({ name: "sessions" });
  }
});

async function navigate() {
  selectedItem.value = [];
  await nextTick();
  router.push({
    name: route.name,
    query: { period: store.period, year: store.year },
  });
}

function createSession() {
  if (valid.value) {
    if (editedElement) {
      store.updateSession(editedElement, newSession.value);
    } else {
      try {
        store.createSession(newSession.value);
      } catch (e) {
        store.error = true;
        store.errorText = e.message;
      }
    }
    close();
  }
}

function getNumActivitiesByStage(activities, stage) {
  return activities.find((ac) => ac.stage == stage).numSessions;
}

async function close() {
  dialog.value = false;
  dialogDelete.value = false;
  await nextTick();
  editedElement = null;
  newSession.value = {};
}

function editItem(item) {
  if (!item) {
    formTitle = "Nuevo elemento";
    editedElement = null;
    newSession.value = {};
  } else {
    formTitle = "Editar elemento";
    editedElement = item;
    newSession.value = Object.assign({}, item);
  }
  dialog.value = true;
}

function deleteItem(item) {
  dialogDelete.value = true;
  editedElement = item;
}

function deleteItemConfirm() {
  selectedItem.value = [];
  store.deleteSession(editedElement);
  close();
}
</script>
