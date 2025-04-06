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
import VoltageTable from './components/VoltageTable';
import { Button, Card, Flex, Text, SliderField, Grid, Label, Input, SelectField } from '@aws-amplify/ui-react';
import { useTranslation } from './hooks/useTranslation';
import { useLanguageContext } from './contexts/LanguageContext';
import { type Schema } from '@/amplify/data/resource';
import { 
  Manufacturer, 
  SolarPanel, 
  Module, 
  PanelCharacteristics,
  AmplifyManufacturer,
  AmplifySolarPanel,
  AmplifyModule,
  AmplifyPanelCharacteristics
} from './types';
import Autocomplete from './components/Autocomplete';

Amplify.configure(outputs);

const client = generateClient<Schema>();

interface ModuleSelectorProps {
  modules: Module[];
  selectedModuleId: string | null;
  onModuleSelect: (moduleId: string) => void;
}

type ButtonVariations = 'primary' | 'link' | 'default' | 'destructive';

function ModuleSelector({ modules, selectedModuleId, onModuleSelect }: ModuleSelectorProps) {
  return (
    <Flex direction="column" gap="1rem">
      <Flex direction="row" gap="0.5rem" wrap="wrap">
        {modules.map((module) => (
          <Button
            key={module.id}
            variation={selectedModuleId === module.id ? "primary" : undefined}
            onClick={() => onModuleSelect(module.id)}
          >
            {module.power}W
          </Button>
        ))}
      </Flex>
      {selectedModuleId && (
        <Grid templateColumns="1fr 1fr 1fr" gap="1rem">
          {modules
            .find((m) => m.id === selectedModuleId)
            ?.characteristics.map((char: PanelCharacteristics) => (
              <Card key={char.id} variation="outlined">
                <Flex direction="column" gap="0.5rem">
                  <Text fontWeight="bold">{char.type}</Text>
                  <Text>Pmax: {char.maximumPower}W</Text>
                  <Text>Voc: {char.openCircuitVoltage}V</Text>
                  <Text>Isc: {char.shortCircuitCurrent}A</Text>
                  <Text>Vmp: {char.voltageAtMaximumPower}V</Text>
                  <Text>Imp: {char.currentAtMaximumPower}A</Text>
                </Flex>
              </Card>
            ))}
        </Grid>
      )}
    </Flex>
  );
}

// Transform API data to client types
const transformManufacturer = (data: any): Manufacturer => {
  console.log('Raw manufacturer data:', data);
  return {
    id: data.id,
    name: data.name,
    solarPanels: data.solarPanels?.items?.map((panel: any) => transformSolarPanel(panel)) || []
  };
};

const transformSolarPanel = (data: any, modules?: any[]): SolarPanel => {
  return {
    id: data.id,
    name: data.name,
    manufacturerId: data.manufacturerId,
    temperatureCoefficientOfVOC: data.temperatureCoefficientOfVOC || 0,
    temperatureCoefficientOfISC: data.temperatureCoefficientOfISC || 0,
    temperatureCoefficientOfPmax: data.temperatureCoefficientOfPmax || 0,
    modules: modules?.map(transformModule) || []
  };
};

const transformModule = (data: any): Module => {
  return {
    id: data.id,
    power: data.power,
    solarPanelId: data.solarPanelId,
    characteristics: data.characteristics?.items || []
  };
};

export default function Home() {
  const { language, toggleLanguage } = useLanguageContext();
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<'calculation' | 'manufacturers' | 'solarPanels'>('calculation');
  const [modalType, setModalType] = useState<'manufacturer' | 'solarPanel'>('manufacturer');
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | undefined>(undefined);
  const [selectedSolarPanel, setSelectedSolarPanel] = useState<SolarPanel | undefined>(undefined);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
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
  const [forceUpdate, setForceUpdate] = useState(0);
  const [searchPanelValue, setSearchPanelValue] = useState('');

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
        
        const manufacturerResult = await client.models.Manufacturer.list();
        const solarPanelResult = await client.models.SolarPanel.list();
        const solarPanelsByManufacturerId: Record<string, any[]> = {};
        solarPanelResult.data.forEach(panel => {
          if (!solarPanelsByManufacturerId[panel.manufacturerId]) {
            solarPanelsByManufacturerId[panel.manufacturerId] = [];
          }
          solarPanelsByManufacturerId[panel.manufacturerId].push(panel);
        });

        const transformedManufacturers = manufacturerResult.data.map(manufacturer => {
          const manufacturerWithPanels = {
            ...manufacturer,
            solarPanels: {
              items: solarPanelsByManufacturerId[manufacturer.id] || []
            }
          };
          return transformManufacturer(manufacturerWithPanels);
        });
        
        setManufacturers(transformedManufacturers);
        
        // Для каждой панели загружаем модули и их характеристики
        const transformedPanels = await Promise.all(
          solarPanelResult.data.map(async (panel) => {
            // Загружаем модули для панели
            const moduleResult = await client.models.Module.list({
              filter: {
                solarPanelId: { eq: panel.id }
              }
            });

            // Для каждого модуля загружаем характеристики
            const modulesWithCharacteristics = await Promise.all(
              moduleResult.data.map(async (module) => {
                const characteristicsResult = await client.models.PanelCharacteristics.list({
                  filter: {
                    moduleId: { eq: module.id }
                  }
                });

                return {
                  ...module,
                  characteristics: {
                    items: characteristicsResult.data
                  }
                };
              })
            );

            return transformSolarPanel(
              panel,
              modulesWithCharacteristics
            );
          })
        );
        
        console.log('Processed panels with modules and characteristics:', transformedPanels);
        setSolarPanels(transformedPanels);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    // Подписка на обновления производителей
    const manufacturerSubscription = client.models.Manufacturer.observeQuery().subscribe({
      next: async ({ items }) => {
        try {
          // Загружаем солнечные панели
          const solarPanelResult = await client.models.SolarPanel.list();
          
          // Создаем карту солнечных панелей по ID производителя
          const solarPanelsByManufacturerId: Record<string, any[]> = {};
          solarPanelResult.data.forEach(panel => {
            if (!solarPanelsByManufacturerId[panel.manufacturerId]) {
              solarPanelsByManufacturerId[panel.manufacturerId] = [];
            }
            solarPanelsByManufacturerId[panel.manufacturerId].push(panel);
          });
          
          // Трансформируем производителей с их солнечными панелями
          const transformedManufacturers = items.map(manufacturer => {
            const manufacturerWithPanels = {
              ...manufacturer,
              solarPanels: {
                items: solarPanelsByManufacturerId[manufacturer.id] || []
              }
            };
            return transformManufacturer(manufacturerWithPanels);
          });
          
          setManufacturers(transformedManufacturers);
        } catch (error) {
          console.error('Error updating manufacturers:', error);
        }
      }
    });

    // Подписка на обновления солнечных панелей
    const solarPanelSubscription = client.models.SolarPanel.observeQuery().subscribe({
      next: async ({ items }) => {
        try {
          console.log('Solar panel subscription update, items:', items);
          
          // Для каждой панели загружаем модули и их характеристики
          const transformedPanels = await Promise.all(
            items.map(async (panel) => {
              // Загружаем модули для панели
              const moduleResult = await client.models.Module.list({
                filter: {
                  solarPanelId: { eq: panel.id }
                }
              });

              // Для каждого модуля загружаем характеристики
              const modulesWithCharacteristics = await Promise.all(
                moduleResult.data.map(async (module) => {
                  const characteristicsResult = await client.models.PanelCharacteristics.list({
                    filter: {
                      moduleId: { eq: module.id }
                    }
                  });

                  return {
                    ...module,
                    characteristics: {
                      items: characteristicsResult.data
                    }
                  };
                })
              );

              return transformSolarPanel(
                panel,
                modulesWithCharacteristics
              );
            })
          );
          
          console.log('Updated panels with modules and characteristics:', transformedPanels);
          setSolarPanels(transformedPanels);
        } catch (error) {
          console.error('Error loading modules:', error);
        }
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
    if (!selectedSolarPanel || !selectedModule) return;
    
    const characteristics = selectedModule.characteristics || [];
    if (characteristics.length === 0) {
      console.log('No characteristics available for voltage calculation');
      return;
    }
    
    console.log('Calculating voltages with characteristics:', characteristics);

    // Получаем характеристики разных типов
    const stc = characteristics.find(c => c.type === 'STC');
    const noct = characteristics.find(c => c.type === 'NOCT');
    const nmot = characteristics.find(c => c.type === 'NMOT');

    if (!stc) {
      console.log('STC characteristics not found, cannot calculate voltages');
      return;
    }

    // Коэффициент Voc (% на градус)
    const tempCoeffVoc = selectedSolarPanel.temperatureCoefficientOfVOC / 100;
    const tempCoeffIsc = selectedSolarPanel.temperatureCoefficientOfISC / 100;
    const tempCoeffPmax = selectedSolarPanel.temperatureCoefficientOfPmax / 100;

    // Массив температур с шагом 5 градусов
    const temperatures = [];
    for (let temp = minTemp; temp <= maxTemp; temp += 1) {
      temperatures.push(temp);
    }

    // Для каждой температуры рассчитываем напряжение и ток
    const voltages = temperatures.map(temp => {
      // Температурные условия STC = 25°C
      const deltaT = temp - 25;

      // Расчет для STC
      const vocAtTemp = stc.openCircuitVoltage * (1 + tempCoeffVoc * deltaT);
      const iscAtTemp = stc.shortCircuitCurrent * (1 + tempCoeffIsc * deltaT);
      const pmaxAtTemp = stc.maximumPower * (1 + tempCoeffPmax * deltaT);

      // Расчет для NOCT и NMOT если они есть
      let vocAtTempNOCT = undefined;
      let iscAtTempNOCT = undefined;
      let pmaxAtTempNOCT = undefined;
      let vocAtTempNMOT = undefined;
      let iscAtTempNMOT = undefined;
      let pmaxAtTempNMOT = undefined;

      if (noct) {
        const noctTemp = 20;
        const deltaTNoct = temp - noctTemp;
        vocAtTempNOCT = noct.openCircuitVoltage * (1 + tempCoeffVoc * deltaTNoct);
        iscAtTempNOCT = noct.shortCircuitCurrent * (1 + tempCoeffIsc * deltaTNoct);
        pmaxAtTempNOCT = noct.maximumPower * (1 + tempCoeffPmax * deltaTNoct);
      }

      if (nmot) {
        const nmotTemp = 20;
        const deltaTNmot = temp - nmotTemp;
        vocAtTempNMOT = nmot.openCircuitVoltage * (1 + tempCoeffVoc * deltaTNmot);
        iscAtTempNMOT = nmot.shortCircuitCurrent * (1 + tempCoeffIsc * deltaTNmot);
        pmaxAtTempNMOT = nmot.maximumPower * (1 + tempCoeffPmax * deltaTNmot);
      }

      return {
        temperature: temp,
        voltage: parseFloat((vocAtTemp * panelCount).toFixed(2)),
        current: parseFloat(iscAtTemp.toFixed(2)),
        power: parseFloat((pmaxAtTemp * panelCount).toFixed(2)),
        voltageNOCT: vocAtTempNOCT ? parseFloat((vocAtTempNOCT * panelCount).toFixed(2)) : undefined,
        currentNOCT: iscAtTempNOCT ? parseFloat(iscAtTempNOCT.toFixed(2)) : undefined,
        powerNOCT: pmaxAtTempNOCT ? parseFloat((pmaxAtTempNOCT * panelCount).toFixed(2)) : undefined,
        voltageNMOT: vocAtTempNMOT ? parseFloat((vocAtTempNMOT * panelCount).toFixed(2)) : undefined,
        currentNMOT: iscAtTempNMOT ? parseFloat(iscAtTempNMOT.toFixed(2)) : undefined,
        powerNMOT: pmaxAtTempNMOT ? parseFloat((pmaxAtTempNMOT * panelCount).toFixed(2)) : undefined
      };
    });

    console.log('Calculated voltages:', voltages);
    setCalculatedVoltages(voltages);
  };

  useEffect(() => {
    calculateVoltages();
  }, [selectedSolarPanel, selectedModule, panelCount, minTemp, maxTemp]);

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

  const getSolarPanelLabel = (panel: SolarPanel) => {
    const manufacturer = manufacturers.find(m => m.id === panel.manufacturerId);
    const manufacturerName = manufacturer ? manufacturer.name : t('calculation.unknownManufacturer');
    return `${manufacturerName} - ${panel.name}`;
  };

  const getModuleLabel = (module: Module) => {
    return `${selectedSolarPanel?.name || ''} - ${module.power}W`;
  };

  const handlePanelSelect = async (data: any) => {
    if (!data) {
      setSelectedSolarPanel(undefined);
      setSelectedModule(null);
      return;
    }

    try {
      // Загружаем модули для выбранной панели
      const moduleResult = await client.models.Module.list({
        filter: {
          solarPanelId: { eq: data.id }
        }
      });

      // Загружаем характеристики для каждого модуля
      const modulesWithCharacteristics = await Promise.all(
        moduleResult.data.map(async (module) => {
          const characteristicsResult = await client.models.PanelCharacteristics.list({
            filter: {
              moduleId: { eq: module.id }
            }
          });
          
          return {
            ...module,
            characteristics: {
              items: characteristicsResult.data
            }
          };
        })
      );

      // Трансформируем панель с загруженными модулями
      const transformedPanel = transformSolarPanel(
        data,
        modulesWithCharacteristics
      );

      console.log('Selected panel with modules:', transformedPanel);
      setSelectedSolarPanel(transformedPanel);
      setSelectedModule(null);
    } catch (error) {
      console.error('Error loading modules for panel:', error);
    }
  };

  const handleModuleSelect = (moduleId: string) => {
    if (!selectedSolarPanel || !selectedSolarPanel.modules) return;
    
    const solarPanelModule = selectedSolarPanel.modules.find(m => m.id === moduleId);
    if (solarPanelModule) {
      console.log('Module selected:', solarPanelModule);
      setSelectedModule(solarPanelModule);
    }
  };

  const handlePanelCreate = (panel: SolarPanel) => {
    if (activeTab === 'calculation') {
      handlePanelSelect(panel);
    }
    setIsModalOpen(false);
  };

  const handleManufacturerSelect = (data: any | null) => {
    setSelectedManufacturer(data ? transformManufacturer(data) : undefined);
    setSelectedSolarPanel(undefined);
    setSelectedModule(null);
  };

  // Обновляем функцию переключения языка
  const handleLanguageToggle = () => {
    toggleLanguage();
  };

  return (
    <Flex direction="column" gap="1.5rem" padding="1rem">
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">{t('title')}</Text>
        <Button onClick={handleLanguageToggle}>{language === 'uk' ? '🇬🇧 EN' : '🇺🇦 UA'}</Button>
      </Flex>
      
      <Flex direction="row" gap="1rem">
        <Button
          onClick={() => setActiveTab('calculation')}
          variation={activeTab === 'calculation' ? 'primary' : undefined}
        >
          {t('tabs.calculation')}
        </Button>
        <Button
          onClick={() => setActiveTab('manufacturers')}
          variation={activeTab === 'manufacturers' ? 'primary' : undefined}
        >
          {t('tabs.manufacturers')}
        </Button>
        <Button
          onClick={() => setActiveTab('solarPanels')}
          variation={activeTab === 'solarPanels' ? 'primary' : undefined}
        >
          {t('tabs.solarPanels')}
        </Button>
      </Flex>

      {activeTab === 'calculation' && (
        <>
          <Card>
            <Flex direction="column" gap="1rem">
              <Autocomplete
                options={solarPanels}
                value={searchPanelValue}
                onChange={setSearchPanelValue}
                onSelect={(panel) => {
                  handlePanelSelect(panel);
                  setSelectedPanelId(panel.id);
                }}
                getOptionLabel={(panel) => getSolarPanelLabel(panel)}
                label={t('calculation.selectSolarPanel')}
                placeholder={t('calculation.chooseSolarPanel')}
              />

              {selectedSolarPanel && selectedSolarPanel.modules && selectedSolarPanel.modules.length > 0 && (
                <ModuleSelector
                  modules={selectedSolarPanel.modules}
                  selectedModuleId={selectedModule?.id || null}
                  onModuleSelect={handleModuleSelect}
                />
              )}

              <Button onClick={() => {
                setModalType('solarPanel');
                setIsModalOpen(true);
              }}>
                {t('calculation.addPanel')}
              </Button>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" gap="1rem">
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
            </Flex>
          </Card>

          {/* Таблица с напряжениями */}
          {selectedSolarPanel && selectedModule && calculatedVoltages.length > 0 && (
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
        </>
      )}

      {activeTab === 'manufacturers' && (
        <Card>
          <Flex direction="column" gap="1rem">
            <Button onClick={() => {
              setModalType('manufacturer');
              setIsModalOpen(true);
            }}>
              {t('modal.addManufacturer')}
            </Button>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('calculation.name')}</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {manufacturers.map((manufacturer) => {
                  return (
                    <tr key={manufacturer.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                      <td style={{ padding: '0.75rem' }}>{manufacturer.name}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <Flex gap="0.5rem" justifyContent="flex-end">
                          <Button size="small" onClick={() => {
                            setSelectedManufacturer(manufacturer);
                            setModalType('manufacturer');
                            setIsModalOpen(true);
                          }}>
                            {t('modal.edit')}
                          </Button>
                          {manufacturer.solarPanels.length === 0 && (
                            <Button 
                              size="small" 
                              variation="destructive" 
                              onClick={() => handleDeleteManufacturer(manufacturer.id)}
                            >
                              {t('modal.delete')}
                            </Button>
                          )}
                        </Flex>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Flex>
        </Card>
      )}

      {activeTab === 'solarPanels' && (
        <Card>
          <Flex direction="column" gap="1rem">
            <Button onClick={() => {
              setModalType('solarPanel');
              setIsModalOpen(true);
            }}>
              {t('modal.addSolarPanel')}
            </Button>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('calculation.name')}</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('calculation.manufacturer')}</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {solarPanels.map((panel) => (
                  <tr key={panel.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                    <td style={{ padding: '0.75rem' }}>{panel.name}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {manufacturers.find(m => m.id === panel.manufacturerId)?.name || t('calculation.unknownManufacturer')}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <Flex gap="0.5rem" justifyContent="flex-end">
                        <Button size="small" onClick={() => {
                          setSelectedSolarPanel(panel);
                          setModalType('solarPanel');
                          setIsModalOpen(true);
                        }}>
                          {t('modal.edit')}
                        </Button>
                        <Button 
                          size="small" 
                          variation="destructive" 
                          onClick={() => handleDeleteSolarPanel(panel.id)}
                        >
                          {t('modal.delete')}
                        </Button>
                      </Flex>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Flex>
        </Card>
      )}

      <Modal
        title={modalType === 'manufacturer' ? 
          (selectedManufacturer ? t('modal.editManufacturer') : t('modal.addManufacturer')) : 
          (selectedSolarPanel ? t('modal.editSolarPanel') : t('modal.addSolarPanel'))}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedManufacturer(undefined);
          setSelectedSolarPanel(undefined);
        }}
        isOpen={isModalOpen}
        type={modalType}
        onSubmit={() => {
          const formSubmitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
          if (formSubmitButton) {
            formSubmitButton.click();
          }
        }}
      >
        {modalType === 'manufacturer' ? (
          <ManufacturerForm
            manufacturer={selectedManufacturer}
            mode={selectedManufacturer ? 'update' : 'create'}
            onSuccess={() => {
              setIsModalOpen(false);
              setSelectedManufacturer(undefined);
            }}
          />
        ) : (
          <SolarPanelForm
            solarPanel={selectedSolarPanel}
            mode={selectedSolarPanel ? 'update' : 'create'}
            onSuccess={() => {
              handlePanelCreate(selectedSolarPanel as SolarPanel);
              setSelectedSolarPanel(undefined);
            }}
          />
        )}
      </Modal>
    </Flex>
  );
}