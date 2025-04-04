'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { Button, Card, Flex, Input, Label, SelectField, Text } from '@aws-amplify/ui-react';
import { useTranslation } from '../hooks/useTranslation';
import { Schema } from '@/amplify/data/resource';
import { SolarPanelFormProps, PanelCharacteristicsInput } from './SolarPanelForm';

function CharacteristicsForm({ 
  characteristics, 
  onChange, 
  t 
}: { 
  characteristics: PanelCharacteristicsInput; 
  onChange: (value: PanelCharacteristicsInput) => void; 
  t: (key: string) => string; 
}) {
  return (
    <Flex direction="column" gap="1rem">
      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="maximumPower">{t('solarPanels.maximumPower')}</Label>
        <Input
          id="maximumPower"
          type="number"
          value={characteristics.maximumPower}
          onChange={(e) => onChange({ ...characteristics, maximumPower: e.target.value })}
          placeholder={t('solarPanels.maximumPowerPlaceholder')}
        />
      </Flex>
      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="openCircuitVoltage">{t('solarPanels.openCircuitVoltage')}</Label>
        <Input
          id="openCircuitVoltage"
          type="number"
          value={characteristics.openCircuitVoltage}
          onChange={(e) => onChange({ ...characteristics, openCircuitVoltage: e.target.value })}
          placeholder={t('solarPanels.openCircuitVoltagePlaceholder')}
        />
      </Flex>
      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="shortCircuitCurrent">{t('solarPanels.shortCircuitCurrent')}</Label>
        <Input
          id="shortCircuitCurrent"
          type="number"
          value={characteristics.shortCircuitCurrent}
          onChange={(e) => onChange({ ...characteristics, shortCircuitCurrent: e.target.value })}
          placeholder={t('solarPanels.shortCircuitCurrentPlaceholder')}
        />
      </Flex>
      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="voltageAtMaximumPower">{t('solarPanels.voltageAtMaximumPower')}</Label>
        <Input
          id="voltageAtMaximumPower"
          type="number"
          value={characteristics.voltageAtMaximumPower}
          onChange={(e) => onChange({ ...characteristics, voltageAtMaximumPower: e.target.value })}
          placeholder={t('solarPanels.voltageAtMaximumPowerPlaceholder')}
        />
      </Flex>
      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="currentAtMaximumPower">{t('solarPanels.currentAtMaximumPower')}</Label>
        <Input
          id="currentAtMaximumPower"
          type="number"
          value={characteristics.currentAtMaximumPower}
          onChange={(e) => onChange({ ...characteristics, currentAtMaximumPower: e.target.value })}
          placeholder={t('solarPanels.currentAtMaximumPowerPlaceholder')}
        />
      </Flex>
    </Flex>
  );
}

const emptyCharacteristics: PanelCharacteristicsInput = {
  maximumPower: '',
  openCircuitVoltage: '',
  shortCircuitCurrent: '',
  voltageAtMaximumPower: '',
  currentAtMaximumPower: '',
};

export default function SolarPanelFormClient({ solarPanel, onSuccess }: SolarPanelFormProps) {
  const t = useTranslation();
  const client = generateClient<Schema>();

  const [name, setName] = useState(solarPanel?.name || '');
  const [manufacturerId, setManufacturerId] = useState(solarPanel?.manufacturerId || '');
  const [temperatureCoefficientOfVOC, setTemperatureCoefficientOfVOC] = useState(
    solarPanel?.temperatureCoefficientOfVOC?.toString() || '0'
  );
  const [temperatureCoefficientOfISC, setTemperatureCoefficientOfISC] = useState(
    solarPanel?.temperatureCoefficientOfISC?.toString() || '0'
  );
  const [temperatureCoefficientOfPmax, setTemperatureCoefficientOfPmax] = useState(
    solarPanel?.temperatureCoefficientOfPmax?.toString() || '0'
  );
  const [manufacturers, setManufacturers] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('stc');
  const [isLoading, setIsLoading] = useState(true);

  const [characteristics, setCharacteristics] = useState<{
    stc: PanelCharacteristicsInput;
    noct: PanelCharacteristicsInput;
    nmot: PanelCharacteristicsInput;
  }>({
    stc: { ...emptyCharacteristics },
    noct: { ...emptyCharacteristics },
    nmot: { ...emptyCharacteristics },
  });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);

        // Загружаем производителей
        const manufacturersResult = await client.models.Manufacturer.list();
        if (!mounted) return;
        
        if (manufacturersResult.data) {
          setManufacturers(manufacturersResult.data);
        }

        // Если редактируем панель, загружаем характеристики
        if (solarPanel?.id) {
          const characteristicsResult = await client.models.PanelCharacteristics.list({
            filter: { solarPanelId: { eq: solarPanel.id } }
          });

          if (!mounted) return;

          if (characteristicsResult.data) {
            const newCharacteristics = { ...characteristics };

            characteristicsResult.data.forEach((char: any) => {
              const data = {
                maximumPower: char.maximumPower.toString(),
                openCircuitVoltage: char.openCircuitVoltage.toString(),
                shortCircuitCurrent: char.shortCircuitCurrent.toString(),
                voltageAtMaximumPower: char.voltageAtMaximumPower.toString(),
                currentAtMaximumPower: char.currentAtMaximumPower.toString(),
              };

              switch (char.type) {
                case 'STC':
                  newCharacteristics.stc = data;
                  break;
                case 'NOCT':
                  newCharacteristics.noct = data;
                  break;
                case 'NMOT':
                  newCharacteristics.nmot = data;
                  break;
              }
            });

            setCharacteristics(newCharacteristics);
          }
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error loading data:', error);
        setError(t('errors.unknown'));
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async () => {
    try {
      setError('');

      if (!name.trim()) {
        setError(t('errors.required'));
        return;
      }

      if (!manufacturerId) {
        setError(t('errors.required'));
        return;
      }

      // Проверяем, что хотя бы одна характеристика заполнена полностью
      const hasStc = Object.values(characteristics.stc).every(value => value !== '');
      const hasNoct = Object.values(characteristics.noct).every(value => value !== '');
      const hasNmot = Object.values(characteristics.nmot).every(value => value !== '');

      if (!hasStc && !hasNoct && !hasNmot) {
        setError(t('errors.characteristicsRequired'));
        return;
      }

      // Создаем или обновляем панель
      const panelData = {
        name,
        manufacturerId,
        temperatureCoefficientOfVOC: parseFloat(temperatureCoefficientOfVOC),
        temperatureCoefficientOfISC: parseFloat(temperatureCoefficientOfISC),
        temperatureCoefficientOfPmax: parseFloat(temperatureCoefficientOfPmax),
      };

      let panelId: string;

      if (solarPanel?.id) {
        // Обновляем существующую панель
        const result = await client.models.SolarPanel.update({
          id: solarPanel.id,
          ...panelData,
        });
        if (!result.data) throw new Error('Failed to update panel');
        panelId = solarPanel.id;

        // Удаляем все существующие характеристики
        const existingCharacteristics = await client.models.PanelCharacteristics.list({
          filter: { solarPanelId: { eq: panelId } }
        });

        if (existingCharacteristics.data) {
          await Promise.all(
            existingCharacteristics.data.map(char => 
              client.models.PanelCharacteristics.delete({ id: char.id })
            )
          );
        }
      } else {
        // Создаем новую панель
        const result = await client.models.SolarPanel.create(panelData);
        if (!result.data) throw new Error('Failed to create panel');
        panelId = result.data.id;
      }

      // Создаем новые характеристики
      const createCharacteristics = [];

      if (hasStc) {
        createCharacteristics.push(
          client.models.PanelCharacteristics.create({
            solarPanelId: panelId,
            type: 'STC',
            maximumPower: parseFloat(characteristics.stc.maximumPower),
            openCircuitVoltage: parseFloat(characteristics.stc.openCircuitVoltage),
            shortCircuitCurrent: parseFloat(characteristics.stc.shortCircuitCurrent),
            voltageAtMaximumPower: parseFloat(characteristics.stc.voltageAtMaximumPower),
            currentAtMaximumPower: parseFloat(characteristics.stc.currentAtMaximumPower),
          })
        );
      }

      if (hasNoct) {
        createCharacteristics.push(
          client.models.PanelCharacteristics.create({
            solarPanelId: panelId,
            type: 'NOCT',
            maximumPower: parseFloat(characteristics.noct.maximumPower),
            openCircuitVoltage: parseFloat(characteristics.noct.openCircuitVoltage),
            shortCircuitCurrent: parseFloat(characteristics.noct.shortCircuitCurrent),
            voltageAtMaximumPower: parseFloat(characteristics.noct.voltageAtMaximumPower),
            currentAtMaximumPower: parseFloat(characteristics.noct.currentAtMaximumPower),
          })
        );
      }

      if (hasNmot) {
        createCharacteristics.push(
          client.models.PanelCharacteristics.create({
            solarPanelId: panelId,
            type: 'NMOT',
            maximumPower: parseFloat(characteristics.nmot.maximumPower),
            openCircuitVoltage: parseFloat(characteristics.nmot.openCircuitVoltage),
            shortCircuitCurrent: parseFloat(characteristics.nmot.shortCircuitCurrent),
            voltageAtMaximumPower: parseFloat(characteristics.nmot.voltageAtMaximumPower),
            currentAtMaximumPower: parseFloat(characteristics.nmot.currentAtMaximumPower),
          })
        );
      }

      await Promise.all(createCharacteristics);
      onSuccess();
    } catch (error) {
      console.error('Error saving panel:', error);
      setError(t('errors.unknown'));
    }
  };

  const handleCharacteristicsChange = (type: 'stc' | 'noct' | 'nmot', value: PanelCharacteristicsInput) => {
    setCharacteristics(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <Card>
      {isLoading ? (
        <Text>{t('common.loading')}</Text>
      ) : (
        <Flex direction="column" gap="1rem">
          <Text>{solarPanel ? t('solarPanels.update') : t('solarPanels.create')}</Text>
          
          <Flex direction="column" gap="0.5rem">
            <Label>{t('solarPanels.name')}</Label>
            <Input
              placeholder={t('solarPanels.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Flex>

          <SelectField
            label={t('solarPanels.selectManufacturer')}
            value={manufacturerId}
            onChange={(e) => setManufacturerId(e.target.value)}
          >
            <option value="">{t('solarPanels.chooseManufacturer')}</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </option>
            ))}
          </SelectField>

          <Flex direction="column" gap="0.5rem">
            <Label>{t('solarPanels.temperatureCoefficientOfVOC')}</Label>
            <Input
              type="number"
              placeholder={t('solarPanels.temperatureCoefficientOfVOCPlaceholder')}
              value={temperatureCoefficientOfVOC}
              onChange={(e) => setTemperatureCoefficientOfVOC(e.target.value)}
            />
          </Flex>

          <Flex direction="column" gap="0.5rem">
            <Label>{t('solarPanels.temperatureCoefficientOfISC')}</Label>
            <Input
              type="number"
              placeholder={t('solarPanels.temperatureCoefficientOfISCPlaceholder')}
              value={temperatureCoefficientOfISC}
              onChange={(e) => setTemperatureCoefficientOfISC(e.target.value)}
            />
          </Flex>

          <Flex direction="column" gap="0.5rem">
            <Label>{t('solarPanels.temperatureCoefficientOfPmax')}</Label>
            <Input
              type="number"
              placeholder={t('solarPanels.temperatureCoefficientOfPmaxPlaceholder')}
              value={temperatureCoefficientOfPmax}
              onChange={(e) => setTemperatureCoefficientOfPmax(e.target.value)}
            />
          </Flex>

          <Flex direction="column" gap="1rem">
            <Flex gap="1rem">
              <Button
                onClick={() => setActiveTab('stc')}
                variation="primary"
                backgroundColor={activeTab === 'stc' ? undefined : '#f0f0f0'}
                color={activeTab === 'stc' ? undefined : '#000000'}
              >
                {t('solarPanels.characteristics.stc')}
              </Button>
              <Button
                onClick={() => setActiveTab('noct')}
                variation="primary"
                backgroundColor={activeTab === 'noct' ? undefined : '#f0f0f0'}
                color={activeTab === 'noct' ? undefined : '#000000'}
              >
                {t('solarPanels.characteristics.noct')}
              </Button>
              <Button
                onClick={() => setActiveTab('nmot')}
                variation="primary"
                backgroundColor={activeTab === 'nmot' ? undefined : '#f0f0f0'}
                color={activeTab === 'nmot' ? undefined : '#000000'}
              >
                {t('solarPanels.characteristics.nmot')}
              </Button>
            </Flex>

            {activeTab === 'stc' && (
              <CharacteristicsForm
                characteristics={characteristics.stc}
                onChange={(value) => handleCharacteristicsChange('stc', value)}
                t={t}
              />
            )}
            {activeTab === 'noct' && (
              <CharacteristicsForm
                characteristics={characteristics.noct}
                onChange={(value) => handleCharacteristicsChange('noct', value)}
                t={t}
              />
            )}
            {activeTab === 'nmot' && (
              <CharacteristicsForm
                characteristics={characteristics.nmot}
                onChange={(value) => handleCharacteristicsChange('nmot', value)}
                t={t}
              />
            )}
          </Flex>

          {error && <Text color="red">{error}</Text>}

          <Flex gap="1rem">
            <Button onClick={handleSubmit}>
              {solarPanel ? t('solarPanels.update') : t('solarPanels.create')}
            </Button>
            <Button onClick={onSuccess}>{t('solarPanels.cancel')}</Button>
          </Flex>
        </Flex>
      )}
    </Card>
  );
} 