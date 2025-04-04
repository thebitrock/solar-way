"use client";

import '@aws-amplify/ui-react/styles.css';
import '@aws-amplify/ui-react/styles/reset.layer.css' // global CSS reset
import '@aws-amplify/ui-react/styles/base.layer.css' // base styling needed for Amplify UI
import '@aws-amplify/ui-react/styles/button.layer.css' // component specific
import '@aws-amplify/ui-react/styles/card.layer.css' // component specific
import '@aws-amplify/ui-react/styles/flex.layer.css' // component specific
import '@aws-amplify/ui-react/styles/grid.layer.css' // component specific
import '@aws-amplify/ui-react/styles/table.layer.css';
import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import ManufacturerForm from './components/ManufacturerForm';
import SolarPanelForm from './components/SolarPanelForm';
import Modal from './components/Modal';
import Autocomplete from './components/Autocomplete';
import VoltageTable from './components/VoltageTable';
import PanelParametersTable from './components/PanelParametersTable';
import { Button, Card, Flex, Text, SliderField, Grid, Label, Input } from '@aws-amplify/ui-react';
import { useTranslation } from './hooks/useTranslation';
import { useLanguage } from './hooks/useLanguage';
import { Schema } from '@/amplify/data/resource';
import { PanelCharacteristics, SolarPanel } from './types';

Amplify.configure(outputs);

const client = generateClient<Schema>();

type Manufacturer = {
  id: string;
  name: string;
  solarPanels?: SolarPanel[];
};

type ApiSolarPanel = {
  id: string;
  name: string;
  manufacturerId: string;
  temperatureCoefficientOfVOC: number;
  temperatureCoefficientOfISC: number;
  temperatureCoefficientOfPmax: number;
  PanelCharacteristics?: {
    items: PanelCharacteristics[];
  };
};

interface AutocompleteProps<T> {
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: T) => void;
  options: T[];
  getOptionLabel: (item: T) => string;
  placeholder: string;
  id?: string;
}

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  isOpen: boolean;
  type?: 'manufacturer' | 'solarPanel';
}

export default function Home() {
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<'calculation' | 'manufacturers' | 'solarPanels'>('calculation');
  const [modalType, setModalType] = useState<'manufacturer' | 'solarPanel'>('manufacturer');
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [selectedSolarPanel, setSelectedSolarPanel] = useState<SolarPanel | null>(null);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [solarPanels, setSolarPanels] = useState<SolarPanel[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingManufacturer, setIsAddingManufacturer] = useState(false);
  const [panelCount, setPanelCount] = useState<number>(1);
  const [isPanelInfoOpen, setIsPanelInfoOpen] = useState<boolean>(true);
  const [calculatedVoltages, setCalculatedVoltages] = useState<Array<{ 
    temperature: number; 
    voltage?: number;
    current?: number;
    power?: number;
    voltageNOCT?: number;
    currentNOCT?: number;
    powerNOCT?: number;
    voltageNMOT?: number;
    currentNMOT?: number;
    powerNMOT?: number;
  }>>([]);
  const [minTemp, setMinTemp] = useState<number>(-30);
  const [maxTemp, setMaxTemp] = useState<number>(25);
  const [mpptMaxVDC, setMpptMaxVDC] = useState<number>(500);
  const [selectedPanelId, setSelectedPanelId] = useState('');

  // Загрузка сохраненных значений
  useEffect(() => {
    const savedMinTemp = localStorage.getItem('minTemp');
    const savedMaxTemp = localStorage.getItem('maxTemp');
    const savedPanelCount = localStorage.getItem('panelCount');
    const savedPanelInfoOpen = localStorage.getItem('panelInfoOpen');
    const savedMpptMaxVDC = localStorage.getItem('mpptMaxVDC');
    
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
    if (savedMpptMaxVDC) {
      setMpptMaxVDC(Number(savedMpptMaxVDC));
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

  // Сохранение MPPT Max VDC в localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mpptMaxVDC', mpptMaxVDC.toString());
    }
  }, [mpptMaxVDC]);

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data...');
        const manufacturerResult = await (client.models as any).Manufacturer.list();
        console.log('Manufacturers loaded:', manufacturerResult.data);
        setManufacturers(manufacturerResult.data);

        const solarPanelResult = await (client.models as any).SolarPanel.list({
          include: {
            PanelCharacteristics: {
              fields: [
                'id',
                'type',
                'maximumPower',
                'openCircuitVoltage',
                'shortCircuitCurrent',
                'voltageAtMaximumPower',
                'currentAtMaximumPower',
                'solarPanelId'
              ]
            }
          }
        });

        console.log('Raw solar panel response:', solarPanelResult.data);
        
        const processedPanels = solarPanelResult.data.map((panel: ApiSolarPanel) => {
          const characteristics = panel.PanelCharacteristics?.items || [];
          console.log(`Processing panel ${panel.id}, characteristics:`, characteristics);
          return {
            ...panel,
            characteristics
          };
        });
        
        console.log('Processed panels:', processedPanels);
        setSolarPanels(processedPanels);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    const manufacturerSubscription = (client.models as any).Manufacturer.observeQuery().subscribe({
      next: ({ items }: { items: Manufacturer[] }) => {
        console.log('Manufacturer subscription update:', items);
        setManufacturers(items);
      },
    });

    const solarPanelSubscription = (client.models as any).SolarPanel.observeQuery().subscribe({
      next: async ({ items }: { items: ApiSolarPanel[] }) => {
        try {
          console.log('Solar panel subscription update, items:', items);
          const panelsWithCharacteristics = await Promise.all(items.map(async (panel) => {
            const characteristicsResult = await (client.models as any).PanelCharacteristics.list({
              filter: {
                solarPanelId: { eq: panel.id }
              }
            });
            console.log(`Characteristics for panel ${panel.id}:`, characteristicsResult.data);
            return {
              ...panel,
              characteristics: characteristicsResult.data || []
            };
          }));
          console.log('Updated panels with characteristics:', panelsWithCharacteristics);
          setSolarPanels(panelsWithCharacteristics);
        } catch (error) {
          console.error('Error loading characteristics:', error);
        }
      },
      error: (error: any) => {
        console.error('Error in subscription:', error);
      }
    });

    return () => {
      console.log('Cleaning up subscriptions');
      manufacturerSubscription.unsubscribe();
      solarPanelSubscription.unsubscribe();
    };
  }, []);

  // Расчет напряжений для разных температур
  const calculateVoltages = () => {
    if (!selectedSolarPanel) return;
    if (!selectedSolarPanel.characteristics || selectedSolarPanel.characteristics.length === 0) {
      console.log('No characteristics available for voltage calculation');
      return;
    }

    console.log('Selected solar panel:', selectedSolarPanel);
    console.log('Characteristics:', selectedSolarPanel.characteristics);

    const voltages = [];
    const tempCoeff = selectedSolarPanel.temperatureCoefficientOfVOC / 100;
    const tempCoeffISC = selectedSolarPanel.temperatureCoefficientOfISC / 100;
    const tempCoeffPmax = selectedSolarPanel.temperatureCoefficientOfPmax / 100;

    const characteristics = (Array.isArray(selectedSolarPanel.characteristics) 
      ? selectedSolarPanel.characteristics 
      : selectedSolarPanel.characteristics ? Object.values(selectedSolarPanel.characteristics) : []) as PanelCharacteristics[];

    console.log('Processed characteristics:', characteristics);

    const stcCharacteristics = characteristics.find(c => c.type === 'STC');
    const noctCharacteristics = characteristics.find(c => c.type === 'NOCT');
    const nmotCharacteristics = characteristics.find(c => c.type === 'NMOT');

    console.log('STC characteristics:', stcCharacteristics);
    console.log('NOCT characteristics:', noctCharacteristics);
    console.log('NMOT characteristics:', nmotCharacteristics);

    for (let temp = minTemp; temp <= maxTemp; temp += 1) {
      const deltaTemp = temp - 25;
      const deltaTempNOCT = temp - 20;
      const deltaTempNMOT = temp - 20;

      const voltage = stcCharacteristics?.openCircuitVoltage 
        ? stcCharacteristics.openCircuitVoltage * (1 + tempCoeff * deltaTemp) * panelCount
        : undefined;

      const current = stcCharacteristics?.shortCircuitCurrent 
        ? stcCharacteristics.shortCircuitCurrent * (1 + tempCoeffISC * deltaTemp)
        : undefined;

      const power = stcCharacteristics?.maximumPower 
        ? stcCharacteristics.maximumPower * (1 + tempCoeffPmax * deltaTemp) * panelCount
        : undefined;

      const voltageNOCT = noctCharacteristics?.openCircuitVoltage 
        ? noctCharacteristics.openCircuitVoltage * (1 + tempCoeff * deltaTempNOCT) * panelCount
        : undefined;

      const currentNOCT = noctCharacteristics?.shortCircuitCurrent 
        ? noctCharacteristics.shortCircuitCurrent * (1 + tempCoeffISC * deltaTempNOCT)
        : undefined;

      const powerNOCT = noctCharacteristics?.maximumPower 
        ? noctCharacteristics.maximumPower * (1 + tempCoeffPmax * deltaTempNOCT) * panelCount
        : undefined;

      const voltageNMOT = nmotCharacteristics?.openCircuitVoltage 
        ? nmotCharacteristics.openCircuitVoltage * (1 + tempCoeff * deltaTempNMOT) * panelCount
        : undefined;

      const currentNMOT = nmotCharacteristics?.shortCircuitCurrent 
        ? nmotCharacteristics.shortCircuitCurrent * (1 + tempCoeffISC * deltaTempNMOT)
        : undefined;

      const powerNMOT = nmotCharacteristics?.maximumPower 
        ? nmotCharacteristics.maximumPower * (1 + tempCoeffPmax * deltaTempNMOT) * panelCount
        : undefined;

      voltages.push({
        temperature: temp,
        voltage,
        current,
        power,
        voltageNOCT,
        currentNOCT,
        powerNOCT,
        voltageNMOT,
        currentNMOT,
        powerNMOT,
      });
    }

    setCalculatedVoltages(voltages);
  };

  const handleDeleteManufacturer = async (id: string) => {
    try {
      await (client.models as any).Manufacturer.delete({ id });
    } catch (error) {
      console.error('Error deleting manufacturer:', error);
    }
  };

  const handleDeleteSolarPanel = async (id: string) => {
    try {
      await (client.models as any).SolarPanel.delete({ id });
    } catch (error) {
      console.error('Error deleting solar panel:', error);
    }
  };

  const getSolarPanelLabel = (panel: SolarPanel) => {
    const manufacturer = manufacturers.find(m => m.id === panel.manufacturerId);
    return `${manufacturer?.name || t('calculation.unknownManufacturer')} - ${panel.name}`;
  };

  useEffect(() => {
    if (!selectedSolarPanel) return;
    if (!selectedSolarPanel.characteristics || selectedSolarPanel.characteristics.length === 0) {
      console.log('No characteristics available, skipping voltage calculation');
      return;
    }
    calculateVoltages();
  }, [selectedSolarPanel, panelCount, minTemp, maxTemp]);

  const handlePanelSelect = async (panel: SolarPanel | null) => {
    console.log('Selecting panel:', panel);
    if (panel) {
      try {
        const characteristicsResult = await (client.models as any).PanelCharacteristics.list({
          filter: {
            solarPanelId: { eq: panel.id }
          }
        });
        console.log('Loaded characteristics:', characteristicsResult.data);
        
        setSelectedSolarPanel({
          ...panel,
          characteristics: characteristicsResult.data || []
        });
      } catch (error) {
        console.error('Error loading characteristics:', error);
        setSelectedSolarPanel(panel);
      }
    } else {
      setSelectedSolarPanel(null);
    }
    setSelectedPanelId(panel?.id || '');
  };

  const handlePanelCreate = (panel: SolarPanel) => {
    setSolarPanels(prev => [...(prev || []), panel]);
    setSelectedSolarPanel(panel);
    setSelectedPanelId(panel.id);
  };

  return (
    <main className="min-h-screen p-8">
      <Flex direction="column" gap="1rem">
        <Card>
          <Flex justifyContent="space-between" alignItems="center">
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <Button onClick={toggleLanguage}>
              {language === 'uk' ? 'EN' : 'UK'}
            </Button>
          </Flex>
        </Card>

        <Card>
          <Flex gap="1rem" marginBottom="1rem">
            <Button
              variation={activeTab === 'calculation' ? 'primary' : undefined}
              onClick={() => setActiveTab('calculation')}
            >
              {t('tabs.calculation')}
            </Button>
            <Button
              variation={activeTab === 'manufacturers' ? 'primary' : undefined}
              onClick={() => {
                setActiveTab('manufacturers');
                setModalType('manufacturer');
              }}
            >
              {t('tabs.manufacturers')}
            </Button>
            <Button
              variation={activeTab === 'solarPanels' ? 'primary' : undefined}
              onClick={() => {
                setActiveTab('solarPanels');
                setModalType('solarPanel');
              }}
            >
              {t('tabs.solarPanels')}
            </Button>
          </Flex>

          {activeTab === 'calculation' && (
            <Card>
              <Flex direction="column" gap="1rem">
                <div>
                  <Label>{t('calculation.selectPanel')}</Label>
                  <Autocomplete<SolarPanel>
                    items={solarPanels}
                    value={searchValue}
                    onChange={setSearchValue}
                    onSelect={handlePanelSelect}
                    getLabel={getSolarPanelLabel}
                    placeholder={t('calculation.selectPanelPlaceholder')}
                  />
                </div>

                {selectedSolarPanel && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{t('calculation.panelInfo')}</h3>
                      <button
                        onClick={() => setIsPanelInfoOpen(!isPanelInfoOpen)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {isPanelInfoOpen ? '▼' : '▶'}
                      </button>
                    </div>
                    {isPanelInfoOpen && (
                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <Text fontWeight="semibold">{t('calculation.name')}</Text>
                            <Text>{selectedSolarPanel.name}</Text>
                          </div>
                          <div>
                            <Text fontWeight="semibold">{t('calculation.manufacturer')}</Text>
                            <Text>{manufacturers.find(m => m.id === selectedSolarPanel.manufacturerId)?.name || t('calculation.unknownManufacturer')}</Text>
                          </div>
                        </div>

                        {/* Temperature Coefficients */}
                        <div>
                          <Text fontWeight="bold" className="mb-2">{t('calculation.panelParameters.temperatureCoefficients')}</Text>
                          <table className="w-full border-collapse">
                            <tbody>
                              <tr className="border-b border-gray-200">
                                <td className="py-2">
                                  <Text>{t('calculation.panelParameters.temperatureCoefficients_isc')}</Text>
                                </td>
                                <td className="py-2 text-right">
                                  {selectedSolarPanel.temperatureCoefficientOfISC > 0 ? '+' : ''}{selectedSolarPanel.temperatureCoefficientOfISC}%/°C
                                </td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="py-2">
                                  <Text>{t('calculation.panelParameters.temperatureCoefficients_voc')}</Text>
                                </td>
                                <td className="py-2 text-right">
                                  {selectedSolarPanel.temperatureCoefficientOfVOC > 0 ? '+' : ''}{selectedSolarPanel.temperatureCoefficientOfVOC}%/°C
                                </td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="py-2">
                                  <Text>{t('calculation.panelParameters.temperatureCoefficients_pmax')}</Text>
                                </td>
                                <td className="py-2 text-right">
                                  {selectedSolarPanel.temperatureCoefficientOfPmax > 0 ? '+' : ''}{selectedSolarPanel.temperatureCoefficientOfPmax}%/°C
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Panel Characteristics */}
                        {selectedSolarPanel.characteristics && selectedSolarPanel.characteristics.length > 0 && (
                          <div>
                            <Text fontWeight="bold" className="mb-2">{t('calculation.characteristics.title')}</Text>
                            <PanelParametersTable 
                              characteristics={selectedSolarPanel.characteristics}
                              t={t}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label>{t('calculation.panelCount')}</Label>
                  <SliderField
                    label=""
                    value={panelCount}
                    onChange={(value) => setPanelCount(value)}
                    min={1}
                    max={30}
                    step={1}
                    labelHidden={true}
                  />
                  <Text>{panelCount}</Text>
                </div>

                <div>
                  <Label>{t('calculation.temperatureRange')}</Label>
                  <Grid templateColumns="1fr 1fr" gap="1rem">
                    <div>
                      <Label>{t('calculation.minTemp')}</Label>
                      <SliderField
                        label=""
                        value={minTemp}
                        onChange={(value) => setMinTemp(value)}
                        min={-50}
                        max={0}
                        step={1}
                        labelHidden={true}
                      />
                      <Text>{minTemp}°C</Text>
                    </div>
                    <div>
                      <Label>{t('calculation.maxTemp')}</Label>
                      <SliderField
                        label=""
                        value={maxTemp}
                        onChange={(value) => setMaxTemp(value)}
                        min={1}
                        max={50}
                        step={1}
                        labelHidden={true}
                      />
                      <Text>{maxTemp}°C</Text>
                    </div>
                  </Grid>
                </div>

                <div>
                  <Label>{t('calculation.mpptMaxVDC')}</Label>
                  <SliderField
                    label=""
                    value={mpptMaxVDC}
                    onChange={(value) => setMpptMaxVDC(value)}
                    min={50}
                    max={1500}
                    step={10}
                    labelHidden={true}
                  />
                  <Text>{mpptMaxVDC}V</Text>
                </div>

                {calculatedVoltages.length > 0 && (
                  <VoltageTable
                    voltages={calculatedVoltages}
                    mpptMaxVDC={mpptMaxVDC}
                    translations={{
                      temperature: t('calculation.temperature'),
                      openCircuitVoltage: t('calculation.openCircuitVoltage'),
                      shortCircuitCurrent: t('calculation.shortCircuitCurrent'),
                      maximumPower: t('calculation.maximumPower'),
                      totalPowerSTC: t('calculation.totalPowerSTC'),
                      totalPowerNOCT: t('calculation.totalPowerNOCT'),
                      totalPowerNMOT: t('calculation.totalPowerNMOT'),
                      notProvided: t('calculation.notProvided')
                    }}
                  />
                )}
              </Flex>
            </Card>
          )}

          {activeTab === 'manufacturers' && (
            <Flex direction="column" gap="1rem">
              <Button onClick={() => setIsModalOpen(true)}>
                {t('modal.addManufacturer')}
              </Button>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">{t('manufacturers.name')}</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {manufacturers.map((manufacturer) => (
                    <tr key={manufacturer.id}>
                      <td className="p-2">{manufacturer.name}</td>
                      <td className="text-right p-2">
                        <Button
                          variation="link"
                          onClick={() => {
                            setSelectedManufacturer(manufacturer);
                            setIsModalOpen(true);
                          }}
                        >
                          {t('modal.editManufacturer')}
                        </Button>
                        <Button
                          variation="link"
                          onClick={() => handleDeleteManufacturer(manufacturer.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Flex>
          )}

          {activeTab === 'solarPanels' && (
            <Flex direction="column" gap="1rem">
              <Button onClick={() => setIsModalOpen(true)}>
                {t('modal.addSolarPanel')}
              </Button>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">{t('solarPanels.name')}</th>
                    <th className="text-left p-2">{t('manufacturers.name')}</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {solarPanels.map((panel: SolarPanel) => {
                    const manufacturer = manufacturers.find(m => m.id === panel.manufacturerId);
                    return (
                      <tr key={panel.id}>
                        <td className="p-2">{panel.name}</td>
                        <td className="p-2">{manufacturer?.name || t('calculation.unknownManufacturer')}</td>
                        <td className="text-right p-2">
                          <Button
                            variation="link"
                            onClick={() => {
                              handlePanelSelect(panel);
                              setIsModalOpen(true);
                            }}
                          >
                            {t('modal.editSolarPanel')}
                          </Button>
                          <Button
                            variation="link"
                            onClick={() => handleDeleteSolarPanel(panel.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Flex>
          )}
        </Card>
      </Flex>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSolarPanel(null);
          setSelectedManufacturer(null);
        }}
        title={
          modalType === 'manufacturer'
            ? selectedManufacturer
              ? t('modal.editManufacturer')
              : t('modal.addManufacturer')
            : selectedSolarPanel
              ? t('modal.editSolarPanel')
              : t('modal.addSolarPanel')
        }
        type={modalType}
      >
        {modalType === 'manufacturer' ? (
          <ManufacturerForm
            manufacturer={selectedManufacturer || undefined}
            mode={selectedManufacturer ? 'update' : 'create'}
            onSuccess={() => {
              setIsModalOpen(false);
              setSelectedManufacturer(null);
            }}
          />
        ) : (
          <SolarPanelForm
            solarPanel={selectedSolarPanel || undefined}
            mode={selectedSolarPanel ? 'update' : 'create'}
            onSuccess={() => {
              setIsModalOpen(false);
              setSelectedSolarPanel(null);
            }}
          />
        )}
      </Modal>
    </main>
  );
}