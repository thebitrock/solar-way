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
      solarPanels {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const createSolarPanel = /* GraphQL */ `
  mutation CreateSolarPanel(
    $condition: ModelSolarPanelConditionInput
    $input: CreateSolarPanelInput!
  ) {
    createSolarPanel(condition: $condition, input: $input) {
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
export const deleteManufacturer = /* GraphQL */ `
  mutation DeleteManufacturer(
    $condition: ModelManufacturerConditionInput
    $input: DeleteManufacturerInput!
  ) {
    deleteManufacturer(condition: $condition, input: $input) {
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
export const deleteSolarPanel = /* GraphQL */ `
  mutation DeleteSolarPanel(
    $condition: ModelSolarPanelConditionInput
    $input: DeleteSolarPanelInput!
  ) {
    deleteSolarPanel(condition: $condition, input: $input) {
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
export const updateManufacturer = /* GraphQL */ `
  mutation UpdateManufacturer(
    $condition: ModelManufacturerConditionInput
    $input: UpdateManufacturerInput!
  ) {
    updateManufacturer(condition: $condition, input: $input) {
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
export const updateSolarPanel = /* GraphQL */ `
  mutation UpdateSolarPanel(
    $condition: ModelSolarPanelConditionInput
    $input: UpdateSolarPanelInput!
  ) {
    updateSolarPanel(condition: $condition, input: $input) {
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
