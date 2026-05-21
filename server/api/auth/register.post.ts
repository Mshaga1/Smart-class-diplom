import bcrypt from 'bcryptjs'
import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name: string
    email: string
    password: string
  }>(event)

  const email = body.email.trim().toLowerCase()
  const hashedPassword = await bcrypt.hash(body.password, 10)

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Энэ email бүртгэлтэй байна'
    })
  }

  const role = email === 'admin@test.com' ? 'admin' : 'user'

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email,
      password: hashedPassword,
      role
    }
  })

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
})