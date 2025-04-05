import dynamic from 'next/dynamic';
import { Flex } from '@aws-amplify/ui-react';

export type ModuleModel = {
  id?: string;
  power: number;
  solarPanelId?: string;
  characteristics?: Array<CharacteristicModel>;
};

export type CharacteristicModel = {
  id?: string;
  type: 'STC' | 'NOCT' | 'NMOT';
  maximumPower: number;
  openCircuitVoltage: number;
  shortCircuitCurrent: number;
  voltageAtMaximumPower: number;
  currentAtMaximumPower: number;
  moduleId?: string;
};

export type SolarPanelModel = {
  id?: string;
  name: string;
  manufacturerId: string;
  temperatureCoefficientOfVOC: number;
  temperatureCoefficientOfISC: number;
  temperatureCoefficientOfPmax: number;
  modules?: Array<ModuleModel>;
};

export type ManufacturerModel = {
  id: string;
  name: string;
};

export interface PanelCharacteristicsInput {
  maximumPower: string;
  openCircuitVoltage: string;
  shortCircuitCurrent: string;
  voltageAtMaximumPower: string;
  currentAtMaximumPower: string;
}

export interface ModuleInput {
  id?: string;
  power: string;
  characteristics: {
    stc: PanelCharacteristicsInput;
    noct: PanelCharacteristicsInput;
    nmot: PanelCharacteristicsInput;
  };
}

export interface CharacteristicsFormProps {
  characteristics: PanelCharacteristicsInput;
  onChange: (characteristics: PanelCharacteristicsInput) => void;
  t: (key: string) => string;
}

export interface ModuleFormProps {
  module: ModuleInput;
  onChange: (module: ModuleInput) => void;
  onDelete?: () => void;
  t: (key: string) => string;
}

export interface SolarPanelFormProps {
  solarPanel?: SolarPanelModel;
  mode: 'create' | 'update';
  onSuccess: () => void;
}

// Создаем клиентский компонент с отключенным SSR
const SolarPanelFormClient = dynamic(
  () => import('./SolarPanelFormClient').then(mod => mod.default),
  { ssr: false }
);

export default function SolarPanelForm(props: SolarPanelFormProps) {
  return (
    <Flex direction="column">
      <SolarPanelFormClient {...props} />
    </Flex>
  );
} 