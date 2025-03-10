'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { Button, Card, Flex, Input, Label, SelectField, Text } from '@aws-amplify/ui-react';
import { translations } from '../i18n/translations';
import { useLanguage } from '../hooks/useLanguage';

const client = generateClient<Schema>();

interface SolarPanelFormProps {
  solarPanel?: Schema['SolarPanel']['type'];
  mode: 'create' | 'update';
  onSuccess?: () => void;
}

export default function SolarPanelForm({ solarPanel, mode, onSuccess }: SolarPanelFormProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [name, setName] = useState(solarPanel?.name || '');
  const [vocSTC, setVocSTC] = useState(solarPanel?.vocSTC?.toString() || '');
  const [temperatureCoefficientOfVOC, setTemperatureCoefficientOfVOC] = useState(
    solarPanel?.temperatureCoefficientOfVOC?.toString() || ''
  );
  const [manufacturerId, setManufacturerId] = useState(solarPanel?.manufacturerId || '');
  const [manufacturers, setManufacturers] = useState<Array<Schema['Manufacturer']['type']>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscription = client.models.Manufacturer.observeQuery().subscribe({
      next: ({ items }) => setManufacturers(items),
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name.trim()) {
      setError(t.errors.required);
      return;
    }

    const vocSTCValue = parseFloat(vocSTC);
    if (isNaN(vocSTCValue)) {
      setError(t.errors.invalidNumber);
      return;
    }

    const tempCoeffValue = parseFloat(temperatureCoefficientOfVOC);
    if (isNaN(tempCoeffValue)) {
      setError(t.errors.invalidNumber);
      return;
    }

    try {
      if (mode === 'create') {
        await client.models.SolarPanel.create({
          name: name.trim(),
          vocSTC: vocSTCValue,
          temperatureCoefficientOfVOC: tempCoeffValue,
          manufacturerId: manufacturerId || ''
        });
      } else if (solarPanel?.id) {
        await client.models.SolarPanel.update({
          id: solarPanel.id,
          name: name.trim(),
          vocSTC: vocSTCValue,
          temperatureCoefficientOfVOC: tempCoeffValue,
          manufacturerId: manufacturerId || ''
        });
      }
      setName('');
      setVocSTC('');
      setTemperatureCoefficientOfVOC('');
      setManufacturerId('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="1rem">
          <div>
            <SelectField
              id="manufacturerId"
              label={t.solarPanels.manufacturer}
              value={manufacturerId}
              onChange={(e) => setManufacturerId(e.target.value)}
              data-1p-ignore
              required
            >
              <option value="">{t.solarPanels.chooseManufacturer}</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </option>
              ))}
            </SelectField>
          </div>

          <div>
            <Label htmlFor="name">{t.solarPanels.name}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-1p-ignore
              required
            />
          </div>

          <div>
            <Label htmlFor="vocSTC">{t.solarPanels.vocSTC}</Label>
            <Input
              id="vocSTC"
              type="number"
              step="0.01"
              value={vocSTC}
              onChange={(e) => setVocSTC(e.target.value)}
              data-1p-ignore
              required
            />
          </div>

          <div>
            <Label htmlFor="temperatureCoefficientOfVOC">{t.solarPanels.temperatureCoefficient}</Label>
            <Input
              id="temperatureCoefficientOfVOC"
              type="number"
              step="0.01"
              value={temperatureCoefficientOfVOC}
              onChange={(e) => setTemperatureCoefficientOfVOC(e.target.value)}
              data-1p-ignore
              required
            />
          </div>

          {error && (
            <Text color="red">{error}</Text>
          )}

          <Flex gap="1rem" justifyContent="flex-end">
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText={mode === 'create' ? t.solarPanels.creating : t.solarPanels.updating}
            >
              {mode === 'create' ? t.solarPanels.create : t.solarPanels.update}
            </Button>
            <Button type="button" onClick={onSuccess}>
              {t.solarPanels.cancel}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
} 