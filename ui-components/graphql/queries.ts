/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getManufacturer = /* GraphQL */ `
  query GetManufacturer($id: ID!) {
    getManufacturer(id: $id) {
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
export const getSolarPanel = /* GraphQL */ `
  query GetSolarPanel($id: ID!) {
    getSolarPanel(id: $id) {
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
export const listSolarPanels = /* GraphQL */ `
  query ListSolarPanels(
    $filter: ModelSolarPanelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSolarPanels(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        id
        manufacturerId
        name
        temperatureCoefficientOfVOC
        updatedAt
        vocSTC
        __typename
      }
      nextToken
      __typename
    }
  }
`;
