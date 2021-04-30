import { createRouter, createWebHistory } from "vue-router";
import { App } from "vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/index.vue"),
    },
    {
      path: "/login",
      component: () => import("@/views/sys/login/Login.vue"),
    },
  ],
});

export function setupRouter(app: App): void {
  app.use(router);
}
export default router;
