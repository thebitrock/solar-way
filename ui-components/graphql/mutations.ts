/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createManufacturer = /* GraphQL */ `
  mutation CreateManufacturer(
    $condition: ModelManufacturerConditionInput
    $input: CreateManufacturerInput!
  ) {
    createManufacturer(condition: $condition, input: $input) {
      createdAt
      id
      name
      updatedAt
      __typename
    }
  }
`;
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $condition: ModelTodoConditionInput
    $input: CreateTodoInput!
  ) {
    createTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const deleteManufacturer = /* GraphQL */ `
  mutation DeleteManufacturer(
    $condition: ModelManufacturerConditionInput
    $input: DeleteManufacturerInput!
  ) {
    deleteManufacturer(condition: $condition, input: $input) {
      createdAt
      id
      name
      updatedAt
      __typename
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $condition: ModelTodoConditionInput
    $input: DeleteTodoInput!
  ) {
    deleteTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const updateManufacturer = /* GraphQL */ `
  mutation UpdateManufacturer(
    $condition: ModelManufacturerConditionInput
    $input: UpdateManufacturerInput!
  ) {
    updateManufacturer(condition: $condition, input: $input) {
      createdAt
      id
      name
      updatedAt
      __typename
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $condition: ModelTodoConditionInput
    $input: UpdateTodoInput!
  ) {
    updateTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
