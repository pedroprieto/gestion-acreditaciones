<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const mainRoutes = router
  .getRoutes()
  .filter((route) => route.meta && route.meta.mainMenu);

// const drawer = ref(false);
</script>

<template>
  <!-- <v-app-bar :elevation="2"> -->
  <!--   <v-app-bar-nav-icon -->
  <!--     variant="text" -->
  <!--     @click.stop="drawer = !drawer" -->
  <!--   ></v-app-bar-nav-icon> -->

  <!--   <v-app-bar-title> -->
  <!--     <v-icon icon="mdi-file-document-multiple-outline" /> -->
  <!--     Gestión del PEAC -->
  <!--   </v-app-bar-title> -->
  <!-- </v-app-bar> -->

  <!-- <v-navigation-drawer v-model="drawer" temporary> -->
  <!--   <v-list> -->
  <!--     <v-list-item v-for="route of mainRoutes" :to="route.path">{{ -->
  <!--       route.meta.prompt -->
  <!--     }}</v-list-item> -->
  <!--   </v-list> -->
  <!-- </v-navigation-drawer> -->
  <v-toolbar color="deep-purple-accent-4">
    <v-toolbar-title>
      <v-icon icon="mdi-file-document-multiple-outline" />
      Gestión del PEAC
    </v-toolbar-title>
  </v-toolbar>

  <v-tabs color="deep-purple-accent-4" align-tabs="center">
    <v-tab v-for="route of mainRoutes" :to="route.path">{{
      route.meta.prompt
    }}</v-tab>
  </v-tabs>
</template>
