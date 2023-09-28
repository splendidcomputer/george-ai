const { execSync } = require('child_process')

const projects = [
  'playwrightScraper',
  'pothosGraphql',
  'typesenseCli',
  'strapiClient',
  'nextjsWeb',
]

projects.forEach((project) => {
  console.log(`Generating code for ${project}...`)
  execSync(`graphql-codegen --config graphql.config.ts --project ${project}`, {
    stdio: 'inherit',
  })
})
