<template>
  <div class="border border-gray-200 p-2 m-2">
    {{nestedSetNode.surface_forms[0]}}
    <div v-if="nestedSetNode.children.length>0">
      <AnnotationNode
          v-for="nestedSetChildNode in nestedSetNode.children"
          :nestedSetNode="nestedSetChildNode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";

const props = defineProps({
  nestedSetNode: NestedSetNode,
})
</script>
