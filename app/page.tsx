"use client";

import '@aws-amplify/ui-react/styles.css';
import '@aws-amplify/ui-react/styles/reset.layer.css' // global CSS reset
import '@aws-amplify/ui-react/styles/base.layer.css' // base styling needed for Amplify UI
import '@aws-amplify/ui-react/styles/button.layer.css' // component specific
import '@aws-amplify/ui-react/styles/card.layer.css' // component specific
import '@aws-amplify/ui-react/styles/flex.layer.css' // component specific
import '@aws-amplify/ui-react/styles/grid.layer.css' // component specific
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import ManufacturerForm from './components/ManufacturerForm';
import SolarPanelForm from './components/SolarPanelForm';
import { Button, Card, Flex, Grid, Text } from '@aws-amplify/ui-react';
// import { ManufacturerSelectField } from './components/ManufacturerSelectField';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'update'>('create');
  const [activeEntity, setActiveEntity] = useState<'manufacturer' | 'solarPanel'>('manufacturer');
  const [selectedManufacturer, setSelectedManufacturer] = useState<Schema['Manufacturer']['type'] | null>(null);
  const [selectedSolarPanel, setSelectedSolarPanel] = useState<Schema['SolarPanel']['type'] | null>(null);
  const [manufacturers, setManufacturers] = useState<Array<Schema['Manufacturer']['type']>>([]);
  const [solarPanels, setSolarPanels] = useState<Array<Schema['SolarPanel']['type']>>([]);

  // Загрузка данных
  useEffect(() => {
    const manufacturerSubscription = client.models.Manufacturer.observeQuery().subscribe({
      next: ({ items }) => setManufacturers(items),
    });

    const solarPanelSubscription = client.models.SolarPanel.observeQuery().subscribe({
      next: ({ items }) => setSolarPanels(items),
    });

    return () => {
      manufacturerSubscription.unsubscribe();
      solarPanelSubscription.unsubscribe();
    };
  }, []);

  const handleDeleteManufacturer = async (id: string) => {
    try {
      await client.models.Manufacturer.delete({ id });
    } catch (error) {
      console.error('Error deleting manufacturer:', error);
    }
  };

  const handleDeleteSolarPanel = async (id: string) => {
    try {
      await client.models.SolarPanel.delete({ id });
    } catch (error) {
      console.error('Error deleting solar panel:', error);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Управление солнечными панелями и производителями</h1>
        
        {/* Табы для переключения между созданием и обновлением */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'create'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => {
              setActiveTab('create');
              setSelectedManufacturer(null);
              setSelectedSolarPanel(null);
            }}
          >
            Создать
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'update'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('update')}
          >
            Обновить
          </button>
        </div>

        {/* Табы для переключения между сущностями */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeEntity === 'manufacturer'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveEntity('manufacturer')}
          >
            Производитель
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeEntity === 'solarPanel'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveEntity('solarPanel')}
          >
            Солнечная панель
          </button>
        </div>

        {/* Формы */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          {activeTab === 'create' ? (
            activeEntity === 'manufacturer' ? (
              <ManufacturerForm mode="create" />
            ) : (
              <SolarPanelForm mode="create" />
            )
          ) : (
            activeEntity === 'manufacturer' ? (
              <ManufacturerForm 
                mode="update" 
                manufacturer={selectedManufacturer || undefined}
              />
            ) : (
              <SolarPanelForm 
                mode="update" 
                solarPanel={selectedSolarPanel || undefined}
              />
            )
          )}
        </div>

        {/* Списки */}
        <Grid columnGap="1rem" rowGap="1rem">
          {activeEntity === 'manufacturer' ? (
            <Card>
              <h2 className="text-xl font-bold mb-4">Список производителей</h2>
              <Flex direction="column" gap="1rem">
                {manufacturers.map((manufacturer) => (
                  <Flex key={manufacturer.id} justifyContent="space-between" alignItems="center">
                    <Text>{manufacturer.name}</Text>
                    <Flex gap="1rem">
                      <Button
                        onClick={() => setSelectedManufacturer(manufacturer)}
                        isDisabled={activeTab !== 'update'}
                      >
                        Редактировать
                      </Button>
                      <Button
                        onClick={() => handleDeleteManufacturer(manufacturer.id)}
                        variation="destructive"
                      >
                        Удалить
                      </Button>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Card>
          ) : (
            <Card>
              <h2 className="text-xl font-bold mb-4">Список солнечных панелей</h2>
              <Flex direction="column" gap="1rem">
                {solarPanels.map((panel) => (
                  <Flex key={panel.id} justifyContent="space-between" alignItems="center">
                    <div>
                      <Text>{panel.name}</Text>
                      <Text fontSize="small" color="gray">
                        {manufacturers.find(m => m.id === panel.manufacturerId)?.name}
                      </Text>
                    </div>
                    <Flex gap="1rem">
                      <Button
                        onClick={() => setSelectedSolarPanel(panel)}
                        isDisabled={activeTab !== 'update'}
                      >
                        Редактировать
                      </Button>
                      <Button
                        onClick={() => handleDeleteSolarPanel(panel.id)}
                        variation="destructive"
                      >
                        Удалить
                      </Button>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Card>
          )}
        </Grid>
      </div>
    </main>
  );
}