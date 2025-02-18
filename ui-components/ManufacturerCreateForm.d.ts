import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ManufacturerCreateFormInputValues = {
    name?: string;
};
export declare type ManufacturerCreateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ManufacturerCreateFormOverridesProps = {
    ManufacturerCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ManufacturerCreateFormProps = React.PropsWithChildren<{
    overrides?: ManufacturerCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ManufacturerCreateFormInputValues) => ManufacturerCreateFormInputValues;
    onSuccess?: (fields: ManufacturerCreateFormInputValues) => void;
    onError?: (fields: ManufacturerCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ManufacturerCreateFormInputValues) => ManufacturerCreateFormInputValues;
    onValidate?: ManufacturerCreateFormValidationValues;
} & React.CSSProperties>;
export default function ManufacturerCreateForm(props: ManufacturerCreateFormProps): React.ReactElement;
