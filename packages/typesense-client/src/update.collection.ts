import dotenv from 'dotenv'

dotenv.config()
import { Client } from 'typesense'
import { FieldType } from 'typesense/lib/Typesense/Collection.js'

export const client = new Client({
  nodes: [
    {
      // host: process.env.TYPESENSE_API_HOST ?? '',
      host: process.env.TYPESENSE_API_HOST ?? 'localhost',
      // port: Number.parseInt(process.env.TYPESENSE_API_PORT ?? '0'),
      port: Number.parseInt(process.env.TYPESENSE_API_PORT ?? '8108'),
      // protocol: process.env.TYPESENSE_API_PROTOCOL ?? '',
      protocol: process.env.TYPESENSE_API_PROTOCOL ?? 'http',
    },
  ],
  // apiKey: process.env.TYPESENSE_API_KEY ?? '',
  apiKey: process.env.TYPESENSE_API_KEY ?? 'xyz',
})

const baseCollectionSchema: {
  name: string
  fields: {
    name: string
    type: FieldType
    optional?: boolean
  }[]
} = {
  name: 'scraped_web_pages',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'url', type: 'string' },
    { name: 'language', type: 'string' },
    { name: 'originalContent', type: 'string' },
    { name: 'publicationState', type: 'string' },
    { name: 'keywords', type: 'string' },
    { name: 'summary', type: 'string' },
    { name: 'largeLanguageModel', type: 'string' },
  ],
}

interface ScrapedWebPagesData {
  id: string
  Title: string
  Url: string
  locale: string
  OriginalContent: string
  publishedAt: string
}

interface WebPageSummaryResponse {
  id: string
  Keywords: string
  Summary: string
  LargeLanguageModel: string
  scraped_web_pages: ScrapedWebPagesData
}

export const updateTypesenseDocument = async (
  document: WebPageSummaryResponse,
) => {
  console.log('document:', document)

  // console.log('scraped_web_pages:', document.scraped_web_pages)

  // const { data } = await strapiClient.request<WebPageSummaryResponse>(
  //   GET_WEBPAGE_SUMMARY_BY_ID_QUERY,
  //   {
  //     id: document.id,
  //   },
  // )
  // console.log('data:', data)
  // document.WebPageSummaries.map((summary: any) =>
  //   console.log('summary:', summary),
  // )

  // if (document.WebPageSummaries[0].__pivot) {
  //   console.log(
  //     'WebPageSummaries__pivot:',
  //     document.WebPageSummaries[0].__pivot,
  //   )
  // }

  // const collectionName = 'scraped_web_pages_summaries'
  // const collectionExists = await client.collections(collectionName).exists()
  // const collectionSchema = {
  //   ...baseCollectionSchema,
  //   name: collectionName,
  // }
  // console.log('collectionExists:', collectionExists)

  // if (!collectionExists) {
  //   await client.collections().create(collectionSchema)
  //   console.log(`Collection ${collectionName} created`)
  // }

  // const documents =
  //   document.WebPageSummaries?.map((summary: any) => ({
  //     id: summary?.id,
  //     title: document.Title,
  //     url: document.Url,
  //     language: document.locale,
  //     originalContent: document.OriginalContent,
  //     publicationState: document.publishedAt ? 'published' : 'draft',
  //     keywords: summary?.GeneratedKeywords,
  //     summary: summary?.GeneratedSummary,
  //     largeLanguageModel: summary?.LargeLanguageModel,
  //   })) || []
  // console.log('documents:', documents)

  // for (const document of documents) {
  //   await client.collections(collectionName).documents().upsert(document)
  //   console.log(
  //     `Data added to typesense in collection ${collectionName}`,
  //     document,
  //   )
  // }
}
