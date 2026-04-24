import { describe, it, expect } from 'vitest'
import {
  rowsToTranslations,
  flatToNested,
} from '../src/services/translationTransform.js'

describe('translationTransform', () => {
  it('converts sheet rows to translations by language', () => {
    const rows = [
      ['key', 'en', 'ru'],
      ['home.title', 'Home', 'Главная'],
      ['home.cta', 'Start', 'Начать'],
    ]

    expect(rowsToTranslations(rows)).toEqual({
      en: {
        'home.title': 'Home',
        'home.cta': 'Start',
      },
      ru: {
        'home.title': 'Главная',
        'home.cta': 'Начать',
      },
    })
  })

  it('converts empty strings to null', () => {
    const rows = [
      ['key', 'en', 'ru'],
      ['home.title', 'Home', ''],
    ]

    expect(rowsToTranslations(rows)).toEqual({
      en: {
        'home.title': 'Home',
      },
      ru: {
        'home.title': null,
      },
    })
  })

  it('converts flat keys to nested object', () => {
    const flat = {
      'home.title': 'Home',
      'home.hero.cta': 'Start',
    }

    expect(flatToNested(flat)).toEqual({
      home: {
        title: 'Home',
        hero: {
          cta: 'Start',
        },
      },
    })
  })
})