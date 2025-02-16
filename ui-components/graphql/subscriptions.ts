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
      solarPanels {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const onCreateSolarPanel = /* GraphQL */ `
  subscription OnCreateSolarPanel(
    $filter: ModelSubscriptionSolarPanelFilterInput
  ) {
    onCreateSolarPanel(filter: $filter) {
      createdAt
      id
      manufacturer {
        createdAt
        id
        name
        updatedAt
        __typename
      }
      manufacturerId
      name
      temperatureCoefficientOfVOC
      updatedAt
      vocSTC
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
      solarPanels {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const onDeleteSolarPanel = /* GraphQL */ `
  subscription OnDeleteSolarPanel(
    $filter: ModelSubscriptionSolarPanelFilterInput
  ) {
    onDeleteSolarPanel(filter: $filter) {
      createdAt
      id
      manufacturer {
        createdAt
        id
        name
        updatedAt
        __typename
      }
      manufacturerId
      name
      temperatureCoefficientOfVOC
      updatedAt
      vocSTC
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
      solarPanels {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const onUpdateSolarPanel = /* GraphQL */ `
  subscription OnUpdateSolarPanel(
    $filter: ModelSubscriptionSolarPanelFilterInput
  ) {
    onUpdateSolarPanel(filter: $filter) {
      createdAt
      id
      manufacturer {
        createdAt
        id
        name
        updatedAt
        __typename
      }
      manufacturerId
      name
      temperatureCoefficientOfVOC
      updatedAt
      vocSTC
      __typename
    }
  }
`;
