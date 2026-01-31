export function useAssetClasses() {
  const options = [
    { label: 'Bargeld / Sparkonto', value: 'cash', liquid: true },
    { label: 'ETF Welt (MSCI World / FTSE)', value: 'etf_world', liquid: false },
    { label: 'ETF Schwellenländer', value: 'etf_emerging', liquid: false },
    { label: 'ETF Obligationen', value: 'etf_bonds', liquid: false },
    { label: 'Einzelaktie', value: 'single_stock', liquid: false },
    { label: 'Bitcoin', value: 'bitcoin', liquid: false },
    { label: 'Ethereum', value: 'ethereum', liquid: false },
    { label: 'Krypto (andere)', value: 'crypto_other', liquid: false },
    { label: 'Vorsorge 3a', value: 'pension_3a', liquid: false },
    { label: 'Immobilie', value: 'real_estate', liquid: false },
    { label: 'Andere', value: 'other', liquid: false },
  ]

  function isLiquidDefault(assetClass: string | null): boolean {
    const match = options.find((o) => o.value === assetClass)
    return match?.liquid ?? true
  }

  function labelFor(assetClass: string | null): string {
    const match = options.find((o) => o.value === assetClass)
    return match?.label ?? assetClass ?? '–'
  }

  return { options, isLiquidDefault, labelFor }
}
