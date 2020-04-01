import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import API from './utils/API';
import moment from 'moment';
import 'flag-icon-css/css/flag-icon.css';

Vue.config.productionTip = false;

Vue.filter('capitalise', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
});

Vue.filter('formatDate', function (value) {
  if (!value) return 'Doh!';
  return moment(value).format('DD-MM-YYYY HH:mm:ss');
});

Vue.filter('formatTime', function (value) {
  if (!value) return 'Doh!';
  return moment.duration(value).humanize();
});

Vue.prototype.$http = API;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
