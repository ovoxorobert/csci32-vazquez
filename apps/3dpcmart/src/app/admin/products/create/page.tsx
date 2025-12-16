'use client'
import React, { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { CreateProductInput } from '@/generated/graphql'
import { gqlClient } from '@/services/graphql-client'
import { CREATE_PRODUCT_MUTATION } from '../../../../graphql/productMutations'

// Define the fields required for the form
type FormFields = CreateProductInput

const CreateProductPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setLoading(true)
    try {
      // Convert string form inputs
      const payload = {
        ...data,
        price: parseFloat(data.price as unknown as string),
        stock: parseInt(data.stock as unknown as string),
      }

      // Execute the GraphQL mutation
      await gqlClient.request(CREATE_PRODUCT_MUTATION, { input: payload })

      // Success feedback and redirect
      alert('Product created successfully!')
      router.push('/admin/products') // Redirect to the product list page
    } catch (error) {
      console.error('Product Creation Failed:', error)
      // Display error message
      alert(`Error: Failed to create product. Check console for details.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-2 border-b pb-4 mb-8">
        <PlusCircle className="h-6 w-6 text-green-600" />
        <h1 className="text-3xl font-bold">Create New Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register('description', {
              required: 'Description is required',
            })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
              min: { value: 0.01, message: 'Must be greater than 0' },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            Stock
          </label>
          <input
            id="stock"
            type="number"
            {...register('stock', {
              required: 'Stock is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Cannot be negative' },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="sku"
            className="block text-sm font-medium text-gray-700"
          >
            SKU (Unique Identifier)
          </label>
          <input
            id="sku"
            type="text"
            {...register('sku', { required: 'SKU is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.sku && (
            <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}

export default CreateProductPage
