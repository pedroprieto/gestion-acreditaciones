<template>
  <div class="container">
    <form @submit.prevent="enviar()">
      <div class="field">
        <label for="name" class="label">Nombre</label>
        <div class="control">
          <input
            required
            v-model="store.info.name"
            id="name"
            class="input"
            type="text"
            placeholder="Nombre"
          />
        </div>
        <label for="surname" class="label">Apellidos</label>
        <div class="control">
          <input
            required
            v-model="store.info.familyName"
            id="surname"
            class="input"
            type="text"
            placeholder="Apellidos"
          />
        </div>
        <label for="nif" class="label">NIF</label>
        <div class="control">
          <input
            required
            v-model="store.info.nif"
            id="nif"
            class="input"
            type="text"
            placeholder="NIF"
          />
        </div>
        <div class="control">
          <input
            required
            v-model="store.info.city"
            id="city"
            class="input"
            type="text"
            placeholder="Ciudad"
          />
        </div>
        <div class="control">
          <input
            required
            v-model="store.info.familiaProfesional"
            id="familiaProfesional"
            class="input"
            type="text"
            placeholder="Familia profesional"
          />
        </div>
        <div class="control">
          <input
            required
            v-model="store.info.sede"
            id="sede"
            class="input"
            type="text"
            placeholder="Sede"
          />
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-primary">Enviar</button>
        </div>
        <!-- <div class="control"> -->
        <!--   <button -->
        <!--     type="button" -->
        <!--     @click="cancelarEdicion()" -->
        <!--     class="button is-link is-light" -->
        <!--   > -->
        <!--     Cancelar -->
        <!--   </button> -->
        <!-- </div> -->
      </div>
    </form>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "../store/app";
const store = useAppStore(); //initialize the store

const router = useRouter();

function enviar() {
  router.push({ name: "root" });
}
</script>
