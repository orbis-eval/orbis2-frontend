<template>
  <div v-if="totalPages > 1" class="join mb-10">
    <OrbisButton
      :on-click="() => changePage(1)"
      :disabled="isFirstPage"
      :join="true"
      size="xs"
    >
      first
    </OrbisButton>
    <OrbisButton
      :on-click="() => changePage(currentPage - 1)"
      :disabled="isFirstPage"
      :join="true"
      size="xs"
    >
      prev
    </OrbisButton>
    <OrbisButton
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
      :on-click="() => changePage(currentPage + 1)"
      :disabled="isLastPage"
      :join="true"
      size="xs"
    >
      next
    </OrbisButton>
    <OrbisButton
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
import { defineProps, toRef, defineEmits, computed, watch } from "vue";

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits(["pageChanged"]);

const isLastPage = computed(() => props.currentPage === props.totalPages);
const isFirstPage = computed(() => props.currentPage === 1);

const threePages = computed(() => {
  const pages = [];
  for (let i = props.currentPage - 1; i <= props.currentPage + 1; i++) {
    if (i > 0 && i <= props.totalPages) {
      pages.push(i);
    }
  }
  if (pages.length < 3) {
    if (pages[0] === 1) {
      pages.push(pages[1] + 1);
    } else {
      pages.unshift(pages[0] - 1);
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
