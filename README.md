# George AI Project

This repository contains several interrelated apps, each with its own purpose and tech stack. Follow the steps below to set up the development environment.

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Obtaining API Keys](#obtaining-api-keys)

## Getting Started

### Clone and Install Dependencies

1. Clone the repository
2. Run `yarn` at the root directory

### Build Typesense-Client

1. `cd packages/typesense-client`
2. `yarn run build`

### Run Strapi in Develop Mode

1. `cd apps/strapi-cms`
2. `cp .env.example .env`
3. `yarn run develop`

### Run Scraper

1. `cd apps/playwright-scraper`
2. `cp .env.example .env`
3. `yarn run scrape`

### Run Next.js Web App

1. `cd apps/nextjs-web`
2. `cp .env.example .env`
3. `yarn run dev`

### Run Typesense-CLI

1. `cd apps/typesense-cli`
2. `cp .env.example .env`
3. `yarn run rebuildcollection`

## Environment Variables

Different parts of the application require specific environment variables to be set in the respective `.env` files within each app directory and at the root of the project.

### Common Variables

#### `STRAPI_API_KEY`

This variable is required in the `.env` files of:

- `apps/nextjs-web/.env`
- `apps/playwright-scraper/.env`
- `apps/typesense-cli/.env`
- `.env` (at the project root)

### Typesense-Specific Variables

- `TYPESENSE_API_HOST`
- `TYPESENSE_API_PORT`
- `TYPESENSE_API_PROTOCOL`
- `TYPESENSE_API_KEY`

These variables are required in the `.env` files of:

- `apps/nextjs-web/.env`
- `apps/strapi-cms/.env`
- `apps/typesense-cli/.env`

### OpenAI-Specific Variables

- `OPENAI_API_KEY`
- `OPENAI_API_ORG`

These variables are required in the `.env` file of `apps/playwright-scraper/.env`.

## Obtaining API Keys

### STRAPI_API_KEY

To obtain a `STRAPI_API_KEY`, follow these steps:

1. **Login to Admin Panel**: Visit the Strapi admin interface (usually at `http://localhost:1337/admin`) and log in.
2. **Navigate to Settings**: Once logged in, go to the "Settings" menu.
3. **API Tokens**: Click on "API Tokens".
4. **Create New API Token**: Click the "Create new API Token" button.
5. **Configure Token**:
   - **Name**: Enter a name for the API token.
   - **Token Duration**: Set the expiration duration for the token.
   - **Token Type**: Choose the type of token you'd like to generate.
6. **Save**: Click the "Save" button to generate the token.
7. **Copy Token**: Your new API token will be displayed. Make sure to copy it and save it securely, as you will not be able to see it again.

Place this token in the relevant `.env` files where `STRAPI_API_KEY` is required.

![Project Architecture](https://github.com/progwise/george-ai/assets/16672443/892a434c-7c93-44f6-a3f7-b8cb5b28d66f)

### Project Architecture Diagram

The diagram above illustrates how Strapi, Typesense, Pothos, and Next.js are interconnected. It shows the direction in which queries are made or written.
