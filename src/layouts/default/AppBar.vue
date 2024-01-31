<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useAppStore } from "@/store/app";

const store = useAppStore();
const router = useRouter();

const mainRoutes = router
  .getRoutes()
  .filter((route) => route.meta && route.meta.mainMenu);

// const drawer = ref(false);

function uploadData(event) {
  const reader = new FileReader();
  reader.readAsText(event.target.files[0]);
  reader.addEventListener(
    "load",
    () => {
      store.restoreData(reader.result);
      alert("Archivo subido correctamente. Se recargará la página");
      location.reload();
    },
    false,
  );
}
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
    <v-spacer></v-spacer>
    <v-btn
      icon
      title="Descargar copia de seguridad"
      @click="store.backupData()"
    >
      <v-icon>mdi-download-outline</v-icon>
    </v-btn>
    <v-btn icon title="Restaurar copia de seguridad">
      <label for="uploadFile" style="cursor: pointer">
        <v-icon>mdi-upload-outline</v-icon>
      </label>
    </v-btn>
    <input
      style="display: none"
      id="uploadFile"
      type="file"
      @change="uploadData"
      accept="application/json"
    />
  </v-toolbar>

  <v-tabs color="deep-purple-accent-4" align-tabs="center">
    <v-tab v-for="route of mainRoutes" :to="route.path">{{
      route.meta.prompt
    }}</v-tab>
  </v-tabs>
</template>
