// src/main.js
import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import 'vuetify/styles'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

createApp(App).use(store).use(vuetify).use(router).mount('#app')
