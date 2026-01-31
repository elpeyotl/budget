import type { Person } from '~/types'

export function usePersons() {
  const persons = useState<Person[]>('persons', () => [])
  const isLoading = ref(true)
  const toast = useToast()

  async function fetch() {
    isLoading.value = true
    try {
      persons.value = await $fetch<Person[]>('/api/persons')
    } catch {
      toast.add({ title: 'Fehler beim Laden der Personen', color: 'red' })
    } finally {
      isLoading.value = false
    }
  }

  async function addPerson(data: { name: string; color: string }) {
    try {
      const person = await $fetch<Person>('/api/persons', {
        method: 'POST',
        body: data,
      })
      persons.value = [...persons.value, person]
      toast.add({ title: 'Person hinzugefügt' })
      return person
    } catch {
      toast.add({ title: 'Fehler beim Hinzufügen', color: 'red' })
    }
  }

  async function updatePerson(id: string, data: Partial<Person>) {
    const backup = [...persons.value]
    persons.value = persons.value.map((p) => (p.id === id ? { ...p, ...data } : p))
    try {
      await $fetch(`/api/persons/${id}`, { method: 'PUT', body: data })
    } catch {
      persons.value = backup
      toast.add({ title: 'Fehler beim Aktualisieren', color: 'red' })
    }
  }

  async function deletePerson(id: string) {
    const backup = [...persons.value]
    persons.value = persons.value.filter((p) => p.id !== id)
    try {
      await $fetch(`/api/persons/${id}`, { method: 'DELETE' })
      toast.add({ title: 'Person gelöscht' })
    } catch {
      persons.value = backup
      toast.add({ title: 'Fehler beim Löschen', color: 'red' })
    }
  }

  onMounted(fetch)

  return { persons, isLoading, addPerson, updatePerson, deletePerson, refresh: fetch }
}
