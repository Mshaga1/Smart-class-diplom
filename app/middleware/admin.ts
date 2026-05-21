type JwtPayload = {
  userId: string
  email: string
  role: 'admin' | 'user'
}

export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('smartclass_token')

  if (!token.value) {
    return navigateTo('/login')
  }

  const parts = token.value.split('.')
  const payload = parts[1]

  if (!payload) {
    return navigateTo('/')
  }

  try {
    const decoded = JSON.parse(atob(payload)) as JwtPayload

    if (decoded.role !== 'admin') {
      return navigateTo('/')
    }
  } catch {
    return navigateTo('/')
  }
})