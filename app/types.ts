export type PanelCharacteristics = {
  id: string;
  maximumPower: number;
  openCircuitVoltage: number;
  shortCircuitCurrent: number;
  voltageAtMaximumPower: number;
  currentAtMaximumPower: number;
  solarPanelId: string;
  type: string;
};

export type SolarPanel = {
  id: string;
  name: string;
  manufacturerId: string;
  temperatureCoefficientOfVOC: number;
  temperatureCoefficientOfISC: number;
  temperatureCoefficientOfPmax: number;
  characteristics?: PanelCharacteristics[];
}; 