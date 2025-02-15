/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateManufacturer = /* GraphQL */ `subscription OnCreateManufacturer(
  $filter: ModelSubscriptionManufacturerFilterInput
) {
  onCreateManufacturer(filter: $filter) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateManufacturerSubscriptionVariables,
  APITypes.OnCreateManufacturerSubscription
>;
export const onUpdateManufacturer = /* GraphQL */ `subscription OnUpdateManufacturer(
  $filter: ModelSubscriptionManufacturerFilterInput
) {
  onUpdateManufacturer(filter: $filter) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateManufacturerSubscriptionVariables,
  APITypes.OnUpdateManufacturerSubscription
>;
export const onDeleteManufacturer = /* GraphQL */ `subscription OnDeleteManufacturer(
  $filter: ModelSubscriptionManufacturerFilterInput
) {
  onDeleteManufacturer(filter: $filter) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteManufacturerSubscriptionVariables,
  APITypes.OnDeleteManufacturerSubscription
>;
