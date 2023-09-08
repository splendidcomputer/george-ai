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
  '\n            query GetUniqueValues {\n              webPageSummaries(publicationState: PREVIEW, locale: "all") {\n                data {\n                  attributes {\n                    locale\n                    largeLanguageModel\n                  }\n                }\n              }\n            }\n          ':
    types.GetUniqueValuesDocument,
  '\n  fragment SummaryFeedback on SummaryFeedbackEntity {\n    id\n    attributes {\n      feedbackDate\n      position\n      query\n      voting\n      web_page_summary {\n        data {\n          id\n        }\n      }\n    }\n  }\n':
    types.SummaryFeedbackFragmentDoc,
  '\n            mutation CreateSummaryFeedback($input: SummaryFeedbackInput!) {\n              createSummaryFeedback(data: $input) {\n                data {\n                  ...SummaryFeedback\n                }\n              }\n            }\n          ':
    types.CreateSummaryFeedbackDocument,
  '\n            mutation DeleteSummaryFeedback($id: ID!) {\n              deleteSummaryFeedback(id: $id) {\n                data {\n                  ...SummaryFeedback\n                }\n              }\n            }\n          ':
    types.DeleteSummaryFeedbackDocument,
  '\n            mutation UpdateSummaryFeedback(\n              $id: ID!\n              $data: SummaryFeedbackInput!\n            ) {\n              updateSummaryFeedback(id: $id, data: $data) {\n                data {\n                  ...SummaryFeedback\n                }\n              }\n            }\n          ':
    types.UpdateSummaryFeedbackDocument,
  '\n            query getSummaryFeedbacks($webPageSummaryId: ID!) {\n              summaryFeedbacks(\n                filters: { web_page_summary: { id: { eq: $webPageSummaryId } } }\n              ) {\n                data {\n                  ...GetSummaryFeedback\n                }\n              }\n            }\n          ':
    types.GetSummaryFeedbacksDocument,
  '\n              fragment GetSummaryFeedback on SummaryFeedbackEntity {\n                id\n                attributes {\n                  web_page_summary {\n                    data {\n                      id\n                    }\n                  }\n                }\n              }\n            ':
    types.GetSummaryFeedbackFragmentDoc,
  '\n            query GetWebPageSummaries {\n              webPageSummaries(publicationState: PREVIEW, locale: "all") {\n                data {\n                  ...WebPageSummary\n                }\n              }\n            }\n          ':
    types.GetWebPageSummariesDocument,
  '\n              fragment WebPageSummary on WebPageSummaryEntity {\n                id\n                attributes {\n                  locale\n                  keywords\n                  summary\n                  largeLanguageModel\n                  scraped_web_page {\n                    data {\n                      attributes {\n                        title\n                        url\n                        originalContent\n                        publishedAt\n                      }\n                    }\n                  }\n                }\n              }\n            ':
    types.WebPageSummaryFragmentDoc,
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
  source: '\n            query GetUniqueValues {\n              webPageSummaries(publicationState: PREVIEW, locale: "all") {\n                data {\n                  attributes {\n                    locale\n                    largeLanguageModel\n                  }\n                }\n              }\n            }\n          ',
): (typeof documents)['\n            query GetUniqueValues {\n              webPageSummaries(publicationState: PREVIEW, locale: "all") {\n                data {\n                  attributes {\n                    locale\n                    largeLanguageModel\n                  }\n                }\n              }\n            }\n          ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SummaryFeedback on SummaryFeedbackEntity {\n    id\n    attributes {\n      feedbackDate\n      position\n      query\n      voting\n      web_page_summary {\n        data {\n          id\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  fragment SummaryFeedback on SummaryFeedbackEntity {\n    id\n    attributes {\n      feedbackDate\n      position\n      query\n      voting\n      web_page_summary {\n        data {\n          id\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n            mutation CreateSummaryFeedback($input: SummaryFeedbackInput!) {\n              createSummaryFeedback(data: $input) {\n                data {\n                  ...SummaryFeedback\n                }\n              }\n            }\n          ',
): (typeof documents)['\n            mutation CreateSummaryFeedback($input: SummaryFeedbackInput!) {\n              createSummaryFeedback(data: $input) {\n                data {\n                  ...SummaryFeedback\n                }\n              }\n            }\n          ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n            mutation DeleteSummaryFeedback($id: ID!) {\n              deleteSummaryFeedback(id: $id) {\n                data {\n                  ...SummaryFeedback\n                }\n              }\n            }\n          ',
): (typeof documents)['\n            mutation DeleteSummaryFeedback($id: ID!) {\n              deleteSummaryFeedback(id: $id) {\n                data {\n                  ...SummaryFeedback\n                }\n              }\n            }\n          ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n            mutation UpdateSummaryFeedback(\n              $id: ID!\n              $data: SummaryFeedbackInput!\n            ) {\n              updateSummaryFeedback(id: $id, data: $data) {\n                data {\n                  ...SummaryFeedback\n                }\n              }\n            }\n          ',
): (typeof documents)['\n            mutation UpdateSummaryFeedback(\n              $id: ID!\n              $data: SummaryFeedbackInput!\n            ) {\n              updateSummaryFeedback(id: $id, data: $data) {\n                data {\n                  ...SummaryFeedback\n                }\n              }\n            }\n          ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n            query getSummaryFeedbacks($webPageSummaryId: ID!) {\n              summaryFeedbacks(\n                filters: { web_page_summary: { id: { eq: $webPageSummaryId } } }\n              ) {\n                data {\n                  ...GetSummaryFeedback\n                }\n              }\n            }\n          ',
): (typeof documents)['\n            query getSummaryFeedbacks($webPageSummaryId: ID!) {\n              summaryFeedbacks(\n                filters: { web_page_summary: { id: { eq: $webPageSummaryId } } }\n              ) {\n                data {\n                  ...GetSummaryFeedback\n                }\n              }\n            }\n          ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n              fragment GetSummaryFeedback on SummaryFeedbackEntity {\n                id\n                attributes {\n                  web_page_summary {\n                    data {\n                      id\n                    }\n                  }\n                }\n              }\n            ',
): (typeof documents)['\n              fragment GetSummaryFeedback on SummaryFeedbackEntity {\n                id\n                attributes {\n                  web_page_summary {\n                    data {\n                      id\n                    }\n                  }\n                }\n              }\n            ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n            query GetWebPageSummaries {\n              webPageSummaries(publicationState: PREVIEW, locale: "all") {\n                data {\n                  ...WebPageSummary\n                }\n              }\n            }\n          ',
): (typeof documents)['\n            query GetWebPageSummaries {\n              webPageSummaries(publicationState: PREVIEW, locale: "all") {\n                data {\n                  ...WebPageSummary\n                }\n              }\n            }\n          ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n              fragment WebPageSummary on WebPageSummaryEntity {\n                id\n                attributes {\n                  locale\n                  keywords\n                  summary\n                  largeLanguageModel\n                  scraped_web_page {\n                    data {\n                      attributes {\n                        title\n                        url\n                        originalContent\n                        publishedAt\n                      }\n                    }\n                  }\n                }\n              }\n            ',
): (typeof documents)['\n              fragment WebPageSummary on WebPageSummaryEntity {\n                id\n                attributes {\n                  locale\n                  keywords\n                  summary\n                  largeLanguageModel\n                  scraped_web_page {\n                    data {\n                      attributes {\n                        title\n                        url\n                        originalContent\n                        publishedAt\n                      }\n                    }\n                  }\n                }\n              }\n            ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
