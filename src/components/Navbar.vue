<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const go = (path: string) => {
  router.push(path)
}

const isActive = (path: string) => {
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="navbar">
    <div class="nav-left">
      <span class="logo">Seller Portal</span>

      <span
        :class="['nav', { active: isActive('/dashboard') }]"
        @click="go('/dashboard')"
      >
        Dashboard
      </span>

      <span
        :class="['nav', { active: isActive('/products') }]"
        @click="go('/products')"
      >
        Products
      </span>

      <span
        :class="['nav', { active: isActive('/orders') }]"
        @click="go('/orders')"
      >
        Orders
      </span>
    </div>

    <div class="user">User</div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.nav-left {
  display: flex;
  gap: 20px;
}

.logo {
  font-weight: bold;
}

.nav {
  color: #555;
  cursor: pointer;
}

.nav:hover {
  font-weight: 500;
}

.active {
  font-weight: bold;
  color: black;
}

.user {
  color: black;
}
</style>