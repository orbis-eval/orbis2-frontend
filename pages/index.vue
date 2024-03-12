<template>
  <NuxtLayout name="default-layout">
    <div class="flex h-full items-center justify-center">
      <!-- Todo: Show spinner for creating/deleting in modal  -->
      <div class="max-w-xl grow">
        <div class="content-card border-2 border-gray-600">
          <div class="card-body">
            <div class="card-title flex">
              <div>{{ $t("corpus.corpora") }}</div>
              <div class="flex-grow"></div>
              <OrbisButton
                :on-click="() => openModal(modalCreateCorpus)"
                size="sm"
                transparent
              >
                <OhVueIcon name="hi-plus" />
              </OrbisButton>
            </div>
            <ul class="mt-5">
              <li
                v-for="corpus in corpora"
                :key="corpus.identifier"
                class="flex py-2"
              >
                <NuxtLink
                  :to="`/corpora/${corpus.identifier}/runs`"
                  class="hover:text-purple-400"
                >
                  {{ corpus.name }}
                </NuxtLink>
                <div class="flex-grow"></div>
                <OrbisButton
                  :on-click="() => onDeleteCorpus(corpus)"
                  size="sm"
                  transparent
                >
                  <OhVueIcon name="md-deleteforever-outlined" />
                </OrbisButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <OrbisMessageToast />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { addIcons, OhVueIcon } from "oh-vue-icons";
import { useI18n } from "vue-i18n";
import { HiPlus, MdDeleteforeverOutlined } from "oh-vue-icons/icons";
import { useRunStore } from "~/stores/runStore";
import { useCorpusStore } from "~/stores/corpusStore";
import modalCreateCorpus from "~/components/modal/createCorpus.vue";
import modalDeleteCorpus from "~/components/modal/deleteCorpus.vue";

import { Corpus } from "~/lib/model/corpus";
import { useMessageToastService } from "~/lib/services/messageToastService";

addIcons(MdDeleteforeverOutlined, HiPlus);

const { t } = useI18n();

const { onSuccess, onError } = useMessageToastService();

const corpusStore = useCorpusStore();
const { corpora } = storeToRefs(corpusStore);

const runStore = useRunStore();
runStore.reset();

const { openModal } = useModal();
const onDeleteCorpus = (corpus: Corpus) => {
  openModal(modalDeleteCorpus, toRaw(corpus));
};

const { $progress } = useNuxtApp();

async function loadCorpora() {
  $progress.start();
  try {
    corpusStore.reset();
    await corpusStore.loadCorpora();
  } catch (error) {
    onError(t("corpus.error.corpusNotLoading"));
  } finally {
    $progress.finish();
  }
}

onMounted(async () => {
  await loadCorpora();
});
</script>
