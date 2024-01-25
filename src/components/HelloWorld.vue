<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <input name="" type="text" value="" v-model="store.test" />
      {{ store.test }}
    </v-responsive>
  </v-container>
</template>

<script setup>
import { useAppStore } from "../store/app";

const store = useAppStore(); //initialize the store
</script>
