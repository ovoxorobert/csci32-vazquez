import type { CodegenConfig } from '@graphql-codegen/cli'

const LIVE_SCHEMA_URL = 'http://localhost:4000/api/graphql'

const config: CodegenConfig = {
  schema:
    process.env.NODE_ENV === 'production'
      ? './schema.graphql'
      : LIVE_SCHEMA_URL,
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
