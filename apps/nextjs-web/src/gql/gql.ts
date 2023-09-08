/* eslint-disable */
import * as types from './graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n      query GetLangAndLlm {\n        additionalSearchFilters {\n          language\n          largeLanguageModel\n        }\n      }\n    ':
    types.GetLangAndLlmDocument,
  '\n  fragment InfoCard on IndexedWebPage {\n    title\n    url\n    language\n    publicationState\n    keywords\n    summary\n  }\n':
    types.InfoCardFragmentDoc,
  '\n      query GetIndexedWebPage(\n        $query: String\n        $language: [String!]\n        $publicationState: [String!]\n        $largeLanguageModel: [String!]\n      ) {\n        searchResult(\n          query: $query\n          language: $language\n          publicationState: $publicationState\n          largeLanguageModel: $largeLanguageModel\n        ) {\n          id\n          ...InfoCard\n        }\n      }\n    ':
    types.GetIndexedWebPageDocument,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query GetLangAndLlm {\n        additionalSearchFilters {\n          language\n          largeLanguageModel\n        }\n      }\n    ',
): (typeof documents)['\n      query GetLangAndLlm {\n        additionalSearchFilters {\n          language\n          largeLanguageModel\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment InfoCard on IndexedWebPage {\n    title\n    url\n    language\n    publicationState\n    keywords\n    summary\n  }\n',
): (typeof documents)['\n  fragment InfoCard on IndexedWebPage {\n    title\n    url\n    language\n    publicationState\n    keywords\n    summary\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query GetIndexedWebPage(\n        $query: String\n        $language: [String!]\n        $publicationState: [String!]\n        $largeLanguageModel: [String!]\n      ) {\n        searchResult(\n          query: $query\n          language: $language\n          publicationState: $publicationState\n          largeLanguageModel: $largeLanguageModel\n        ) {\n          id\n          ...InfoCard\n        }\n      }\n    ',
): (typeof documents)['\n      query GetIndexedWebPage(\n        $query: String\n        $language: [String!]\n        $publicationState: [String!]\n        $largeLanguageModel: [String!]\n      ) {\n        searchResult(\n          query: $query\n          language: $language\n          publicationState: $publicationState\n          largeLanguageModel: $largeLanguageModel\n        ) {\n          id\n          ...InfoCard\n        }\n      }\n    ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
