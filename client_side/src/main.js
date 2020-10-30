import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BaseCard from './components/base/BaseCard.vue';
import BaseLogin from './components/base/BaseLogin.vue';

const app = createApp(App);

app.component('base-card',BaseCard);
app.component('base-login',BaseLogin);

app.use(store);
app.use(router);
app.mount('#app')
