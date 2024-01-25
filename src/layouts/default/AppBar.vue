<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const mainRoutes = router
  .getRoutes()
  .filter((route) => route.meta && route.meta.mainMenu);

const drawer = ref(false);
</script>

<template>
  <v-app-bar :elevation="2">
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-6" />

      Essentials Preset
    </v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item v-for="route of mainRoutes" :to="route.path">{{
        route.meta.prompt
      }}</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
