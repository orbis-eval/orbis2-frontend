<template>
  <div class="flex-1 overflow-auto p-4">
    <div class="mb-2 text-lg font-bold">Annotations</div>
    <div v-if="nestedSetRootNode" class="space-y-2">
      <div
        v-for="nestedSetNode in nestedSetRootNode.allAnnotationNodes()"
        :key="nestedSetNode._id"
      >
        <div
          :class="
            nestedSetNode._id === selectedAnnotation?._id
              ? 'bg-gray-500'
              : 'bg-gray-700'
          "
          class="flex cursor-pointer items-center rounded p-2 hover:bg-gray-500"
          @mouseleave="
            emit('setHighlightNestedSetNode', [selectedAnnotation?._id])
          "
          @mouseover="
            emit('setHighlightNestedSetNode', [
              selectedAnnotation?._id,
              nestedSetNode._id,
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
                'font-bold': nestedSetNode._id === selectedAnnotation?._id,
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
</template>

<script lang="ts" setup>
import { addIcons, OhVueIcon } from "oh-vue-icons";
import { MdDeleteforeverOutlined } from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useAnnotationStore } from "~/stores/annotationStore";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

addIcons(MdDeleteforeverOutlined);

const emit = defineEmits(["setHighlightNestedSetNode"]);

const { $orbisApiService } = useNuxtApp();

const annotationStore = useAnnotationStore();
const { nestedSetRootNode, selectedAnnotation } = storeToRefs(annotationStore);
const colorPalettesStore = useColorPalettesStore();
const { currentColorPalette } = storeToRefs(colorPalettesStore);

async function deleteAnnotation(nestedSetNode: NestedSetNode) {
  await annotationStore.deleteAnnotation(nestedSetNode, $orbisApiService);
}
</script>
