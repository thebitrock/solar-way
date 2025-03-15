'use client';

import { Card, Table, TableHead, TableRow, TableCell, TableBody } from '@aws-amplify/ui-react';
import { translations } from '../i18n/translations';
import { useLanguage } from '../hooks/useLanguage';

interface VoltageTableProps {
  voltages: Array<{
    temperature: number;
    voltage: number;
    current: number;
    power: number;
  }>;
}

export default function VoltageTable({ voltages }: VoltageTableProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t.calculation.temperature}</TableCell>
            <TableCell>{t.calculation.openCircuitVoltage}</TableCell>
            <TableCell>{t.calculation.shortCircuitCurrent}</TableCell>
            <TableCell>{t.calculation.maximumPower}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {voltages.map(({ temperature, voltage, current, power }) => (
            <TableRow key={temperature}>
              <TableCell>{temperature}</TableCell>
              <TableCell>{voltage === 0 ? t.calculation.insufficientData : voltage.toFixed(2)}</TableCell>
              <TableCell>{current === 0 ? t.calculation.insufficientData : current.toFixed(2)}</TableCell>
              <TableCell>{power === 0 ? t.calculation.insufficientData : power.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 