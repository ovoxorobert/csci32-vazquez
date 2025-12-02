import { InputType, Field, Int, registerEnumType } from 'type-graphql'

// Enum for the direction of sorting
export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

// Enum for the fields available to sort the Product model by
export enum ProductSortField {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  PRICE = 'price',
}

// Register the enums with GraphQL
registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'The direction to sort the results (ASC or DESC).',
})

registerEnumType(ProductSortField, {
  name: 'ProductSortField',
  description: 'Fields available for sorting products.',
})

@InputType()
export class ListProductsInput {
  @Field(() => Int, {
    nullable: true,
    defaultValue: 10,
    description: 'Number of items to return.',
  })
  take?: number

  @Field(() => Int, {
    nullable: true,
    defaultValue: 0,
    description: 'Number of items to skip (for pagination).',
  })
  skip?: number

  @Field(() => ProductSortField, {
    nullable: true,
    defaultValue: ProductSortField.CREATED_AT,
    description: 'Field to sort by.',
  })
  sortBy?: ProductSortField

  @Field(() => SortDirection, {
    nullable: true,
    defaultValue: SortDirection.DESC,
    description: 'Sort direction.',
  })
  sortDirection?: SortDirection

  @Field(() => String, {
    nullable: true,
    description: 'Search term to filter products by name or description.',
  })
  search?: string
}
