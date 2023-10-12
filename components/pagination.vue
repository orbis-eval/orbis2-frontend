<template>
  <div class="my-2">
    <button @click="changePage(currentPage - 1)"
            class="pagination-button"
            :class="(isFirstPage)?'':'pagination-button button-enabled'"
            :disabled="isFirstPage">
      prev
    </button>
    <button v-for="pageNumber in totalPages"
            @click="changePage(pageNumber)"
            class="pagination-button button-enabled"
            :class="(currentPage === pageNumber)?'highlighted':''">
      {{ pageNumber }}
    </button>
    <button @click="changePage(currentPage + 1)"
            class="pagination-button"
            :class="(isLastPage)?'':'pagination-button button-enabled'"
            :disabled="isLastPage">
      next
    </button>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});
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
