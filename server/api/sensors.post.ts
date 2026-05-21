import { prisma } from './utils/prisma'

interface IncomingSensorBody {
  temperature: number
  humidity: number
  airQuality: number
  fireValue: number
  light?: number
  mode?: 'simulated' | 'real'
}

export default defineEventHandler(async (event) => {
  const body = await readBody<IncomingSensorBody>(event)
 console.log('SENSOR POST RECEIVED:', body)
  if (
    typeof body.temperature !== 'number' ||
    typeof body.humidity !== 'number' ||
    typeof body.airQuality !== 'number' ||
    typeof body.fireValue !=='number'
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid sensor payload'
    })
  }

  const reading = await prisma.sensorReading.create({
    data: {
      temperature: Number(body.temperature.toFixed(1)),
      humidity: Number(body.humidity.toFixed(1)),
      airQuality: Math.round(body.airQuality),
      fireValue: Math.round(body.fireValue),
      light: typeof body.light === 'number' ? Math.round(body.light) : undefined,
      mode: body.mode ?? 'simulated'
    }
  })

  return {
    success: true,
    message: 'Sensor data saved to MongoDB',
    data: reading
  }
  
})