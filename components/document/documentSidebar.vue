<template>
  <div v-if="!loading">
    <div class="mt-5">
      <OrbisButton :onClick="undoAnnotation" :disabled="isUndoDisabled">
        <OhVueIcon name="la-undo-alt-solid"/>
      </OrbisButton>
      <OrbisButton :onClick="redoAnnotation" :disabled="isRedoDisabled">
        <OhVueIcon name="la-redo-alt-solid"/>
      </OrbisButton>
    </div>
    <div v-if="nestedSetRootNode">
      <h2 class="text-4xl p-2">Annotations</h2>
      <table class="table-auto border-spacing-1 text-gray-500 dark:text-gray-400">
        <thead class="text-lg text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-left">
        <tr>
          <th class="p-2"></th>
          <th class="p-2">start</th>
          <th class="p-2">end</th>
          <th class="p-2">surface</th>
          <th class="p-2">type</th>
          <th class="p-2"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="nestedSetNode in nestedSetRootNode.allAnnotationNodes()"
            class="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700 hover:underline"
            @mouseleave="emit('setHighlightNestedSetNode', null)"
            @mouseout="emit('setHighlightNestedSetNode', null)"
            @mouseover="emit('setHighlightNestedSetNode', nestedSetNode._id)">
          <td class="p-2">
            <div
                :style="{background: '#'+currentColorPalette.getHexadecimalColorValue(nestedSetNode.annotation_type.color_id)}"
                class="rounded-lg w-10 h-10"></div>
          </td>
          <td class="p-2">{{ nestedSetNode.start_indices[0] }}</td>
          <td class="p-2">{{ nestedSetNode.end_indices[0] }}</td>
          <td class="p-2">{{ nestedSetNode.surface_forms[0] }}</td>
          <td class="p-2">{{ nestedSetNode.annotation_type.name }}</td>
          <td class="p-2">
            <OrbisButton :onClick="async () => deleteAnnotation(nestedSetNode)" size="xs">
              Delete <OhVueIcon name="md-deleteforever-outlined"/>
            </OrbisButton>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {addIcons, OhVueIcon} from "oh-vue-icons";
import {
  LaRedoAltSolid,
  LaUndoAltSolid,
  MdDeleteforeverOutlined
} from "oh-vue-icons/icons";
import {useAnnotationStore} from "~/stores/annotationStore";
import {storeToRefs} from "pinia";
import {useRunStore} from "~/stores/runStore";
import {useDocumentStore} from "~/stores/documentStore";
import {useColorPalettesStore} from "~/stores/colorPalettesStore";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";

addIcons(LaUndoAltSolid, LaRedoAltSolid, MdDeleteforeverOutlined);

defineProps({loading: Boolean});
const emit = defineEmits(['setHighlightNestedSetNode']);

const {$orbisApiService} = useNuxtApp();

const documentStore = useDocumentStore();
const runStore = useRunStore();
const annotationStore = useAnnotationStore();
const {nestedSetRootNode, isUndoDisabled, isRedoDisabled} = storeToRefs(annotationStore);
const colorPalettesStore = useColorPalettesStore();
const {currentColorPalette} = storeToRefs(colorPalettesStore);

async function deleteAnnotation(nestedSetNode: NestedSetNode) {
  await annotationStore.deleteAnnotation(nestedSetNode, $orbisApiService);
}

async function undoAnnotation() {
  await annotationStore.undoAnnotation()
}

async function redoAnnotation() {
  await annotationStore.redoAnnotation();
}


</script>
