import { upsertTypesenseCollection } from '@george-ai/typesense-client'

const transformAndUpsertSummary = async (id) => {
  const webPageSummaryResult = await strapi.entityService.findOne(
    'api::web-page-summary.web-page-summary',
    id,
    {
      populate: ['scraped_web_page'],
    },
  )

  const allSummaryFeedbackResult = await strapi.entityService.findMany(
    'api::summary-feedback.summary-feedback',
    {
      filters: {
        web_page_summary: {
          id: {
            $eq: id,
          },
        },
      },
    },
  )
  console.log('allSummaryFeedbackResult: ', allSummaryFeedbackResult)

  let popularity = 0
  if (allSummaryFeedbackResult) {
    for (const feedback of allSummaryFeedbackResult) {
      const vote = feedback.voting
      if (vote === 'up') {
        popularity += 1
      }
      if (vote === 'down') {
        popularity -= 1
      }
    }
  }

  const webPageSummary = {
    id: webPageSummaryResult.id.toString(),
    language: webPageSummaryResult.locale,
    keywords: webPageSummaryResult.keywords
      ? JSON.parse(webPageSummaryResult.keywords)
      : [],
    summary: webPageSummaryResult.summary,
    largeLanguageModel: webPageSummaryResult.largeLanguageModel,
    title: webPageSummaryResult.scraped_web_page.title,
    url: webPageSummaryResult.scraped_web_page.url,
    originalContent: webPageSummaryResult.scraped_web_page.originalContent,
    publicationState: webPageSummaryResult.publishedAt
      ? 'published'
      : 'draft',
      popularity,
  }

  upsertTypesenseCollection(webPageSummary)
}

export default {
  async afterCreate(event) {
    await transformAndUpsertSummary(event.result.id)
  },

  async afterUpdate(event) {
    await transformAndUpsertSummary(event.result.id)
  },
}
