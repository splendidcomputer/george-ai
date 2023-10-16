import { typesenseClient } from '../typesense.js'
import { summaryCollectionSchema } from '../collections/summary-collection-schema.js'
import { PublicationState } from './search-summary-documents.js'

type UpserteDocument = {
  id: string
  language: string
  keywords: string[]
  summary: string
  largeLanguageModel: string
  title: string
  url: string
  originalContent: string
  publicationState: PublicationState
  popularity: number
}

export const upsertSummaryDocument = async (
  document: UpserteDocument,
  id: string,
) => {
  try {
    await typesenseClient
      .collections<UpserteDocument>(summaryCollectionSchema.name)
      .documents()
      .upsert(document)
    console.log(`Data upsert to typesense collection with id: ${id}`)
  } catch (error) {
    console.error(
      `Error while Upsert collection ${summaryCollectionSchema.name} with id: ${id}`,
      error,
    )
    throw error
  }
}
