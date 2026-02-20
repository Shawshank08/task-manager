import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const ACCESS_SECRET = "access_secret_key"
const REFRESH_SECRET = "refresh_secret_key"

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "2h" })
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" })
}
