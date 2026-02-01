export function useAssetClasses() {
  // annualReturn: avg. annual return in % (conservative estimates, historical data)
  const options = [
    { label: 'Bargeld / Sparkonto', value: 'cash', liquid: true, annualReturn: 1 },
    { label: 'ETF Welt (MSCI World / FTSE)', value: 'etf_world', liquid: false, annualReturn: 7 },
    { label: 'ETF Schwellenländer', value: 'etf_emerging', liquid: false, annualReturn: 6 },
    { label: 'ETF Obligationen', value: 'etf_bonds', liquid: false, annualReturn: 2 },
    { label: 'Einzelaktie', value: 'single_stock', liquid: false, annualReturn: 7 },
    { label: 'Bitcoin', value: 'bitcoin', liquid: false, annualReturn: 30 },
    { label: 'Ethereum', value: 'ethereum', liquid: false, annualReturn: 20 },
    { label: 'Krypto (andere)', value: 'crypto_other', liquid: false, annualReturn: 15 },
    { label: 'Vorsorge 3a', value: 'pension_3a', liquid: false, annualReturn: 4 },
    { label: 'Immobilie', value: 'real_estate', liquid: false, annualReturn: 3 },
    { label: 'Andere', value: 'other', liquid: false, annualReturn: 0 },
  ]

  function isLiquidDefault(assetClass: string | null): boolean {
    const match = options.find((o) => o.value === assetClass)
    return match?.liquid ?? true
  }

  function labelFor(assetClass: string | null): string {
    const match = options.find((o) => o.value === assetClass)
    return match?.label ?? assetClass ?? '–'
  }

  function annualReturnFor(assetClass: string | null): number {
    const match = options.find((o) => o.value === assetClass)
    return match?.annualReturn ?? 0
  }

  return { options, isLiquidDefault, labelFor, annualReturnFor }
}
