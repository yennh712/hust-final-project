<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useRouter } from 'vue-router'
import { getOrdersController, updateOrderStatusController } from '@/controllers/orderController'

const router = useRouter()

const orders = ref<any[]>([])
const search = ref('')
const statusFilter = ref('')

const fetchOrders = async () => {
  const { data } = await getOrdersController()
  orders.value = data || []
}

onMounted(fetchOrders)

// filter
const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    const matchSearch =
      o.order_number?.toLowerCase().includes(search.value.toLowerCase())

    const matchStatus =
      !statusFilter.value || o.status === statusFilter.value

    return matchSearch && matchStatus
  })
})

// navigate
const goToDetail = (id: string) => {
  router.push(`/orders/${id}`)
}

// màu status
const getStatusClass = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'status delivered'
    case 'shipping':
      return 'status shipping'
    case 'pending':
      return 'status pending'
    case 'processing':
      return 'status processing'
    case 'cancelled':
      return 'status cancelled'
    default:
      return 'status'
  }
}

// update status
const updateStatus = async (order: any) => {
  const newStatus = order.status

  // clone history
  let history = order.status_history || []

  if (typeof history === 'string') {
    history = JSON.parse(history)
  }

  // thêm status mới
  const newEntry: any = {
    status: newStatus,
    time: new Date().toISOString()
  }

  // nếu là shipping → thêm tracking link
  if (newStatus === 'shipping') {
    const tracking = prompt('Enter tracking link:')
    if (tracking) {
      newEntry.note = tracking
    }
  }

  history.push(newEntry)

  const { error } = await updateOrderStatusController(
    order.id,
    newStatus,
    history
  )

  if (error) {
    alert('Update failed')
  } else {
    alert('Updated!')
  }
}

</script>

<template>
  <div class="frame">
    <div class="card">

      <Navbar />

      <h2 class="title">Order Management</h2>
      <div class="toolbar">
        <input v-model="search" placeholder="Search order" />

        <select v-model="statusFilter">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="shipping">Shipping</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="o in filteredOrders" :key="o.id">
            <td>#{{ o.order_number }}</td>
            <td>{{ o.shipping_address?.name || 'N/A' }}</td>
            <td>${{ o.total_price }}</td>

            <td>
                <select
                v-model="o.status"
                @change="updateStatus(o)"
                :class="getStatusClass(o.status)"
                >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipping">Shipping</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                </select>
            </td>

            <td>
              <button @click="goToDetail(o.id)">View</button>
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
  width: 1000px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  margin-top: 40px;
}

.title {
  margin: 20px 0;
}

/* toolbar */
.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input, select {
  padding: 8px;
}

/* table */
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f0f3f5;
  text-align: center;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

/* status */
.status {
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
}

.delivered {
  background: #2ecc71;
}

.shipping {
  background: #f39c12;
}

.pending {
  background: #95a5a6;
}

select.status {
  padding: 5px;
  border-radius: 4px;
  color: white;
  border: none;
}

select.delivered {
  background: #2ecc71;
}

select.shipping {
  background: #f39c12;
}

select.pending {
  background: #95a5a6;
}

select.processing {
  background: #3498db;
  color: white;
}

select.cancelled {
  background: #e74c3c;
  color: white;
  font-weight: bold;
}
</style>