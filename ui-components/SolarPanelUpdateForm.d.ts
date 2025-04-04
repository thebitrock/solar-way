import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { SolarPanel } from "./graphql/types";
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
export declare type SolarPanelUpdateFormInputValues = {
    name?: string;
    vocSTC?: number;
    temperatureCoefficientOfVOC?: number;
    temperatureCoefficientOfISC?: number;
    temperatureCoefficientOfPmax?: number;
    impSTC?: number;
    vmpSTC?: number;
    iscSTC?: number;
    impNOCT?: number;
    vmpNOCT?: number;
    iscNOCT?: number;
};
export declare type SolarPanelUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    vocSTC?: ValidationFunction<number>;
    temperatureCoefficientOfVOC?: ValidationFunction<number>;
    temperatureCoefficientOfISC?: ValidationFunction<number>;
    temperatureCoefficientOfPmax?: ValidationFunction<number>;
    impSTC?: ValidationFunction<number>;
    vmpSTC?: ValidationFunction<number>;
    iscSTC?: ValidationFunction<number>;
    impNOCT?: ValidationFunction<number>;
    vmpNOCT?: ValidationFunction<number>;
    iscNOCT?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SolarPanelUpdateFormOverridesProps = {
    SolarPanelUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    vocSTC?: PrimitiveOverrideProps<TextFieldProps>;
    temperatureCoefficientOfVOC?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SolarPanelUpdateFormProps = React.PropsWithChildren<{
    overrides?: SolarPanelUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    solarPanel?: SolarPanel;
    onSubmit?: (fields: SolarPanelUpdateFormInputValues) => SolarPanelUpdateFormInputValues;
    onSuccess?: (fields: SolarPanelUpdateFormInputValues) => void;
    onError?: (fields: SolarPanelUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SolarPanelUpdateFormInputValues) => SolarPanelUpdateFormInputValues;
    onValidate?: SolarPanelUpdateFormValidationValues;
} & React.CSSProperties>;
export default function SolarPanelUpdateForm(props: SolarPanelUpdateFormProps): React.ReactElement;
