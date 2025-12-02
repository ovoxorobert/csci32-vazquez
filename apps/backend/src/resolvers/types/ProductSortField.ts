import { registerEnumType } from 'type-graphql'

// Define the fields available for sorting products
export enum ProductSortField {
  NAME = 'name',
  PRICE = 'price',
  STOCK = 'stock',
  CREATED_AT = 'createdAt',
}

// Register the enum with TypeGraphQL
registerEnumType(ProductSortField, {
  name: 'ProductSortField',
  description: 'Fields by which products can be sorted.',
})

// Define the available sort directions
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

// Register the SortDirection enum
registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'Direction for sorting results (ascending or descending).',
})
