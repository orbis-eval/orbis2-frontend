<template>
  <div v-if="!loading">
    <div class="mt-5">
      <OrbisButton :on-click="undoAnnotation" :disabled="isUndoDisabled">
        <OhVueIcon name="la-undo-alt-solid" />
      </OrbisButton>
      <OrbisButton :on-click="redoAnnotation" :disabled="isRedoDisabled">
        <OhVueIcon name="la-redo-alt-solid" />
      </OrbisButton>
    </div>
    <div v-if="nestedSetRootNode">
      <h2 class="p-2 text-4xl">Annotations</h2>
      <table
        aria-label="List of annotations"
        class="table-auto border-spacing-1 text-gray-500 dark:text-gray-400"
      >
        <thead
          class="bg-gray-50 text-left text-lg uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
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
          <tr
            v-for="nestedSetNode in nestedSetRootNode.allAnnotationNodes()"
            class="border-b bg-gray-50 hover:underline dark:border-gray-700 dark:bg-gray-800"
            @mouseleave="emit('setHighlightNestedSetNode', null)"
            @mouseout="emit('setHighlightNestedSetNode', null)"
            @mouseover="emit('setHighlightNestedSetNode', nestedSetNode._id)"
          >
            <td class="p-2">
              <div
                :style="{
                  background:
                    '#' +
                    currentColorPalette.getHexadecimalColorValue(
                      nestedSetNode.annotation_type.color_id,
                    ),
                }"
                class="h-10 w-10 rounded-lg"
              ></div>
            </td>
            <td class="p-2">{{ nestedSetNode.start_indices[0] }}</td>
            <td class="p-2">{{ nestedSetNode.end_indices[0] }}</td>
            <td class="p-2">{{ nestedSetNode.surface_forms[0] }}</td>
            <td class="p-2">{{ nestedSetNode.annotation_type.name }}</td>
            <td class="p-2">
              <OrbisButton
                :on-click="async () => deleteAnnotation(nestedSetNode)"
                size="xs"
              >
                Delete <OhVueIcon name="md-deleteforever-outlined" />
              </OrbisButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addIcons, OhVueIcon } from "oh-vue-icons";
import {
  LaRedoAltSolid,
  LaUndoAltSolid,
  MdDeleteforeverOutlined,
} from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useAnnotationStore } from "~/stores/annotationStore";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

addIcons(LaUndoAltSolid, LaRedoAltSolid, MdDeleteforeverOutlined);

const props = defineProps<{
  loading: boolean;
}>();

const emit = defineEmits(["setHighlightNestedSetNode"]);

const { $orbisApiService } = useNuxtApp();

const annotationStore = useAnnotationStore();
const { nestedSetRootNode, isUndoDisabled, isRedoDisabled } =
  storeToRefs(annotationStore);
const colorPalettesStore = useColorPalettesStore();
const { currentColorPalette } = storeToRefs(colorPalettesStore);

async function deleteAnnotation(nestedSetNode: NestedSetNode) {
  await annotationStore.deleteAnnotation(nestedSetNode, $orbisApiService);
}

async function undoAnnotation() {
  await annotationStore.undoAnnotation();
}

async function redoAnnotation() {
  await annotationStore.redoAnnotation();
}
</script>
