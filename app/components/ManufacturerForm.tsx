'use client';

import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { Button, TextField, Flex } from '@aws-amplify/ui-react';
import { translations } from '../i18n/translations';
import { useLanguage } from '../hooks/useLanguage';

const client = generateClient<Schema>();

interface ManufacturerFormProps {
  mode: 'create' | 'update';
  manufacturer?: Schema['Manufacturer']['type'];
  onSuccess: () => void;
}

export default function ManufacturerForm({ mode, manufacturer, onSuccess }: ManufacturerFormProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [name, setName] = useState(manufacturer?.name || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(t.errors.required);
      return;
    }

    try {
      if (mode === 'create') {
        await client.models.Manufacturer.create({
          name: name.trim()
        });
      } else if (manufacturer) {
        await client.models.Manufacturer.update({
          id: manufacturer.id,
          name: name.trim()
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving manufacturer:', error);
      setError('An error occurred while saving');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="1rem">
        <TextField
          label={t.manufacturers.name}
          placeholder={t.manufacturers.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          errorMessage={error}
        />
        <Flex gap="1rem" justifyContent="flex-end">
          <Button type="submit">
            {t.solarPanels.submit}
          </Button>
          <Button type="button" onClick={onSuccess}>
            {t.solarPanels.cancel}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
} 