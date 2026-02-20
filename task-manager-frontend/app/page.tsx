"use client"

import { useEffect, useState } from "react"
import {
  login,
  logout,
  getTasks,
  createTask,
  deleteTask,
  toggleTask,
  setAccessToken,
  restoreSession
} from "@/src/lib/api"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const [search, setSearch] = useState("")

  const handleLogin = async () => {
    try {
      const data = await login(email, password)
      setAccessToken(data.accessToken)
      setIsLoggedIn(true)
      setError("")
    } catch {
      setError("Invalid credentials")
    }
  }

  const handleLogout = async () => {
    await logout()
    setAccessToken(null)
    setIsLoggedIn(false)
    setTasks([])
  }

  const fetchTasks = async () => {
    let query = `?page=${page}&limit=5`

    if (statusFilter) query += `&status=${statusFilter}`
    if (search) query += `&search=${search}`

    const data = await getTasks(query)
    setTasks(data.data)
  }

  const handleAddTask = async () => {
    if (!title) return
    await createTask(title, description)
    setTitle("")
    setDescription("")
    fetchTasks()
  }

  const handleDelete = async (id: string) => {
    await deleteTask(id)
    fetchTasks()
  }

  const handleToggle = async (id: string) => {
    await toggleTask(id)
    fetchTasks()
  }
  useEffect(() => {
    const tryRestore = async () => {
      const token = await restoreSession()
      if (token) {
        setAccessToken(token)
        setIsLoggedIn(true)
      }
    }

    tryRestore()
  }, [])
  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks()
    }
  }, [isLoggedIn, page])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center px-4">
        <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-sm space-y-5">

          <h1 className="text-2xl font-semibold text-center">
            Sign In
          </h1>

          <input
            className="bg-zinc-900 border border-zinc-700 p-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-zinc-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="bg-zinc-900 border border-zinc-700 p-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-zinc-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-md transition"
            onClick={handleLogin}
          >
            Login
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Task Manager
          </h1>

          <button
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md text-sm transition cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Add Task */}
        <div className="bg-zinc-800 p-4 rounded-lg shadow space-y-3">
          <div className="flex gap-3">
            <input
              className="bg-zinc-900 border border-zinc-700 p-2 rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="bg-zinc-900 border border-zinc-700 p-2 rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              className="bg-blue-600 hover:bg-blue-500 px-4 rounded-md transition cursor-pointer"
              onClick={handleAddTask}
            >
              Add
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <select
            className="bg-zinc-800 border border-zinc-700 p-2 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="done">Done</option>
          </select>

          <input
            className="bg-zinc-800 border border-zinc-700 p-2 rounded-md flex-1"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="bg-zinc-700 hover:bg-zinc-600 px-4 rounded-md cursor-pointer"
            onClick={fetchTasks}
          >
            Apply
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="font-medium">{task.title}</p>
                {task.description && (
                  <p className="text-sm text-zinc-400">{task.description}</p>
                )}

                <span
                  onClick={() => handleToggle(task.id)}
                  className={`text-xs px-2 py-1 rounded cursor-pointer transition ${task.status === "done"
                    ? "bg-green-600/20 text-green-400"
                    : "bg-yellow-600/20 text-yellow-400"
                    }`}
                >
                  {task.status}
                </span>
              </div>

              <button
                className="text-red-400 hover:text-red-300 text-sm transition cursor-pointer"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-zinc-500 py-10">
              No tasks found.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md text-sm cursor-pointer"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <span className="text-sm text-zinc-400 pt-2">
            Page {page}
          </span>

          <button
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md text-sm cursor-pointer"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  )
}