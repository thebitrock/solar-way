/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getManufacturer = /* GraphQL */ `
  query GetManufacturer($id: ID!) {
    getManufacturer(id: $id) {
      createdAt
      id
      name
      updatedAt
      __typename
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const listManufacturers = /* GraphQL */ `
  query ListManufacturers(
    $filter: ModelManufacturerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listManufacturers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        id
        name
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        content
        createdAt
        id
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
