export function useFormatters() {
  function formatMoney(cents: number): string {
    const value = cents / 100
    return value.toLocaleString('de-CH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + ' CHF'
  }

  function formatMoneyShort(cents: number): string {
    const value = cents / 100
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M CHF`
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k CHF`
    return formatMoney(cents)
  }

  function parseMoney(input: string): number {
    const cleaned = input.replace(/[^0-9.,\-]/g, '').replace(/'/g, '')
    const value = parseFloat(cleaned.replace(',', '.'))
    return Math.round((isNaN(value) ? 0 : value) * 100)
  }

  function formatDate(date: Date | string | null): string {
    if (!date) return '–'
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  function formatRelativeDate(date: Date | string | null): string {
    if (!date) return 'Nie'
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Heute'
    if (diffDays === 1) return 'Gestern'
    if (diffDays < 7) return `Vor ${diffDays} Tagen`
    return formatDate(d)
  }

  return { formatMoney, formatMoneyShort, parseMoney, formatDate, formatRelativeDate }
}
