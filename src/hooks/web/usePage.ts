import { RouteLocationRaw, Router, useRouter } from "vue-router";
import { unref } from "vue";
import { isString } from "lodash-es";

function handleError(e: Error) {
  console.error(e);
}

export function useGo(_router?: Router) {
  let router;
  if (!_router) {
    router = useRouter();
  }
  const { push, replace } = _router || router;
  function go(opt, isReplace = false) {
    if (!opt) return;
    if (isString(opt)) {
      isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
    } else {
      const o = opt as RouteLocationRaw;
      isReplace ? replace(o).catch(handleError) : push(o).catch(handleError);
    }
  }

  return go;
}

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
