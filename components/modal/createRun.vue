<template>
  <div>
    <h2 class="mb-5 text-3xl font-bold">{{ $t("run.createRun") }}</h2>
    <Form
      v-slot="{ errors }"
      :validation-schema="validationSchema"
      @submit="createRun"
    >
      <div class="mb-4">
        <label class="mb-1 block text-white">{{ $t("name") }}:</label>
        <Field
          :class="errors.runName ? 'input-bordered input-error' : ''"
          class="input mb-2 w-full bg-white text-black"
          name="runName"
          type="text"
        />
        <ErrorMessage class="text-red-400" name="runName" />
      </div>
      <div class="mb-4">
        <label class="mb-1 block text-white">{{ $t("description") }}:</label>
        <Field
          :class="errors.runDesc ? 'input-bordered input-error' : ''"
          class="input mb-2 w-full bg-white text-black"
          name="runDesc"
          type="text"
        />
        <ErrorMessage class="text-red-400" name="runDesc" />
      </div>
      <div class="mt-10 grid grid-cols-3 gap-4">
        <OrbisButton :is-form-button="true"
          >{{ $t("button.create") }}
        </OrbisButton>
        <OrbisButton :on-click="() => closeModal()"
          >{{ $t("button.cancel") }}
        </OrbisButton>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useRunStore } from "~/stores/runStore";
import { Run } from "~/lib/model/run";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { useCorpusStore } from "~/stores/corpusStore";

const { $orbisApiService } = useNuxtApp() as {
  $orbisApiService: OrbisApiService;
};
const { t } = useI18n();
const { closeModal } = useModal();
const runStore = useRunStore();
const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);
const { runs } = storeToRefs(runStore);

const runNotExists = (runName: string) => {
  return !runs.value.some((run) => run.name === runName);
};

const validationSchema = toTypedSchema(
  zod.object({
    runName: zod
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .string({ required_error: t("run.error.runNameRequired") })
      .refine(runNotExists, { message: t("run.error.runExists") }),
    runDesc: zod.string({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      required_error: t("run.error.runDescriptionRequired"),
    }),
  }),
);

const createRun = async (values: any) => {
  try {
    const newRun = new Run({
      name: values.runName,
      description: values.runDesc,
      corpus: corpus.value,
    });
    await runStore.createRun(newRun, corpus.value, $orbisApiService);
  } catch (error) {
    // Todo: Show error to user
    console.error(error);
  } finally {
    closeModal();
  }
};
</script>
