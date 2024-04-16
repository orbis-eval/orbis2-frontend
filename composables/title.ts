const title = ref("Orbis NG");

export const useTitle = (paramTitle?: string) => {
  const setTitle = (newTitle: string) => {
    if (newTitle.length > 0) {
      title.value = newTitle;
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
