<template>
  <div>
    <h2 class="font-bold text-3xl mb-5">Create run</h2>
    <Form v-slot="{ errors }" :validation-schema="validationSchema" @submit="createRun">
      <div class="mb-4">
        <label class="text-white block mb-1 ">Name:</label>
        <Field :class="errors.runName ? 'input-bordered input-error' : ''"
               class="input w-full bg-white text-black mb-2"
               name="runName"
               type="text"/>
        <ErrorMessage class="text-red-400" name="runName"/>
      </div>
      <div class="mb-4">
        <label class="text-white block mb-1">Description:</label>
        <Field :class="errors.runDesc ? 'input-bordered input-error' : ''"
               class="input w-full bg-white text-black mb-2"
               name="runDesc"
               type="text"/>
        <ErrorMessage class="text-red-400" name="runDesc"/>
      </div>
      <div class="grid grid-cols-3 gap-4 mt-10">
        <OrbisButton :isFormButton="true">Create</OrbisButton>
        <OrbisButton :onClick="() => closeModal()">Cancel</OrbisButton>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import {Form, Field, ErrorMessage, useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import * as zod from 'zod';
import {useRunStore} from "~/stores/runStore";
import {storeToRefs} from "pinia";
import {Run} from "~/lib/model/run";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {useCorpusStore} from "~/stores/corpusStore";

const {$orbisApiService} = useNuxtApp() as { $orbisApiService: OrbisApiService };
const {closeModal} = useModal();
const runStore = useRunStore();
const corpusStore = useCorpusStore();
const {corpus} = storeToRefs(corpusStore);
const {errors} = useForm();

const validationSchema = toTypedSchema(zod.object({
  runName: zod.string({required_error: 'Run Name is required'}),
  runDesc: zod.string({required_error: 'Run Description is required'})
}));

const createRun = async (values: any) => {
  try {
    const newRun = new Run({name: values.runName, description: values.runDesc, corpus: corpus.value});
    await runStore.createRun(newRun, corpus.value, $orbisApiService);
  } catch (error) {
    // Todo: Show error to user
    console.error(error);
  } finally {
    closeModal();
  }
}
</script>
