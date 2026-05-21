export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('smartclass_token')

  const publicPages = ['/login', '/register']
  const isPublicPage = publicPages.includes(to.path)

  if (!token.value && !isPublicPage) {
    return navigateTo('/login')
  }

  if (token.value && isPublicPage) {
    return navigateTo('/')
  }
})