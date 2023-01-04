import fastify from "fastify"
import fastifySensible from "@fastify/sensible"
import fastifyCors from "@fastify/cors"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
dotenv.config()

const app = fastify()
app.register(fastifySensible)
app.register(fastifyCors, {
  origin: process.env.CLIENT_URL,
  credentials: true,
})
const prisma = new PrismaClient()

app.get("/posts", async (req, res) => {
  return await commitToDb(
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  )
})

async function commitToDb(promise) {
  const [error, data] = await app.to(promise)
  if (error) return app.httpErrors.internalServerError(error.message)
  return data
}

app.listen({ port: process.env.PORT })
