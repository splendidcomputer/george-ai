import { getClient } from '@/app/client/urql-client'
import { FilterCheckbox } from './filter-checkbox'
import { graphql } from '@/src/gql'

export interface FilterSelectionProps {
  lang?: string[]
  status?: string[]
  llm?: string[]
}

const shouldDisplayFilter = (array: string[] | undefined) => {
  return (array?.length ?? 0) > 1
}

export const FilterSelection = async ({
  lang,
  status,
  llm,
}: FilterSelectionProps) => {
  const result = await getClient().query(
    graphql(`
      query GetLangAndLlm {
        searchFilters {
          language
          largeLanguageModel
          publicationState
        }
      }
    `),
    {},
  )
  const searchFilters = result.data?.searchFilters

  return (
    <div className="flex justify-end gap-3">
      {shouldDisplayFilter(searchFilters?.publicationState) &&
        searchFilters?.publicationState.map((state) => (
          <FilterCheckbox
            key={state}
            value={state}
            checked={status?.includes(state) ?? false}
            filter="status"
          />
        ))}
      {shouldDisplayFilter(searchFilters?.language) &&
        searchFilters?.language.map((language) => (
          <FilterCheckbox
            key={language}
            value={language}
            checked={lang?.includes(language) ?? false}
            filter="lang"
          />
        ))}
      {shouldDisplayFilter(searchFilters?.largeLanguageModel) &&
        searchFilters?.largeLanguageModel.map((model) => (
          <FilterCheckbox
            key={model}
            value={model}
            checked={llm?.includes(model) ?? false}
            filter="llm"
          />
        ))}
    </div>
  )
}
