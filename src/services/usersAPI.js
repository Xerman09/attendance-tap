// src/services/usersApi.js
const BASE = '/items/user'

// Generic fetch helper
async function j(method, url, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (import.meta.env.VITE_DIRECTUS_TOKEN) {
        headers['Authorization'] = `Bearer ${import.meta.env.VITE_DIRECTUS_TOKEN}`;
    }
    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status}: ${txt || res.statusText}`)
    }
    return res.json().catch(() => ({}))
}

// List users (Directus-style shape: { data: [...] })
export async function listUsers(params = {}) {
    const usp = new URLSearchParams(params)
    const url = `${BASE}${usp.toString() ? `?${usp}` : ''}`
    return j('GET', url)
}

// Get user by RFID – tries Directus filter first, falls back to plain query
export async function getUserByRfid(rfid) {
    // Directus filter format (rf_id is the canonical column in Directus)
    const directusUrl = `${BASE}?filter[rf_id][_eq]=${encodeURIComponent(rfid)}&limit=1`
    let out = await j('GET', directusUrl)
    if (out?.data && Array.isArray(out.data)) return out.data[0] || null

    // Fallback 1: plain query param with rf_id
    let fallbackUrl = `${BASE}?rf_id=${encodeURIComponent(rfid)}`
    out = await j('GET', fallbackUrl)
    if (out?.data && Array.isArray(out.data)) return out.data[0] || null
    if (Array.isArray(out)) return out[0] || null
    if (out && typeof out === 'object' && !Array.isArray(out)) return out

    // Fallback 2: legacy rfid param
    fallbackUrl = `${BASE}?rfid=${encodeURIComponent(rfid)}`
    out = await j('GET', fallbackUrl)
    if (out?.data && Array.isArray(out.data)) return out.data[0] || null
    if (Array.isArray(out)) return out[0] || null
    return out || null
}

// Example: get user by email (Directus filter)
export async function getUserByEmail(email) {
    const url = `${BASE}?filter[email][_eq]=${encodeURIComponent(email)}&limit=1`
    const out = await j('GET', url)
    return out?.data?.[0] || null
}

// Create user (Directus-style expects { data: { ... } })
export async function createUser(user) {
    return j('POST', BASE, { data: user })
}

// Update user by id (Directus: /items/user/:id with { data: {...} })
export async function updateUser(id, patch) {
    return j('PATCH', `${BASE}/${encodeURIComponent(id)}`, { data: patch })
}
