import { strapiClient } from '..'
import { graphql } from '../gql'

export interface NewSummary {
  summary: string
  keywords: string
  largeLanguageModel: string
  scraped_web_page: string
}

export const updateWebPageSummary = async (
  webPageSummaryId: string,
  newSummary: NewSummary,
) => {
  try {
    await strapiClient.request(
      graphql(`
        mutation UpdateWebPageSummary($id: ID!, $data: WebPageSummaryInput!) {
          updateWebPageSummary(id: $id, data: $data) {
            data {
              id
              attributes {
                keywords
                summary
                largeLanguageModel
                scraped_web_page {
                  data {
                    id
                  }
                }
              }
            }
          }
        }
      `),
      {
        id: webPageSummaryId,
        data: newSummary,
      },
    )

    console.log('Update WebPageSummary with ID:', webPageSummaryId)
  } catch (error) {
    console.error('Error updating WebPageSummary:', error)
    throw error
  }
}
