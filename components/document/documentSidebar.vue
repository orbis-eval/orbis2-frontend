<template>
  <div v-if="!loading" id="document-sidebar" class="flex h-full flex-col">
    <div class="flex h-full w-full flex-col bg-gray-800 pt-4 text-white">
      <div class="p-4">
        <div class="text-lg font-bold">Selection Info</div>
        <div class="mt-2 rounded bg-gray-700 p-2">
          <div v-if="selectedAnnotation">
            <div class="flex items-center justify-between">
              <span
                :style="{
                  color:
                    '#' +
                    currentColorPalette.getHexadecimalColorValue(
                      selectedAnnotation.annotationType.colorId,
                    ),
                }"
                class="text-sm"
                >{{ selectedAnnotation.annotationType.name }}</span
              >
            </div>
            <div class="mt-1 font-bold">
              {{ selectedAnnotation.surfaceForms[0] }}
            </div>
            <div class="mt-3 flex flex-col">
              <span class="mb-1 text-sm"
                >Text section: {{ selectedAnnotation.startIndices[0] }} -
                {{ selectedAnnotation.endIndices[0] }}</span
              >
              <span class="mb-1 text-sm"
                >Key: {{ selectedAnnotation.key }}</span
              >
            </div>
          </div>
          <div v-else>No Annotation is selected</div>
        </div>
      </div>

      <div class="grow-0 pl-4">
        <OrbisButton
          :disabled="isUndoDisabled"
          :on-click="undoAnnotation"
          class="mr-4"
        >
          <OhVueIcon name="la-undo-alt-solid" />
        </OrbisButton>
        <OrbisButton :disabled="isRedoDisabled" :on-click="redoAnnotation">
          <OhVueIcon name="la-redo-alt-solid" />
        </OrbisButton>
      </div>

      <div class="flex-1 overflow-auto p-4">
        <div class="mb-2 text-lg font-bold">Annotations</div>
        <div v-if="nestedSetRootNode" class="space-y-2">
          <div
            v-for="nestedSetNode in nestedSetRootNode.allAnnotationNodes()"
            :key="nestedSetNode.id"
          >
            <div
              :class="
                nestedSetNode.id === selectedAnnotation?.id
                  ? 'bg-gray-500'
                  : 'bg-gray-700'
              "
              class="flex cursor-pointer items-center rounded p-2 hover:bg-gray-500"
              @mouseleave="
                emit('setHighlightNestedSetNode', [selectedAnnotation?.id])
              "
              @mouseover="
                emit('setHighlightNestedSetNode', [
                  selectedAnnotation?.id,
                  nestedSetNode.id,
                ])
              "
            >
              <div
                class="flex flex-grow"
                @click="annotationStore.setSelectedAnnotation(nestedSetNode)"
              >
                <div
                  :style="{
                    background:
                      '#' +
                      currentColorPalette.getHexadecimalColorValue(
                        nestedSetNode.annotationType.colorId,
                      ),
                  }"
                  class="mr-2 h-4 w-4 shrink-0"
                ></div>
                <div
                  :class="{
                    'font-bold': nestedSetNode.id === selectedAnnotation?.id,
                  }"
                  class="text-sm"
                >
                  {{ nestedSetNode.surfaceForms[0] }}
                </div>
                <div class="flex-grow"></div>
              </div>
              <OrbisButton
                :on-click="() => deleteAnnotation(nestedSetNode)"
                size="xs"
                transparent
              >
                <OhVueIcon name="md-deleteforever-outlined" />
              </OrbisButton>
            </div>
          </div>
        </div>
      </div>
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

defineProps<{
  loading: boolean;
}>();

const emit = defineEmits(["setHighlightNestedSetNode"]);

const { $orbisApiService } = useNuxtApp();

const annotationStore = useAnnotationStore();
const {
  nestedSetRootNode,
  selectedAnnotation,
  isUndoDisabled,
  isRedoDisabled,
} = storeToRefs(annotationStore);
const colorPalettesStore = useColorPalettesStore();
const { currentColorPalette } = storeToRefs(colorPalettesStore);

watch(selectedAnnotation, (newSelectedAnnotation) => {
  if (newSelectedAnnotation) {
    emit("setHighlightNestedSetNode", [newSelectedAnnotation.id]);
  }
});

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

<style lang="scss" scoped>
#document-sidebar {
  width: 450px;
}
</style>
