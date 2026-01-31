export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  const publicPages = ['/', '/login']
  if (publicPages.includes(to.path)) return

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
