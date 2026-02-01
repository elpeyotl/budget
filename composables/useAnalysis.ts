interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function useAnalysis() {
  const analysis = ref('')
  const isLoading = ref(false)
  const isChatLoading = ref(false)
  const error = ref<string | null>(null)
  const messages = ref<ChatMessage[]>([])
  const toast = useToast()

  async function runAnalysis() {
    isLoading.value = true
    error.value = null
    analysis.value = ''
    messages.value = []
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

  async function sendMessage(text: string) {
    isChatLoading.value = true
    error.value = null
    messages.value = [...messages.value, { role: 'user', content: text }]

    // Build conversation: initial analysis as assistant + follow-ups
    const history: ChatMessage[] = [
      { role: 'assistant', content: analysis.value },
      ...messages.value,
    ]

    try {
      const result = await $fetch<{ reply: string }>('/api/analysis/chat', {
        method: 'POST',
        body: { messages: history },
      })
      messages.value = [...messages.value, { role: 'assistant', content: result.reply }]
    } catch {
      messages.value = messages.value.slice(0, -1) // rollback user message
      toast.add({ title: 'Fehler beim Senden', color: 'red' })
    } finally {
      isChatLoading.value = false
    }
  }

  return { analysis, isLoading, isChatLoading, error, messages, runAnalysis, sendMessage }
}
