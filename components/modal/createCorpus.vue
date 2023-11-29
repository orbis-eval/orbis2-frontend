<template>
  <div>
    <h2 class="mb-5 text-3xl font-bold">{{ $t("corpus.create") }}</h2>
    <Form
      v-slot="{ errors }"
      :validation-schema="validationSchema"
      @submit="createCorpus"
    >
      <div class="mb-4">
        <label class="mb-1 block text-white">{{ $t("name") }}:</label>
        <Field
          :class="errors.corpusName ? 'input-bordered input-error' : ''"
          class="input mb-2 w-full bg-white text-black"
          name="corpusName"
          type="text"
        />
        <ErrorMessage class="text-red-400" name="corpusName" />
      </div>
      <FileInput
        :accepted-file-types="acceptedFileTypes"
        @fileChange="fileChanged"
      />
      <div class="mt-5 flex gap-4">
        <OrbisButton :is-form-button="true"
          >{{ $t("button.create") }}
        </OrbisButton>
        <OrbisButton :on-click="cancel">{{ $t("button.cancel") }}</OrbisButton>
      </div>
    </Form>
  </div>
  <!-- TODO: when in modal and somethings wrongs with backend, show message toast left bottom corner message toast -->
  <div>
    <MessageToast
      :toastSettings="toastSettings"
      class="fixed bottom-4 left-4 z-50"
    />
  </div>
</template>

<script lang="ts" setup>
import { ErrorMessage, Field, Form } from "vee-validate";
import { useI18n } from "vue-i18n";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useCorpusStore } from "~/stores/corpusStore";
import { MessageToastSettings } from "~/lib/types/MessageToastSettings";
import ErrorService from "~/lib/services/errorService";

const { t } = useI18n();

const { closeModal } = useModal();
const corpusStore = useCorpusStore();
const { corpora } = storeToRefs(corpusStore);
const cancel = () => closeModal();

const chosenFiles = ref([] as File[]);
const corpusFileError = ref("");

const showToast = ref(false);
const toastSettings = ref({} as MessageToastSettings);
const fileFormat = ref("label-studio");

const corpusNotExists = (runName: string) => {
  return !corpora.value.some((corpus) => corpus.name === runName);
};

const setCorpusFileError = (error: any) => {
  corpusFileError.value = error;
};

const validationSchema = toTypedSchema(
  zod.object({
    corpusName: zod
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .string({ required_error: t("corpus.error.corpusNameRequired") })
      .refine(corpusNotExists, {
        message: t("corpus.error.corpusExists"),
      }),
  }),
);

function fileChanged(newChosenFiles: File[]) {
  chosenFiles.value = newChosenFiles;
}

const acceptedFileTypes = ".json, .jsonl";

const createCorpus = async (values: any) => {
  try {
    await corpusStore.createCorpus(values.corpusName, chosenFiles.value);
  } catch (error) {
    // Todo: Add Error Message
    console.error(error);
  } finally {
    closeModal();
  } catch (error: any) {
    if (!error.response) {
      // TODO: use correct translation text
      setCorpusFileError("There was an error creating this corpus");
    } else if (error.response.status === 422) {
      setCorpusFileError("There was a problem with the file structure");
    }
    // return this.displayErrorMessage("Network error occured");
    // TODO: differentiate between ErrorMessage and MessageToast
    // toastSettings.value = ErrorService.onError(error);

    // showToast.value = true;
  }
};
</script>
