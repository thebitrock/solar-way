/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateManufacturerInput = {
  id?: string | null,
  name?: string | null,
};

export type ModelManufacturerConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelManufacturerConditionInput | null > | null,
  or?: Array< ModelManufacturerConditionInput | null > | null,
  not?: ModelManufacturerConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type Manufacturer = {
  __typename: "Manufacturer",
  id: string,
  name?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateManufacturerInput = {
  id: string,
  name?: string | null,
};

export type DeleteManufacturerInput = {
  id: string,
};

export type ModelManufacturerFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelManufacturerFilterInput | null > | null,
  or?: Array< ModelManufacturerFilterInput | null > | null,
  not?: ModelManufacturerFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelManufacturerConnection = {
  __typename: "ModelManufacturerConnection",
  items:  Array<Manufacturer | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionManufacturerFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionManufacturerFilterInput | null > | null,
  or?: Array< ModelSubscriptionManufacturerFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type CreateManufacturerMutationVariables = {
  input: CreateManufacturerInput,
  condition?: ModelManufacturerConditionInput | null,
};

export type CreateManufacturerMutation = {
  createManufacturer?:  {
    __typename: "Manufacturer",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateManufacturerMutationVariables = {
  input: UpdateManufacturerInput,
  condition?: ModelManufacturerConditionInput | null,
};

export type UpdateManufacturerMutation = {
  updateManufacturer?:  {
    __typename: "Manufacturer",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteManufacturerMutationVariables = {
  input: DeleteManufacturerInput,
  condition?: ModelManufacturerConditionInput | null,
};

export type DeleteManufacturerMutation = {
  deleteManufacturer?:  {
    __typename: "Manufacturer",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetManufacturerQueryVariables = {
  id: string,
};

export type GetManufacturerQuery = {
  getManufacturer?:  {
    __typename: "Manufacturer",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListManufacturersQueryVariables = {
  filter?: ModelManufacturerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListManufacturersQuery = {
  listManufacturers?:  {
    __typename: "ModelManufacturerConnection",
    items:  Array< {
      __typename: "Manufacturer",
      id: string,
      name?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateManufacturerSubscriptionVariables = {
  filter?: ModelSubscriptionManufacturerFilterInput | null,
};

export type OnCreateManufacturerSubscription = {
  onCreateManufacturer?:  {
    __typename: "Manufacturer",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateManufacturerSubscriptionVariables = {
  filter?: ModelSubscriptionManufacturerFilterInput | null,
};

export type OnUpdateManufacturerSubscription = {
  onUpdateManufacturer?:  {
    __typename: "Manufacturer",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteManufacturerSubscriptionVariables = {
  filter?: ModelSubscriptionManufacturerFilterInput | null,
};

export type OnDeleteManufacturerSubscription = {
  onDeleteManufacturer?:  {
    __typename: "Manufacturer",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
