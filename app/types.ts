import { type Schema } from '@/amplify/data/resource';

export type AmplifyManufacturer = Schema['Manufacturer'];
export type AmplifySolarPanel = Schema['SolarPanel'];
export type AmplifyModule = Schema['Module'];
export type AmplifyPanelCharacteristics = Schema['PanelCharacteristics'];

// Client-side types
export interface Manufacturer {
  id: string;
  name: string;
  solarPanels: SolarPanel[];
}

export interface SolarPanel {
  id: string;
  name: string;
  manufacturerId: string;
  temperatureCoefficientOfVOC: number;
  temperatureCoefficientOfISC: number;
  temperatureCoefficientOfPmax: number;
  modules: Module[];
}

export interface Module {
  id: string;
  power: number;
  solarPanelId: string;
  characteristics: PanelCharacteristics[];
}

export interface PanelCharacteristics {
  id: string;
  type: CharacteristicType;
  moduleId: string;
  maximumPower: number;
  openCircuitVoltage: number;
  shortCircuitCurrent: number;
  voltageAtMaximumPower: number;
  currentAtMaximumPower: number;
}

export type CharacteristicType = 'STC' | 'NOCT' | 'NMOT';

export interface PanelParametersTableProps {
  characteristics: PanelCharacteristics[];
  t: (key: string) => string;
}

// Amplify model types
export interface AmplifyModelBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AmplifyManufacturerModel extends AmplifyModelBase {
  name: string;
  solarPanels: {
    items: AmplifySolarPanelModel[];
  };
}

export interface AmplifySolarPanelModel extends AmplifyModelBase {
  name: string;
  manufacturerId: string;
  manufacturer: AmplifyManufacturerModel;
  temperatureCoefficientOfVOC: number;
  temperatureCoefficientOfISC: number;
  temperatureCoefficientOfPmax: number;
  modules: {
    items: AmplifyModuleModel[];
  };
}

export interface AmplifyModuleModel extends AmplifyModelBase {
  power: number;
  solarPanelId: string;
  solarPanel: AmplifySolarPanelModel;
  characteristics: {
    items: AmplifyCharacteristicsModel[];
  };
}

export interface AmplifyCharacteristicsModel extends AmplifyModelBase {
  type: CharacteristicType;
  moduleId: string;
  module: AmplifyModuleModel;
  maximumPower: number;
  openCircuitVoltage: number;
  shortCircuitCurrent: number;
  voltageAtMaximumPower: number;
  currentAtMaximumPower: number;
} 