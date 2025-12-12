'use client'

import React, { useState, useEffect } from 'react'
import { Search, ChevronDown, Grid } from 'lucide-react'

// --- CONFIGURATION ---
const GRAPHQL_API_URL = 'http://127.0.0.1:4000/api/graphql'

// --- GRAPHQL QUERY ---
const LIST_PRODUCTS_QUERY = `
  query ListProducts($input: ListProductsInput!) {
    products(input: $input) {
      id
      name
      description
      price
      stock
      createdAt
      reviews {
        rating
      }
    }
  }
`

// --- TYPE DEFINITIONS (TypeScript Interfaces) ---
interface IReview {
  rating: number
}

interface IProduct {
  id: string
  name: string
  description: string
  price: number
  stock: number
  createdAt: string
  reviews: IReview[]
}

interface IHeaderProps {
  search: string
  setSearch: (search: string) => void
  sortBy: string
  setSortBy: (sortBy: string) => void
  sortDirection: 'ASC' | 'DESC'
  setSortDirection: (direction: 'ASC' | 'DESC') => void
}

/**
 * Calculates the average rating for a product.
 * @param {IReview[]} reviews
 * @returns {number}
 */
const calculateAverageRating = (reviews: IReview[]): number => {
  if (!reviews || reviews.length === 0) return 0

  const total = reviews.reduce(
    (sum: number, review: IReview) => sum + review.rating,
    0,
  )
  return total / reviews.length
}

/**
 * @param {object} props
 * @param {IProduct} props.product
 */
const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  const avgRating = calculateAverageRating(product.reviews)
  const starColor = avgRating >= 4 ? 'text-yellow-400' : 'text-gray-400'
  const ratingText = avgRating > 0 ? avgRating.toFixed(1) : 'No reviews'

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">
        {product.name}
      </h2>

      <div className="flex items-center text-sm text-gray-500 mb-3">
        <span className={`font-semibold ${starColor}`}>
          {'★'.repeat(Math.round(avgRating))}
        </span>
        <span className="ml-1">({ratingText})</span>
        <span className="ml-3 text-gray-400">|</span>
        <span className="ml-3 font-medium">In Stock: {product.stock}</span>
      </div>

      <p className="text-sm text-gray-600 mb-4 grow line-clamp-3">
        {product.description}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-indigo-600">
          ${product.price.toFixed(2)}
        </div>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md"
          onClick={() => console.log('View Product:', product.id)}
        >
          View Details
        </button>
      </div>
    </div>
  )
}

const Header: React.FC<IHeaderProps> = ({
  search,
  setSearch,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md mb-6 w-full flex flex-col md:flex-row gap-4">
    <div className="relative grow">
      <input
        type="text"
        placeholder="Search products by name or description..."
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>

    <div className="flex gap-4">
      <div className="relative w-48">
        <select
          value={sortBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSortBy(e.target.value)
          }
          className="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-3 pr-8"
        >
          <option value="CREATED_AT">Newest</option>
          <option value="PRICE">Price</option>
          <option value="NAME">Name</option>
          <option value="STOCK">Stock</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      <button
        onClick={() =>
          setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC')
        }
        className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
      >
        {sortDirection === 'ASC' ? (
          <span className="text-xs font-semibold">ASC &uarr;</span>
        ) : (
          <span className="text-xs font-semibold">DESC &darr;</span>
        )}
      </button>
    </div>
  </div>
)

// --- MAIN APPLICATION COMPONENT ---
const ProductCatalogPage = () => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')

  const [sortBy, setSortBy] = useState('CREATED_AT')

  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC')
  const [skip, setSkip] = useState(0)
  const [take] = useState(8)
  const [hasMore, setHasMore] = useState(true)

  const fetchProducts = async (isNewSearch = false) => {
    setLoading(true)
    setError(null)

    const currentSkip = isNewSearch ? 0 : skip

    try {
      const response = await fetch(GRAPHQL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: LIST_PRODUCTS_QUERY,
          variables: {
            input: {
              search: search || undefined,
              skip: currentSkip,
              take: take,
              sortBy: sortBy,
              sortDirection: sortDirection,
            },
          },
        }),
      })

      const result = await response.json()

      if (result.errors) {
        const errorMessages = result.errors
          .map((e: { message: string }) => e.message)
          .join(' | ')
        throw new Error(errorMessages || 'GraphQL Error')
      }
      const fetchedProducts: IProduct[] = result.data.products

      if (isNewSearch) {
        setProducts(fetchedProducts)
      } else {
        setProducts((prev) => [...prev, ...fetchedProducts])
      }

      setHasMore(fetchedProducts.length === take)
      setSkip(currentSkip + fetchedProducts.length)
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred.'
      if (err instanceof Error) {
        errorMessage = 'Failed to fetch products: ' + err.message
      } else if (typeof err === 'string') {
        errorMessage = 'Failed to fetch products: ' + err
      }
      setError(errorMessage)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setSkip(0)
      fetchProducts(true)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [search, sortBy, sortDirection])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          E-Commerce Product Catalog
        </h1>

        <Header
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {loading &&
            (products.length === 0 || skip === 0) &&
            Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`loading-${i}`}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-pulse h-64"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-6"></div>
                  <div className="h-2 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded mb-2 w-5/6"></div>
                  <div className="h-2 bg-gray-200 rounded mb-4 w-4/5"></div>
                  <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-10 bg-indigo-200 rounded-lg w-1/3"></div>
                  </div>
                </div>
              ))}
        </div>

        {hasMore && products.length > 0 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className={`px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl'
              }`}
            >
              {loading ? 'Loading...' : 'Load More Products'}
            </button>
          </div>
        )}

        {!loading && products.length === 0 && !error && (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg mt-8">
            <Grid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">
              No Products Found
            </h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search filters or clear the search bar.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCatalogPage
