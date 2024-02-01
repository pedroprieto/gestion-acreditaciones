<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <v-card>
          <v-card-title>
            <h2 class="text-h2 text-center">Gestión del PEAC</h2>
          </v-card-title>
          <v-card-text>
            <v-list lines="two">
              <v-list-item>
                <v-list-item-title>Descripción</v-list-item-title>
                <v-list-item-subtitle
                  >Esta aplicación se ha creado con el objetivo de facilitar la
                  gestión de la documentación del Programa de Acreditación de
                  Competencias Profesionales de la Generalitat
                  Valenciana.</v-list-item-subtitle
                >
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Protección de datos</v-list-item-title>
                <v-list-item-subtitle
                  >Esta aplicación
                  <b>no almacena ningún dato en ningún servidor</b>. Toda la
                  información se almacena de manera <b>local</b> en el
                  navegador.</v-list-item-subtitle
                >
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Almacenamiento de datos</v-list-item-title>
                <v-list-item-subtitle
                  >Los datos se almacenan en el navegador. Si se borran los
                  datos del sitio (almacenamiento local/cookies), se perderán
                  los datos. De igual modo, si se cambia de navegador o
                  dispositivo, los datos no estarán disponibles.
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title
                  >Copias de seguridad y restauración</v-list-item-title
                >
                <v-list-item-subtitle
                  >En la parte superior derecha existen dos botones para
                  realizar y restaurar copias de seguridad de los
                  datos.</v-list-item-subtitle
                >
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup></script>
