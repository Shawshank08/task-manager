import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth"
import taskRoutes from "./routes/tasks"

const app = express()

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())


app.use("/auth", authRoutes)
app.use("/tasks", taskRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Server running" })
})
const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
