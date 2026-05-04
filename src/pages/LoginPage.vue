<script setup lang="ts">
import { ref } from 'vue'
import { loginController } from '@/controllers/authController'
import { router } from '@/routers'

const email = ref<string>('')
const password = ref<string>('')

const handleLogin = async (): Promise<void> => {
  const { error } = await loginController(email.value, password.value)

  if (error) {
    alert(error.message)
  } else {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>

      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />

      <button @click="handleLogin">Login</button>

    </div>
  </div>
</template>

<style scoped>

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f7fa;
}

.login-card {
  width: 350px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

input {
  width: auto;
  padding: 10px;
  margin-bottom: 15px;
}

button {
  width: 100%;
  padding: 10px;
  background: #4a90e2;
  color: white;
  border: none;
}

</style>