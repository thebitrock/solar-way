/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateManufacturer = /* GraphQL */ `
  subscription OnCreateManufacturer(
    $filter: ModelSubscriptionManufacturerFilterInput
  ) {
    onCreateManufacturer(filter: $filter) {
      createdAt
      id
      name
      updatedAt
      __typename
    }
  }
`;
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onCreateTodo(filter: $filter) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const onDeleteManufacturer = /* GraphQL */ `
  subscription OnDeleteManufacturer(
    $filter: ModelSubscriptionManufacturerFilterInput
  ) {
    onDeleteManufacturer(filter: $filter) {
      createdAt
      id
      name
      updatedAt
      __typename
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
    onDeleteTodo(filter: $filter) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const onUpdateManufacturer = /* GraphQL */ `
  subscription OnUpdateManufacturer(
    $filter: ModelSubscriptionManufacturerFilterInput
  ) {
    onUpdateManufacturer(filter: $filter) {
      createdAt
      id
      name
      updatedAt
      __typename
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onUpdateTodo(filter: $filter) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
