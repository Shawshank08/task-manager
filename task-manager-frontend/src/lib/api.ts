const API_URL = process.env.NEXT_PUBLIC_API_URL!

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

const refreshAccessToken = async () => {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include"
  })

  if (!res.ok) {
    throw new Error("Refresh failed")
  }

  const data = await res.json()
  accessToken = data.accessToken
  return accessToken
}

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers: any = options.headers || {}

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include"
  })

  if (res.status === 401) {
    try {
      const newToken = await refreshAccessToken()
      headers["Authorization"] = `Bearer ${newToken}`

      const retry = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include"
      })

      return retry
    } catch {
      accessToken = null
      throw new Error("Session expired")
    }
  }

  return res
}

// AUTH
export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) throw new Error("Login failed")

  const data = await res.json()
  accessToken = data.accessToken
  return data
}

export const logout = async () => {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include"
  })

  accessToken = null
}

// TASKS
export const getTasks = async (query = "") => {
  const res = await apiFetch(`/tasks${query}`)
  return res.json()
}

export const createTask = async (title: string, description: string) => {
  const res = await apiFetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description })
  })

  return res.json()
}

export const deleteTask = async (id: string) => {
  const res = await apiFetch(`/tasks/${id}`, {
    method: "DELETE"
  })

  return res.json()
}

export const toggleTask = async (id: string) => {
  const res = await apiFetch(`/tasks/${id}/toggle`, {
    method: "POST"
  })

  return res.json()
}
export const restoreSession = async () => {
  try {
    const token = await refreshAccessToken()
    return token
  } catch {
    return null
  }
}