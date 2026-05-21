import { prisma } from '../utils/prisma'
import { requireAdmin } from '../utils/auth'

interface UpdateBody {
  name?: string
  description?: string
  floor?: number | null
  capacity?: number | null
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID шаардлагатай' })
  }

  const body = await readBody<UpdateBody>(event)

  const updated = await prisma.classroom.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.description !== undefined && {
        description: body.description?.trim() || null
      }),
      ...(body.floor !== undefined && {
        floor: body.floor !== null ? Number(body.floor) : null
      }),
      ...(body.capacity !== undefined && {
        capacity: body.capacity !== null ? Number(body.capacity) : null
      })
    }
  })

  return updated
})
