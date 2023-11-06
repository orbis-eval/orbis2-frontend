import { refDebounced } from "@vueuse/core";

const titleIntern = ref("");
const title = refDebounced(titleIntern, 100);

export const useTitle = (paramTitle?: string) => {
  const setTitle = (newTitle: string) => {
    if (newTitle.length > 0) {
      titleIntern.value = newTitle;
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
