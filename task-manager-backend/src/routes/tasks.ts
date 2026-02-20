import express from "express"
import prisma from "../prisma"
import { requireAuth, AuthRequest } from "../middleware/auth"

const router = express.Router()

// GET ALL TASKS
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id

  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const status = req.query.status as string | undefined
  const search = req.query.search as string | undefined

  const skip = (page - 1) * limit

  const where: any = {
    userId
  }

  if (status) {
    where.status = status
  }

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive"
    }
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.task.count({ where })
  ])

  res.json({
    data: tasks,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  })
})

// CREATE TASK
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id
  const { title, description } = req.body

  if (!title) {
    return res.status(400).json({ message: "Title is required" })
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      userId
    }
  })

  res.status(201).json(task)
})

// DELETE TASK
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id
  const { id } = req.params

  const task = await prisma.task.findUnique({
    where: { id }
  })

  if (!task || task.userId !== userId) {
    return res.status(404).json({ message: "Task not found" })
  }

  await prisma.task.delete({
    where: { id }
  })

  res.json({ message: "Task deleted" })
})
// UPDATE TASK
router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id
  const { id } = req.params
  const { title, description, status } = req.body

  const task = await prisma.task.findUnique({
    where: { id }
  })

  if (!task || task.userId !== userId) {
    return res.status(404).json({ message: "Task not found" })
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      title: title ?? task.title,
      description: description ?? task.description,
      status: status ?? task.status
    }
  })

  res.json(updatedTask)
})
// GET SINGLE TASK
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id
  const { id } = req.params

  const task = await prisma.task.findUnique({
    where: { id }
  })

  if (!task || task.userId !== userId) {
    return res.status(404).json({ message: "Task not found" })
  }

  res.json(task)
})
// TOGGLE TASK STATUS
router.post("/:id/toggle", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id
  const { id } = req.params

  const task = await prisma.task.findUnique({
    where: { id }
  })

  if (!task || task.userId !== userId) {
    return res.status(404).json({ message: "Task not found" })
  }

  const newStatus = task.status === "done" ? "todo" : "done"

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { status: newStatus }
  })

  res.json(updatedTask)
})

export default router