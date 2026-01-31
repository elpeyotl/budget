export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Only protect API routes server-side
  if (!path.startsWith('/api/')) return

  // Public API routes
  const publicApi = ['/api/auth/', '/api/_auth/']
  if (publicApi.some((p) => path.startsWith(p))) return

  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Nicht authentifiziert' })
  }
})
