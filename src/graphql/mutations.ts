/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createManufacturer = /* GraphQL */ `mutation CreateManufacturer(
  $input: CreateManufacturerInput!
  $condition: ModelManufacturerConditionInput
) {
  createManufacturer(input: $input, condition: $condition) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateManufacturerMutationVariables,
  APITypes.CreateManufacturerMutation
>;
export const updateManufacturer = /* GraphQL */ `mutation UpdateManufacturer(
  $input: UpdateManufacturerInput!
  $condition: ModelManufacturerConditionInput
) {
  updateManufacturer(input: $input, condition: $condition) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateManufacturerMutationVariables,
  APITypes.UpdateManufacturerMutation
>;
export const deleteManufacturer = /* GraphQL */ `mutation DeleteManufacturer(
  $input: DeleteManufacturerInput!
  $condition: ModelManufacturerConditionInput
) {
  deleteManufacturer(input: $input, condition: $condition) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteManufacturerMutationVariables,
  APITypes.DeleteManufacturerMutation
>;
