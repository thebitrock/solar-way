import { Schema } from "@/amplify/data/resource";

export interface SolarPanel {
  id: string;
  name: string;
  manufacturerId: string;
  vocSTC: number;
  vocNOCT?: number;
  temperatureCoefficientOfVOC: number;
  temperatureCoefficientOfISC: number;
  temperatureCoefficientOfPmax: number;
  impSTC: number;
  vmpSTC: number;
  iscSTC: number;
  impNOCT?: number;
  vmpNOCT?: number;
  iscNOCT?: number;
  createdAt: string;
  updatedAt: string;
}

export type ExtendedSolarPanel = Schema['SolarPanel']['type'] & {
  impNOCT?: number;
  vmpNOCT?: number;
  iscNOCT?: number;
}; 