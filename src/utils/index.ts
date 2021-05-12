import { RouteLocationNormalized, RouteRecordNormalized } from "vue-router";
import { isObject } from "lodash-es";

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    if (target.hasOwnProperty(key)) {
      src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
    }
  }
  return src;
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;

  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({ meta: item.meta, name: item.name, path: item.path }))
      : undefined) as RouteRecordNormalized[],
  };
}
