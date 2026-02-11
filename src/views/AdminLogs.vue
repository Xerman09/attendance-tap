<template>
  <div class="space-y-4">
    <!-- Filters / Controls -->
    <div
        class="rounded-2xl p-6 border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur shadow-sm"
    >
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <!-- <h2 class="text-lg font-semibold">Admin Logs</h2> -->
        <div class="flex flex-wrap items-center gap-3">
          <label class="flex items-center gap-2 text-sm opacity-80">
            <input type="checkbox" v-model="autoRefresh" />
            Auto-refresh (15s)
          </label>
          <button class="btn" @click="refresh">Refresh</button>
          <button class="btn" @click="reset">Reset</button>
          <button class="btn" @click="exportCsv" :disabled="!rows.length">Export CSV</button>
        </div>
      </div>

      <div class="grid md:grid-cols-4 gap-3">
        <div>
          <label class="label">User ID</label>
          <input v-model="q.userId" type="number" class="input" placeholder="e.g. 133" />
        </div>
        <div>
          <label class="label">From</label>
          <input v-model="q.from" type="date" class="input" />
        </div>
        <div>
          <label class="label">To</label>
          <input v-model="q.to" type="date" class="input" />
        </div>
        <div class="flex items-end">
          <button class="btn w-full" @click="load" :disabled="loading">
            {{ loading ? 'Loading…' : 'Load Logs' }}
          </button>
        </div>
      </div>

      <p v-if="error" class="text-sm text-rose-600 mt-3">{{ error }}</p>
    </div>

    <!-- Table / States -->
    <div class="rounded-2xl p-0 border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur shadow-sm overflow-hidden">
      <div class="px-6 py-4 flex items-center justify-between">
        <div class="text-sm opacity-70">
          <span v-if="!loading">{{ paged.length }}</span>
          <span v-else>…</span>
          of {{ rows.length }} records
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span>Rows per page</span>
          <select class="input !py-1 !px-2" v-model.number="pageSize">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="px-6 py-10 text-center text-sm opacity-70">Loading logs…</div>

      <!-- Empty -->
      <div v-else-if="!rows.length" class="px-6 py-10 text-center text-sm opacity-70">
        No logs found for the current filter.
      </div>

      <!-- Table -->
      <div v-else class="overflow-auto">
        <table class="min-w-[900px] w-full text-sm">
          <thead class="text-left border-y border-black/10 dark:border-white/10 bg-black/[.03] dark:bg-white/[.03]">
          <tr class="[&>*]:py-2 [&>*]:px-4">
            <th>Full Name</th>
            <th>User ID</th>
            <th>Department</th>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Lunch Start</th>
            <th>Lunch End</th>
            <th>Break Start</th>
            <th>Break End</th>
            <th>Status</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="row in paged"
              :key="row.logId || row.id"
              class="border-b border-black/5 dark:border-white/5 hover:bg-black/[.02] dark:hover:bg-white/[.02] transition"
          >
            <td class="py-2 px-4">{{ userFullName(row.userId) }}</td>
            <td class="py-2 px-4">#{{ row.userId }}</td>
            <td class="py-2 px-4">{{ displayDept(row) }}</td>
            <td class="py-2 px-4">{{ row.logDate }}</td>
            <td class="py-2 px-4">{{ showTime(row.timeIn) }}</td>
            <td class="py-2 px-4">{{ showTime(row.timeOut) }}</td>
            <td class="py-2 px-4">{{ showTime(row.lunchStart) }}</td>
            <td class="py-2 px-4">{{ showTime(row.lunchEnd) }}</td>
            <td class="py-2 px-4">{{ showTime(row.breakStart) }}</td>
            <td class="py-2 px-4">{{ showTime(row.breakEnd) }}</td>
            <td class="py-2 px-4">{{ computedStatus(row) }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 dark:border-white/10">
        <div class="text-xs opacity-70">
          Page {{ page + 1 }} of {{ totalPages || 1 }}
        </div>
        <div class="flex items-center gap-2">
          <button class="btn" @click="prev" :disabled="page === 0">Prev</button>
          <button class="btn" @click="next" :disabled="page >= totalPages - 1">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import { getLogs, getUsers, getDepartments, getDepartmentSchedules } from '../services/api.js'

const rows = ref([])
const loading = ref(false)
const error = ref('')
const q = reactive({ userId: '', from: '', to: '' })

// user -> department mapping
const userDeptMap = ref({})
const userNameById = ref({})

// departmentId -> departmentName mapping
const deptNameById = ref({})

// department work-start map (by department name, case-insensitive)
const deptWorkStartByKey = ref({})
function nameKey(name){ return String(name || '').trim().toLowerCase() }
function toHms(s){
  if (!s && s !== 0) return ''
  const m = String(s).match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/)
  if (!m) return ''
  const hh = String(m[1]).padStart(2,'0')
  const mm = String(m[2]).padStart(2,'0')
  const ss = m[3] != null ? String(m[3]).padStart(2,'0') : '00'
  return `${hh}:${mm}:${ss}`
}
function toHms12(s){
  if (!s && s !== 0) return ''
  const m = String(s).match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/)
  if (!m) return ''
  let hh = Number(m[1])
  const mm = String(m[2]).padStart(2,'0')
  const ss = m[3] != null ? String(m[3]).padStart(2,'0') : '00'
  const ap = hh >= 12 ? 'PM' : 'AM'
  hh = hh % 12
  if (hh === 0) hh = 12
  const sec = m[3] != null ? `:${ss}` : ''
  return `${hh}:${mm}${sec} ${ap}`
}
function showTime(v){
  const t = toHms12(v)
  return t || (v ? String(v) : '-')
}
function prettyStatus(s){
  const t = String(s || '').trim()
  if (!t) return '-'
  const u = t.replace(/[\s_-]/g,'').toUpperCase()
  const map = {
    ONTIME: 'On Time',
    LATE: 'Late',
    ABSENT: 'Absent',
    HALFDAY: 'Half Day',
    INCOMPLETE: 'Incomplete',
    LEAVE: 'Leave',
    HOLIDAY: 'Holiday',
  }
  return map[u] || t
}
async function loadDeptMeta(){
  try {
    // Load departments
    let depRes = []
    try {
      const res = await getDepartments()
      depRes = Array.isArray(res) ? res : (res?.content || [])
    } catch (e) {
      console.warn('[AdminLogs] getDepartments failed:', e?.message || e)
      depRes = []
    }
    const idToNameKey = {}
    const idToName = {}
    for (const d of depRes) {
      if (!d) continue
      const id = d.departmentId ?? d.department_id ?? d.deptId ?? d.dept_id ?? d.id
      const name = d.departmentName ?? d.department_name ?? d.deptName ?? d.dept_name ?? d.name ?? d.title
      if (id == null || !name) continue
      idToNameKey[String(id)] = nameKey(name)
      idToName[String(id)] = String(name)
    }
    // expose departmentId -> name mapping for UI
    deptNameById.value = idToName

    // Load schedules
    let scheds = []
    try {
      const res = await getDepartmentSchedules()
      scheds = Array.isArray(res) ? res : (res?.content || [])
    } catch (e) {
      console.warn('[AdminLogs] getDepartmentSchedules failed:', e?.message || e)
      scheds = []
    }
    const idToWs = {}
    for (const s of scheds) {
      const did = s?.departmentId ?? s?.department_id ?? s?.deptId ?? s?.dept_id
      const ws = toHms(s?.workStart ?? s?.work_start ?? s?.start)
      if (did != null && ws) idToWs[String(did)] = ws
    }

    const map = {}
    for (const [id, key] of Object.entries(idToNameKey)) {
      const ws = idToWs[id]
      if (key && ws) map[key] = ws
    }
    deptWorkStartByKey.value = map
  } catch (e) {
    console.warn('[AdminLogs] loadDeptMeta failed:', e?.message || e)
  }
}

async function loadUsers() {
  try {
    const res = await getUsers({ limit: -1 })
    const list = Array.isArray(res) ? res : (res?.content || [])
    const deptMap = {}
    const nameMap = {}
    for (const u of list) {
      if (!u) continue
      const id = u.userId ?? u.user_id ?? u.id
      if (id == null) continue
      const dept = pickDept(u)
      deptMap[String(id)] = dept || '-'
      const fn = u.user_fname ?? u.userFname ?? u.first_name ?? u.firstName ?? u.firstname ?? u.fname
      const ln = u.user_lname ?? u.userLname ?? u.last_name ?? u.lastName ?? u.lastname ?? u.lname
      const nm = [fn, ln].filter(Boolean).join(' ').trim() || u.full_name || u.fullName || u.name || ''
      nameMap[String(id)] = nm
    }
    userDeptMap.value = deptMap
    userNameById.value = nameMap
  } catch (e) {
    console.warn('[AdminLogs] loadUsers failed:', e?.message || e)
    // leave maps as-is; getUsers already has offline fallback
  }
}
function pickDept(u) {
  // Try various possible shapes
  return (
    u.departmentName ||
    u.department?.name ||
    u.deptName ||
    u.department_name ||
    u.department ||
    ''
  )
}
function userDept(userId) {
  return userDeptMap.value[String(userId ?? '')] || '-'
}
function userFullName(userId) {
  const id = String(userId ?? '')
  const nm = userNameById.value[id] || ''
  return nm || (userId != null ? `User #${userId}` : '-')
}

function deptName(id){
  if (id == null) return ''
  return deptNameById.value[String(id)] || ''
}
function displayDept(row){
  const direct = row?.departmentName || row?.department?.departmentName || row?.department?.name || row?.department || row?.deptName || row?.dept_name
  if (direct) return String(direct)
  const viaId = row?.departmentId ?? row?.department_id ?? row?.department?.departmentId ?? row?.department?.id
  const nm = deptName(viaId)
  if (nm) return nm
  return userDept(row?.userId)
}

// pagination
const page = ref(0)
const pageSize = ref(25)
const totalPages = computed(() => Math.ceil(rows.value.length / pageSize.value) || 1)
const paged = computed(() => {
  const start = page.value * pageSize.value
  return rows.value.slice(start, start + pageSize.value)
})
function next() { if (page.value < totalPages.value - 1) page.value++ }
function prev() { if (page.value > 0) page.value-- }

// auto-refresh
const autoRefresh = ref(false)
let timer = null
onMounted(() => {
  loadUsers()
  loadDeptMeta()
  startAutoRefresh()
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
function startAutoRefresh() {
  if (timer) clearInterval(timer)
  if (autoRefresh.value) {
    timer = setInterval(() => refresh(), 15000) // 15s
  }
}
watchEffect(startAutoRefresh)

// core load
async function load() {
  try {
    error.value = ''
    loading.value = true
    page.value = 0

    // Validate range
    if (q.from && q.to && q.from > q.to) {
      error.value = 'Invalid date range: "From" must be before or equal to "To".'
      rows.value = []
      return
    }

    const params = {}
    if (q.userId) params.userId = q.userId
    if (q.from) params.from = q.from
    if (q.to) params.to = q.to

    const data = await getLogs(params)
    rows.value = Array.isArray(data) ? data : (data?.content || [])
    console.log('[AdminLogs] Loaded', rows.value.length, 'rows')
  } catch (e) {
    console.error('[AdminLogs] load error:', e)
    error.value = e?.message || 'Failed to load logs.'
    rows.value = []
  } finally {
    loading.value = false
  }
}

// helpers
function refresh() { load() }
function reset() {
  q.userId = ''
  q.from = ''
  q.to = ''
  load()
}

function computedStatus(row){
  try {
    const ti = toHms(row?.timeIn)
    if (!ti) return prettyStatus(row?.status) || '-'
    const dept = displayDept(row)
    const ws = deptWorkStartByKey.value[nameKey(dept)]
    if (!ws) return prettyStatus(row?.status) || '-'
    return ti > ws ? 'Late' : 'On Time'
  } catch (_) {
    return prettyStatus(row?.status) || '-'
  }
}

// export CSV
function exportCsv() {
  if (!rows.value.length) return
  const header = ['logId', 'userId', 'department', 'logDate', 'timeIn', 'timeOut', 'lunchStart', 'lunchEnd', 'breakStart', 'breakEnd', 'status']
  const csv = [
    header.join(','),
    ...rows.value.map(r => [
      safe(r.logId ?? r.id),
      safe(r.userId),
      safe(displayDept(r)),
      safe(r.logDate),
      safe(r.timeIn || ''),
      safe(r.timeOut || ''),
      safe(r.lunchStart || ''),
      safe(r.lunchEnd || ''),
      safe(r.breakStart || ''),
      safe(r.breakEnd || ''),
      safe(computedStatus(r))
    ].join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `attendance_logs_${new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date())}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
function safe(v) {
  if (v == null) return ''
  const s = String(v).replace(/"/g, '""')
  return /[",\n]/.test(s) ? `"${s}"` : s
}

// initial load
load()
</script>

<style scoped>
.label{ @apply block text-sm mb-1 opacity-80; }
.input{ @apply w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400; }
.btn{ @apply rounded-xl px-3 py-1.5 border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 hover:bg-white/80 dark:hover:bg-neutral-800/80; }
</style>
