/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Manufacturer } from "../API.ts";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ManufacturerUpdateFormInputValues = {
    name?: string;
};
export declare type ManufacturerUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ManufacturerUpdateFormOverridesProps = {
    ManufacturerUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ManufacturerUpdateFormProps = React.PropsWithChildren<{
    overrides?: ManufacturerUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    manufacturer?: Manufacturer;
    onSubmit?: (fields: ManufacturerUpdateFormInputValues) => ManufacturerUpdateFormInputValues;
    onSuccess?: (fields: ManufacturerUpdateFormInputValues) => void;
    onError?: (fields: ManufacturerUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ManufacturerUpdateFormInputValues) => ManufacturerUpdateFormInputValues;
    onValidate?: ManufacturerUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ManufacturerUpdateForm(props: ManufacturerUpdateFormProps): React.ReactElement;
