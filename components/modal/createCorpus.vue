<template>
  <div>
    <h2 class="mb-5 text-3xl font-bold">Create Corpus</h2>
    <Form
      v-slot="{ errors }"
      :validation-schema="validationSchema"
      @submit="createCorpus"
    >
      <div class="mb-4">
        <label class="mb-1 block text-white">Name of Corpus:</label>
        <Field
          :class="errors.corpusName ? 'input-bordered input-error' : ''"
          class="input mb-2 w-full bg-white text-black"
          name="corpusName"
          type="text"
        />
        <ErrorMessage class="text-red-400" name="corpusName" />
      </div>
      <FileInput accepted-file-types=".json" @fileChange="fileChanged" />
      <div class="mt-5 flex gap-4">
        <OrbisButton :is-form-button="true">Create</OrbisButton>
        <OrbisButton :on-click="cancel">cancel</OrbisButton>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import { ErrorMessage, Field, Form } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useCorpusStore } from "~/stores/corpusStore";

const { $orbisApiService } = useNuxtApp();
const { closeModal } = useModal();
const corpusStore = useCorpusStore();
const { corpora } = storeToRefs(corpusStore);
const cancel = () => closeModal();

const chosenFiles = ref([] as File[]);

const corpusNotExists = (runName: string) => {
  return !corpora.value.some((corpus) => corpus.name === runName);
};

const validationSchema = toTypedSchema(
  zod.object({
    corpusName: zod
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .string({ required_error: "Corpus Name is required" })
      .refine(corpusNotExists, {
        message: "Corpus with this name already exists",
      }),
  }),
);

function fileChanged(newChosenFiles: File[]) {
  chosenFiles.value = newChosenFiles;
}

const createCorpus = async (values: any) => {
  try {
    await corpusStore.createCorpus(
      values.corpusName,
      chosenFiles.value,
      $orbisApiService,
    );
  } catch (Error) {
    // Todo: Add Error Message
    console.error(Error);
  } finally {
    closeModal();
  }
};
</script>
