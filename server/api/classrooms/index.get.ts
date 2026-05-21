import { prisma } from '../utils/prisma'

const defaultClassrooms = [
  {
    name: 'Анги 101',
    slug: 'angi-101',
    description: '1-р давхар, 1-р анги',
    floor: 1,
    capacity: 40,
    isActive: true
  },
  {
    name: 'Анги 102',
    slug: 'angi-102',
    description: '1-р давхар, 2-р анги',
    floor: 1,
    capacity: 35,
    isActive: false
  },
  {
    name: 'Анги 201',
    slug: 'angi-201',
    description: '2-р давхар, 1-р анги',
    floor: 2,
    capacity: 40,
    isActive: false
  },
  {
    name: 'Анги 202',
    slug: 'angi-202',
    description: '2-р давхар, 2-р анги',
    floor: 2,
    capacity: 35,
    isActive: false
  }
]

export default defineEventHandler(async () => {
  const count = await prisma.classroom.count()

  if (count === 0) {
    await prisma.classroom.createMany({ data: defaultClassrooms })
  }

  return prisma.classroom.findMany({
    orderBy: { createdAt: 'asc' }
  })
})
