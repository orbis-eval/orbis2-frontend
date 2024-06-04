<template>
  <div v-if="totalPages > 1" class="join mb-10">
    <OrbisButton
      class="text-black dark:text-white"
      :on-click="() => changePage(1)"
      :disabled="isFirstPage"
      :join="true"
      size="xs"
    >
      first
    </OrbisButton>
    <OrbisButton
      class="text-black dark:text-white"
      :on-click="() => changePage(currentPage - 1)"
      :disabled="isFirstPage"
      :join="true"
      size="xs"
    >
      prev
    </OrbisButton>
    <OrbisButton
      class="text-black dark:text-white"
      v-for="pageNumber in threePages"
      :key="pageNumber"
      :on-click="() => changePage(pageNumber)"
      :active="currentPage === pageNumber"
      :join="true"
      size="xs"
    >
      {{ pageNumber }}
    </OrbisButton>
    <OrbisButton
      class="text-black dark:text-white"
      :on-click="() => changePage(currentPage + 1)"
      :disabled="isLastPage"
      :join="true"
      size="xs"
    >
      next
    </OrbisButton>
    <OrbisButton
      class="text-black dark:text-white"
      :on-click="() => changePage(totalPages)"
      :disabled="isLastPage"
      :join="true"
      size="xs"
    >
      last
    </OrbisButton>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, toRef, watch } from "vue";

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits(["pageChanged"]);

const isLastPage = computed(() => props.currentPage === props.totalPages);
const isFirstPage = computed(() => props.currentPage === 1);

const threePages = computed(() => {
  const pages = [];
  const startPage = Math.max(1, props.currentPage - 1);
  const endPage = Math.min(props.totalPages, props.currentPage + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  while (pages.length < 3) {
    if (pages[0] > 1) {
      pages.unshift(pages[0] - 1);
    } else if (pages[pages.length - 1] < props.totalPages) {
      pages.push(pages[pages.length - 1] + 1);
    } else {
      break;
    }
  }
  return pages;
});

function changePage(nextPage: number) {
  if (nextPage > 0 && nextPage <= props.totalPages) {
    emit("pageChanged", nextPage);
  }
}

watch(
  [toRef(props, "currentPage"), toRef(props, "totalPages")],
  ([newPage, newTotal]) => {
    if (newTotal < newPage) {
      changePage(newTotal);
    }
  },
);
</script>
