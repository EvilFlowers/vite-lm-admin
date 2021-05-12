import { defineStore } from "pinia";
import { RouteLocationNormalized, RouteLocationRaw, Router } from "vue-router";
import { toRaw, unref } from "vue";
import { getRawRoute } from "@/utils";
import { useGo, useRedo } from "@/hooks/web/usePage";
import { PageEnum } from "@/enums/pageEnum";

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

    clearCacheTabs(): void {
      this.cacheTabList = new Set();
    },

    resetState(): void {
      this.tabList = [];
      this.clearCacheTabs();
    },

    goToPage(router: Router) {
      const go = useGo(router);
      const len = this.tabList.length;
      const { path } = unref(router.currentRoute);
      let toPath;
      if (len > 0) {
        const page = this.tabList[len - 1];
        const p = page.fullPath || page.path;
        if (p) {
          toPath = p;
        }
      }
      path !== toPath && go(toPath, true);
    },

    async addTab(route: RouteLocationNormalized) {
      const { path, name, fullPath, params, query } = getRawRoute(route);
      if (path === PageEnum.ERROR_PAGE || !name) return;
      let updateIndex = -1;

      const tabHasExits = this.tabList.some((tab, index) => {
        updateIndex = index;
        return (tab.fullPath || tab.path) == (fullPath || path);
      });
      if (tabHasExits) {
        const curTab = toRaw(this.tabList)[updateIndex];
        if (!curTab) return;
        curTab.params = params || curTab.params;
        curTab.query = query || curTab.query;
        curTab.fullPath = fullPath || curTab.fullPath;
        this.tabList.splice(updateIndex, 1, curTab);
        return;
      }
      this.tabList.push(route);
      this.updateCacheTab();
    },

    async closeTab(tab: RouteLocationNormalized, router: Router) {
      const getToTarget = (tabItem: RouteLocationNormalized) => {
        const { params, path, query } = tabItem;
        return {
          params: params || {},
          path,
          query: query || {},
        };
      };

      const close = (route: RouteLocationNormalized) => {
        const { fullPath, meta: { affix } = {} } = route;
        if (affix) return;
        const index = this.tabList.findIndex((item) => item.fullPath === fullPath);
        index !== -1 && this.tabList.splice(index, 1);
      };

      const { currentRoute, replace } = router;
      const { path } = unref(currentRoute);
      if (path !== tab.path) {
        close(tab);
        return;
      }
      let toTarget: RouteLocationRaw = {};

      const index = this.tabList.findIndex((item) => item.path === path);

      if (index === 0) {
        if (this.tabList.length === 1) {
          toTarget = PageEnum.BASE_HOME;
        } else {
          const page = this.tabList[index + 1];
          toTarget = getToTarget(page);
        }
      } else {
        const page = this.tabList[index - 1];
        toTarget = getToTarget(page);
      }
      close(currentRoute.value);
      await replace(toTarget);
    },

    async closeTabByKey(key: string, router: Router) {
      const index = this.tabList.findIndex((item) => (item.fullPath || item.path) === key);
      index !== -1 && this.closeTab(this.tabList[index], router);
    },

    async sortTabs(oldIndex: number, newIndex: number) {
      const currentTab = this.tabList[oldIndex];
      this.tabList.splice(oldIndex, 1);
      this.tabList.splice(newIndex, 0, currentTab);
      this.lastDragEndIndex = this.lastDragEndIndex + 1;
    },

    closeLeftTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.tabList.findIndex((item) => item.path === route.path);
      if (index > 0) {
      }
    },
  },
});
