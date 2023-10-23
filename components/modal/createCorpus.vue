<template>
  <div>
    <h2 class="font-bold text-3xl mb-5">Create Corpus</h2>
    <Form v-slot="{ errors }" :validation-schema="validationSchema" @submit="createCorpus">
      <div class="mb-4">
        <label class="text-white block mb-1 ">Name of Corpus:</label>
        <Field :class="errors.corpusName ? 'input-bordered input-error' : ''"
               class="input w-full bg-white text-black mb-2"
               name="corpusName"
               type="text"/>
        <ErrorMessage class="text-red-400" name="corpusName"/>
      </div>
      <FileInput acceptedFileTypes=".json" @fileChange="fileChanged"/>
      <div class="flex gap-4 mt-5">
        <OrbisButton :isFormButton="true" :onClick="() => {}">Create</orbisButton>
        <OrbisButton :onClick="cancel">cancel</orbisButton>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import {ErrorMessage, Field, Form} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";
import {useCorpusStore} from "~/stores/corpusStore";

const {$orbisApiService} = useNuxtApp();
const {closeModal} = useModal();
const corpusStore = useCorpusStore();
const {corpora} = storeToRefs(corpusStore);
const cancel = () => closeModal();

let chosenFiles = ref([] as File[]);

const corpusNotExists = (runName: string) => {
  return !corpora.value.some(corpus => corpus.name === runName);
};

const validationSchema = toTypedSchema(zod.object({
  corpusName: zod.string({required_error: 'Corpus Name is required'})
      .refine(corpusNotExists, {message: 'Corpus with this name already exists'})
}));


function fileChanged(newChosenFiles: File[]) {
  chosenFiles.value = newChosenFiles;
}

const createCorpus = async (values: any) => {
  try {
    await corpusStore.createCorpus(values.corpusName, chosenFiles.value, $orbisApiService);
  } catch (Error) {
    // Todo: Add Error Message
    console.error(Error);
  } finally {
    closeModal();
  }
};
</script>
