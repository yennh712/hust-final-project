<script setup lang="ts">
    import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="frame">
    <div class="card">
      
      <!-- Navbar -->
        <Navbar />

      <!-- Content -->
      <h1 class="title">Welcome to my project!</h1>

    </div>
  </div>
</template>

<style scoped>
.frame {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 900px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* Navbar */
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
  font-weight: bold;
}

.user {
  color: black;
}

/* Content */
.title {
  font-size: 24px;
  color: #2c3e50;
}
</style>