<template>
  <NuxtLayout name="sidebar">
<!--    <div v-on:mouseup="onMouseUp" class="p-4">
      <div class="line">
      <span>
      DEIN KARRIERESCHRITT BEI DEN FINANCIAL SERVICES IN ZÜRICH
      </span>
      </div>
      <div class="line">
        <span>&nbsp;Du schätzt ein modernes und kollegiales</span>
        <span class="annotation">&nbsp;Arbeitsumfeld,</span>
        <span>&nbsp;anspruchsvolle</span>
        <span class="annotation">&nbsp;Tätigkeiten</span>
        <span>&nbsp;und Kundennähe? Du bist es gewohnt, selbstständig zu arbeiten, bist aber gleichzeitig ein hilfsbereiter und </span>
        <span class="annotation">
         flexibler
        <span class="annotation">&nbsp;Teamplayer? </span>
      </span>
        <span>&nbsp;Dann sollten wir uns kennenlernen.</span>
      </div>
      <div class="line">
        DAS BEWEGST DU
      </div>
      <div class="line">- Du bist verantwortlich für einen reibungslosen Support des

        <span class="annotation"> Office <span class="annotation">Assistenz</span> Teams </span>

      </div>
      <div class="line">- Du organisierst Sitzungen, Konferenzen und weitere anspruchsvolle Anlässe</div>
    </div>
    <div class="p-4">
      selected content: {{ selectedText }} ({{ selectionStart }}/{{ selectionEnd }})
    </div>
    -->

    <h2 class="text-4xl p-4">Annotations</h2>
    <ul>
      <li v-for="annotation in annotations">
        {{annotation.surface_forms[0]}} ({{annotation.start_indices[0]}}:{{annotation.end_indices[0]}}) - {{annotation.annotation_type.name}}
      </li>
    </ul>

    <h2 class="text-4xl p-4">Document</h2>
    {{nestedSetRootNode.surface_forms[0]}}

    <h2 class="text-4xl p-4">Rendered Tree</h2>
    <AnnotationNode v-for="nestedSetChildNode in nestedSetRootNode.children"
                    :nestedSetNode="nestedSetChildNode"/>
  </NuxtLayout>
</template>

<script setup lang="ts">

import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {Annotation} from "~/lib/model/annotation";

const selectedText = ref('');
const selectionStart = ref(null);
const selectionEnd = ref(null);

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

const annotations = ref([
  mockAnnotation('AABB', 0, 4, 1, annotationType, annotator),
  mockAnnotation('AA', 0, 2, 2, annotationType, annotator),
  mockAnnotation('A', 0, 1, 3, annotationType, annotator),
  mockAnnotation('DD', 6, 8, 4, annotationType, annotator)
]);

const nestedSetRootNode = ref(NestedSet.toTree(
    annotations.value,
    'AABBCCDDEE',
    1,
    1,
    new Date()
))

/**
 * mouse up event handler on
 */
const onMouseUp = () => {

  // get the selection from the window
  const selection = window.getSelection();

  // get the word string
  selectedText.value = selection.toString();

  // get start/end index of selected text
  const range = selection.getRangeAt(0).cloneRange();
  selectionStart.value = range.startOffset;
  selectionEnd.value = range.endOffset;
};

</script>
