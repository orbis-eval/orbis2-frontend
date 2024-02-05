<template>
  <div class="mb-10">
    <OrbisButton
      :on-click="() => changePage(currentPage - 1)"
      :disabled="isFirstPage"
    >
      prev
    </OrbisButton>
    <OrbisButton
      v-for="pageNumber in totalPages"
      :key="pageNumber"
      :on-click="() => changePage(pageNumber)"
      :active="currentPage === pageNumber"
    >
      {{ pageNumber }}
    </OrbisButton>
    <OrbisButton
      :on-click="() => changePage(currentPage + 1)"
      :disabled="isLastPage"
    >
      next
    </OrbisButton>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const totalPages = toRef(props, "totalPages");
const emit = defineEmits(["pageChanged"]);

const isLastPage = computed(() => props.currentPage === props.totalPages);
const isFirstPage = computed(() => props.currentPage === 1);

function changePage(nextPage: number) {
  if (nextPage > 0 && nextPage <= props.totalPages) {
    emit("pageChanged", nextPage);
  }
}

watch(totalPages, (newValue) => {
  // when nofPages changed go to last page
  if (newValue) {
    changePage(newValue);
  }
});
</script>
