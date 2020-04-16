import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueMaterial from 'vue-material';
import VueCookies from 'vue-cookies';
import VueResource from 'vue-resource';
import Toast from "vue-toastification";

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import "vue-toastification/dist/index.css";

Vue.use(VueMaterial);
Vue.use(VueCookies);
Vue.use(VueResource);
Vue.use(Toast);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
