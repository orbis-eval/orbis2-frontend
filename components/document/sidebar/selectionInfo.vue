<template>
  <div class="p-4">
    <div class="text-lg font-bold">
      {{ $t("document.sidebar.selectionInfo.selectionInfoTitle") }}
    </div>
    <div class="mt-2 rounded p-2">
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
            >{{ $t("document.sidebar.selectionInfo.textSection") }}:
            {{ selectedAnnotation.startIndices[0] }} -
            {{ selectedAnnotation.endIndices[0] }}</span
          >
          <span class="mb-1 text-sm"
            >{{ $t("document.sidebar.selectionInfo.fieldKey") }}:
            {{ selectedAnnotation.key }}</span
          >
        </div>
      </div>
      <div v-else>
        {{ $t("document.sidebar.selectionInfo.noSelectionInfo") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAnnotationStore } from "~/stores/annotationStore";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";

const annotationStore = useAnnotationStore();
const { selectedAnnotation } = storeToRefs(annotationStore);
const colorPalettesStore = useColorPalettesStore();
const { currentColorPalette } = storeToRefs(colorPalettesStore);
</script>
