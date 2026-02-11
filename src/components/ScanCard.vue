<template>
  <div class="scanner-container">
    <h2>QR Code Scanner</h2>

    <div class="scanner-box">
      <!-- Simulated QR Scanner (replace with real scanner component) -->
      <button @click="simulateScan">Simulate QR Scan</button>
    </div>

    <div v-if="selectedUser" class="user-info">
      <img
          v-if="displayPhoto"
          :src="displayPhoto"
          alt="User Photo"
          class="user-photo"
      />
      <div>
        <p><strong>Name:</strong> {{ selectedUser.user_fname }} {{ selectedUser.user_lname }}</p>
        <p><strong>Email:</strong> {{ selectedUser.user_email }}</p>
        <p><strong>RFID:</strong> {{ selectedUser.rf_id }}</p>
        <p><strong>Position:</strong> {{ selectedUser.user_position }}</p>
      </div>
    </div>

    <div v-else>
      <p>No user scanned yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 🧠 Reactive state
const selectedUser = ref(null)

// ✅ Compute full server photo URL
const serverPhotoUrl = computed(() => {
  const u = selectedUser.value
  console.log('[DEBUG] Selected User (stringified):', JSON.stringify(u, null, 2))

  if (!u) return ''

  // Extract the possible photo path from different fields
  const photoPath =
      u?.user_image ||
      u?.photoUrl ||
      u?.avatar ||
      u?.profilePhoto ||
      u?.photo ||
      u?.image ||
      ''

  console.log('[DEBUG] Extracted photo path:', photoPath)

  const fullUrl = photoPath ? `http://100.126.246.124:3002${photoPath}` : ''
  console.log('[DEBUG] Final server photo URL:', fullUrl)

  return fullUrl
})

const displayPhoto = computed(() => {
  console.log('[DEBUG] Display photo URL:', serverPhotoUrl.value || '')
  return serverPhotoUrl.value || ''
})

// 🧪 Simulate a QR code scan event

</script>

<style scoped>
.scanner-container {
  max-width: 500px;
  margin: 2rem auto;
  text-align: center;
}

.scanner-box {
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 8px;
}

.user-photo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ddd;
}
</style>
