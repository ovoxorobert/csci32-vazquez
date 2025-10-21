import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:4000/api/graphql', // Your backend GraphQL endpoint
  documents: ['src/**/*.{ts,tsx}', '!src/generated/**/*'],
  generates: {
    'schema.graphql': {
      plugins: ['schema-ast'],
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
