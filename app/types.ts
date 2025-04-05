import { Schema } from '@/amplify/data/resource';
import { ClientSchema } from '@/amplify/data/datastore';

export type AmplifyManufacturer = ClientSchema['Manufacturer'];
export type AmplifySolarPanel = ClientSchema['SolarPanel'];
export type AmplifyModule = ClientSchema['Module'];
export type AmplifyPanelCharacteristics = ClientSchema['PanelCharacteristics'];

export interface ApiManufacturer {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  solarPanels: {
    items: ApiSolarPanel[];
  };
}

export interface ApiSolarPanel {
  id: string;
  name: string;
  manufacturerId: string;
  manufacturer: ApiManufacturer;
  modules: {
    items: ApiModule[];
  };
  temperatureCoefficientOfPmax: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiModule {
  id: string;
  power: number;
  solarPanelId: string;
  characteristics: {
    items: PanelCharacteristics[];
  };
}

export type CharacteristicType = 'STC' | 'NOCT' | 'NMOT';

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