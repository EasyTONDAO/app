import 'mdb-vue-ui-kit/css/mdb.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

const app = createApp(App);
app.use(i18n);
app.use(store);
app.use(router);
app.mount('#app');