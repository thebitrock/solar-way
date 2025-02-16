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
export declare type SolarPanelCreateFormInputValues = {
    name?: string;
    vocSTC?: number;
    temperatureCoefficientOfVOC?: number;
};
export declare type SolarPanelCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    vocSTC?: ValidationFunction<number>;
    temperatureCoefficientOfVOC?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SolarPanelCreateFormOverridesProps = {
    SolarPanelCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    vocSTC?: PrimitiveOverrideProps<TextFieldProps>;
    temperatureCoefficientOfVOC?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SolarPanelCreateFormProps = React.PropsWithChildren<{
    overrides?: SolarPanelCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: SolarPanelCreateFormInputValues) => SolarPanelCreateFormInputValues;
    onSuccess?: (fields: SolarPanelCreateFormInputValues) => void;
    onError?: (fields: SolarPanelCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SolarPanelCreateFormInputValues) => SolarPanelCreateFormInputValues;
    onValidate?: SolarPanelCreateFormValidationValues;
} & React.CSSProperties>;
export default function SolarPanelCreateForm(props: SolarPanelCreateFormProps): React.ReactElement;
