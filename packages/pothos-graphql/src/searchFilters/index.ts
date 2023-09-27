import { builder } from '../builder'
import { fetchGroupedValues } from '@george-ai/typesense-client'

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
    },
  }),
)
