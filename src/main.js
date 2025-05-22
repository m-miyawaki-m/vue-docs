// src/main.js
import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import 'vuetify/styles'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

createApp(App).use(vuetify).use(router).mount('#app')
