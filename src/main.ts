import { createApp } from "vue";
import App from "./App.vue";
import router, { setupRouter } from "@/router";
import { setupStore } from "@/store";
import { ElIcon } from "element-plus";
import "@iconify/iconify";
import "@purge-icons/generated";
import "./index.css";
const app = createApp(App);

app.use(ElIcon);
setupRouter(app);
setupStore(app);

app.mount("#app");
