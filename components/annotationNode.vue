<template>
    <span v-if="nestedSetNode.annotation_type.name==NestedSet.GAP_ANNOTATION_TYPE_NAME">
      {{ nestedSetNode.surface_forms[0] }}
    </span>
  <span v-else class="annotation">
                <span v-if="nestedSetNode.children.length==0">
                  {{ nestedSetNode.surface_forms[0] }}
                </span>
            <AnnotationNode
                v-for="nestedSetChildNode in nestedSetNode.children"
                :nestedSetNode="nestedSetChildNode"
            />
    </span>
</template>

<script setup lang="ts">
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";

const props = defineProps({
  nestedSetNode: NestedSetNode
});
</script>
