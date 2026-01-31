import type { Household } from '~/types'

export function useHousehold() {
  const household = useState<Household | null>('household', () => null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  async function fetch() {
    isLoading.value = true
    error.value = null
    try {
      household.value = await $fetch<Household>('/api/households')
    } catch (e) {
      error.value = 'Haushalt konnte nicht geladen werden'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetch)

  return { household, isLoading, error, refresh: fetch }
}
