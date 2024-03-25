import { useRoute, useRouter } from "vue-router";

export function useRouteHandler() {
  const route = useRoute();
  const router = useRouter();
  const changeParam = async (param: string, value: string) => {
    // check if param exists in the route
    if (route.params[param]) {
      await router.replace({
        params: {
          [param]: value,
        },
      });
    }
  };

  return {
    changeParam,
  };
}
