<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { getProductDetailController } from '@/controllers/productController'

const route = useRoute()
const isCreateMode = route.path.includes('create')
const productId = route.params.id as string

const product = ref<any>(null)
const variants = ref<any[]>([])
const mockups = ref<any[]>([])
const printArea = ref({
  name: '',
  top: 0,
  left: 0,
  width: 0,
  height: 0
})

const fetchData = async () => {
  if (!productId || isCreateMode) {
    return
  }
  
  const { data } = await getProductDetailController(productId)

  if (data) {
    product.value = data.product
    variants.value = data.variants || []
    mockups.value = data.mockups || []
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="page">
    <div class="card">

      <Navbar />

      <h2>Product Details</h2>

      <div class="section">
        <h3>Mockup</h3>
        <div class="mockup-box">
          <img
            v-if="mockups.length"
            :src="mockups[0].image_url"
            width="200"
          />
          <p v-else>No mockup</p>
        </div>
      </div>

      <div class="section">
        <h3>Variants</h3>

        <table>
          <thead>
            <tr>
              <th>Variant</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="v in variants" :key="v.id">
              <td>{{ v.attributes?.name }}</td>
              <td>{{ v.attributes?.price }}</td>
              <td>
                <button>Edit</button>
                <button class="delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <button class="add">Add new</button>
      </div>

      <div class="section">
        <h3>Print Area</h3>

        <input v-model="printArea.name" placeholder="Name" />

        <div class="row">
          <input v-model="printArea.top" placeholder="Top" />
          <input v-model="printArea.left" placeholder="Left" />
        </div>

        <div class="row">
          <input v-model="printArea.width" placeholder="Width" />
          <input v-model="printArea.height" placeholder="Height" />
        </div>

        <button class="save">Save</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.page {
  background: #f5f7fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.card {
  width: 900px;
  background: white;
  padding: 20px;
  margin-top: 30px;
}

.section {
  margin-top: 20px;
}

.mockup-box {
  background: #fafafa;
  border: 1px solid #ccc;
  padding: 20px;
}

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

.row {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

button {
  margin-top: 10px;
}

.delete {
  background: red;
  color: white;
}

.add {
  background: #4a90e2;
  color: white;
}

.save {
  background: #4a90e2;
  color: white;
}
</style>