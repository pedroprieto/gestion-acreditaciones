<template>
  <v-container>
    <v-row>
      <v-data-table
        show-select
        select-strategy="single"
        :search="search"
        :headers="headers"
        :items="store.sessions"
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
            <v-dialog v-model="dialog" max-width="800px">
              <template> </template>
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
    </v-row>
    <v-row v-if="selectedItem && selectedItem.length">
      <v-divider thickness="5"></v-divider>
      <router-view />
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, nextTick, computed, watch } from "vue";
import { useAppStore } from "../store/app";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useAppStore();

let newSession = ref({});
let valid = ref(false);
let dialog = ref(false);
let dialogDelete = ref(false);
let text = ref("");
let search = ref("");
let hide = ref(true);
let selectedItem = ref([]);

let editedElement = null;
let formTitle;
let headers = [
  {
    align: "start",
    key: "date",
    title: "Fecha",
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

function createSession() {
  if (valid.value) {
    if (editedElement) {
      Object.assign(editedElement, newSession.value);
    } else {
      store.createSession(newSession.value);
    }
    close();
  }
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

function hideItem(item) {
  item.active = !item.active;
}

function deleteItemConfirm() {
  store.deleteSession(editedElement);
  close();
}
</script>
