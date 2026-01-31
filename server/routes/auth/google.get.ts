import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { users, households, householdMembers, persons } from '../../database/schema'

export default defineOAuthGoogleEventHandler({
  config: {
    emailRequired: true,
    scope: ['email', 'profile'],
  },
  async onSuccess(event, { user: googleUser }) {
    const db = useDatabase()
    const userId = googleUser.sub as string

    let dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!dbUser) {
      dbUser = await createUserWithHousehold(db, {
        id: userId,
        email: googleUser.email as string,
        name: googleUser.name as string,
        avatar: googleUser.picture as string,
      })
    }

    await setUserSession(event, {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name ?? '',
        avatar: dbUser.avatar ?? '',
      },
    })

    return sendRedirect(event, '/dashboard')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/login?error=auth')
  },
})

async function createUserWithHousehold(
  db: ReturnType<typeof useDatabase>,
  userData: { id: string; email: string; name: string; avatar: string },
) {
  const [dbUser] = await db.insert(users).values(userData).returning()

  const householdId = crypto.randomUUID()
  const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase()

  await db.insert(households).values({
    id: householdId,
    name: 'Unser Haushalt',
    ownerId: dbUser.id,
    shareCode,
  })

  await db.insert(householdMembers).values({
    id: crypto.randomUUID(),
    householdId,
    userId: dbUser.id,
    role: 'owner',
  })

  const firstName = dbUser.name?.split(' ')[0] ?? 'Person 1'
  await db.insert(persons).values({
    id: crypto.randomUUID(),
    householdId,
    name: firstName,
    color: '#3b82f6',
    sortOrder: 0,
  })

  return dbUser
}
