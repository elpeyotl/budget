import type { Account, AccountType } from '~/types'

export function useAccounts() {
  const accounts = useState<Account[]>('accounts', () => [])
  const isLoading = ref(true)
  const toast = useToast()

  async function fetch() {
    isLoading.value = true
    try {
      accounts.value = await $fetch<Account[]>('/api/accounts')
    } catch {
      toast.add({ title: 'Fehler beim Laden der Konten', color: 'red' })
    } finally {
      isLoading.value = false
    }
  }

  const byType = computed(() => {
    const grouped: Record<string, Account[]> = {}
    for (const acc of accounts.value) {
      if (!grouped[acc.type]) grouped[acc.type] = []
      grouped[acc.type].push(acc)
    }
    return grouped
  })

  const netWorthTotal = computed(() =>
    accounts.value.reduce((sum, a) => sum + a.currentValue, 0),
  )

  const liquidTotal = computed(() =>
    accounts.value.filter((a) => a.isLiquid).reduce((sum, a) => sum + a.currentValue, 0),
  )

  const investedTotal = computed(() =>
    accounts.value.filter((a) => !a.isLiquid).reduce((sum, a) => sum + a.currentValue, 0),
  )

  async function addAccount(data: {
    name: string
    institution?: string | null
    type: AccountType
    assetClass?: string | null
    ticker?: string | null
    isLiquid: boolean
    currentValue: number
    personId?: string | null
  }) {
    try {
      const account = await $fetch<Account>('/api/accounts', {
        method: 'POST',
        body: data,
      })
      accounts.value = [...accounts.value, account]
      toast.add({ title: 'Konto hinzugefügt' })
      return account
    } catch {
      toast.add({ title: 'Fehler beim Hinzufügen', color: 'red' })
    }
  }

  async function updateAccount(id: string, data: Partial<Account>) {
    const backup = [...accounts.value]
    accounts.value = accounts.value.map((a) => (a.id === id ? { ...a, ...data } : a))
    try {
      await $fetch(`/api/accounts/${id}`, { method: 'PUT', body: data })
    } catch {
      accounts.value = backup
      toast.add({ title: 'Fehler beim Aktualisieren', color: 'red' })
    }
  }

  async function deleteAccount(id: string) {
    const backup = [...accounts.value]
    accounts.value = accounts.value.filter((a) => a.id !== id)
    try {
      await $fetch(`/api/accounts/${id}`, { method: 'DELETE' })
      toast.add({ title: 'Konto gelöscht' })
    } catch {
      accounts.value = backup
      toast.add({ title: 'Fehler beim Löschen', color: 'red' })
    }
  }

  onMounted(fetch)

  return {
    accounts, byType, isLoading,
    netWorthTotal, liquidTotal, investedTotal,
    addAccount, updateAccount, deleteAccount, refresh: fetch,
  }
}
