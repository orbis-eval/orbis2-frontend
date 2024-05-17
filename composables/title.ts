const appTitle = ref("Orbis NG");
const seoTitle = ref("Orbis");

export const useTitle = (paramTitle?: string, metaTitle?: string) => {
  const setAppTitle = (newAppTitle: string) => {
    if (newAppTitle && newAppTitle.length > 0) {
      appTitle.value = newAppTitle;
    }
  };

  const setSeoTitle = (newSeoTitle: string) => {
    if (newSeoTitle && newSeoTitle.length > 0) {
      seoTitle.value = newSeoTitle;
      useSeoMeta({
        title: seoTitle.value,
        ogTitle: seoTitle.value,
      });
    }
  };

  if (paramTitle) {
    setAppTitle(paramTitle);
  }

  if (metaTitle) {
    setSeoTitle(metaTitle);
  }

  return {
    setAppTitle,
    appTitle,
    setSeoTitle,
    seoTitle,
  };
};
