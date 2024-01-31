<template>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">¿Desea borrar este elemento?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="$emit('close')"
          >Cancelar</v-btn
        >
        <v-btn color="blue-darken-1" variant="text" @click="$emit('accept')"
          >OK</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
const dialogDelete = defineModel();
defineEmits(["close", "accept"]);
</script>
