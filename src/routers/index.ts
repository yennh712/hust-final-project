import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import ProductDetailPage from '@/pages/ProductDetailPage.vue'
import OrderPage from '@/pages/OrderPage.vue'
import OrderDetailPage from '@/pages/OrderDetailPage.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/products', component: ProductPage },
  { path: '/products/create', component: ProductDetailPage },
  { path: '/products/:id', component: ProductDetailPage },
  { path: '/orders', component: OrderPage },
  { path: '/orders/:id', component: OrderDetailPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})