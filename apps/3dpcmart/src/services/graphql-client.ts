import { GraphQLClient } from 'graphql-request'

const GRAPHQL_API_URL = '/api/graphql'

// 1. Core token state
let currentAuthToken: string | null = null

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const API_ENDPOINT = `${API_BASE_URL}${GRAPHQL_API_URL}`

// 2. Client is created using a DYNAMIC header function
export const gqlClient = new GraphQLClient(
  API_ENDPOINT, // Use the guaranteed valid string for the constructor
  {
    headers: () => {
      let token = currentAuthToken
      if (typeof window !== 'undefined') {
        token = token || localStorage.getItem('authToken')
      }
      return {
        Authorization: token ? `Bearer ${token}` : '',
      }
    },
  },
)
// 3. Auth helper functions must update the in-memory token
export function setAuthToken(token: string) {
  // Update in-memory state
  currentAuthToken = token

  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
  }
}

export function clearAuthToken() {
  currentAuthToken = null

  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
  }
}

// 4. Initialization only needs to set the in-memory token for the first render
export function initializeAuth() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken')
    if (token) {
      currentAuthToken = token
    }
  }
}
