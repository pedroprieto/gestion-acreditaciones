<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>Mis Datos</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-form @submit.prevent="enviar()" v-model="valid">
                <v-text-field
                  label="Nombre"
                  v-model="store.info.name"
                ></v-text-field>
                <v-text-field
                  label="Apellidos"
                  v-model="store.info.familyName"
                ></v-text-field>
                <v-text-field
                  label="NIF"
                  v-model="store.info.nif"
                ></v-text-field>
                <v-text-field
                  label="Ciudad"
                  v-model="store.info.city"
                ></v-text-field>
                <v-text-field
                  label="FamiliaProfesional"
                  v-model="store.info.familiaProfesional"
                ></v-text-field>
                <v-text-field
                  label="Sede"
                  v-model="store.info.sede"
                ></v-text-field>
                <v-btn class="me-4" :type="submit" color="primary"
                  >Volver</v-btn
                >
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "../store/app";
const store = useAppStore(); //initialize the store

const router = useRouter();

function enviar() {
  router.push({ name: "Home" });
}
</script>
