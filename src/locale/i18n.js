import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "./en_lang";
import ko from "./ko_lang";
Vue.use(VueI18n);
let locale = JSON.parse(localStorage.getItem("mintBoxPersonal-lang"));
if (!locale) {
  locale = "ko";
}
export const i18n = new VueI18n({
  locale,
  silentFallbackWarn: true,
  messages: {
    ko,
    en,
  },
});
