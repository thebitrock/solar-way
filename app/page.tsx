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
import { Button, Card, Flex, Text, SliderField, Grid } from '@aws-amplify/ui-react';
import { translations } from './i18n/translations';
import { useLanguage } from './hooks/useLanguage';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Home() {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'calculation' | 'manufacturers' | 'solarPanels'>('calculation');
  const [selectedManufacturer, setSelectedManufacturer] = useState<Schema['Manufacturer']['type'] | null>(null);
  const [selectedSolarPanel, setSelectedSolarPanel] = useState<Schema['SolarPanel']['type'] | null>(null);
  const [manufacturers, setManufacturers] = useState<Array<Schema['Manufacturer']['type']>>([]);
  const [solarPanels, setSolarPanels] = useState<Array<Schema['SolarPanel']['type']>>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingManufacturer, setIsAddingManufacturer] = useState(false);
  const [panelCount, setPanelCount] = useState<number>(1);
  const [isPanelInfoOpen, setIsPanelInfoOpen] = useState<boolean>(true);
  const [calculatedVoltages, setCalculatedVoltages] = useState<Array<{ 
    temperature: number; 
    voltage: number;
    current: number;
    power: number;
  }>>([]);
  const [minTemp, setMinTemp] = useState<number>(-30);
  const [maxTemp, setMaxTemp] = useState<number>(25);

  // Загрузка сохраненных значений
  useEffect(() => {
    const savedMinTemp = localStorage.getItem('minTemp');
    const savedMaxTemp = localStorage.getItem('maxTemp');
    const savedPanelCount = localStorage.getItem('panelCount');
    const savedPanelInfoOpen = localStorage.getItem('panelInfoOpen');
    
    if (savedMinTemp) {
      setMinTemp(Number(savedMinTemp));
    }
    if (savedMaxTemp) {
      setMaxTemp(Number(savedMaxTemp));
    }
    if (savedPanelCount) {
      setPanelCount(Number(savedPanelCount));
    }
    if (savedPanelInfoOpen !== null) {
      setIsPanelInfoOpen(savedPanelInfoOpen === 'true');
    }
  }, []);

  // Сохранение температур в localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('minTemp', minTemp.toString());
    }
  }, [minTemp]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('maxTemp', maxTemp.toString());
    }
  }, [maxTemp]);

  // Сохранение количества панелей в localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('panelCount', panelCount.toString());
    }
  }, [panelCount]);

  // Сохранение состояния спойлера в localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('panelInfoOpen', isPanelInfoOpen.toString());
    }
  }, [isPanelInfoOpen]);

  // Загрузка данных
  useEffect(() => {
    const manufacturerSubscription = client.models.Manufacturer.observeQuery().subscribe({
      next: ({ items }) => setManufacturers(items),
    });

    const solarPanelSubscription = client.models.SolarPanel.observeQuery().subscribe({
      next: ({ items }) => setSolarPanels(items
        .filter((panel): panel is NonNullable<typeof panel> => panel !== null)
        .map(panel => ({
          ...panel,
          temperatureCoefficientOfISC: panel.temperatureCoefficientOfISC ?? 0,
          temperatureCoefficientOfPmax: panel.temperatureCoefficientOfPmax ?? 0,
          impSTC: panel.impSTC ?? 0,
          vmpSTC: panel.vmpSTC ?? 0,
          iscSTC: panel.iscSTC ?? 0
        }))),
    });

    return () => {
      manufacturerSubscription.unsubscribe();
      solarPanelSubscription.unsubscribe();
    };
  }, []);

  // Расчет напряжений при изменении панели или количества
  useEffect(() => {
    if (!selectedSolarPanel) return;

    const results = [];
    const { 
      vocSTC, 
      temperatureCoefficientOfVOC, 
      iscSTC, 
      temperatureCoefficientOfISC,
      vmpSTC,
      impSTC,
      temperatureCoefficientOfPmax 
    } = selectedSolarPanel;
    
    // Расчет для температур от minTemp до maxTemp
    for (let temp = minTemp; temp <= maxTemp; temp++) {
      // Формула для напряжения: Voc(T) = Voc(STC) * (1 + α * (T - 25))
      // где α - температурный коэффициент в %/°C
      const voltage = vocSTC * (1 + (temperatureCoefficientOfVOC / 100) * (temp - 25));

      // Формула для тока: Isc(T) = Isc(STC) * (1 + β * (T - 25))
      // где β - температурный коэффициент Isc в %/°C
      const current = (iscSTC ?? 0) * (1 + ((temperatureCoefficientOfISC ?? 0) / 100) * (temp - 25));

      // Формула для мощности: P(T) = Pmax(STC) * (1 + γ * (T - 25))
      // где γ - температурный коэффициент Pmax в %/°C
      const stcPower = (vmpSTC ?? 0) * (impSTC ?? 0); // Мощность при STC
      const power = stcPower * (1 + ((temperatureCoefficientOfPmax ?? 0) / 100) * (temp - 25));

      results.push({
        temperature: temp,
        voltage: voltage * panelCount, // Умножаем на количество панелей, так как они соединены последовательно
        current: current, // Ток не умножаем, так как панели соединены последовательно
        power: power * panelCount // Умножаем на количество панелей для получения общей мощности
      });
    }

    setCalculatedVoltages(results);
  }, [selectedSolarPanel, panelCount, minTemp, maxTemp]);

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
    const defaultLabel = 'Неизвестная панель'
    
    if (!panel) {
      return defaultLabel
    }

    console.log(panel)
    const manufacturer = manufacturers.find(m => m.id === panel.manufacturerId);
    return `${panel.name} (${manufacturer?.name || 'Неизвестный производитель'}) - Voc STC: ${panel.vocSTC}V`;
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Flex justifyContent="space-between" alignItems="center" className="mb-8">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <Button onClick={toggleLanguage} variation="link">
            {language === 'uk' ? '🇬🇧 EN' : '🇺🇦 UA'}
          </Button>
        </Flex>
        
        <br/>
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
            {t.tabs.calculation}
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'manufacturers'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('manufacturers')}
          >
            {t.tabs.manufacturers}
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'solarPanels'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('solarPanels')}
          >
            {t.tabs.solarPanels}
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
                  placeholder={t.calculation.selectPanel}
                  label={t.calculation.selectPanel}
                />

                <Button onClick={() => setIsModalOpen(true)}>
                  {t.calculation.addPanel}
                </Button>
              </Flex>
            </Card>

            {/* Информация о выбранной панели */}
            {selectedSolarPanel && (
              <Card className="mb-8">
                <Flex direction="column" gap="1rem">
                  <Button
                    onClick={() => setIsPanelInfoOpen(!isPanelInfoOpen)}
                    variation="link"
                    className="text-left"
                  >
                    <Flex alignItems="center" gap="0.5rem">
                      <Text className="text-xl font-bold">{t.calculation.panelInfo}</Text>
                      <Text fontSize="large">{isPanelInfoOpen ? '▼' : '▶'}</Text>
                    </Flex>
                  </Button>
                  
                  {isPanelInfoOpen && (
                    <Grid
                      columnGap="1rem"
                      rowGap="1rem"
                      templateColumns="1fr 1fr"
                    >
                      <div>
                        <Text fontWeight="bold">{t.calculation.name}</Text>
                        <Text>{selectedSolarPanel.name}</Text>
                      </div>
                      <div>
                        <Text fontWeight="bold">{t.calculation.manufacturer}</Text>
                        <Text>
                          {manufacturers.find(m => m.id === selectedSolarPanel.manufacturerId)?.name}
                        </Text>
                      </div>
                      <div>
                        <Text fontWeight="bold">{t.calculation.vocSTC}</Text>
                        <Text>{selectedSolarPanel.vocSTC}V</Text>
                      </div>
                      <div>
                        <Text fontWeight="bold">{t.calculation.temperatureCoefficient}</Text>
                        <Text>{selectedSolarPanel.temperatureCoefficientOfVOC}%/°C</Text>
                      </div>
                      <div>
                        <Text fontWeight="bold">{t.calculation.temperatureCoefficientISC}</Text>
                        <Text>{selectedSolarPanel.temperatureCoefficientOfISC ?? t.calculation.insufficientData}%/°C</Text>
                      </div>
                      <div>
                        <Text fontWeight="bold">{t.calculation.temperatureCoefficientPmax}</Text>
                        <Text>{selectedSolarPanel.temperatureCoefficientOfPmax ?? t.calculation.insufficientData}%/°C</Text>
                      </div>
                      <div>
                        <Text fontWeight="bold">{t.calculation.impSTC}</Text>
                        <Text>{selectedSolarPanel.impSTC ?? t.calculation.insufficientData}A</Text>
                      </div>
                      <div>
                        <Text fontWeight="bold">{t.calculation.vmpSTC}</Text>
                        <Text>{selectedSolarPanel.vmpSTC ?? t.calculation.insufficientData}V</Text>
                      </div>
                      <div>
                        <Text fontWeight="bold">{t.calculation.iscSTC}</Text>
                        <Text>{selectedSolarPanel.iscSTC}A</Text>
                      </div>
                    </Grid>
                  )}
                </Flex>
              </Card>
            )}

<Card className="my-4">
              <Flex direction="column" gap="1rem">
              <SliderField
                label={t.calculation.panelCount}
                min={1}
                max={30}
                step={1}
                value={panelCount}
                onChange={(value) => setPanelCount(value)}
              />
                          </Flex>
              {selectedSolarPanel && (
                <Flex direction="column" gap="0.5rem" className="mt-2">
                  <Text fontWeight="bold">
                    {t.calculation.totalVoltage} {selectedSolarPanel.vocSTC * panelCount}V
                  </Text>
                  <Text fontWeight="bold">
                    {t.calculation.totalPowerSTC}: {selectedSolarPanel.vmpSTC && selectedSolarPanel.impSTC
                      ? `${(selectedSolarPanel.vmpSTC * selectedSolarPanel.impSTC * panelCount).toFixed(2)}W`
                      : t.calculation.insufficientData}
                  </Text>
                </Flex>
              )}
            

            </Card>

            {/* Управление диапазоном температур */}
            <Card className="my-4">
              <Flex direction="column" gap="1rem">
                <Text fontWeight="bold">{t.calculation.temperatureRange}</Text>
                <Flex gap="2rem">
                  <SliderField
                    label={t.calculation.minTemperature}
                    min={-50}
                    max={-1}
                    step={1}
                    value={minTemp}
                    onChange={(value) => {
                      const newValue = Number(value);
                      if (newValue >= -50 && newValue <= -1) {
                        setMinTemp(newValue);
                      }
                    }}
                  />
                  <SliderField
                    label={t.calculation.maxTemperature}
                    min={1}
                    max={100}
                    step={1}
                    value={maxTemp}
                    onChange={(value) => {
                      const newValue = Number(value);
                      if (newValue >= 1 && newValue <= 100) {
                        setMaxTemp(newValue);
                      }
                    }}
                  />
                </Flex>
              </Flex>
            </Card>

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
                <h2 className="text-xl font-bold">{t.manufacturers.list}</h2>
                <Button onClick={() => {
                  setIsAddingManufacturer(true);
                  setIsModalOpen(true);
                }}>
                  {t.manufacturers.add}
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
                        {t.manufacturers.edit}
                      </Button>
                      <Button
                        onClick={() => handleDeleteManufacturer(manufacturer.id)}
                        variation="destructive"
                      >
                        {t.manufacturers.delete}
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
                <h2 className="text-xl font-bold">{t.solarPanels.list}</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                  {t.solarPanels.add}
                </Button>
              </Flex>
              <Flex direction="column" gap="1rem">
                {solarPanels.filter(panel => panel !== null).map((panel) => (
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
                        {t.solarPanels.edit}
                      </Button>
                      <Button
                        onClick={() => handleDeleteSolarPanel(panel.id)}
                        variation="destructive"
                      >
                        {t.solarPanels.delete}
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
              selectedSolarPanel
              ? t.modal.editSolarPanel
              : t.modal.addSolarPanel
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