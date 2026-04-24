import fs from 'fs'
import path from 'path'

interface PluginOptions {
  url: string
  outputPath: string
  hash: string
  variant: string
  languageNames?: Record<string, string>
}

type TranslationMap = Record<string, Record<string, unknown>>

const sleep = (ms: number): Promise<void> => (
  new Promise(resolve => setTimeout(resolve, ms))
)

const ensureDirectory = async (directoryPath: string): Promise<void> => {
  if (!fs.existsSync(directoryPath)) {
    await fs.promises.mkdir(directoryPath, { recursive: true })
  }
}

const writeJsonFile = async (
  directoryPath: string,
  fileName: string,
  data: unknown,
): Promise<void> => {
  await ensureDirectory(directoryPath)

  await fs.promises.writeFile(
    path.join(directoryPath, fileName),
    JSON.stringify(data, null, 2),
  )
}

const createLanguageMap = (
  languages: string[],
  languageNames: Record<string, string> = {},
): Record<string, string> => (
  languages.reduce((acc, lang) => ({
    ...acc,
    [lang]: languageNames[lang] || lang,
  }), {})
)

class SaverLangsPlugin {
  private options: PluginOptions

  constructor(options: PluginOptions) {
    this.options = options
  }

  apply(compiler: any): void {
    compiler.hooks.emit.tapPromise('SaverLangsPlugin', async () => {
      const response = await fetch(this.options.url)

      if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.status} ${response.statusText}`)
      }

      const translations = await response.json() as TranslationMap
      const languages = Object.keys(translations)
      const outputPath = this.options.outputPath

      await ensureDirectory(outputPath)

      await Promise.all([
        writeJsonFile(
          outputPath,
          `languages.${this.options.variant}.${this.options.hash}.json`,
          createLanguageMap(languages, this.options.languageNames),
        ),
        ...languages.map(lang => writeJsonFile(
          outputPath,
          `${lang}.${this.options.variant}.${this.options.hash}.json`,
          translations[lang],
        )),
      ])
    })
  }
}

export default SaverLangsPlugin
