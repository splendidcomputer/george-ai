import { builder } from '../builder'
import { typesenseClient } from '@george-ai/typesense-client'

const fetchGroupedValues = async (fieldName: string) => {
  const response = await typesenseClient
    .collections('scraped_web_pages_summaries')
    .documents()
    .search({
      q: '*',
      query_by: '',
      group_by: fieldName,
    })
  return response.grouped_hits?.map((item) => item.group_key).flat() || []
}

const searchFilters = builder.simpleObject('searchFilters', {
  fields: (t) => ({
    language: t.stringList(),
    largeLanguageModel: t.stringList(),
    publicationState: t.stringList(),
  }),
})

builder.queryField('searchFilters', (t) =>
  t.field({
    type: searchFilters,
    resolve: async () => {
      try {
        const [language, largeLanguageModel, publicationState] =
          await Promise.all([
            fetchGroupedValues('language'),
            fetchGroupedValues('largeLanguageModel'),
            fetchGroupedValues('publicationState'),
          ])

        return {
          language,
          largeLanguageModel,
          publicationState,
        }
      } catch (error) {
        console.error('Error fetching data from Typesense:', error)
        return {
          language: [],
          largeLanguageModel: [],
          publicationState: [],
        }
      }
    },
  }),
)
