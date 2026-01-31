import type { BudgetItemType } from '~/types'

const CATEGORIES: Record<BudgetItemType, string[]> = {
  income: [
    'Lohn',
    'Nebeneinkommen',
    'Bonus',
    'Kindergeld',
    'Mieteinnahmen',
    'Dividenden',
    'Andere',
  ],
  expense: [
    'Miete',
    'Nebenkosten',
    'Lebensmittel',
    'Transport',
    'Versicherungen',
    'Krankenkasse',
    'Steuern',
    'Kommunikation',
    'Abos',
    'Taschengeld',
    'Freizeit',
    'Restaurants',
    'Kleidung',
    'Haushalt',
    'Gesundheit',
    'Bildung',
    'Kinder',
    'Haustiere',
    'Geschenke',
    'Ferien',
    'Andere',
  ],
  savings: [
    'Notgroschen',
    'Vorsorge 3a',
    'Investition',
    'Sparziel',
    'Andere',
  ],
}

export function useBudgetCategories() {
  function optionsFor(type: BudgetItemType) {
    return [
      { label: '– Keine –', value: '' },
      ...CATEGORIES[type].map((c) => ({ label: c, value: c })),
    ]
  }

  return { optionsFor }
}
