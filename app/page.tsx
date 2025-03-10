"use client";

import '@aws-amplify/ui-react/styles.css';
import '@aws-amplify/ui-react/styles/reset.layer.css' // global CSS reset
import '@aws-amplify/ui-react/styles/base.layer.css' // base styling needed for Amplify UI
import '@aws-amplify/ui-react/styles/button.layer.css' // component specific
import '@aws-amplify/ui-react/styles/card.layer.css' // component specific
import '@aws-amplify/ui-react/styles/flex.layer.css' // component specific
import '@aws-amplify/ui-react/styles/grid.layer.css' // component specific
import '@aws-amplify/ui-react/styles/table.layer.css';
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import ManufacturerForm from './components/ManufacturerForm';
import SolarPanelForm from './components/SolarPanelForm';
import Modal from './components/Modal';
import Autocomplete from './components/Autocomplete';
import VoltageTable from './components/VoltageTable';
import { Button, Card, Flex, Grid, Text, Input, Label } from '@aws-amplify/ui-react';
// import { ManufacturerSelectField } from './components/ManufacturerSelectField';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Home() {
  const [activeTab, setActiveTab] = useState<'calculation' | 'manufacturers' | 'solarPanels'>('calculation');
  const [selectedManufacturer, setSelectedManufacturer] = useState<Schema['Manufacturer']['type'] | null>(null);
  const [selectedSolarPanel, setSelectedSolarPanel] = useState<Schema['SolarPanel']['type'] | null>(null);
  const [manufacturers, setManufacturers] = useState<Array<Schema['Manufacturer']['type']>>([]);
  const [solarPanels, setSolarPanels] = useState<Array<Schema['SolarPanel']['type']>>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingManufacturer, setIsAddingManufacturer] = useState(false);
  const [panelCount, setPanelCount] = useState<number>(1);
  const [calculatedVoltages, setCalculatedVoltages] = useState<Array<{ temperature: number; voltage: number }>>([]);

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

  // Расчет напряжений при изменении панели или количества
  useEffect(() => {
    if (!selectedSolarPanel) return;

    const voltages = [];
    const { vocSTC, temperatureCoefficientOfVOC } = selectedSolarPanel;
    
    // Расчет для температур от -30 до +25
    for (let temp = -30; temp <= 25; temp++) {
      // Формула: Voc(T) = Voc(STC) * (1 + α * (T - 25))
      // где α - температурный коэффициент в %/°C
      const voltage = vocSTC * (1 + (temperatureCoefficientOfVOC / 100) * (temp - 25));
      // Умножаем на количество панелей, так как они соединены последовательно
      voltages.push({
        temperature: temp,
        voltage: voltage * panelCount
      });
    }

    setCalculatedVoltages(voltages);
  }, [selectedSolarPanel, panelCount]);

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

  const getSolarPanelLabel = (panel: Schema['SolarPanel']['type']) => {
    const manufacturer = manufacturers.find(m => m.id === panel.manufacturerId);
    return `${panel.name} (${manufacturer?.name || 'Неизвестный производитель'}) - Voc STC: ${panel.vocSTC}V`;
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Калькулятор солнечных панелей</h1>
        
        {/* Табы для переключения между разделами */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'calculation'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('calculation')}
          >
            Калькуляция напряжения
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'manufacturers'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('manufacturers')}
          >
            Производители
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'solarPanels'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('solarPanels')}
          >
            Солнечные панели
          </button>
        </div>

        {/* Основной контент */}
        {activeTab === 'calculation' && (
          <>
            {/* Форма калькуляции */}
            <Card className="mb-8">
              <Flex direction="column" gap="1rem">
                <Autocomplete
                  items={solarPanels}
                  value={searchValue}
                  onChange={setSearchValue}
                  onSelect={setSelectedSolarPanel}
                  getLabel={getSolarPanelLabel}
                  placeholder="Поиск солнечной панели..."
                  label="Выберите солнечную панель"
                />

                <div>
                  <Label htmlFor="panelCount">Количество панелей в стринге</Label>
                  <Input
                    id="panelCount"
                    type="number"
                    min="1"
                    value={panelCount.toString()}
                    onChange={(e) => setPanelCount(Math.max(1, parseInt(e.target.value) || 1))}
                    required
                  />
                </div>

                <Button onClick={() => setIsModalOpen(true)}>
                  Добавить солнечную панель
                </Button>
              </Flex>
            </Card>

            {/* Информация о выбранной панели */}
            {selectedSolarPanel && (
              <Card className="mb-8">
                <Flex direction="column" gap="1rem">
                  <h2 className="text-xl font-bold">Параметры выбранной панели</h2>
                  <div>
                    <Text fontWeight="bold">Название:</Text>
                    <Text>{selectedSolarPanel.name}</Text>
                  </div>
                  <div>
                    <Text fontWeight="bold">Производитель:</Text>
                    <Text>
                      {manufacturers.find(m => m.id === selectedSolarPanel.manufacturerId)?.name}
                    </Text>
                  </div>
                  <div>
                    <Text fontWeight="bold">Voc STC:</Text>
                    <Text>{selectedSolarPanel.vocSTC}V</Text>
                  </div>
                  <div>
                    <Text fontWeight="bold">Температурный коэффициент Voc:</Text>
                    <Text>{selectedSolarPanel.temperatureCoefficientOfVOC}%/°C</Text>
                  </div>
                  <div>
                    <Text fontWeight="bold">Общее напряжение при STC:</Text>
                    <Text>{selectedSolarPanel.vocSTC * panelCount}V</Text>
                  </div>
                </Flex>
              </Card>
            )}

            {/* Таблица с расчетами */}
            {calculatedVoltages.length > 0 && (
              <VoltageTable voltages={calculatedVoltages} />
            )}
          </>
        )}

        {activeTab === 'manufacturers' && (
          <Card>
            <Flex direction="column" gap="1rem">
              <Flex justifyContent="space-between" alignItems="center">
                <h2 className="text-xl font-bold">Список производителей</h2>
                <Button onClick={() => {
                  setIsAddingManufacturer(true);
                  setIsModalOpen(true);
                }}>
                  Добавить производителя
                </Button>
              </Flex>
              <Flex direction="column" gap="1rem">
                {manufacturers.map((manufacturer) => (
                  <Flex key={manufacturer.id} justifyContent="space-between" alignItems="center">
                    <Text>{manufacturer.name}</Text>
                    <Flex gap="1rem">
                      <Button
                        onClick={() => {
                          setSelectedManufacturer(manufacturer);
                          setIsModalOpen(true);
                        }}
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
            </Flex>
          </Card>
        )}

        {activeTab === 'solarPanels' && (
          <Card>
            <Flex direction="column" gap="1rem">
              <Flex justifyContent="space-between" alignItems="center">
                <h2 className="text-xl font-bold">Список солнечных панелей</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                  Добавить солнечную панель
                </Button>
              </Flex>
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
                        onClick={() => {
                          setSelectedSolarPanel(panel);
                          setIsModalOpen(true);
                        }}
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
            </Flex>
          </Card>
        )}

        {/* Модальное окно */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsAddingManufacturer(false);
            setSelectedManufacturer(null);
            setSelectedSolarPanel(null);
          }}
          title={
            isAddingManufacturer
              ? 'Добавить производителя'
              : selectedManufacturer
              ? 'Редактировать производителя'
              : selectedSolarPanel
              ? 'Редактировать солнечную панель'
              : 'Добавить солнечную панель'
          }
        >
          {isAddingManufacturer || selectedManufacturer ? (
            <ManufacturerForm
              mode={selectedManufacturer ? 'update' : 'create'}
              manufacturer={selectedManufacturer || undefined}
              onSuccess={() => {
                setIsModalOpen(false);
                setIsAddingManufacturer(false);
                setSelectedManufacturer(null);
              }}
            />
          ) : (
            <Flex direction="column" gap="1rem">
              <Autocomplete
                items={manufacturers}
                value=""
                onChange={() => {}}
                onSelect={() => {}}
                getLabel={(m) => m.name}
                placeholder="Поиск производителя..."
                label="Выберите производителя"
              />
              <Button onClick={() => setIsAddingManufacturer(true)}>
                Добавить нового производителя
              </Button>
              <SolarPanelForm
                mode={selectedSolarPanel ? 'update' : 'create'}
                solarPanel={selectedSolarPanel || undefined}
                onSuccess={() => {
                  setIsModalOpen(false);
                  setSelectedSolarPanel(null);
                }}
              />
            </Flex>
          )}
        </Modal>
      </div>
    </main>
  );
}