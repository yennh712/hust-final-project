<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProductsController } from '@/controllers/productController'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()

const products = ref<any[]>([])
const search = ref('')

// navigation
const goToCreate = () => {
  router.push('/products/create')
}

const goToEdit = (id: string) => {
  router.push(`/products/${id}`)
}

// fetch data
const fetchProducts = async () => {
  const { data } = await getProductsController()
  products.value = data || []
}

onMounted(fetchProducts)

// filter
const filteredProducts = () => {
  return products.value.filter(p =>
    p.name?.toLowerCase().includes(search.value.toLowerCase())
  )
}
</script>

<template>
  <div class="frame">
    <div class="card">

      <Navbar />

      <h2 class="title">Product Management</h2>

      <div class="toolbar">
        <input v-model="search" placeholder="Search product" />

        <button class="create-btn" @click="goToCreate">
          Create
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in filteredProducts()" :key="p.id">
            <td>{{ p.name }}</td>
            <td>{{ p.price || 'N/A' }}</td>
            <td>
              <button @click="goToEdit(p.id)">Edit</button>
              <button class="delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<style scoped>
.frame {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
}

.card {
  width: 900px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  margin-top: 40px;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.nav-left {
  display: flex;
  gap: 20px;
}

.nav {
  color: #555;
  cursor: pointer;
}

.active {
  font-weight: bold;
}

/* Title */
.title {
  margin: 20px 0;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

input {
  padding: 8px;
  width: 200px;
}

.create-btn {
  background: #4a90e2;
  color: white;
  padding: 8px 12px;
  border: none;
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f0f3f5;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

button {
  margin-right: 5px;
}

.delete {
  background: #e74c3c;
  color: white;
}
</style>