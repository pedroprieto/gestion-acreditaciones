<template>
  <v-main>
    <router-view />
    <v-snackbar
      color="error"
      elevation="24"
      v-model="store.error"
      timeout="2000"
    >
      {{ store.errorText }}
    </v-snackbar>
  </v-main>
</template>

<script setup>
import { useAppStore } from "@/store/app";
const store = useAppStore();
</script>
