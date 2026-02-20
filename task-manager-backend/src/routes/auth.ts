import express from "express"
import prisma from "../prisma"
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from "../utils/auth"
import jwt from "jsonwebtoken"
const REFRESH_SECRET = "refresh_secret_key"
const router = express.Router()

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" })
  }

  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash
    }
  })

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })

  return res.json({ accessToken })
})

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" })
  }

  const valid = await comparePassword(password, user.passwordHash)

  if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" })
  }

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })

  return res.json({ accessToken })
})
// REFRESH TOKEN
router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken

  if (!token) {
    return res.status(401).json({ message: "No refresh token" })
  }

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as any

    const newAccessToken = generateAccessToken(decoded.userId)

    return res.json({ accessToken: newAccessToken })
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" })
  }
})
// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken")
  res.json({ message: "Logged out" })
})

export default router
