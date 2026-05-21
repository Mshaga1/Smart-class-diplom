import { prisma } from '../utils/prisma'
import { requireAdmin } from '../utils/auth'

interface CreateBody {
  name: string
  slug: string
  description?: string
  floor?: number
  capacity?: number
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody<CreateBody>(event)

  if (!body.name?.trim() || !body.slug?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Нэр болон slug шаардлагатай' })
  }

  const slug = body.slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const existing = await prisma.classroom.findUnique({ where: { slug } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Энэ дугаартай анги аль хэдийн байна' })
  }

  const classroom = await prisma.classroom.create({
    data: {
      name: body.name.trim(),
      slug,
      description: body.description?.trim() || null,
      floor: body.floor ? Number(body.floor) : null,
      capacity: body.capacity ? Number(body.capacity) : null,
      isActive: false
    }
  })

  return classroom
})
