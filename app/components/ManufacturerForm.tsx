'use client';

import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { Button, Card, Flex, Input, Label, Text } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

interface ManufacturerFormProps {
  manufacturer?: Schema['Manufacturer']['type'];
  mode: 'create' | 'update';
  onSuccess?: () => void;
}

export default function ManufacturerForm({ manufacturer, mode, onSuccess }: ManufacturerFormProps) {
  const [name, setName] = useState(manufacturer?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'create') {
        await client.models.Manufacturer.create({
          name,
        });
      } else if (manufacturer?.id) {
        await client.models.Manufacturer.update({
          id: manufacturer.id,
          name,
        });
      }
      setName('');
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
            <Label htmlFor="name">Название производителя</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            {mode === 'create' ? 'Создать производителя' : 'Обновить производителя'}
          </Button>
        </Flex>
      </form>
    </Card>
  );
} 