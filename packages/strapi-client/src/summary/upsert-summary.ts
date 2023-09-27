import { ScrapeResult, createSummary, getSummaryId, updateSummary } from '..'

interface ScrapeResultAndSummary extends ScrapeResult {
  summary: string
  keywords: string[]
  largeLanguageModel: string
  currentLanguage: string
}

export const upsertWebPageSummary = async (
  scrapeResultAndSummary: ScrapeResultAndSummary,
  ScrapedWebPageId: string,
) => {
  const newSummary = {
    summary: scrapeResultAndSummary.summary,
    keywords: JSON.stringify(scrapeResultAndSummary.keywords),
    largeLanguageModel: scrapeResultAndSummary.largeLanguageModel,
    scraped_web_page: ScrapedWebPageId,
  }

  const webPageSummaryId = await getSummaryId(
    scrapeResultAndSummary.largeLanguageModel,
    scrapeResultAndSummary.url,
    scrapeResultAndSummary.currentLanguage,
  )

  webPageSummaryId
    ? await updateSummary(newSummary, webPageSummaryId)
    : await createSummary(newSummary, scrapeResultAndSummary.currentLanguage)
}
