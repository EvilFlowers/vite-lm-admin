import { defineStore } from "pinia";
import { RouteLocationNormalized, Router } from "vue-router";
import { unref } from "vue";
import { getRawRoute } from "@/utils";

export interface MultipleTabState {
  cacheTabList: Set<string>;
  tabList: RouteLocationNormalized[];
  lastDragEndIndex: number;
}

export const useMultipleTabStore = defineStore({
  id: "app-multiple-tab",
  state: (): MultipleTabState => ({
    cacheTabList: new Set(),
    tabList: [],
    lastDragEndIndex: 0,
  }),
  getters: {
    getTabList(): RouteLocationNormalized[] {
      return this.tabList;
    },
    getCachedTabList(): string[] {
      return Array.from(this.cacheTabList);
    },
    getLastDragEndIndex(): number {
      return this.lastDragEndIndex;
    },
  },
  actions: {
    async updateCacheTab() {
      const cacheMap: Set<string> = new Set();
      for (const tab of this.tabList) {
        const item = getRawRoute(tab);
        const needCache = !item.meta?.ignoreKeepAlive;
        if (!needCache) return;
        const name = item.name as string;
        cacheMap.add(name);
      }
      this.cacheTabList = cacheMap;
    },

    async refreshPage(router: Router) {
      const { currentRoute } = router;
      const route = unref(currentRoute);
      const name = route.name;
      const findTab = this.getCachedTabList.find((item) => item === name);
      if (findTab) {
        this.cacheTabList.delete(findTab);
      }
      const redo = useRedo(router);
      await redo();
    },
  },
});
