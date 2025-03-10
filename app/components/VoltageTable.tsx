'use client';

import { Card, Table, TableHead, TableRow, TableCell, TableBody } from '@aws-amplify/ui-react';
import { translations } from '../i18n/translations';
import { useLanguage } from '../hooks/useLanguage';

interface VoltageTableProps {
  voltages: Array<{
    temperature: number;
    voltage: number;
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
          </TableRow>
        </TableHead>
        <TableBody>
          {voltages.map(({ temperature, voltage }) => (
            <TableRow key={temperature}>
              <TableCell>{temperature}</TableCell>
              <TableCell>{voltage.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 