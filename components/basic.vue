<script setup lang="ts">
import documents from "~/components/documents.vue";
import document from "~/components/document.vue";


const currentComponent = ref(documents)
const items = ["run1", "run2", "run3"]
const clickedDocumentId = ref(0)

watch(clickedDocumentId, (newDocumentId) => {
  console.log(`document ${newDocumentId} has been clicked on`)
  clickedDocumentId.value = newDocumentId
  currentComponent.value = document
})

</script>


<template>
    <v-app id="inspire" style="height: 100%">
      <v-toolbar color="primaryDark" dark fixed app>
        <v-item-group class="align-center" style="display: inline-flex; width: 300px; height: 100%">
          <v-img src="/images/transparent_logo.png"/>
          <v-toolbar-title>Orbis2</v-toolbar-title>
        </v-item-group>
      </v-toolbar>
      <v-container style="height: 100%;">
        <v-layout justify-center align-center style="height: 100%">
          <v-navigation-drawer absolute border style="height: 100%">
            <v-list>
              <v-list-item prepend-icon="mdi-file-document-multiple-outline" title="Career Coach" />
            </v-list>
            <v-divider></v-divider>
            <v-list density="compact" nav >
              <v-list-item prepend-icon="mdi-run-fast" value="runs">
                <v-select :items="items" label="Runs"/>
              </v-list-item>
              <v-list-item prepend-icon="mdi-file-document-outline" title="Documents" value="document" />
              <v-list-item prepend-icon="mdi-account-group-outline" title="Members" value="members" />
              <v-list-item prepend-icon="mdi-label-multiple" title="Lables" value="label" />
            </v-list>
          </v-navigation-drawer>
          <v-main>
            <v-card style="padding: 20px; height: 100%" outlined border >
                <v-layout>
                  <component :is="currentComponent" @clickedDocumentId="(id) => clickedDocumentId = id"
                             :documentId="clickedDocumentId"/>
                </v-layout>
            </v-card>
          </v-main>
        </v-layout>
      </v-container>

      <v-footer color="primary">
        <span class="white--text">&copy; 2022</span>
      </v-footer>
    </v-app>
</template>
