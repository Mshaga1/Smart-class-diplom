export default defineEventHandler((event) => {
  deleteCookie(event, 'smartclass_token', {
    path: '/'
  })

  return {
    success: true
  }
})