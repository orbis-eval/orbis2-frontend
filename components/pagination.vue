<template>
  <div class="my-2">
    <button @click="changePage(currentPage - 1)"
            class="pagination-button"
            :class="(isFirstPage)?'':'pagination-button button-enabled'"
            :disabled="isFirstPage">
      prev
    </button>
    <button v-for="pageNumber in nofPages"
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

const currentPage = ref(1);
const props = defineProps({
  nofPages: Number
});
const nofPages = toRef(props, 'nofPages');
const emit = defineEmits(['pageChanged']);

const isLastPage = computed(() => currentPage.value == props.nofPages);
const isFirstPage = computed(() => currentPage.value == 1);

watch(nofPages, newValue => {
  // when nofPages changed go to last page
  changePage(newValue);
})

function changePage(nextPage: number) {
  if (nextPage > 0 && nextPage <= props.nofPages) {
    currentPage.value = nextPage;
    emit('pageChanged', nextPage);
  }
}

</script>
