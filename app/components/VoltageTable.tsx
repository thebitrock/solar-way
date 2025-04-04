'use client';

import { Card, Table, TableHead, TableRow, TableCell, TableBody } from '@aws-amplify/ui-react';

interface VoltageData {
  temperature: number;
  voltage?: number;
  current?: number;
  power?: number;
  voltageNOCT?: number;
  currentNOCT?: number;
  powerNOCT?: number;
  voltageNMOT?: number;
  currentNMOT?: number;
  powerNMOT?: number;
}

interface VoltageTableTranslations {
  temperature: string;
  openCircuitVoltage: string;
  shortCircuitCurrent: string;
  maximumPower: string;
  totalPowerSTC: string;
  totalPowerNOCT: string;
  totalPowerNMOT: string;
  notProvided: string;
}

interface VoltageTableProps {
  voltages: VoltageData[];
  mpptMaxVDC: number;
  translations: VoltageTableTranslations;
}

export default function VoltageTable({ voltages, mpptMaxVDC, translations }: VoltageTableProps) {
  const getCellStyle = (voltage?: number) => {
    if (voltage === undefined) return undefined;
    return voltage > mpptMaxVDC ? { backgroundColor: '#ffebee' } : undefined;
  };

  const noctStyle = { backgroundColor: '#f1f8e9' };
  const nmotStyle = { backgroundColor: '#e3f2fd' };

  // Проверяем наличие данных для каждой характеристики
  const hasSTCData = voltages.some(v => v.voltage !== undefined || v.current !== undefined || v.power !== undefined);
  const hasNOCTData = voltages.some(v => v.voltageNOCT !== undefined || v.currentNOCT !== undefined || v.powerNOCT !== undefined);
  const hasNMOTData = voltages.some(v => v.voltageNMOT !== undefined || v.currentNMOT !== undefined || v.powerNMOT !== undefined);

  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{translations.temperature}</TableCell>
            {hasSTCData && (
              <>
                <TableCell>{translations.openCircuitVoltage} (STC)</TableCell>
                <TableCell>{translations.shortCircuitCurrent} (STC)</TableCell>
                <TableCell>{translations.maximumPower} (STC)</TableCell>
              </>
            )}
            {hasNOCTData && (
              <>
                <TableCell style={noctStyle}>{translations.openCircuitVoltage} (NOCT)</TableCell>
                <TableCell style={noctStyle}>{translations.shortCircuitCurrent} (NOCT)</TableCell>
                <TableCell style={noctStyle}>{translations.maximumPower} (NOCT)</TableCell>
              </>
            )}
            {hasNMOTData && (
              <>
                <TableCell style={nmotStyle}>{translations.openCircuitVoltage} (NMOT)</TableCell>
                <TableCell style={nmotStyle}>{translations.shortCircuitCurrent} (NMOT)</TableCell>
                <TableCell style={nmotStyle}>{translations.maximumPower} (NMOT)</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {voltages.map(({ temperature, voltage, current, power, voltageNOCT, currentNOCT, powerNOCT, voltageNMOT, currentNMOT, powerNMOT }) => (
            <TableRow key={temperature}>
              <TableCell>{temperature}°C</TableCell>
              {hasSTCData && (
                <>
                  <TableCell style={getCellStyle(voltage)}>
                    {voltage === undefined ? translations.notProvided : `${voltage.toFixed(2)}V`}
                  </TableCell>
                  <TableCell>
                    {current === undefined ? translations.notProvided : `${current.toFixed(2)}A`}
                  </TableCell>
                  <TableCell>
                    {power === undefined ? translations.notProvided : `${power.toFixed(2)}W`}
                  </TableCell>
                </>
              )}
              {hasNOCTData && (
                <>
                  <TableCell style={{ ...noctStyle, ...getCellStyle(voltageNOCT) }}>
                    {voltageNOCT === undefined ? translations.notProvided : `${voltageNOCT.toFixed(2)}V`}
                  </TableCell>
                  <TableCell style={noctStyle}>
                    {currentNOCT === undefined ? translations.notProvided : `${currentNOCT.toFixed(2)}A`}
                  </TableCell>
                  <TableCell style={noctStyle}>
                    {powerNOCT === undefined ? translations.notProvided : `${powerNOCT.toFixed(2)}W`}
                  </TableCell>
                </>
              )}
              {hasNMOTData && (
                <>
                  <TableCell style={{ ...nmotStyle, ...getCellStyle(voltageNMOT) }}>
                    {voltageNMOT === undefined ? translations.notProvided : `${voltageNMOT.toFixed(2)}V`}
                  </TableCell>
                  <TableCell style={nmotStyle}>
                    {currentNMOT === undefined ? translations.notProvided : `${currentNMOT.toFixed(2)}A`}
                  </TableCell>
                  <TableCell style={nmotStyle}>
                    {powerNMOT === undefined ? translations.notProvided : `${powerNMOT.toFixed(2)}W`}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 