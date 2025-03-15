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
  const [temperatureCoefficientOfISC, setTemperatureCoefficientOfISC] = useState(
    solarPanel?.temperatureCoefficientOfISC?.toString() || ''
  );
  const [temperatureCoefficientOfPmax, setTemperatureCoefficientOfPmax] = useState(
    solarPanel?.temperatureCoefficientOfPmax?.toString() || ''
  );
  const [impSTC, setImpSTC] = useState(solarPanel?.impSTC?.toString() || '');
  const [vmpSTC, setVmpSTC] = useState(solarPanel?.vmpSTC?.toString() || '');
  const [iscSTC, setIscSTC] = useState(solarPanel?.iscSTC?.toString() || '');
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

    const tempCoeffVOCValue = parseFloat(temperatureCoefficientOfVOC);
    if (isNaN(tempCoeffVOCValue)) {
      setError(t.errors.invalidNumber);
      return;
    }

    const tempCoeffISCValue = temperatureCoefficientOfISC ? parseFloat(temperatureCoefficientOfISC) : undefined;
    if (temperatureCoefficientOfISC && isNaN(tempCoeffISCValue!)) {
      setError(t.errors.invalidNumber);
      return;
    }

    const tempCoeffPmaxValue = temperatureCoefficientOfPmax ? parseFloat(temperatureCoefficientOfPmax) : undefined;
    if (temperatureCoefficientOfPmax && isNaN(tempCoeffPmaxValue!)) {
      setError(t.errors.invalidNumber);
      return;
    }

    const impSTCValue = impSTC ? parseFloat(impSTC) : undefined;
    if (impSTC && isNaN(impSTCValue!)) {
      setError(t.errors.invalidNumber);
      return;
    }

    const vmpSTCValue = vmpSTC ? parseFloat(vmpSTC) : undefined;
    if (vmpSTC && isNaN(vmpSTCValue!)) {
      setError(t.errors.invalidNumber);
      return;
    }

    const iscSTCValue = iscSTC ? parseFloat(iscSTC) : undefined;
    if (iscSTC && isNaN(iscSTCValue!)) {
      setError(t.errors.invalidNumber);
      return;
    }

    try {
      if (mode === 'create') {
        await client.models.SolarPanel.create({
          name: name.trim(),
          vocSTC: vocSTCValue,
          temperatureCoefficientOfVOC: tempCoeffVOCValue,
          manufacturerId: manufacturerId || '',
          ...(tempCoeffISCValue !== undefined && { temperatureCoefficientOfISC: tempCoeffISCValue }),
          ...(tempCoeffPmaxValue !== undefined && { temperatureCoefficientOfPmax: tempCoeffPmaxValue }),
          ...(impSTCValue !== undefined && { impSTC: impSTCValue }),
          ...(vmpSTCValue !== undefined && { vmpSTC: vmpSTCValue }),
          ...(iscSTCValue !== undefined && { iscSTC: iscSTCValue })
        });
      } else if (solarPanel?.id) {
        await client.models.SolarPanel.update({
          id: solarPanel.id,
          name: name.trim(),
          vocSTC: vocSTCValue,
          temperatureCoefficientOfVOC: tempCoeffVOCValue,
          manufacturerId: manufacturerId || '',
          ...(tempCoeffISCValue !== undefined && { temperatureCoefficientOfISC: tempCoeffISCValue }),
          ...(tempCoeffPmaxValue !== undefined && { temperatureCoefficientOfPmax: tempCoeffPmaxValue }),
          ...(impSTCValue !== undefined && { impSTC: impSTCValue }),
          ...(vmpSTCValue !== undefined && { vmpSTC: vmpSTCValue }),
          ...(iscSTCValue !== undefined && { iscSTC: iscSTCValue })
        });
      }
      setName('');
      setVocSTC('');
      setTemperatureCoefficientOfVOC('');
      setTemperatureCoefficientOfISC('');
      setTemperatureCoefficientOfPmax('');
      setImpSTC('');
      setVmpSTC('');
      setIscSTC('');
      setManufacturerId('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.required);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="1rem">
          <Text fontSize="small" color="gray">
            {t.solarPanels.datasheetInfo}
          </Text>
          <Text fontSize="small" color="gray">
            {t.calculation.requiredField}
          </Text>

          <div>
            <SelectField
              id="manufacturerId"
              label={`${t.solarPanels.manufacturer} *`}
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
            <Label htmlFor="name">{t.solarPanels.name} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-1p-ignore
              required
              placeholder={t.solarPanels.namePlaceholder}
            />
          </div>

          <div>
            <Label htmlFor="vocSTC">{t.solarPanels.vocSTC} *</Label>
            <Input
              id="vocSTC"
              type="number"
              step="0.01"
              value={vocSTC}
              onChange={(e) => setVocSTC(e.target.value)}
              data-1p-ignore
              required
              placeholder={t.solarPanels.vocSTCPlaceholder}
            />
          </div>

          <div>
            <Label htmlFor="temperatureCoefficientOfVOC">{t.solarPanels.temperatureCoefficient} *</Label>
            <Input
              id="temperatureCoefficientOfVOC"
              type="number"
              step="0.01"
              value={temperatureCoefficientOfVOC}
              onChange={(e) => setTemperatureCoefficientOfVOC(e.target.value)}
              data-1p-ignore
              required
              placeholder={t.solarPanels.temperatureCoefficientPlaceholder}
            />
          </div>

          <div>
            <Label htmlFor="temperatureCoefficientOfISC">{t.solarPanels.temperatureCoefficientISC}</Label>
            <Input
              id="temperatureCoefficientOfISC"
              type="number"
              step="0.01"
              value={temperatureCoefficientOfISC}
              onChange={(e) => setTemperatureCoefficientOfISC(e.target.value)}
              data-1p-ignore
              placeholder={t.solarPanels.temperatureCoefficientISCPlaceholder}
            />
          </div>

          <div>
            <Label htmlFor="temperatureCoefficientOfPmax">{t.solarPanels.temperatureCoefficientPmax}</Label>
            <Input
              id="temperatureCoefficientOfPmax"
              type="number"
              step="0.01"
              value={temperatureCoefficientOfPmax}
              onChange={(e) => setTemperatureCoefficientOfPmax(e.target.value)}
              data-1p-ignore
              placeholder={t.solarPanels.temperatureCoefficientPmaxPlaceholder}
            />
          </div>

          <div>
            <Label htmlFor="impSTC">{t.solarPanels.impSTC}</Label>
            <Input
              id="impSTC"
              type="number"
              step="0.01"
              value={impSTC}
              onChange={(e) => setImpSTC(e.target.value)}
              data-1p-ignore
              placeholder={t.solarPanels.impSTCPlaceholder}
            />
          </div>

          <div>
            <Label htmlFor="vmpSTC">{t.solarPanels.vmpSTC}</Label>
            <Input
              id="vmpSTC"
              type="number"
              step="0.01"
              value={vmpSTC}
              onChange={(e) => setVmpSTC(e.target.value)}
              data-1p-ignore
              placeholder={t.solarPanels.vmpSTCPlaceholder}
            />
          </div>

          <div>
            <Label htmlFor="iscSTC">{t.solarPanels.iscSTC}</Label>
            <Input
              id="iscSTC"
              type="number"
              step="0.01"
              value={iscSTC}
              onChange={(e) => setIscSTC(e.target.value)}
              data-1p-ignore
              placeholder={t.solarPanels.iscSTCPlaceholder}
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