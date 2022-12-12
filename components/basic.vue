<script setup lang="ts">
const counter = ref(0)

</script>


<template>
    <v-app id="inspire" style="height: 100%">
      <v-toolbar color="green" dark fixed app>
        <v-toolbar-title>Orbis2</v-toolbar-title>
      </v-toolbar>
      <v-container style="height: 100%;">
        <v-layout justify-center align-center style="height: 100%">
          <v-navigation-drawer border style="height: 100%">
            <v-list>
              <v-list-item prepend-icon="mdi-file-document-multiple-outline" title="Career Coach" />
            </v-list>
            <v-divider></v-divider>
            <v-list density="compact" nav>
              <v-list-item prepend-icon="mdi-run-fast" title="Runs" value="runs"/>
              <v-list-item prepend-icon="mdi-file-document-outline" title="Documents" value="document" />
              <v-list-item prepend-icon="mdi-account-group-outline" title="Members" value="members" />
              <v-list-item prepend-icon="mdi-label-multiple" title="Lables" value="label" />
            </v-list>
          </v-navigation-drawer>
          <v-main>
            <v-card style="padding: 20px; height: 100%" outlined border >

                <v-layout>
                  <documents />
                </v-layout>
            </v-card>
          </v-main>
        </v-layout>
      </v-container>

      <v-footer color="green">
        <span class="white--text">&copy; 2022</span>
      </v-footer>
    </v-app>
</template>
