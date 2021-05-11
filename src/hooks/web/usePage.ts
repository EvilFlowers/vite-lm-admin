import { Router, useRouter } from "vue-router";
import { unref } from "vue";

export const useRedo = (_router?: Router) => {
  let router;
  if (!_router) {
    router = useRouter();
  }

  const { push, currentRoute } = _router || router;
  const { query, params } = currentRoute.value;
  function redo(): Promise<boolean> {
    return new Promise((resolve) => {
      push({
        path: "/redirect" + unref(currentRoute).fullPath,
        query,
        params,
      }).then(() => resolve(true));
    });
  }
  return redo;
};
