/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export enum Enum_Feedback {
  Down = 'Down',
  Up = 'Up',
}

export type Query = {
  __typename?: 'Query'
  allPages: Array<ScrapedWebPage>
}

export type ScrapedWebPage = {
  __typename?: 'ScrapedWebPage'
  locale: Scalars['String']['output']
  originalContent: Scalars['String']['output']
  publishedAt: Scalars['String']['output']
  title: Scalars['String']['output']
  url: Scalars['String']['output']
  webPageSummaries?: Maybe<Array<WebPageSummary>>
}

export type WebPageSummary = {
  __typename?: 'WebPageSummary'
  feedback?: Maybe<Enum_Feedback>
  generatedKeywords: Scalars['String']['output']
  generatedSummary: Scalars['String']['output']
  id: Scalars['String']['output']
  largeLanguageModel: Scalars['String']['output']
}

export type InfoCardFragment = {
  __typename?: 'ScrapedWebPage'
  title: string
  url: string
  locale: string
  publishedAt: string
  webPageSummaries?: Array<{
    __typename?: 'WebPageSummary'
    generatedKeywords: string
    generatedSummary: string
    feedback?: Enum_Feedback | null
  }> | null
} & { ' $fragmentName'?: 'InfoCardFragment' }

export type GetScrapedWebPagesQueryVariables = Exact<{ [key: string]: never }>

export type GetScrapedWebPagesQuery = {
  __typename?: 'Query'
  allPages: Array<
    { __typename?: 'ScrapedWebPage'; url: string } & {
      ' $fragmentRefs'?: { InfoCardFragment: InfoCardFragment }
    }
  >
}

export const InfoCardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'InfoCard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'ScrapedWebPage' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'locale' } },
          { kind: 'Field', name: { kind: 'Name', value: 'publishedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'webPageSummaries' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'generatedKeywords' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'generatedSummary' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'feedback' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<InfoCardFragment, unknown>
export const GetScrapedWebPagesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetScrapedWebPages' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'allPages' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'InfoCard' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'InfoCard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'ScrapedWebPage' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'locale' } },
          { kind: 'Field', name: { kind: 'Name', value: 'publishedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'webPageSummaries' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'generatedKeywords' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'generatedSummary' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'feedback' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetScrapedWebPagesQuery,
  GetScrapedWebPagesQueryVariables
>
