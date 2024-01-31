<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :search="search"
          :headers="headers"
          :items="filteredCandidates"
          show-select
          select-strategy="single"
          v-model="selectedItem"
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
                label="Ocultar finalizados"
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
                      <v-form
                        @submit.prevent="createCandidate()"
                        v-model="valid"
                      >
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
                        <v-checkbox
                          label="Exclusión"
                          v-model="newUser.exclusion"
                        ></v-checkbox>
                        <v-combobox
                          v-if="newUser.exclusion"
                          clearable
                          label="Motivo exclusión"
                          v-model="newUser.exclusionCause"
                          :items="store.exclusionCauses"
                        ></v-combobox>
                        <v-checkbox
                          label="Cambio sede"
                          v-model="newUser.changeCommission"
                        ></v-checkbox>
                        <template v-if="newUser.changeCommission">
                          <v-text-field
                            label="Familia Profesional"
                            v-model="newUser.changeCommissionFamiliaProfesional"
                          ></v-text-field>
                          <v-text-field
                            label="Centro"
                            v-model="newUser.changeCommissionIES"
                          ></v-text-field>
                          <v-text-field
                            label="Ciudad"
                            v-model="newUser.changeCommissionCity"
                          ></v-text-field>
                          <v-text-field
                            label="Provincia"
                            v-model="newUser.changeCommissionProvince"
                          ></v-text-field>
                        </template>
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
              <DialogDelete
                @close="close"
                @accept="deleteItemConfirm"
                v-model="dialogDelete"
              ></DialogDelete>
            </v-toolbar>
          </template>
          <template v-slot:item.stage="{ value }">
            {{ store.getStageTitleByValue(value) }}
          </template>
          <template v-slot:item.exclusion="{ value }">
            <v-icon :title="value" v-if="value" size="large" class="me-2">
              mdi-check
            </v-icon>
          </template>
          <template v-slot:item.changeCommission="{ value }">
            <v-icon :title="value" v-if="value" size="large" class="me-2">
              mdi-check
            </v-icon>
          </template>
          <template v-slot:item.documents="{ item }">
            <v-chip
              size="small"
              variant="flat"
              class="me-2"
              @click="store.generarCertificados('AE4', item)"
              color="primary"
              title="Ficha de asesoramiento/evaluación"
            >
              <v-icon start icon="mdi-office-building"></v-icon>
              AE4
            </v-chip>
            <v-chip
              v-if="
                item.stage == 20 && !item.exclusion && !item.changeCommission
              "
              variant="flat"
              size="small"
              class="me-2"
              @click="store.generarCertificados('A61', item)"
              color="secondary"
              title="Informe de continuidad"
            >
              <v-icon start icon="mdi-account"></v-icon>
              A6-1
            </v-chip>
            <v-chip
              v-if="item.stage == 20 && item.changeCommission"
              variant="flat"
              size="small"
              class="me-2"
              @click="store.generarCertificados('A62', item)"
              color="orange"
              title="Informe de cambio de sede"
            >
              <v-icon start icon="mdi-account"></v-icon>
              A6-2
            </v-chip>
            <v-chip
              v-if="item.stage == 20 && item.exclusion"
              variant="flat"
              size="small"
              class="me-2"
              @click="store.generarCertificados('A63', item)"
              color="red"
              title="Informe de exclusión"
            >
              <v-icon start icon="mdi-account"></v-icon>
              A6-3
            </v-chip>
            <v-chip
              v-if="
                item.stage == 20 && !item.exclusion && !item.changeCommission
              "
              variant="flat"
              size="small"
              class="me-2"
              @click="store.generarCertificados('A9', item)"
              color="teal"
              title="Informe de asesoramiento"
            >
              <v-icon start icon="mdi-office-building"></v-icon>
              A9
            </v-chip>
            <v-chip
              v-if="
                item.stage == 20 && !item.exclusion && !item.changeCommission
              "
              size="small"
              class="me-2"
              @click="store.generarCertificados('A10', item)"
              color="primary"
              title="Comunicación del resultado del asesoramiento"
            >
              <v-icon start icon="mdi-account"></v-icon>
              A10
            </v-chip>
            <v-chip
              v-if="item.stage == 30"
              size="small"
              class="me-2"
              @click="store.generarCertificados('E3', item)"
              color="primary"
              title="Informe de evaluación"
            >
              <v-icon start icon="mdi-account"></v-icon>
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
      </v-col>
    </v-row>
    <v-row v-if="selectedItem && selectedItem.length">
      <v-col>
        <v-divider thickness="5" color="primary" class="mt-5 mb-5"></v-divider>
        <v-tabs color="deep-purple-accent-4" align-tabs="center">
          <v-tab
            v-for="route of candidateRoutes"
            :to="{
              name: route.name,
              params: { candidate: selectedItem[0] },
            }"
            >{{ route.meta.prompt }}</v-tab
          >
        </v-tabs>
        <v-card elevation="10">
          <router-view> </router-view>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar color="error" elevation="24" v-model="snackbar" timeout="2000">
      {{ textSnackbar }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, nextTick, computed, watch } from "vue";
import { useAppStore } from "../store/app";
import { useRouter } from "vue-router";
import DialogDelete from "../components/DialogDelete";

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
let selectedItem = ref([]);

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
    key: "exclusion",
    title: "Exclusión",
    sortable: false,
    align: "center",
  },
  {
    key: "changeCommission",
    title: "Cambio de sede",
    sortable: false,
    align: "center",
  },
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

const candidateRoutes = router
  .getRoutes()
  .filter((route) => route.meta && route.meta.candidateMenu);

const filteredCandidates = computed(() => {
  if (hide.value) return store.listActiveCandidates();

  return store.candidates;
});

watch(selectedItem, async (newValue, oldValue) => {
  if (newValue.length) {
    router.push({ name: "candidateUCs", params: { candidate: newValue[0] } });
  } else {
    router.push({ name: "candidates" });
  }
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
  item.active = !item.active;
}

function deleteItemConfirm() {
  store.deleteCandidate(editedElement);
  close();
}
</script>
