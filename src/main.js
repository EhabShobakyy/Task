import Vue from "vue";
import App from "./App.vue";
import store from "./store/store"; // Your Vuex store
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css"; // Import Vuetify CSS
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

new Vue({
  store,
  vuetify: new Vuetify(),
  render: (h) => h(App),
}).$mount("#app");
