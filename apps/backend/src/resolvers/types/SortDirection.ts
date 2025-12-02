import { registerEnumType } from 'type-graphql'

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'Sorting direction for list queries.',
})
