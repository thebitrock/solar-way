'use client';

import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { Button, Card, Flex, Input, Label, Text } from '@aws-amplify/ui-react';
import { useTranslation } from '../hooks/useTranslation';
import { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

type ManufacturerInput = {
  name: string;
};

interface ManufacturerFormProps {
  manufacturer?: ManufacturerInput & { id: string };
  mode: 'create' | 'update';
  onSuccess?: () => void;
}

export default function ManufacturerForm({ manufacturer, mode, onSuccess }: ManufacturerFormProps) {
  const t = useTranslation();
  const [name, setName] = useState(manufacturer?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name.trim()) {
      setError(t('errors.required'));
      return;
    }

    try {
      if (mode === 'create') {
        await client.models.Manufacturer.create({
          name: name.trim()
        });
      } else if (manufacturer?.id) {
        await client.models.Manufacturer.update({
          id: manufacturer.id,
          name: name.trim()
        });
      }
      setName('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="1rem">
          <div>
            <Label htmlFor="name">{t('manufacturers.name')} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-1p-ignore
              required
              placeholder={t('manufacturers.namePlaceholder')}
            />
          </div>

          {error && (
            <Text color="red">{error}</Text>
          )}

          <Flex gap="1rem" justifyContent="flex-end">
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText={mode === 'create' ? t('manufacturers.creating') : t('manufacturers.updating')}
            >
              {mode === 'create' ? t('manufacturers.create') : t('manufacturers.update')}
            </Button>
            <Button type="button" onClick={onSuccess}>
              {t('manufacturers.cancel')}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
} 