/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getSolarPanel } from "./graphql/queries";
import { updateSolarPanel } from "./graphql/mutations";
const client = generateClient();
export default function SolarPanelUpdateForm(props) {
  const {
    id: idProp,
    solarPanel: solarPanelModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    vocSTC: "",
    temperatureCoefficientOfVOC: "",
    temperatureCoefficientOfISC: "",
    temperatureCoefficientOfPmax: "",
    impSTC: "",
    vmpSTC: "",
    iscSTC: "",
    impNOCT: "",
    vmpNOCT: "",
    iscNOCT: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [vocSTC, setVocSTC] = React.useState(initialValues.vocSTC);
  const [temperatureCoefficientOfVOC, setTemperatureCoefficientOfVOC] =
    React.useState(initialValues.temperatureCoefficientOfVOC);
  const [temperatureCoefficientOfISC, setTemperatureCoefficientOfISC] =
    React.useState(initialValues.temperatureCoefficientOfISC);
  const [temperatureCoefficientOfPmax, setTemperatureCoefficientOfPmax] =
    React.useState(initialValues.temperatureCoefficientOfPmax);
  const [impSTC, setImpSTC] = React.useState(initialValues.impSTC);
  const [vmpSTC, setVmpSTC] = React.useState(initialValues.vmpSTC);
  const [iscSTC, setIscSTC] = React.useState(initialValues.iscSTC);
  const [impNOCT, setImpNOCT] = React.useState(initialValues.impNOCT);
  const [vmpNOCT, setVmpNOCT] = React.useState(initialValues.vmpNOCT);
  const [iscNOCT, setIscNOCT] = React.useState(initialValues.iscNOCT);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = solarPanelRecord
      ? { ...initialValues, ...solarPanelRecord }
      : initialValues;
    setName(cleanValues.name);
    setVocSTC(cleanValues.vocSTC);
    setTemperatureCoefficientOfVOC(cleanValues.temperatureCoefficientOfVOC);
    setTemperatureCoefficientOfISC(cleanValues.temperatureCoefficientOfISC);
    setTemperatureCoefficientOfPmax(cleanValues.temperatureCoefficientOfPmax);
    setImpSTC(cleanValues.impSTC);
    setVmpSTC(cleanValues.vmpSTC);
    setIscSTC(cleanValues.iscSTC);
    setImpNOCT(cleanValues.impNOCT);
    setVmpNOCT(cleanValues.vmpNOCT);
    setIscNOCT(cleanValues.iscNOCT);
    setErrors({});
  };
  const [solarPanelRecord, setSolarPanelRecord] =
    React.useState(solarPanelModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getSolarPanel.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getSolarPanel
        : solarPanelModelProp;
      setSolarPanelRecord(record);
    };
    queryData();
  }, [idProp, solarPanelModelProp]);
  React.useEffect(resetStateValues, [solarPanelRecord]);
  const validations = {
    name: [{ type: "Required" }],
    vocSTC: [{ type: "Required" }],
    temperatureCoefficientOfVOC: [{ type: "Required" }],
    temperatureCoefficientOfISC: [{ type: "Required" }],
    temperatureCoefficientOfPmax: [{ type: "Required" }],
    impSTC: [{ type: "Required" }],
    vmpSTC: [{ type: "Required" }],
    iscSTC: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name,
          vocSTC,
          temperatureCoefficientOfVOC,
          temperatureCoefficientOfISC,
          temperatureCoefficientOfPmax,
          impSTC,
          vmpSTC,
          iscSTC,
          impNOCT,
          vmpNOCT,
          iscNOCT,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateSolarPanel.replaceAll("__typename", ""),
            variables: {
              input: {
                id: solarPanelRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "SolarPanelUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              vocSTC,
              temperatureCoefficientOfVOC,
              temperatureCoefficientOfISC,
              temperatureCoefficientOfPmax,
              impSTC,
              vmpSTC,
              iscSTC,
              impNOCT,
              vmpNOCT,
              iscNOCT,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Voc stc"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={vocSTC}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              vocSTC: value,
              temperatureCoefficientOfVOC,
              temperatureCoefficientOfISC,
              temperatureCoefficientOfPmax,
              impSTC,
              vmpSTC,
              iscSTC,
              impNOCT,
              vmpNOCT,
              iscNOCT,
            };
            const result = onChange(modelFields);
            value = result?.vocSTC ?? value;
          }
          if (errors.vocSTC?.hasError) {
            runValidationTasks("vocSTC", value);
          }
          setVocSTC(value);
        }}
        onBlur={() => runValidationTasks("vocSTC", vocSTC)}
        errorMessage={errors.vocSTC?.errorMessage}
        hasError={errors.vocSTC?.hasError}
        {...getOverrideProps(overrides, "vocSTC")}
      ></TextField>
      <TextField
        label="Temperature coefficient of voc"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={temperatureCoefficientOfVOC}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              vocSTC,
              temperatureCoefficientOfVOC: value,
              temperatureCoefficientOfISC,
              temperatureCoefficientOfPmax,
              impSTC,
              vmpSTC,
              iscSTC,
              impNOCT,
              vmpNOCT,
              iscNOCT,
            };
            const result = onChange(modelFields);
            value = result?.temperatureCoefficientOfVOC ?? value;
          }
          if (errors.temperatureCoefficientOfVOC?.hasError) {
            runValidationTasks("temperatureCoefficientOfVOC", value);
          }
          setTemperatureCoefficientOfVOC(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "temperatureCoefficientOfVOC",
            temperatureCoefficientOfVOC
          )
        }
        errorMessage={errors.temperatureCoefficientOfVOC?.errorMessage}
        hasError={errors.temperatureCoefficientOfVOC?.hasError}
        {...getOverrideProps(overrides, "temperatureCoefficientOfVOC")}
      ></TextField>
      <TextField
        label="Temperature coefficient of isc"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={temperatureCoefficientOfISC}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              vocSTC,
              temperatureCoefficientOfVOC,
              temperatureCoefficientOfISC: value,
              temperatureCoefficientOfPmax,
              impSTC,
              vmpSTC,
              iscSTC,
              impNOCT,
              vmpNOCT,
              iscNOCT,
            };
            const result = onChange(modelFields);
            value = result?.temperatureCoefficientOfISC ?? value;
          }
          if (errors.temperatureCoefficientOfISC?.hasError) {
            runValidationTasks("temperatureCoefficientOfISC", value);
          }
          setTemperatureCoefficientOfISC(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "temperatureCoefficientOfISC",
            temperatureCoefficientOfISC
          )
        }
        errorMessage={errors.temperatureCoefficientOfISC?.errorMessage}
        hasError={errors.temperatureCoefficientOfISC?.hasError}
        {...getOverrideProps(overrides, "temperatureCoefficientOfISC")}
      ></TextField>
      <TextField
        label="Temperature coefficient of pmax"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={temperatureCoefficientOfPmax}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              vocSTC,
              temperatureCoefficientOfVOC,
              temperatureCoefficientOfISC,
              temperatureCoefficientOfPmax: value,
              impSTC,
              vmpSTC,
              iscSTC,
              impNOCT,
              vmpNOCT,
              iscNOCT,
            };
            const result = onChange(modelFields);
            value = result?.temperatureCoefficientOfPmax ?? value;
          }
          if (errors.temperatureCoefficientOfPmax?.hasError) {
            runValidationTasks("temperatureCoefficientOfPmax", value);
          }
          setTemperatureCoefficientOfPmax(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "temperatureCoefficientOfPmax",
            temperatureCoefficientOfPmax
          )
        }
        errorMessage={errors.temperatureCoefficientOfPmax?.errorMessage}
        hasError={errors.temperatureCoefficientOfPmax?.hasError}
        {...getOverrideProps(overrides, "temperatureCoefficientOfPmax")}
      ></TextField>
      <TextField
        label="Imp stc"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={impSTC}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              vocSTC,
              temperatureCoefficientOfVOC,
              temperatureCoefficientOfISC,
              temperatureCoefficientOfPmax,
              impSTC: value,
              vmpSTC,
              iscSTC,
              impNOCT,
              vmpNOCT,
              iscNOCT,
            };
            const result = onChange(modelFields);
            value = result?.impSTC ?? value;
          }
          if (errors.impSTC?.hasError) {
            runValidationTasks("impSTC", value);
          }
          setImpSTC(value);
        }}
        onBlur={() => runValidationTasks("impSTC", impSTC)}
        errorMessage={errors.impSTC?.errorMessage}
        hasError={errors.impSTC?.hasError}
        {...getOverrideProps(overrides, "impSTC")}
      ></TextField>
      <TextField
        label="Vmp stc"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={vmpSTC}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              vocSTC,
              temperatureCoefficientOfVOC,
              temperatureCoefficientOfISC,
              temperatureCoefficientOfPmax,
              impSTC,
              vmpSTC: value,
              iscSTC,
              impNOCT,
              vmpNOCT,
              iscNOCT,
            };
            const result = onChange(modelFields);
            value = result?.vmpSTC ?? value;
          }
          if (errors.vmpSTC?.hasError) {
            runValidationTasks("vmpSTC", value);
          }
          setVmpSTC(value);
        }}
        onBlur={() => runValidationTasks("vmpSTC", vmpSTC)}
        errorMessage={errors.vmpSTC?.errorMessage}
        hasError={errors.vmpSTC?.hasError}
        {...getOverrideProps(overrides, "vmpSTC")}
      ></TextField>
      <TextField
        label="Isc stc"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={iscSTC}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              vocSTC,
              temperatureCoefficientOfVOC,
              temperatureCoefficientOfISC,
              temperatureCoefficientOfPmax,
              impSTC,
              vmpSTC,
              iscSTC: value,
              impNOCT,
              vmpNOCT,
              iscNOCT,
            };
            const result = onChange(modelFields);
            value = result?.iscSTC ?? value;
          }
          if (errors.iscSTC?.hasError) {
            runValidationTasks("iscSTC", value);
          }
          setIscSTC(value);
        }}
        onBlur={() => runValidationTasks("iscSTC", iscSTC)}
        errorMessage={errors.iscSTC?.errorMessage}
        hasError={errors.iscSTC?.hasError}
        {...getOverrideProps(overrides, "iscSTC")}
      ></TextField>
      <TextField
        label="Imp noct"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={impNOCT}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              vocSTC,
              temperatureCoefficientOfVOC,
              temperatureCoefficientOfISC,
              temperatureCoefficientOfPmax,
              impSTC,
              vmpSTC,
              iscSTC,
              impNOCT: value,
              vmpNOCT,
              iscNOCT,
            };
            const result = onChange(modelFields);
            value = result?.impNOCT ?? value;
          }
          if (errors.impNOCT?.hasError) {
            runValidationTasks("impNOCT", value);
          }
          setImpNOCT(value);
        }}
        onBlur={() => runValidationTasks("impNOCT", impNOCT)}
        errorMessage={errors.impNOCT?.errorMessage}
        hasError={errors.impNOCT?.hasError}
        {...getOverrideProps(overrides, "impNOCT")}
      ></TextField>
      <TextField
        label="Vmp noct"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={vmpNOCT}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              vocSTC,
              temperatureCoefficientOfVOC,
              temperatureCoefficientOfISC,
              temperatureCoefficientOfPmax,
              impSTC,
              vmpSTC,
              iscSTC,
              impNOCT,
              vmpNOCT: value,
              iscNOCT,
            };
            const result = onChange(modelFields);
            value = result?.vmpNOCT ?? value;
          }
          if (errors.vmpNOCT?.hasError) {
            runValidationTasks("vmpNOCT", value);
          }
          setVmpNOCT(value);
        }}
        onBlur={() => runValidationTasks("vmpNOCT", vmpNOCT)}
        errorMessage={errors.vmpNOCT?.errorMessage}
        hasError={errors.vmpNOCT?.hasError}
        {...getOverrideProps(overrides, "vmpNOCT")}
      ></TextField>
      <TextField
        label="Isc noct"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={iscNOCT}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              vocSTC,
              temperatureCoefficientOfVOC,
              temperatureCoefficientOfISC,
              temperatureCoefficientOfPmax,
              impSTC,
              vmpSTC,
              iscSTC,
              impNOCT,
              vmpNOCT,
              iscNOCT: value,
            };
            const result = onChange(modelFields);
            value = result?.iscNOCT ?? value;
          }
          if (errors.iscNOCT?.hasError) {
            runValidationTasks("iscNOCT", value);
          }
          setIscNOCT(value);
        }}
        onBlur={() => runValidationTasks("iscNOCT", iscNOCT)}
        errorMessage={errors.iscNOCT?.errorMessage}
        hasError={errors.iscNOCT?.hasError}
        {...getOverrideProps(overrides, "iscNOCT")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || solarPanelModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || solarPanelModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
