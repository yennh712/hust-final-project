<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { getOrderDetailController } from '@/controllers/orderController'

const route = useRoute()
const router = useRouter()

const orderId = route.params.id as string

const order = ref<any>(null)
const items = ref<any[]>([])

const fetchData = async () => {
  const { data } = await getOrderDetailController(orderId)

  if (data) {
    order.value = data.order
    items.value = data.items || []
  }
}

onMounted(fetchData)

const goBack = () => {
  router.push('/orders')
}
</script>

<template>
  <div class="page">
    <div class="card">

      <Navbar />

      <h2 class="title">Order Details</h2>

      <button class="back-btn" @click="goBack">Back</button>
      <div class="section">
        <h3>Order Information</h3>
        <p>Order ID: #{{ order?.order_number }}</p>
        <p>Status: {{ order?.status }}</p>
        <p>Total: ${{ order?.total_price }}</p>
      </div>
      <div class="section">
        <h3>Shipping Address</h3>
        <p>{{ order?.shipping_address?.name }}</p>
        <p>{{ order?.shipping_address?.phone }}</p>
        <p>{{ order?.shipping_address?.address }}</p>
      </div>
      <div class="section">
        <h3>Products</h3>

        <div
          v-for="item in items"
          :key="item.id"
          class="product-row"
        >
          <div class="image-box">
            <img
            v-if="item.product?.mockups?.length"
            :src="item.product.mockups[0].image_url"
            />
            <span v-else>No Image</span>
          </div>

          <div>
            <p>Name: {{ item.product?.name }}</p>
            <p>Variant: {{ item.variant?.attributes?.name }}</p>
            <p>Qty: {{ item.quantity }}</p>
          </div>
        </div>
      </div>
      <div class="section">
        <h3>Design</h3>

        <div class="design-container">
          <div class="design-mockup">
            <h4>Mockup</h4>
            <img
              v-if="items[0]?.design?.design_mockup_url"
              :src="items[0].design.design_mockup_url"
              alt="Design Mockup"
            />
            <span v-else>No mockup available</span>
          </div>
          
          <div class="design-file">
            <h4>Design File</h4>
            <a
              v-if="items[0]?.design?.design_file_url"
              :href="items[0].design.design_file_url"
              target="_blank"
              class="download-link"
            >
              Download Design File
            </a>
            <span v-else>No design file available</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.page {
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
  margin-top: 30px;
}

.title {
  margin: 20px 0;
}

.section {
  margin-top: 20px;
  padding: 15px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
}

.back-btn {
  margin-top: 10px;
}

/* product */
.product-row {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  align-items: center;
}

.image-box {
  width: 80px;
  height: 80px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-box img {
  width: 100%;
}

/* design */
.design-container {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.design-mockup,
.design-file {
  flex: 1;
}

.design-mockup h4,
.design-file h4 {
  margin-bottom: 10px;
  font-weight: 600;
}

.design-mockup img {
  max-width: 100%;
  max-height: 300px;
  background: #eee;
  padding: 10px;
  border-radius: 4px;
}

.download-link {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 16px;
  background: #4a90e2;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.download-link:hover {
  background: #357abd;
}
</style>