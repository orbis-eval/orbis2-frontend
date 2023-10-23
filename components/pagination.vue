<template>
  <div class="mb-10">
    <OrbisButton :onClick="() => changePage(currentPage - 1)" :disabled="isFirstPage">
      prev
    </OrbisButton>
    <OrbisButton v-for="pageNumber in totalPages"
                 :onClick="() => changePage(pageNumber)"
                 :active="currentPage === pageNumber" 
                 :disabled="isFirstPage"
    >
      {{ pageNumber }}
    </OrbisButton>
    <OrbisButton :onClick="() => changePage(currentPage + 1)" :disabled="isLastPage">
      next
    </OrbisButton>
  </div>
</template>

<script setup lang="ts">
interface IPaginationProps {
  currentPage: number
  totalPages: number
}
const props = defineProps<IPaginationProps>();
const totalPages = toRef(props, 'totalPages');
const emit = defineEmits(['pageChanged']);

const isLastPage = computed(() => props.currentPage == props.totalPages);
const isFirstPage = computed(() => props.currentPage == 1);

watch(totalPages, newValue => {
  // when nofPages changed go to last page
  if (newValue) {
    changePage(newValue);
  }
})

function changePage(nextPage: number) {
  if (nextPage > 0 && nextPage <= props.totalPages) {
    emit('pageChanged', nextPage);
  }
}

</script>
