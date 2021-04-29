import { createApp } from "vue";
import App from "./App.vue";
import router, { setupRouter } from "@/router/index";
import { ElIcon } from "element-plus";
import "./index.css";
const app = createApp(App);

app.use(ElIcon);
setupRouter(app);

app.mount("#app");
