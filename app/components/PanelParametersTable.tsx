import React from 'react';
import { Text } from '@aws-amplify/ui-react';
import { type PanelCharacteristics } from '@/app/types';

interface PanelParametersTableProps {
  characteristics: PanelCharacteristics[];
  t: (key: string) => string;
}

const PanelParametersTable: React.FC<PanelParametersTableProps> = ({ characteristics, t }) => {
  const stc = characteristics.find(c => c.type === 'STC');
  const noct = characteristics.find(c => c.type === 'NOCT');
  const nmot = characteristics.find(c => c.type === 'NMOT');

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-left">{t('calculation.characteristics.parameters')}</th>
            <th className="p-2 border text-center">{t('calculation.characteristics.stc')}</th>
            <th className="p-2 border text-center">{t('calculation.characteristics.noct')}</th>
            <th className="p-2 border text-center">{t('calculation.characteristics.nmot')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border font-semibold">{t('calculation.characteristics.voc')}</td>
            <td className="p-2 border text-center">{stc?.openCircuitVoltage ? `${stc.openCircuitVoltage}` : '-'}</td>
            <td className="p-2 border text-center">{noct?.openCircuitVoltage ? `${noct.openCircuitVoltage}` : '-'}</td>
            <td className="p-2 border text-center">{nmot?.openCircuitVoltage ? `${nmot.openCircuitVoltage}` : '-'}</td>
          </tr>
          <tr>
            <td className="p-2 border font-semibold">{t('calculation.characteristics.isc')}</td>
            <td className="p-2 border text-center">{stc?.shortCircuitCurrent ? `${stc.shortCircuitCurrent}` : '-'}</td>
            <td className="p-2 border text-center">{noct?.shortCircuitCurrent ? `${noct.shortCircuitCurrent}` : '-'}</td>
            <td className="p-2 border text-center">{nmot?.shortCircuitCurrent ? `${nmot.shortCircuitCurrent}` : '-'}</td>
          </tr>
          <tr>
            <td className="p-2 border font-semibold">{t('calculation.characteristics.vmp')}</td>
            <td className="p-2 border text-center">{stc?.voltageAtMaximumPower ? `${stc.voltageAtMaximumPower}` : '-'}</td>
            <td className="p-2 border text-center">{noct?.voltageAtMaximumPower ? `${noct.voltageAtMaximumPower}` : '-'}</td>
            <td className="p-2 border text-center">{nmot?.voltageAtMaximumPower ? `${nmot.voltageAtMaximumPower}` : '-'}</td>
          </tr>
          <tr>
            <td className="p-2 border font-semibold">{t('calculation.characteristics.imp')}</td>
            <td className="p-2 border text-center">{stc?.currentAtMaximumPower ? `${stc.currentAtMaximumPower}` : '-'}</td>
            <td className="p-2 border text-center">{noct?.currentAtMaximumPower ? `${noct.currentAtMaximumPower}` : '-'}</td>
            <td className="p-2 border text-center">{nmot?.currentAtMaximumPower ? `${nmot.currentAtMaximumPower}` : '-'}</td>
          </tr>
          <tr>
            <td className="p-2 border font-semibold">{t('calculation.characteristics.pmax')}</td>
            <td className="p-2 border text-center">{stc?.maximumPower ? `${stc.maximumPower}` : '-'}</td>
            <td className="p-2 border text-center">{noct?.maximumPower ? `${noct.maximumPower}` : '-'}</td>
            <td className="p-2 border text-center">{nmot?.maximumPower ? `${nmot.maximumPower}` : '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PanelParametersTable; 