export function useAnalysis() {
  const analysis = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const toast = useToast()

  async function runAnalysis() {
    isLoading.value = true
    error.value = null
    analysis.value = ''
    try {
      const result = await $fetch<{ analysis: string }>('/api/analysis', {
        method: 'POST',
      })
      analysis.value = result.analysis
    } catch {
      error.value = 'Analyse fehlgeschlagen'
      toast.add({ title: 'Fehler bei der Analyse', color: 'red' })
    } finally {
      isLoading.value = false
    }
  }

  return { analysis, isLoading, error, runAnalysis }
}
