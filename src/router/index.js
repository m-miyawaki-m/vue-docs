// src/router/index.js
import DashboardPage from '@/views/DashboardPage.vue'
import DetailPage from '@/views/DetailPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: DashboardPage, props: true  },
  { path: '/detail/:name', component: DetailPage, props: true },
  { path: '/dashboard', component: DashboardPage, props: true },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
