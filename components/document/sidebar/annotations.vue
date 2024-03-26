<template>
  <div class="flex-1 overflow-auto p-4">
    <div class="mb-2 text-lg font-bold">Annotations</div>
    <div v-if="isRun" role="tablist" class="tabs-boxed tabs">
      <a
        @click="activeAnnotationTab = 'tp'"
        role="tab"
        class="tab"
        :class="activeAnnotationTab == 'tp' ? 'tab-active' : ''"
        >TP</a
      >
      <a
        @click="activeAnnotationTab = 'fp'"
        role="tab"
        class="tab"
        :class="activeAnnotationTab == 'fp' ? 'tab-active' : ''"
        >FP</a
      >
      <a
        @click="activeAnnotationTab = 'fn'"
        role="tab"
        class="tab"
        :class="activeAnnotationTab == 'fn' ? 'tab-active' : ''"
        >FN</a
      >
    </div>
    <div v-if="nestedSetRootNode" class="space-y-2">
      <div
        v-for="nestedSetNode in filterAnnotationNodes(
          nestedSetRootNode.allAnnotationNodes(),
        )"
        :key="nestedSetNode.identifier"
        @click="annotationStore.setSelectedAnnotation(nestedSetNode)"
      >
        <div
          :class="
            nestedSetNode.identifier === selectedAnnotation?.identifier
              ? 'bg-gray-500'
              : 'bg-gray-700'
          "
          class="flex cursor-pointer items-center rounded p-2 hover:bg-gray-500"
          @mouseleave="
            emit('setHighlightNestedSetNode', [selectedAnnotation?.identifier])
          "
          @mouseover="
            emit('setHighlightNestedSetNode', [
              selectedAnnotation?.identifier,
              nestedSetNode.identifier,
            ])
          "
        >
          <div class="flex flex-grow">
            <div
              :style="{
                background:
                  '#' +
                  currentColorPalette.getHexadecimalColorValue(
                    nestedSetNode.annotationType.colorId || 1,
                  ),
              }"
              class="mr-2 h-4 w-4 shrink-0"
            ></div>
            <div
              :class="{
                'font-bold':
                  nestedSetNode.identifier === selectedAnnotation?.identifier,
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
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {MdDeleteforeverOutlined} from "oh-vue-icons/icons";
import {storeToRefs} from "pinia";
import {useRunStore} from "~/stores/runStore";
import {useDocumentStore} from "~/stores/documentStore";
import {useAnnotationStore} from "~/stores/annotationStore";
import {useColorPalettesStore} from "~/stores/colorPalettesStore";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";

addIcons(MdDeleteforeverOutlined);

const emit = defineEmits(["setHighlightNestedSetNode"]);

const runStore = useRunStore();
const {selectedRun} = storeToRefs(runStore);
const documentStore = useDocumentStore();
const {currentDocument} = storeToRefs(documentStore);
const annotationStore = useAnnotationStore();
const {nestedSetRootNode, selectedAnnotation} = storeToRefs(annotationStore);
const colorPalettesStore = useColorPalettesStore();
const {currentColorPalette} = storeToRefs(colorPalettesStore);

async function deleteAnnotation(nestedSetNode: NestedSetNode) {
  await annotationStore.deleteAnnotation(nestedSetNode);
}

const activeAnnotationTab = ref("tp");

const isRun = computed(() => {
  return currentDocument.value.runId === selectedRun.value.identifier;
});

const filterAnnotationNodes = (nodes: NestedSetNode[]) => {
  if (isRun.value) {
    return nodes.filter((node) => {

      if (activeAnnotationTab.value === "tp") {
        return currentDocument.value.scoring.tp.find((tp) => tp.identifier === node.identifier);
      } else if (activeAnnotationTab.value === "fp") {
        return currentDocument.value.scoring.fp.find((fp) => fp.identifier === node.identifier);
      } else if (activeAnnotationTab.value === "fn") {
        return currentDocument.value.scoring.fn.find((fn) => fn.identifier === node.identifier);
      }
    });
  }
  return nodes;
};
</script>
