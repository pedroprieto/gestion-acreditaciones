<template>
  <v-container>
    <v-row justify="center">
      <v-col md="8">
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
                <v-list-item-subtitle>
                  Los datos <b>se almacenan en el navegador</b>: no se deben
                  borrar los datos del sitio (almacenamiento local/cookies),
                  usar otro navegador, o utilizar navegación de incógnito.
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
              <v-list-item>
                <v-list-item-title>Responsabilidad</v-list-item-title>
                <v-list-item-subtitle
                  >Esta aplicación no sustituye a la documentación oficial. Solo
                  es una herramienta para ayudar a generar dicha documentación.
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        <v-card class="mt-2">
          <v-card-text>
            <h3 class="text-h3 mt-2 mb-2 text-center">Tutorial de uso</h3>
            <iframe
              style="width: 100%; aspect-ratio: 16/9"
              src="https://www.youtube.com/embed/UypZaga6JE0?si=4gj9JcTpaTRnKEWv"
              title="Gestión PEAC"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup></script>
