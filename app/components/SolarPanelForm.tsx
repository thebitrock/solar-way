'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { Button, Card, Flex, Input, Label, SelectField, Text } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

interface SolarPanelFormProps {
  solarPanel?: Schema['SolarPanel']['type'];
  mode: 'create' | 'update';
  onSuccess?: () => void;
}

export default function SolarPanelForm({ solarPanel, mode, onSuccess }: SolarPanelFormProps) {
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

    try {
      if (mode === 'create') {
        await client.models.SolarPanel.create({
          name,
          vocSTC: parseFloat(vocSTC),
          temperatureCoefficientOfVOC: parseFloat(temperatureCoefficientOfVOC),
          manufacturerId,
        });
      } else if (solarPanel?.id) {
        await client.models.SolarPanel.update({
          id: solarPanel.id,
          name,
          vocSTC: parseFloat(vocSTC),
          temperatureCoefficientOfVOC: parseFloat(temperatureCoefficientOfVOC),
          manufacturerId,
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
              label="Производитель"
              value={manufacturerId}
              onChange={(e) => setManufacturerId(e.target.value)}
              data-1p-ignore
              required
            >
              <option value="">Выберите производителя</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </option>
              ))}
            </SelectField>
          </div>

          <div>
            <Label htmlFor="name">Название модели</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-1p-ignore
              required
            />
          </div>

          <div>
            <Label htmlFor="vocSTC">Voc STC (V)</Label>
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
            <Label htmlFor="temperatureCoefficientOfVOC">
              Температурный коэффициент Voc (%/°C)
            </Label>
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

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText={mode === 'create' ? 'Создание...' : 'Обновление...'}
          >
            {mode === 'create' ? 'Создать солнечную панель' : 'Обновить солнечную панель'}
          </Button>
        </Flex>
      </form>
    </Card>
  );
} 