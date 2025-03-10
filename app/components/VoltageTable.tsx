'use client';

import { Card, Table, TableHead, TableRow, TableCell, TableBody } from '@aws-amplify/ui-react';

interface VoltageTableProps {
  voltages: Array<{
    temperature: number;
    voltage: number;
  }>;
}

export default function VoltageTable({ voltages }: VoltageTableProps) {
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Температура (°C)</TableCell>
            <TableCell>Напряжение холостого хода (V)</TableCell>
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