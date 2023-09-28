import { graphql } from '../gql'
import { strapiClient } from '../strapi-client'

export const getScraperConfiguration = async () => {
  try {
    const { scraperConfiguration: scraperConfigurationResponse } =
      await strapiClient.request(
        graphql(`
          query GetScraperConfiguration {
            scraperConfiguration {
              data {
                attributes {
                  entryPoints {
                    startUrl
                    depth
                    prompts {
                      data {
                        attributes {
                          summaryPrompt
                          keywordPrompt
                          llm
                          locale
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `),
        {},
      )

    const entryPoints =
      scraperConfigurationResponse?.data?.attributes?.entryPoints
    const scraperConfiguration = entryPoints?.map((entry) => ({
      startUrl: entry?.startUrl,
      depth: entry?.depth,
      prompts: entry?.prompts?.data.map((prompt) => ({
        summaryPrompt: prompt.attributes?.summaryPrompt,
        keywordPrompt: prompt.attributes?.keywordPrompt,
        llm: prompt.attributes?.llm,
        locale: prompt.attributes?.locale,
      })),
    }))

    return scraperConfiguration
  } catch (error) {
    console.error('Error fetching ScraperConfiguration:', error)
    throw error
  }
}
