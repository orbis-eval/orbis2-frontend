<script setup lang="ts">
import { useRunStore } from "~/stores/runStore";

useAsyncData(async ({ params }) => {
  const runStore = useRunStore();
  const route = useRoute();

  try {
    await runStore.loadGoldStandards(Number(route.params.corpusId));
  } catch (error) {
    console.error('Error loading corpus:', error);
    // Handle error loading corpus data
  }
});
</script>
