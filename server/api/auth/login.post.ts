import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    email: string
    password: string
  }>(event)

  const email = body.email.trim().toLowerCase()

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found'
    })
  }

  const isValid = await bcrypt.compare(body.password, user.password)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Password incorrect'
    })
  }

  const token = jwt.sign(
  {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  },
  process.env.JWT_SECRET as string,
  {
    expiresIn: '7d'
  }
)

  setCookie(event, 'smartclass_token', token, {
  httpOnly: false,
  sameSite: 'lax',
  secure: false,
  path: '/',
  maxAge: 60 * 60 * 24 * 7
})

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      message: 'Login successful'
    }
  }
})