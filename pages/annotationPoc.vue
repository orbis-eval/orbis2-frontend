<template>
  <NuxtLayout name="sidebar">
    <h2 class="text-4xl p-4">Annotations</h2>
    <ul>
      <li v-for="annotation in annotations">
        {{annotation.surface_forms[0]}} ({{annotation.start_indices[0]}}:{{annotation.end_indices[0]}}) - {{annotation.annotation_type.name}}
      </li>
    </ul>
    <div v-if="nestedSetRootNode">
      <h2 class="text-4xl p-4">Document</h2>
      {{nestedSetRootNode.surface_forms[0]}}
      <h2 class="text-4xl p-4">Rendered Tree</h2>
      <AnnotationNode :nestedSetNode="nestedSetRootNode"
                      @updateAnnotations="updateAnnotations"/>
    </div>
    <div v-else>
      <h2 class="text-4xl">Tree could not be rendered</h2>
        {{documentString}}
        <ul>
          <li v-for="node in errorNodes">
            {{node.start_indices[0]}}/{{node.end_indices[0]}}
          </li>
        </ul>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">

import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {Annotation} from "~/lib/model/annotation";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";

function mockAnnotation(
    surfaceForm: string,
    start: number,
    end: number,
    id: number,
    annotationType: AnnotationType,
    annotator: Annotator): Annotation {
  return new Annotation({
    key: "",
    surface_forms: [surfaceForm],
    start_indices: [start],
    end_indices: [end],
    annotation_type: annotationType,
    annotator: annotator,
    run_id: 1,
    document_id: 1,
    metadata: [],
    timestamp: new Date(),
    _id: id
  });
}

let annotationType: AnnotationType = new AnnotationType({
  name: "A Type",
  _id: 1
});

let annotator: Annotator = new Annotator({
  name: "test annotator",
  roles: [],
  _id: 1
});

const documentString = ref('AA BB CC DD EE');

const annotations = ref([
  mockAnnotation('AA BB', 0, 5, 1, annotationType, annotator),
  mockAnnotation('AA', 0, 2, 2, annotationType, annotator),
  mockAnnotation('A', 0, 1, 3, annotationType, annotator),
  mockAnnotation('DD', 9, 11, 4, annotationType, annotator)
  // faulty annotations
  // mockAnnotation('AB', 0, 2, 1, annotationType, annotator),
  // mockAnnotation('BC', 1, 3, 2, annotationType, annotator)
]);

const errorNodes = ref([]);
const parseErrorCallBack = (parseError: NestedSetParseError) => {
  errorNodes.value = parseError.nodes;
}

const nestedSetRootNode = ref(NestedSet.toTree(
    annotations.value,
    documentString.value,
    1,
    1,
    new Date(),
    parseErrorCallBack
))

function updateAnnotations(selection) {
  console.log(`${selection.word}:${selection.start}/${selection.end}, ${documentString.value.substring(selection.start, selection.end)}`);
  annotations.value.push(
      mockAnnotation(selection.word, selection.start, selection.end, 1, annotationType, annotator)
  );
  nestedSetRootNode.value = NestedSet.toTree(
      annotations.value,
      documentString.value,
      1,
      1,
      new Date(),
      parseErrorCallBack
  );
}
</script>
