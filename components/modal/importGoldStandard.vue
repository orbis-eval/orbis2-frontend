<template>
  <div>
    <h2 class="mb-5 text-3xl font-bold">Import new version</h2>
    <p>Lorem Ipsum</p>
    <input type="file" class="input" />
    <br>
    <OrbisButton :on-click="cancel">Cancel</OrbisButton>
  </div>
</template>

<script lang="ts" setup>
const { closeModal } = useModal();
const cancel = () => closeModal();
</script>
