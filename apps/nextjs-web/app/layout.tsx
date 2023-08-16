'use client'

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {
  UrqlProvider,
  createClient,
  ssrExchange,
  cacheExchange,
  fetchExchange,
} from '@urql/next'
import { metadata } from './metadata'

const inter = Inter({ subsets: ['latin'] })

const ssr = ssrExchange()
const client = createClient({
  url: 'http://localhost:3000/graphql',
  exchanges: [cacheExchange, ssr, fetchExchange],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UrqlProvider client={client} ssr={ssr}>
      <html lang="en">
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </UrqlProvider>
  )
}
