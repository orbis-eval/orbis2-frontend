import { refDebounced } from "@vueuse/core";

const _title = ref("");
const title = refDebounced(_title, 100);

export const useTitle = (paramTitle?: string) => {
  const setTitle = (newTitle: string) => {
    if (newTitle.length > 0) {
      _title.value = newTitle;
      useSeoMeta({
        title: newTitle,
        ogTitle: newTitle,
      });
    }
  };

  if (paramTitle) {
    setTitle(paramTitle);
  }

  return { setTitle, title };
};
