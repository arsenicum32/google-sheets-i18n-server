import { useEffect, useState } from 'react'
import i18n from 'i18next'

interface AppProps {
  lang: string
  project: string
  baseUrl: string
}

async function loadTranslations({
  baseUrl,
  project,
  lang,
}: AppProps): Promise<void> {
  const response = await fetch(
    `${baseUrl}/v1/projects/${project}/translations/${lang}?format=nested`,
  )

  if (!response.ok) {
    throw new Error(`Failed to load translations: ${response.status}`)
  }

  const resources = await response.json()

  i18n.addResourceBundle(lang, 'translation', resources, true, true)
  await i18n.changeLanguage(lang)
}

export function App({ lang, project, baseUrl }: AppProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    setIsLoaded(false)
    setError(null)

    loadTranslations({ lang, project, baseUrl })
      .then(() => {
        if (!cancelled) {
          setIsLoaded(true)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
        }
      })

    return () => {
      cancelled = true
    }
  }, [lang, project, baseUrl])

  if (error) {
    return <div>Failed to load translations</div>
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return <div>{i18n.t('home.title')}</div>
}
