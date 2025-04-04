import dynamic from 'next/dynamic';
import { Flex } from '@aws-amplify/ui-react';

export type SolarPanelModel = {
  id?: string;
  name: string;
  manufacturerId: string;
  temperatureCoefficientOfVOC: number;
  temperatureCoefficientOfISC: number;
  temperatureCoefficientOfPmax: number;
  characteristics?: Array<{
    id: string;
    type: string;
    maximumPower: number;
    openCircuitVoltage: number;
    shortCircuitCurrent: number;
    voltageAtMaximumPower: number;
    currentAtMaximumPower: number;
  }>;
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

export interface CharacteristicsFormProps {
  characteristics: PanelCharacteristicsInput;
  onChange: (characteristics: PanelCharacteristicsInput) => void;
  t: (key: string) => string;
}

export interface SolarPanelFormProps {
  solarPanel?: SolarPanelModel;
  mode: 'create' | 'update';
  onSuccess: () => void;
}

export type Characteristic = {
  id: string;
  type: string;
  maximumPower: number;
  openCircuitVoltage: number;
  shortCircuitCurrent: number;
  voltageAtMaximumPower: number;
  currentAtMaximumPower: number;
};

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