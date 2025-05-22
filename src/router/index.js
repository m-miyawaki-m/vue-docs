// src/router/index.js
import DetailPage from '@/views/DetailPage.vue'
import HomePage from '@/views/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: HomePage },
  { path: '/detail/:name', component: DetailPage, props: true }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
