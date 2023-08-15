import { Header } from './components/header'
import { SearchBox } from './components/search-box'
import React, { useState, useEffect, Suspense } from 'react'
import { PageList } from './page-list'
import Loading from './loading'

interface WebPageSummary {
  id: string
  feedback?: 'up' | 'down'
  generatedKeywords: string
  generatedSummary: string
  largeLanguageModel: string
}

export interface Page {
  title: string
  url: string
  locale: string
  publishedAt: string | null
  webPageSummaries: WebPageSummary[]
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  p-24 ">
      <div className="max-w-2xl w-full flex flex-col gap-5">
        <Header />
        <SearchBox />
        <span className="border-b border-black">
          ich habe folgende Informationen für Sie gefunden:
        </span>
        <PageList />
      </div>
    </main>
  )
}
