<script setup lang="ts">
import { ref, onMounted, computed, type CSSProperties } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { getProductDetailController } from '@/controllers/productController'
import { createVariantController, updateVariantController, deleteVariantController } from '@/controllers/variantController'
import { supabase } from '@/lib/supabase'
import { createPrintAreaController } from '@/controllers/printAreaController'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

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

const printAreas = ref<any[]>([])

const handleAddPrintArea = async () => {
  if (!selectedMockup.value) {
    alert('Please select mockup first')
    return
  }

  const payload = {
    mockup_id: selectedMockup.value.id,
    attributes: {
      name: printArea.value.name,
      top: Number(printArea.value.top),
      left: Number(printArea.value.left),
      width: Number(printArea.value.width),
      height: Number(printArea.value.height)
    }
  }

  const { error } = await createPrintAreaController(payload)

  if (error) {
    alert(error.message)
  } else {
    alert('Created!')
    fetchData()
    resetPrintAreaForm()
  }
}

const resetPrintAreaForm = () => {
  printArea.value = {
    name: '',
    top: 0,
    left: 0,
    width: 0,
    height: 0
  }
}

const selectedMockup = ref<any>(null)

const getPrintAreasByMockup = (mockupId: string) => {
  return printAreas.value.filter(
    p =>
      p.mockup_id === mockupId &&
      selectedPrintAreaIds.value.includes(p.id)
  )
}

const getPrintAreaStyle = (pa: any): CSSProperties => {
  const attr = pa.attributes

  return {
    position: 'absolute',
    top: attr.top + 'px',
    left: attr.left + 'px',
    width: attr.width + 'px',
    height: attr.height + 'px',
    border: '2px dashed red',
    background: 'rgba(255,0,0,0.1)'
  } as CSSProperties
}

const getAttr = (pa: any) => {
  if (!pa.attributes) return {}

  if (typeof pa.attributes === 'string') {
    try {
      pa.attributes = JSON.parse(pa.attributes)
    } catch {
      return {}
    }
  }

  return pa.attributes
}

const availablePrintAreas = computed(() =>
  printAreas.value.filter(
    pa => pa.mockup_id === selectedMockup.value?.id
  )
)

const addPrintArea = (id: string) => {
  // Remove other print areas for this mockup
  const printAreaToAdd = printAreas.value.find(pa => pa.id === id)
  if (printAreaToAdd) {
    selectedPrintAreaIds.value = selectedPrintAreaIds.value.filter(
      paId => {
        const pa = printAreas.value.find(p => p.id === paId)
        return pa?.mockup_id !== printAreaToAdd.mockup_id
      }
    )
  }

  // Add the new print area
  if (!selectedPrintAreaIds.value.includes(id)) {
    selectedPrintAreaIds.value.push(id)
  }

  fetchData()
}

const removePrintArea = (id: string) => {
  selectedPrintAreaIds.value =
    selectedPrintAreaIds.value.filter(pid => pid !== id)
}

const dragging = ref(false)
const resizing = ref(false)

const activePrintArea = ref<any>(null)

const startX = ref(0)
const startY = ref(0)

const startDrag = (e: MouseEvent, pa: any) => {
  dragging.value = true
  activePrintArea.value = pa

  startX.value = e.clientX
  startY.value = e.clientY

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!dragging.value || !activePrintArea.value) return

  const dx = e.clientX - startX.value
  const dy = e.clientY - startY.value

  const attr = getAttr(activePrintArea.value)

  attr.left += dx
  attr.top += dy

  startX.value = e.clientX
  startY.value = e.clientY

  requestAnimationFrame(() => {
    const attr = getAttr(activePrintArea.value)

    attr.left += dx
    attr.top += dy

    activePrintArea.value.attributes = { ...attr } // 👈 trigger re-render
  })
}

const stopDrag = () => {
  if (activePrintArea.value) {
    savePrintArea(activePrintArea.value)
  }

  dragging.value = false
  activePrintArea.value = null

  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

const startResize = (e: MouseEvent, pa: any) => {
  resizing.value = true
  activePrintArea.value = pa

  startX.value = e.clientX
  startY.value = e.clientY

  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}

const onResize = (e: MouseEvent) => {
  if (!resizing.value || !activePrintArea.value) return

  const dx = e.clientX - startX.value
  const dy = e.clientY - startY.value

  const attr = getAttr(activePrintArea.value)

  attr.width += dx
  attr.height += dy

  startX.value = e.clientX
  startY.value = e.clientY
}

const stopResize = () => {
  if (activePrintArea.value) {
    savePrintArea(activePrintArea.value)
  }

  resizing.value = false
  activePrintArea.value = null

  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
}

const savePrintArea = async (pa: any) => {
  const attr = getAttr(pa)

  const { error } = await supabase
    .from('print_areas')
    .update({
      attributes: attr
    })
    .eq('id', pa.id)

  if (error) {
    alert('Save failed')
  } else {
    alert('Saved!')
  }
}

const selectedPrintAreaIds = ref<string[]>([])
const isInitialLoad = ref(true)

const fetchData = async () => {
  if (!productId || isCreateMode) {
    return
  }
  
  const { data } = await getProductDetailController(productId)

  if (data) {
    product.value = data.product
    variants.value = data.variants || []
    mockups.value = data.mockups || []
    printAreas.value = data.printAreas || []
    printAreas.value = printAreas.value.map(pa => ({
      ...pa,
      attributes:
        typeof pa.attributes === 'string'
          ? JSON.parse(pa.attributes)
          : pa.attributes
    }))

    if (data.mockups?.length) {
      selectedMockup.value = data.mockups[0]
    }

    // Only initialize selectedPrintAreaIds on first load
    if (isInitialLoad.value) {
      // Load previously saved selections from product metadata
      if (product.value?.metadata?.selected_print_areas) {
        selectedPrintAreaIds.value = product.value.metadata.selected_print_areas
      } else {
        selectedPrintAreaIds.value = []
      }
      isInitialLoad.value = false
    }
  }
}

const saveProduct = async () => {
  if (!product.value) {
    alert('No product to save')
    return
  }

  const { error } = await supabase
    .from('products')
    .update({
      metadata: {
        ...(product.value.metadata || {}),
        selected_print_areas: selectedPrintAreaIds.value
      }
    })
    .eq('id', productId)

  if (error) {
    alert('Save failed: ' + error.message)
  } else {
    alert('Product saved successfully!')
  }
}

onMounted(fetchData)

const isEditMode = ref(false)
const editingVariantId = ref<string | null>(null)

const variantForm = ref({
  name: '',
  price: 0,
  color: '',
  size: ''
})

const handleAddVariant = async () => {
  const payload = {
    product_id: productId,
    sku: `SKU-${Date.now()}`,
    attributes: {
      name: variantForm.value.name,
      price: variantForm.value.price,
      color: variantForm.value.color,
      size: variantForm.value.size
    },
    stock: 100
  }

  const { error } = await createVariantController(payload)

  if (error) {
    alert(error.message)
  } else {
    alert('Added!')
    fetchData()
    resetForm()
  }
}

const startEdit = (v: any) => {
  isEditMode.value = true
  editingVariantId.value = v.id

  variantForm.value = {
    name: v.attributes?.name || '',
    price: v.attributes?.price || 0,
    color: v.attributes?.color || '',
    size: v.attributes?.size || ''
  }
}

const handleUpdateVariant = async () => {
  if (!editingVariantId.value) return

  const payload = {
    attributes: {
      name: variantForm.value.name,
      price: variantForm.value.price,
      color: variantForm.value.color,
      size: variantForm.value.size
    }
  }

  const { error } = await updateVariantController(
    editingVariantId.value,
    payload
  )

  if (error) {
    alert(error.message)
  } else {
    alert('Updated!')
    fetchData()
    resetForm()
  }
}

const resetForm = () => {
  isEditMode.value = false
  editingVariantId.value = null

  variantForm.value = {
    name: '',
    price: 0,
    color: '',
    size: ''
  }
}

const handleDeleteVariant = async (id: string) => {
  const confirmDelete = confirm('Delete this variant?')
  if (!window.confirm('Are you sure?')) return
  const { error } = await deleteVariantController(id)

  if (error) {
    alert(error.message)
  } else {
    alert('Deleted!')
    fetchData()
  }

  if (editingVariantId.value === id) {
  resetForm()
  }
}

</script>

<template>
  <div class="page">
    <div class="card">

      <Navbar />

      <div class="section">
        <div class="section-header">
          <h2>Product Details</h2>
          <button class="save-product" @click="saveProduct">
            Save Product
          </button>
        </div>
      </div>

      <div class="section">
        <h3>Mockup</h3>
        <div class="mockup-layout">
          <div class="mockup-main" v-if="mockups.length">
            <div class="mockup-container">
              <img
                :src="selectedMockup.image_url"
                class="mockup-image"
              />

              <div
                v-for="pa in getPrintAreasByMockup(selectedMockup.id)"
                :key="pa.id"
                class="print-area"
                :class="{ active: selectedPrintAreaIds.includes(pa.id) }"
                :style="getPrintAreaStyle(pa)"
                @mousedown="startDrag($event, pa)"
              >
                <div
                  class="resize-handle"
                  @mousedown.stop="startResize($event, pa)"
                ></div>

                <div class="print-label">
                  <div><b>{{ getAttr(pa).name }}</b></div>
                  <div>Top: {{ getAttr(pa).top }}</div>
                  <div>Left: {{ getAttr(pa).left }}</div>
                  <div>W: {{ getAttr(pa).width }}</div>
                  <div>H: {{ getAttr(pa).height }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="mockup-list">
            <div
              v-for="m in mockups"
              :key="m.id"
              class="mockup-item"
              @click="selectedMockup = m"
            >
              <img :src="m.image_url" />
            </div>
          </div>

        </div>
      </div>

      <div class="pa-list">
        <h4>Available Print Areas</h4>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="pa in availablePrintAreas" :key="pa.id">
              <td>{{ getAttr(pa).name }}</td>
              <td>
                <button
                  v-if="!selectedPrintAreaIds.includes(pa.id)"
                  @click="addPrintArea(pa.id)"
                >
                  Add
                </button>

                <button
                  v-else
                  @click="removePrintArea(pa.id)"
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>Variants</h3>
          <div class="variant-form">
          <input v-model="variantForm.name" placeholder="Name" />
          <input v-model="variantForm.price" placeholder="Price" />
          <input v-model="variantForm.color" placeholder="Color" />
          <input v-model="variantForm.size" placeholder="Size" />

          <button v-if="!isEditMode" @click="handleAddVariant">
            Add
          </button>

          <button v-else @click="handleUpdateVariant">
            Update
          </button>

          <button v-if="isEditMode" @click="resetForm">
            Cancel
          </button>
        </div>

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
              <td>{{ formatPrice(v.attributes?.price) }}</td>
              <td>
                <button @click="startEdit(v)">Edit</button>
                <button class="delete" @click="handleDeleteVariant(v.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

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

        <button class="save" @click="handleAddPrintArea">
          Save
        </button>
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

.mockup-container {
  position: relative;
  display: inline-block;
}

.print-area {
  position: absolute;
}

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

.variant-form {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.print-label {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.7);
  color: white;
  font-size: 10px;
  padding: 4px;
  line-height: 1.2;
  
}

.mockup-layout {
  display: flex;
  gap: 20px;
}

/* LEFT: chiếm 1/3 */
.mockup-main {
  flex: 1;
  max-width: 33%;
}

/* RIGHT: chiếm 2/3 */
.mockup-list {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

/* MAIN IMAGE */
.mockup-image {
  width: 100%;
}

/* LIST ITEM */
.mockup-item img {
  width: 100%;
  cursor: pointer;
  border: 2px solid transparent;
}

/* hover đẹp hơn */
.mockup-item img:hover {
  border: 2px solid #4a90e2;
}

.print-area {
  position: absolute;
  border: 2px dashed red;
  cursor: move;
}

.resize-handle {
  width: 10px;
  height: 10px;
  background: red;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: se-resize;
}

.pa-list {
  margin-top: 20px;
}

.pa-list table {
  width: 100%;
  border-collapse: collapse;
}

.pa-list th {
  background: #f0f3f5;
  text-align: center;
}

.pa-list th, .pa-list td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.print-area.active {
  border: 2px solid blue;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
}

.save-product {
  background: #27ae60;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.save-product:hover {
  background: #229954;
}
</style>