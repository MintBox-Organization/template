import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";
import "@/assets/css/style.less";
import "@/assets/font/iconfont.css";
import { i18n } from "./locale/i18n";

document.title = "MintBox";
Vue.config.productionTip = false;
Vue.use(ElementUI, { locale });
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
