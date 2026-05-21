import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const latest = await prisma.sensorReading.findFirst({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return latest ?? {
    temperature: 0,
    humidity: 0,
    airQuality: 0,
    light: 0,
    mode: 'simulated',
    createdAt: new Date()
  }
})