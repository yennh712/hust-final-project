<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
      >
        <div class="toast-content">
          <span>{{ toast.message }}</span>
          <button class="toast-close" @click="removeToast(toast.id)">×</button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: all;
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;
}

.toast-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.toast-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  line-height: 1;
}

.toast-close:hover {
  color: #333;
}

.toast-success {
  border-left: 4px solid #52c41a;
  background: #f6ffed;
}

.toast-success span {
  color: #22863a;
}

.toast-error {
  border-left: 4px solid #ff4d4f;
  background: #fff1f0;
}

.toast-error span {
  color: #92261e;
}

.toast-warning {
  border-left: 4px solid #faad14;
  background: #fffbe6;
}

.toast-warning span {
  color: #953800;
}

.toast-info {
  border-left: 4px solid #1890ff;
  background: #e6f7ff;
}

.toast-info span {
  color: #003a8c;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(400px);
  opacity: 0;
}
</style>
