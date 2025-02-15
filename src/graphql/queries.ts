/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getManufacturer = /* GraphQL */ `query GetManufacturer($id: ID!) {
  getManufacturer(id: $id) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetManufacturerQueryVariables,
  APITypes.GetManufacturerQuery
>;
export const listManufacturers = /* GraphQL */ `query ListManufacturers(
  $filter: ModelManufacturerFilterInput
  $limit: Int
  $nextToken: String
) {
  listManufacturers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListManufacturersQueryVariables,
  APITypes.ListManufacturersQuery
>;
