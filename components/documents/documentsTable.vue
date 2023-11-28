<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCorpusStore } from "~/stores/corpusStore";
import { useDocumentStore } from "~/stores/documentStore";

const route = useRoute();
const router = useRouter();

const corpusStore = useCorpusStore();
const documentStore = useDocumentStore();
const { currentPage, documents } = storeToRefs(documentStore);
const { corpus } = storeToRefs(corpusStore);

const pageSize = ref(10);
const viewMode = ref("single");

if (route.query.mode && route.query.mode === "comparison") {
  viewMode.value = "comparison";
}
</script>
