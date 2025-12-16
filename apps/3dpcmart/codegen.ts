import type { CodegenConfig } from '@graphql-codegen/cli'
import { existsSync } from 'fs'
import { join } from 'path'

const LIVE_SCHEMA_URL = 'http://localhost:4000/api/graphql'
const LOCAL_SCHEMA_PATH = join(__dirname, 'schema.graphql')

const schemaSource = existsSync(LOCAL_SCHEMA_PATH)
  ? LOCAL_SCHEMA_PATH
  : LIVE_SCHEMA_URL

const config: CodegenConfig = {
  schema: schemaSource,
  documents: ['src/**/*.{ts,tsx}', '!src/generated/**/*'],
  generates: {
    './schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        endpoint: LIVE_SCHEMA_URL,
      },
    },
    'src/generated/': {
      preset: 'client',
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config
