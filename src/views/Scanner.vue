<template>
  <div class="space-y-8">
    <!-- Top banner like screenshot -->
    <div
        class="rounded-2xl p-5 md:p-6 border border-black/5 bg-gradient-to-r from-indigo-50 via-sky-50 to-fuchsia-50 shadow-sm"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold">
            Employee Time Tracking System
          </h1>
          <p class="mt-1 text-neutral-600">
            Digital time recording and attendance management
          </p>
        </div>
        <div class="text-right">
          <div class="flex items-center justify-end gap-2">
            <span
                class="inline-block w-2 h-2 rounded-full bg-blue-500"
            ></span>
            <div
                class="tabular-nums text-xl md:text-2xl font-semibold"
            >
              {{ timeString }}
            </div>
          </div>
          <div class="mt-1 text-xs md:text-sm text-neutral-700">
            {{ dateString }}
          </div>
        </div>
      </div>
    </div>

    <!-- Top row: Employee Information and Department Schedule -->
    <div class="grid lg:grid-cols-5 gap-4">
      <!-- Employee Information card -->
      <div
          class="rounded-2xl p-4 border border-black/5 bg-white/70 backdrop-blur shadow-sm lg:col-span-2"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
              class="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-5 h-5"
            >
              <path
                  fill="currentColor"
                  d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m-7 8a7 7 0 0 1 14 0z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold">Employee Information</h3>
        </div>

        <!-- Photo -->
        <div class="mb-4 flex items-center gap-4">
          <div
              class="w-32 h-32 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center text-neutral-600 border border-black/10"
          >
            <img
                v-if="displayPhoto"
                :src="displayPhoto"
                alt="Employee photo"
                class="w-full h-full object-cover"
            />
            <span v-else class="font-semibold">{{ initials }}</span>
          </div>
          <div>
            <label class="block text-sm mb-1 opacity-80">Photo</label>
            <div class="text-xs text-neutral-600">
              Photo will appear here when available from the database.
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm mb-1 opacity-80">
              Employee No:
            </label>
            <input
                class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
                type="number"
                v-model.number="form.manualUserId"
                placeholder="Employee number"
                :disabled="DISABLE_EMPLOYEE_NO || busy"
            />
          </div>

          <div>
            <label
                class="block text-sm mb-1 opacity-80 flex items-center gap-2"
            >
              <span
                  class="inline-flex items-center justify-center w-5 h-5 text-indigo-600"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="w-5 h-5"
                >
                  <path
                      fill="currentColor"
                      d="M2 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1h1a4 4 0 0 1 4 4v3a3 3 0 0 1-3 3H9a4 4 0 0 1-4-4V7Zm2 0v4a2 2 0 0 0 2 2h7V7z"
                  />
                </svg>
              </span>
              <span>RFID</span>
            </label>
            <div class="relative">
              <span
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="w-5 h-5"
                >
                  <path
                      fill="currentColor"
                      d="M2 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1h1a4 4 0 0 1 4 4v3a3 3 0 0 1-3 3H9a4 4 0 0 1-4-4V7Zm2 0v4a2 2 0 0 0 2 2h7V7z"
                  />
                </svg>
              </span>
              <input
                  ref="rfidInput"
                  class="w-full rounded-xl border border-black/10 bg-white/80 pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 text-transparent caret-indigo-600"
                  type="text"
                  v-model.trim="form.rfide"
                  @keyup.enter="onRfidSubmit"
                  placeholder="Tap card or enter RFID"
                  :disabled="DISABLE_RFID || busy"
                  autocomplete="off"
              />
              <div
                  class="pointer-events-none absolute left-10 right-3 top-1/2 -translate-y-1/2 text-neutral-900"
              >
                {{ maskedRfid }}
              </div>
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm mb-1 opacity-80">
              Full Name:
            </label>
            <div
                class="w-full rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-base font-medium min-h-[40px] flex items-center"
            >
              {{
                fullName ||
                (selectedUser &&
                    (selectedUser.fullName || selectedUser.name)) ||
                '—'
              }}
            </div>
          </div>

          <div>
            <label class="block text-sm mb-1 opacity-80">
              Department:
            </label>
            <div
                class="w-full rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-base font-medium min-h-[40px] flex items-center"
            >
              {{ departmentNameDisplay }}
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-2">
          <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 shadow hover:bg-indigo-700 disabled:opacity-60"
              :disabled="busy"
              @click="simulateFingerprint"
          >
            <span class="flex items-center gap-1">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="w-4 h-4"
              >
                <path
                    fill="currentColor"
                    d="M20 4H4a2 2 0 0 0-2 2v2h20V6a2 2 0 0 0-2-2M2 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10H2z"
                />
              </svg>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="w-4 h-4"
              >
                <path
                    fill="currentColor"
                    d="M12 1a7 7 0 0 0-7 7v3a1 1 0 1 0 2 0V8a5 5 0 0 1 10 0v3a7 7 0 0 1-7 7a1 1 0 0 0 0 2a9 9 0 0 0 9-9V8a7 7 0 0 0-7-7"
                />
              </svg>
            </span>
            <span v-if="!busy">Scan</span>
            <span v-else>Saving…</span>
          </button>
        </div>
      </div>

      <!-- Department Schedule -->
      <div
          class="rounded-2xl p-0 border border-black/5 bg-white/70 backdrop-blur shadow-sm overflow-hidden lg:col-span-3"
      >
        <div class="px-6 py-4 border-b border-black/10">
          <h3 class="text-lg font-semibold">Department Schedule</h3>
        </div>
        <div class="p-4">
          <div
              v-if="schedulesLoading"
              class="text-sm text-neutral-600"
          >
            Loading schedules...
          </div>
          <div
              v-else-if="schedulesError"
              class="text-sm text-red-600"
          >
            Failed to load schedules: {{ schedulesError }}
          </div>
          <div v-else>
            <div class="overflow-x-auto">
              <table class="min-w-[700px] w-full table-fixed text-xs">
                <thead
                    class="text-left border-b border-black/10 bg-black/[.03]"
                >
                <tr
                    class="[&>*]:py-1 [&>*]:px-2 [&>*]:align-top"
                >
                  <th>Depart-ment</th>
                  <th>Working Days</th>
                  <th>Work Start</th>
                  <th>Work End</th>
                  <th class="hidden sm:table-cell">
                    Lunch Start
                  </th>
                  <th class="hidden sm:table-cell">
                    Lunch End
                  </th>
                  <th class="hidden sm:table-cell">
                    Break Start
                  </th>
                  <th class="hidden sm:table-cell">
                    Break End
                  </th>
                  <th class="hidden sm:table-cell">Note</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="s in schedules"
                    :key="s.scheduleId ?? s.departmentId"
                    class="border-b border-black/5"
                >
                  <td
                      class="py-1 px-2 whitespace-normal break-words align-top"
                  >
                    {{ getDeptName(s.departmentId) }}
                  </td>
                  <td
                      class="py-1 px-2 whitespace-normal break-words align-top"
                  >
                    {{ s.workingDays ?? '' }}
                  </td>
                  <td
                      class="py-1 px-2 whitespace-normal break-words align-top"
                  >
                    {{ hms12(s.workStart) }}
                  </td>
                  <td
                      class="py-1 px-2 whitespace-normal break-words align-top"
                  >
                    {{ hms12(s.workEnd) }}
                  </td>
                  <td
                      class="py-1 px-2 whitespace-normal break-words align-top hidden sm:table-cell"
                  >
                    {{ hms12(s.lunchStart) }}
                  </td>
                  <td
                      class="py-1 px-2 whitespace-normal break-words align-top hidden sm:table-cell"
                  >
                    {{ hms12(s.lunchEnd) }}
                  </td>
                  <td
                      class="py-1 px-2 whitespace-normal break-words align-top hidden sm:table-cell"
                  >
                    {{ hms12(s.breakStart) }}
                  </td>
                  <td
                      class="py-1 px-2 whitespace-normal break-words align-top hidden sm:table-cell"
                  >
                    {{ hms12(s.breakEnd) }}
                  </td>
                  <td
                      class="py-1 px-2 whitespace-normal break-words align-top hidden sm:table-cell"
                  >
                    {{ s.workdaysNote ?? '' }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div
                v-if="schedules.length === 0"
                class="text-sm text-neutral-600 p-4"
            >
              No schedules available.
            </div>
          </div>
        </div>
        <div
            class="px-6 py-3 text-xs text-neutral-500 border-t border-black/5"
        >
          Updated on: {{ updatedOn }}
        </div>
      </div>
    </div>

    <!-- Floating modal showing last scan info -->
    <div v-if="lastScan" class="fixed top-4 left-4 z-50">
      <div
          class="rounded-xl border border-black/10 bg-white/90 backdrop-blur px-4 py-3 shadow-lg"
      >
        <div
            class="text-[11px] uppercase tracking-wide text-neutral-500"
        >
          Last Scan
        </div>
        <div class="text-base font-semibold text-neutral-900">
          {{ lastScan.name }}
        </div>
        <div class="text-sm text-neutral-700">
          {{ lastScan.department || '—' }}
        </div>
      </div>
    </div>

    <StatusToast :ok="toast.ok" :message="toast.msg" />
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  nextTick,
} from 'vue';
import StatusToast from '../components/StatusToast.vue';
import {
  postLog,
  findUserByRfidOrBarcode,
  getLogs,
  resolveDepartmentForUser,
  getUserById,
  normalizeStatus,
  getDepartmentSchedules,
  getDepartments,
  getExistingAttendanceLog,
  updateLog,
  getScheduleByDepartment, // ✅ ADD THIS
} from '../services/api.js';

import {
  DISABLE_EMPLOYEE_NO,
  DISABLE_RFID,
} from '../config.js';

/** ---------------- Form / State ---------------- */
const form = ref({
  action: 'TIME_IN',
  departmentId: undefined,
  manualUserId: undefined,
  rfide: '',
  keyboard: '',
});

// Masked display for RFID
const maskedRfid = computed(() =>
    '#'.repeat(String(form.value.rfide || '').length)
);

const rfidInput = ref(null);
const busy = ref(false);
const lastLocalLogs = ref([]);
const toast = ref({ ok: false, msg: '' });
const adminRows = ref([]);

/** ---------------- Clock ---------------- */
const now = ref(new Date());
let t = null;
onMounted(() => {
  t = setInterval(() => (now.value = new Date()), 1000);
});
onBeforeUnmount(() => {
  if (t) clearInterval(t);
});

// Auto-focus RFID input
onMounted(() => {
  if (DISABLE_RFID) return;
  nextTick(() => {
    setTimeout(() => {
      try {
        rfidInput?.value?.focus();
      } catch {}
    }, 0);
  });
});

/** ---------------- PH time strings ---------------- */
const timeString = computed(() =>
    now.value.toLocaleTimeString('en-PH', {
      timeZone: 'Asia/Manila',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
);
const dateString = computed(() =>
    now.value.toLocaleDateString('en-PH', {
      timeZone: 'Asia/Manila',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
);
const updatedOn = computed(() =>
    now.value.toLocaleDateString('en-PH', {
      timeZone: 'Asia/Manila',
    })
);

/** ---------------- Displayed user ---------------- */
const fullName = ref('');
const lastScan = ref(null);
const selectedUser = ref(null);
const serverPhotoUrl = computed(() => {
  const u = selectedUser.value;
  console.log('[DEBUG] Selected User object:', u);
  if (u) console.log('[DEBUG] Selected User (stringified):', JSON.stringify(u, null, 2));

  const photoPath =
      u?.photoUrl ||
      u?.avatar ||
      u?.profilePhoto ||
      u?.photo ||
      u?.image ||
      u?.user_image ||
      '';
  console.log('[DEBUG] Extracted photo path:', photoPath);

  const fullUrl = photoPath
      ? `http://100.126.246.124:3002${photoPath}`
      : '';
  console.log('[DEBUG] Final server photo URL:', fullUrl);

  return fullUrl;
});

const displayPhoto = computed(() => {
  console.log('[DEBUG] Display photo URL:', serverPhotoUrl.value || '');
  return serverPhotoUrl.value || '';
});

watch(selectedUser, (newVal, oldVal) => {
  console.log('[DEBUG] selectedUser changed from:', oldVal, 'to:', newVal);
});
watch(selectedUser, (newVal) => {
  console.log('[DEBUG] selectedUser updated:', newVal);
});

const initials = computed(() => {
  const u = selectedUser.value;
  let name = String(fullName.value || '').trim();
  if (!name && (u?.fullName || u?.name)) name = u.fullName || u.name;
  const parts = String(name || '')
      .split(/\s+/)
      .filter(Boolean);
  const s =
      (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  return s ? s.toUpperCase() : 'EMP';
});

/** ---------------- Watch manual user id ---------------- */
watch(
    () => form.value.manualUserId,
    async (id) => {
      selectedUser.value = null;
      if (id == null || id === '') {
        fullName.value = '';
        form.value.departmentId = undefined;
        return;
      }
      try {
        const user = await getUserById(id);
        if (user) {
          selectedUser.value = user;
          const name =
              user.fullName ||
              user.name ||
              [
                user.firstName,
                user.middleName,
                user.lastName,
                user.user_fname,
                user.user_mname,
                user.user_lname,
              ]
                  .filter(Boolean)
                  .join(' ')
                  .trim();
          if (name) fullName.value = name;
          try {
            const directId =
                user.departmentId ??
                user.department_id ??
                user.user_department ??
                user?.department?.departmentId ??
                user?.department?.id;
            if (directId != null) {
              form.value.departmentId = Number(directId);
            } else {
              const info = await resolveDepartmentForUser(
                  user.userId ?? user.id ?? id
              );
              if (info?.departmentId != null)
                form.value.departmentId = Number(
                    info.departmentId
                );
            }
          } catch {}
        } else {
          fullName.value = '';
          form.value.departmentId = undefined;
        }
      } catch {
        fullName.value = '';
        form.value.departmentId = undefined;
      }
    }
);

/** ---------------- RFID submit ---------------- */
async function onRfidSubmit() {
  if (DISABLE_RFID || busy.value) return;
  const v = String(form.value.rfide || '').trim();
  if (!v) return;
  try {
    const u = await findUserByRfidOrBarcode(v);
    if (u && (u.userId != null || u.id != null)) {
      form.value.manualUserId = Number(u.userId ?? u.id);
      const directId =
          u.departmentId ??
          u.department_id ??
          u?.department?.departmentId ??
          u?.department?.id;
      if (directId != null)
        form.value.departmentId = Number(directId);
      selectedUser.value = u;
      const name =
          u.fullName ||
          u.name ||
          [
            u.firstName,
            u.middleName,
            u.lastName,
            u.user_fname,
            u.user_mname,
            u.user_lname,
          ]
              .filter(Boolean)
              .join(' ')
              .trim();
      if (name) fullName.value = name;

      try {
        await commit({
          departmentId: form.value.departmentId,
          manualUserId: form.value.manualUserId,
        });
      } finally {
        form.value.rfide = '';
      }
    } else {
      note(false, 'User not found for given RFID.');
      scheduleClearFields(2000);
    }
  } catch (e) {
    console.error('[Scanner] onRfidSubmit error:', e);
    note(false, 'Failed to resolve RFID.');
    scheduleClearFields(2000);
  }
}

/** ---------------- Manila helpers ---------------- */
const manilaDateYMD = () =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

const manilaIsoWithOffset = () => {
  const parts = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
      .formatToParts(new Date())
      .reduce((acc, p) => {
        acc[p.type] = p.value;
        return acc;
      }, {});
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+08:00`;
};

/** ---------------- UI helpers ---------------- */
function note(ok, msg) {
  toast.value = { ok, msg };
  setTimeout(
      () => (toast.value = { ok: false, msg: '' }),
      3000
  );
}
function pushLocal(entry) {
  lastLocalLogs.value.unshift(entry);
  if (lastLocalLogs.value.length > 12)
    lastLocalLogs.value.pop();
}
function clearForm() {
  form.value = {
    action: 'TIME_IN',
    departmentId: undefined,
    manualUserId: undefined,
    rfide: '',
    keyboard: '',
  };
  fullName.value = '';
  selectedUser.value = null;
  try {
    if (!DISABLE_RFID)
      nextTick(() =>
          setTimeout(() => rfidInput?.value?.focus?.(), 0)
      );
  } catch {}
}
let clearFieldsTimer = null;
function scheduleClearFields(ms) {
  if (clearFieldsTimer) {
    clearTimeout(clearFieldsTimer);
    clearFieldsTimer = null;
  }
  clearFieldsTimer = setTimeout(() => {
    try {
      clearForm();
    } finally {
      clearFieldsTimer = null;
    }
  }, ms);
}

/** ---------------- Data loaders ---------------- */
async function loadAdminLogs() {
  try {
    const data = await getLogs({});
    adminRows.value = Array.isArray(data)
        ? data
        : data?.content || [];
    console.log('[AdminLogs] rows:', adminRows.value.length);
  } catch (e) {
    console.error('[AdminLogs] load error:', e);
    adminRows.value = [];
  }
}
loadAdminLogs();

/** ---------------- Department schedules ---------------- */
const schedules = ref([]);
const schedulesLoading = ref(true);
const schedulesError = ref('');
const departments = ref([]);

const deptMap = computed(() => {
  const map = {};
  for (const d of departments.value || []) {
    const key = String(
        d.departmentId ??
        d.department_id ??
        d.deptId ??
        d.dept_id ??
        d.id
    );
    map[key] = d;
  }
  return map;
});
function deptNameOf(d) {
  return (
      d?.departmentName ??
      d?.department_name ??
      d?.deptName ??
      d?.dept_name ??
      d?.name ??
      d?.title ??
      null
  );
}
function getDeptName(id) {
  if (id == null) return '—';
  const d = deptMap.value[String(id)];
  return deptNameOf(d) || '—';
}
const departmentNameDisplay = computed(() => {
  const id = form.value.departmentId;
  const u = selectedUser.value;

  const nameFromUserObject =
      u?.departmentName ??
      u?.department_name ??
      u?.deptName ??
      u?.dept_name ??
      u?.department?.departmentName ??
      u?.department?.department_name ??
      u?.department?.deptName ??
      u?.department?.dept_name ??
      u?.department?.name ??
      u?.department?.title;
  if (nameFromUserObject) return nameFromUserObject;

  if (id != null) {
    const d = deptMap.value[String(id)];
    return deptNameOf(d) || '—';
  }

  return '—';
});

async function loadSchedules() {
  schedulesLoading.value = true;
  schedulesError.value = '';
  try {
    const data = await getDepartmentSchedules();
    const arr = Array.isArray(data)
        ? data
        : data?.content || [];
    schedules.value = arr;
  } catch (e) {
    console.error('[Scanner] loadSchedules error:', e);
    schedulesError.value = e?.message || 'Error loading schedules';
    schedules.value = [];
  } finally {
    schedulesLoading.value = false;
  }
}
async function loadDepartments() {
  try {
    const res = await getDepartments();
    const list = Array.isArray(res)
        ? res
        : res?.content || [];
    departments.value = list;
  } catch {
    departments.value = [];
  }
}
onMounted(() => {
  loadSchedules();
  loadDepartments();
});

/** ---------------- Utilities ---------------- */
function titleCaseFromEnum(s = '') {
  return s
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
}
function hms12(s) {
  if (!s && s !== 0) return '';
  const m = String(s).match(
      /(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/
  );
  if (!m) return String(s || '');
  let hh = Number(m[1]);
  const mm = String(m[2]).padStart(2, '0');
  const ss =
      m[3] != null ? String(m[3]).padStart(2, '0') : null;
  const ap = hh >= 12 ? 'PM' : 'AM';
  hh = hh % 12;
  if (hh === 0) hh = 12;
  const sec = ss != null ? `:${ss}` : '';
  return `${hh}:${mm}${sec} ${ap}`;
}
async function verifyUserExists(id) {
  try {
    const user = await getUserById(id, { noMock: true });
    return !!(
        user &&
        (user.userId != null ||
            user.id != null ||
            user.user_id != null)
    );
  } catch {
    return false;
  }
}
const ACTION_SEQUENCE = [
  'TIME_IN',
  'LUNCH_START',
  'LUNCH_END',
  'BREAK_START',
  'BREAK_END',
  'TIME_OUT',
];

async function getTodayLogForUser(userId) {
  const dateStr = manilaDateYMD();
  try {
    const res = await getLogs({
      userId,
      from: dateStr,
      to: dateStr,
      useUserDateEndpoint: true,
    });
    const arrRaw = Array.isArray(res)
        ? res
        : res?.content || [];
    const arr = arrRaw.filter((r) => {
      const uid = Number(
          r?.userId ?? r?.user_id ?? r?.user?.id
      );
      const ld = String(
          r?.logDate || r?.log_date || ''
      ).slice(0, 10);
      return (
          uid === Number(userId) &&
          (!ld || ld === dateStr)
      );
    });
    if (!arr?.length) return null;
    if (arr.length === 1) return arr[0];
    return arr.reduce((best, r) => {
      const a =
          latestActionTime(best) ??
          toTs(
              best?.updatedAt ||
              best?.updated_at ||
              best?.createdAt ||
              best?.created_at ||
              best?.logDate ||
              best?.log_date
          );
      const b =
          latestActionTime(r) ??
          toTs(
              r?.updatedAt ||
              r?.updated_at ||
              r?.createdAt ||
              r?.created_at ||
              r?.logDate ||
              r?.log_date
          );
      return (b || 0) > (a || 0) ? r : best;
    }, arr[0]);
  } catch {
    try {
      const res2 = await getLogs({
        userId,
        from: dateStr,
        to: dateStr,
      });
      const arr2Raw = Array.isArray(res2)
          ? res2
          : res2?.content || [];
      const arr2 = arr2Raw.filter((r) => {
        const uid = Number(
            r?.userId ?? r?.user_id ?? r?.user?.id
        );
        const ld = String(
            r?.logDate || r?.log_date || ''
        ).slice(0, 10);
        return (
            uid === Number(userId) &&
            (!ld || ld === dateStr)
        );
      });
      if (!arr2?.length) return null;
      if (arr2.length === 1) return arr2[0];
      return arr2.reduce((best, r) => {
        const a =
            latestActionTime(best) ??
            toTs(
                best?.updatedAt ||
                best?.createdAt ||
                best?.logDate ||
                best?.log_date
            );
        const b =
            latestActionTime(r) ??
            toTs(
                r?.updatedAt ||
                r?.createdAt ||
                r?.logDate ||
                r?.log_date
            );
        return (b || 0) > (a || 0) ? r : best;
      }, arr2[0]);
    } catch {
      return null;
    }
  }
}
function countRecordedActions(row) {
  if (!row) return 0;
  const fields = [
    'timeIn',
    'lunchStart',
    'lunchEnd',
    'breakStart',
    'breakEnd',
    'timeOut',
  ];
  return fields.reduce((n, f) => n + (row[f] ? 1 : 0), 0);
}
async function determineNextAction(userId) {
  const todayStr = manilaDateYMD();
  const todayLog = await getTodayLogForUser(userId);

  // ---- Try to load the user's schedule ----
  let schedule = null;
  try {
    const deptInfo = await resolveDepartmentForUser(userId);
    if (deptInfo?.departmentId != null) {
      schedule = await getScheduleByDepartment(deptInfo.departmentId);
    }
  } catch (_) {
    schedule = null;
  }

  // ---- Check if we are already past scheduled work_end (Asia/Manila) ----
  let afterWorkEnd = false;
  if (schedule?.workEnd) {
    // schedule.workEnd is something like "17:30:00"
    const hhmmss = String(schedule.workEnd).slice(0, 8); // keep "HH:MM:SS"
    const schedStr = `${todayStr}T${hhmmss}+08:00`;       // Manila absolute time
    const schedTs = Date.parse(schedStr);                // ms since epoch
    if (!Number.isNaN(schedTs)) {
      const nowTs = Date.now();
      if (nowTs >= schedTs) afterWorkEnd = true;
    }
  }

  if (afterWorkEnd && todayLog) {
    const hasTimeIn = !!(
        todayLog.timeIn ||
        todayLog.time_in ||
        todayLog.checkIn ||
        todayLog.in
    );
    const hasTimeOut = !!(
        todayLog.timeOut ||
        todayLog.time_out ||
        todayLog.checkOut ||
        todayLog.out
    );

    // If user has already TIMED IN but has no TIME_OUT yet and
    // current time is after work_end -> force TIME_OUT.
    if (hasTimeIn && !hasTimeOut) {
      return 'TIME_OUT';
    }

    // If TIME_OUT is already recorded, no more actions for today.
    if (hasTimeOut) {
      return null;
    }
  }

  // ---- Normal behavior (before work_end) ----
  const count = countRecordedActions(todayLog);
  return ACTION_SEQUENCE[count] || null;
}


/** ---------------- Cooldown ---------------- */
const COOLDOWN_MINUTES = 1;
const COOLDOWN_STORAGE_KEY = 'attnCooldowns';
const COOLDOWN_DISABLED = false;
function readCooldowns() {
  try {
    return JSON.parse(
        localStorage.getItem(COOLDOWN_STORAGE_KEY) || '{}'
    );
  } catch {
    return {};
  }
}
function writeCooldowns(map) {
  try {
    localStorage.setItem(
        COOLDOWN_STORAGE_KEY,
        JSON.stringify(map)
    );
  } catch {}
}
function getCooldownUntil(userId) {
  if (COOLDOWN_DISABLED) return 0;
  if (!userId) return 0;
  const map = readCooldowns();
  const v = map[String(userId)];
  return typeof v === 'number' ? v : 0;
}
function setCooldown(userId, minutes = COOLDOWN_MINUTES) {
  if (!userId) return;
  const until = Date.now() + minutes * 60 * 1000;
  const map = readCooldowns();
  map[String(userId)] = until;
  writeCooldowns(map);
}
function getCooldownLeftSec(userId) {
  const until = getCooldownUntil(userId);
  return Math.max(
      0,
      Math.ceil((until - Date.now()) / 1000)
  );
}
function startCooldownFor(userId, minutes = COOLDOWN_MINUTES) {
  if (COOLDOWN_DISABLED) return;
  setCooldown(userId, minutes);
  tickCooldown();
}
function clearCooldownFor(userId) {
  if (!userId) return;
  const map = readCooldowns();
  if (Object.prototype.hasOwnProperty.call(map, String(userId))) {
    delete map[String(userId)];
    writeCooldowns(map);
    tickCooldown();
  }
}
async function resetCooldownIfNoLogs(userId) {
  if (COOLDOWN_DISABLED || !userId) return;
  try {
    const dateStr = manilaDateYMD();
    const res = await getLogs({
      userId,
      from: dateStr,
      to: dateStr,
      useUserDateEndpoint: true,
    });
    const arr = Array.isArray(res)
        ? res
        : res?.content || [];
    if (!arr || arr.length === 0)
      clearCooldownFor(userId);
  } catch {}
}
const selectedUserId = computed(() => {
  const n = Number(form.value.manualUserId);
  return Number.isFinite(n) && n > 0 ? n : null;
});
const selectedCooldownLeftSec = ref(0);
const isCoolingDownForSelected = computed(() => {
  if (!selectedUserId.value) return false;
  return getCooldownUntil(selectedUserId.value) > Date.now();
});
let cooldownTicker = null;
function tickCooldown() {
  if (selectedUserId.value)
    selectedCooldownLeftSec.value = getCooldownLeftSec(
        selectedUserId.value
    );
  else selectedCooldownLeftSec.value = 0;
  const map = readCooldowns();
  let changed = false;
  for (const k of Object.keys(map)) {
    if (
        typeof map[k] === 'number' &&
        map[k] <= Date.now()
    ) {
      delete map[k];
      changed = true;
    }
  }
  if (changed) writeCooldowns(map);
}
onMounted(() => {
  cooldownTicker = setInterval(tickCooldown, 1000);
  tickCooldown();
});
onBeforeUnmount(() => {
  if (cooldownTicker) {
    clearInterval(cooldownTicker);
    cooldownTicker = null;
  }
});

async function enforceLocalCooldownOrThrow(userId) {
  if (COOLDOWN_DISABLED) return;
  const leftSec = getCooldownLeftSec(userId);
  if (leftSec > 0) {
    try {
      const today = await getTodayLogForUser(userId);
      if (!today) {
        clearCooldownFor(userId);
        return;
      }
    } catch {}
    const err = new Error('You can only scan once.');
    err.code = 'COOLDOWN_LOCAL';
    throw err;
  }
}

/** ---------------- Time helpers ---------------- */
function toTs(v) {
  if (!v) return null;
  if (typeof v === 'number' && !Number.isNaN(v))
    return v > 1e12 ? v : v * 1000;
  if (v instanceof Date) {
    const t = v.getTime();
    return Number.isNaN(t) ? null : t;
  }
  const s = String(v).trim();
  let d = new Date(s);
  if (Number.isNaN(d.getTime()))
    d = new Date(
        s.replace(
            /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}(:\d{2})?)$/,
            '$1T$2'
        )
    );
  if (
      Number.isNaN(d.getTime()) &&
      /T\d{2}:\d{2}/.test(s) &&
      !/[zZ]|[+-]\d{2}:?\d{2}$/.test(s)
  )
    d = new Date(s + 'Z');
  const t = d.getTime();
  return Number.isNaN(t) ? null : t;
}
function latestActionTime(row) {
  if (!row) return null;
  const candidates = [
    row.timeIn,
    row.time_in,
    row.timeOut,
    row.time_out,
    row.lunchStart,
    row.lunch_start,
    row.lunchEnd,
    row.lunch_end,
    row.breakStart,
    row.break_start,
    row.breakEnd,
    row.break_end,
  ];
  const times = candidates
      .map((v) => toTs(v))
      .filter(Boolean);
  if (!times.length) {
    const fallback = toTs(
        row.updatedAt ||
        row.updated_at ||
        row.createdAt ||
        row.created_at ||
        row.logDate ||
        row.log_date
    );
    return fallback || null;
  }
  return Math.max(...times);
}
async function enforceServerCooldownOrThrow(userId) {
  if (COOLDOWN_DISABLED) return;
  try {
    const today = await getTodayLogForUser(userId);
    if (!today) {
      clearCooldownFor(userId);
      return;
    }
    const lastTs = latestActionTime(today);
    if (!lastTs) return;
    const diffMin = (Date.now() - lastTs) / 60000;
    if (diffMin < COOLDOWN_MINUTES) {
      const err = new Error('You can only scan once.');
      err.code = 'COOLDOWN_SERVER';
      throw err;
    }
  } catch {
    // network errors -> don't block locally
  }
}

/** ---------------- Resolve & Build payload ---------------- */
async function resolveUser({ manualUserId, keyboard }) {
  let userId = manualUserId;
  let type = 'RFID';
  const raw = (keyboard || '').trim();

  if (userId && !Number.isNaN(Number(userId))) {
    const ok = await verifyUserExists(userId);
    if (!ok) throw new Error(`User #${userId} not found.`);
    return { userId: Number(userId), type, raw };
  }
  if (!raw)
    throw new Error('Provide a User ID or scan an RFID value.');

  type = 'RFID';
  const user = await findUserByRfidOrBarcode(raw);
  if (user?.id || user?.userId) {
    userId = user.id || user.userId;
    return { userId: Number(userId), type, raw };
  }
  throw new Error('User not found for given RFID.');
}

function buildPayload({
                        userId,
                        departmentId,
                        departmentName,
                        type,
                        action,
                        raw,
                      }) {
  const iso = manilaIsoWithOffset();
  const actionEnum = String(action || 'TIME_IN')
      .trim()
      .toUpperCase();
  const statusName = normalizeStatus(actionEnum);
  const fieldMap = {
    TIME_IN: 'timeIn',
    TIME_OUT: 'timeOut',
    LUNCH_START: 'lunchStart',
    LUNCH_END: 'lunchEnd',
    BREAK_START: 'breakStart',
    BREAK_END: 'breakEnd',
  };
  const fieldName = fieldMap[actionEnum] || 'timeIn';
  const timed = { [fieldName]: iso };
  return {
    userId,
    departmentId: departmentId || undefined,
    departmentName: departmentName || undefined,
    logDate: iso.slice(0, 10),
    ...timed,
    type,
    action: actionEnum,
    status: statusName,
    raw: raw || undefined,
  };
}

/** ---------------- Actions ---------------- */
let lastSubmit = { key: '', ts: 0 };

async function simulateFingerprint() {
  let success = false;
  const targetUserId = Number(form.value.manualUserId);

  if (!Number.isFinite(targetUserId) || targetUserId <= 0) {
    note(false, 'No user found.');
    scheduleClearFields(2000);
    return;
  }

  const nextAction = await determineNextAction(targetUserId);
  if (!nextAction) {
    note(
        false,
        'All required scans for today are already recorded. Please do not scan again.'
    );
    scheduleClearFields(2000);
    return;
  }

  const key = `${targetUserId}|${nextAction}|${manilaDateYMD()}`;
  const nowTs = Date.now();
  if (lastSubmit.key === key && nowTs - lastSubmit.ts < 1500) {
    note(false, 'Already recorded. Please do not scan twice.');
    scheduleClearFields(2000);
    return;
  }
  lastSubmit = { key, ts: nowTs };

  await resetCooldownIfNoLogs(targetUserId);
  await enforceLocalCooldownOrThrow(targetUserId);

  if (busy.value) return;
  busy.value = true;

  try {
    const ok = await verifyUserExists(targetUserId);
    if (!ok) {
      note(false, `User #${targetUserId} not found.`);
      return;
    }

    await enforceServerCooldownOrThrow(targetUserId);

    try {
      const u = await getUserById(targetUserId);
      if (u) {
        selectedUser.value = u;
        const name =
            u.fullName ||
            u.name ||
            [
              u.firstName,
              u.middleName,
              u.lastName,
              u.user_fname,
              u.user_mname,
              u.user_lname,
            ]
                .filter(Boolean)
                .join(' ')
                .trim();
        if (name) fullName.value = name;
      }
    } catch {}

    let autoDeptId = form.value.departmentId;
    let autoDeptName;
    if (autoDeptId == null) {
      const info = await resolveDepartmentForUser(targetUserId);
      autoDeptId = info?.departmentId;
      autoDeptName = info?.departmentName;
    }
    form.value.manualUserId = targetUserId;
    if (autoDeptId != null)
      form.value.departmentId = Number(autoDeptId);

    const payload = buildPayload({
      userId: targetUserId,
      departmentId: autoDeptId,
      departmentName: autoDeptName,
      type: 'FINGERPRINT',
      action: nextAction,
      raw: 'SIMULATED_FP_4500',
    });

    console.debug(
        '[Scanner] simulateFingerprint payload ->',
        payload
    );

    // ALWAYS use postLog so schedule-based auto TIME_OUT runs
    const res = await postLog(payload);

    pushLocal({
      time: new Date().toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        hour12: true,
      }),
      userId: targetUserId,
      type: 'FINGERPRINT',
      action: nextAction,
      departmentId: autoDeptId,
      departmentName: autoDeptName,
    });
    note(
        true,
        `Fingerprint ${titleCaseFromEnum(nextAction)} logged for #${targetUserId}`
    );
    success = true;
    console.log('[Scanner] simulateFingerprint result ->', res);
    form.value.action = nextAction;
    loadAdminLogs();

    const scanDept = autoDeptName || getDeptName(autoDeptId);
    const scanName =
        fullName.value ||
        (selectedUser.value &&
            (selectedUser.value.fullName ||
                selectedUser.value.name)) ||
        `#${targetUserId}`;
    lastScan.value = {
      name: String(scanName),
      department: String(scanDept || ''),
    };

    startCooldownFor(targetUserId);
  } catch (e) {
    console.error('[Scanner] simulateFingerprint error:', e);
    const msg = e?.message || 'Failed to log fingerprint.';
    const m = msg.match(/wait\s+(\d+)\s+minute/i);
    if (m)
      startCooldownFor(
          targetUserId,
          Number(m[1]) || COOLDOWN_MINUTES
      );
    note(false, msg);
  } finally {
    scheduleClearFields(success ? 0 : 2000);
    busy.value = false;
  }
}

async function onKeyboardSubmit(value) {
  form.value.keyboard = value;
  await commit(form.value);
}

async function commit({
                        action,
                        departmentId,
                        manualUserId,
                        keyboard,
                      }) {
  if (busy.value) return;
  busy.value = true;

  let intendedUserId = Number(manualUserId) || null;
  let success = false;

  try {
    const { userId, type, raw } = await resolveUser({
      manualUserId,
      keyboard,
    });
    intendedUserId = userId;

    await resetCooldownIfNoLogs(userId);
    await enforceLocalCooldownOrThrow(userId);
    await enforceServerCooldownOrThrow(userId);

    const nextAction = await determineNextAction(userId);
    if (!nextAction) {
      note(
          false,
          'All required scans for today are already recorded. Please do not scan again.'
      );
      return;
    }

    const key = `${userId}|${nextAction}|${manilaDateYMD()}`;
    const nowTs = Date.now();
    if (lastSubmit.key === key && nowTs - lastSubmit.ts < 1500) {
      note(false, 'Already recorded. Please do not scan twice.');
      return;
    }
    lastSubmit = { key, ts: nowTs };

    let resolvedDeptId = departmentId;
    let resolvedDeptName;

    try {
      const info = await resolveDepartmentForUser(userId);
      if (info) {
        resolvedDeptId =
            resolvedDeptId ?? info.departmentId;
        resolvedDeptName = info.departmentName;
      }
    } catch {}

    form.value.manualUserId = userId;
    if (resolvedDeptId != null)
      form.value.departmentId = Number(resolvedDeptId);

    const payload = buildPayload({
      userId,
      departmentId: resolvedDeptId,
      departmentName: resolvedDeptName,
      type,
      action: nextAction,
      raw,
    });

    console.debug('[Scanner] commit payload ->', payload);

    // ALWAYS use postLog – it will upsert + auto-TIME_OUT if needed
    const res = await postLog(payload);

    pushLocal({
      time: new Date().toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        hour12: true,
      }),
      userId,
      type,
      action: nextAction,
      departmentId: resolvedDeptId,
      departmentName: resolvedDeptName,
    });
    note(
        true,
        `${type} ${titleCaseFromEnum(nextAction)} logged for #${userId}`
    );
    success = true;
    console.log('[Scanner] commit result ->', res);
    loadAdminLogs();

    const scanDept =
        resolvedDeptName || getDeptName(resolvedDeptId);
    const scanName =
        fullName.value ||
        (selectedUser.value &&
            (selectedUser.value.fullName ||
                selectedUser.value.name)) ||
        `#${userId}`;
    lastScan.value = {
      name: String(scanName),
      department: String(scanDept || ''),
    };

    startCooldownFor(userId);
  } catch (e) {
    console.error('[Scanner] commit error:', e);
    const msg = e?.message || 'Failed to submit log.';
    const m = msg.match(/wait\s+(\d+)\s+minute/i);
    if (m && intendedUserId)
      startCooldownFor(
          intendedUserId,
          Number(m[1]) || COOLDOWN_MINUTES
      );
    note(false, msg);
  } finally {
    scheduleClearFields(success ? 0 : 2000);
    busy.value = false;
  }
}
</script>

