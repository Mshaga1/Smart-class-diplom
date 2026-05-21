import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'
import { getCookie, createError } from 'h3'

export interface AdminPayload {
  userId: string
  name: string
  email: string
  role: string
}

export function requireAdmin(event: H3Event): AdminPayload {
  const token = getCookie(event, 'smartclass_token')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Нэвтрэх шаардлагатай' })
  }

  let payload: AdminPayload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as AdminPayload
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Буруу токен' })
  }

  if (payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Зөвхөн администратор хандах боломжтой' })
  }

  return payload
}
