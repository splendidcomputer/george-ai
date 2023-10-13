import { graphql } from '../gql/gql'
import { strapiClient } from '../strapi-client'

export const getScrapedPageByUrl = async (url: string) => {
  try {
    const { scrapedWebPages } = await strapiClient.request(
      graphql(`
        query GetScrapedWebPagesByUrl($url: String!) {
          scrapedWebPages(filters: { url: { eq: $url } }) {
            data {
              id
              attributes {
                originalContent
              }
            }
          }
        }
      `),
      { url },
    )

    return {
      id: scrapedWebPages?.data.at(0)?.id ?? '',
      originalContent:
        scrapedWebPages?.data.at(0)?.attributes?.originalContent ?? '',
    }
  } catch (error) {
    console.error('Error while fetching ScrapedWebPages:', error)
    throw error
  }
}
