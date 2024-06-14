<template>
  <v-container>
    <v-row align="center">
      <v-col md="5" offset-md="1"
        >Acta provisional de evaluación (Presidente/Secretari@)
      </v-col>
      <v-col md="2">
        <v-text-field
          block
          label="Código comisión"
          v-model="store.info.commissionCode"
        ></v-text-field>
      </v-col>
      <v-col md="2">
        <v-text-field
          block
          type="date"
          label="Fecha"
          v-model="date"
        ></v-text-field>
      </v-col>
      <v-col md="1">
        <v-btn block target="_blank" :href="link2" prepend-icon="mdi-link">
          Ir</v-btn
        >
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col md="5" offset-md="1"
        >Comunicación de resultado al candidato (Presidente/Secretari@)</v-col
      >
      <v-col md="2">
        <v-text-field
          block
          label="Código comisión"
          v-model="store.info.commissionCode"
        ></v-text-field>
      </v-col>
      <v-col md="2">
        <v-text-field
          block
          label="NIF del candidato"
          v-model="candidateNIF"
        ></v-text-field>
      </v-col>
      <v-col md="1">
        <v-btn block target="_blank" :href="link3" prepend-icon="mdi-link">
          Ir</v-btn
        >
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col md="5" offset-md="1"
        >Acta definitiva de evaluación (Presidente/Secretari@)</v-col
      >
      <v-col md="2">
        <v-text-field
          block
          label="Código comisión"
          v-model="store.info.commissionCode"
        ></v-text-field>
      </v-col>
      <v-col md="2">
        <v-text-field
          block
          type="date"
          label="Fecha"
          v-model="date2"
        ></v-text-field>
      </v-col>
      <v-col md="1">
        <v-btn block target="_blank" :href="link4" prepend-icon="mdi-link">
          Ir</v-btn
        >
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col md="5" offset-md="1"
        >Comunicación de resultado de la reclamación al candidato
        (Presidente/Secretari@)</v-col
      >
      <v-col md="2">
        <v-text-field
          block
          label="Código comisión"
          v-model="store.info.commissionCode"
        ></v-text-field>
      </v-col>
      <v-col md="2">
        <v-text-field
          block
          label="NIF del candidato"
          v-model="candidateNIF2"
        ></v-text-field>
      </v-col>
      <v-col md="1">
        <v-btn block target="_blank" :href="link5" prepend-icon="mdi-link">
          Ir</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAppStore } from "../store/app";

const store = useAppStore();

let date = ref("");
let candidateNIF = ref("");
let date2 = ref("");
let candidateNIF2 = ref("");

let link1 =
  "https://sforms.gva.es/sformssistemaexplotacion/servletObtenerXMLns/ObtenerXMLorig?formulario=60852";

const link2 = computed(() => {
  let dateFormatted = date.value.split("-").reverse().join("");
  return `https://sforms.gva.es/sformssistemaexplotacion/servletObtenerXMLns/ObtenerXMLorig?formulario=60853&COMISION=${store.info.commissionCode}&FEC_COMISION=${dateFormatted}`;
});

const link3 = computed(() => {
  return `https://sforms.gva.es/sformssistemaexplotacion/servletObtenerXMLns/ObtenerXMLorig?formulario=60855&COMISION=${store.info.commissionCode}&DNI=${candidateNIF.value}`;
});

const link4 = computed(() => {
  let dateFormatted = date2.value.split("-").reverse().join("");
  return `https://sforms.gva.es/sformssistemaexplotacion/servletObtenerXMLns/ObtenerXMLorig?formulario=61126&COMISION=${store.info.commissionCode}&FEC_COMISION=${dateFormatted}`;
});

const link5 = computed(() => {
  return `https://sforms.gva.es/sformssistemaexplotacion/servletObtenerXMLns/ObtenerXMLorig?formulario=60856&COMISION=${store.info.commissionCode}&DNI=${candidateNIF2.value}`;
});
</script>
