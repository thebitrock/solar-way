'use client';

import { useState, useEffect, FormEvent } from 'react';
import { generateClient } from 'aws-amplify/data';
import { Button, Card, Flex, Input, Label, SelectField, Text, Heading, Divider, Grid, Tabs } from '@aws-amplify/ui-react';
import { useTranslation } from '../hooks/useTranslation';
import { Schema } from '@/amplify/data/resource';
import { SolarPanelFormProps, PanelCharacteristicsInput, ModuleInput } from './SolarPanelForm';

function CharacteristicsForm({ 
  characteristics, 
  onChange, 
  errors,
  t 
}: { 
  characteristics: PanelCharacteristicsInput; 
  onChange: (value: PanelCharacteristicsInput) => void;
  errors?: Record<string, string>;
  t: (key: string) => string; 
}) {
  console.log('Rendering CharacteristicsForm with characteristics:', characteristics);
  return (
    <Flex direction="column" gap="1rem">
      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="maximumPower">{t('solarPanels.maximumPower')}</Label>
        <Input
          id="maximumPower"
          type="number"
          value={characteristics.maximumPower}
          onChange={(e) => onChange({ ...characteristics, maximumPower: e.target.value })}
          placeholder={t('solarPanels.maximumPowerPlaceholder')}
          hasError={!!errors?.maximumPower}
        />
        {errors?.maximumPower && <Text variation="error">{errors.maximumPower}</Text>}
      </Flex>
      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="openCircuitVoltage">{t('solarPanels.openCircuitVoltage')}</Label>
        <Input
          id="openCircuitVoltage"
          type="number"
          value={characteristics.openCircuitVoltage}
          onChange={(e) => onChange({ ...characteristics, openCircuitVoltage: e.target.value })}
          placeholder={t('solarPanels.openCircuitVoltagePlaceholder')}
          hasError={!!errors?.openCircuitVoltage}
        />
        {errors?.openCircuitVoltage && <Text variation="error">{errors.openCircuitVoltage}</Text>}
      </Flex>
      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="shortCircuitCurrent">{t('solarPanels.shortCircuitCurrent')}</Label>
        <Input
          id="shortCircuitCurrent"
          type="number"
          value={characteristics.shortCircuitCurrent}
          onChange={(e) => onChange({ ...characteristics, shortCircuitCurrent: e.target.value })}
          placeholder={t('solarPanels.shortCircuitCurrentPlaceholder')}
          hasError={!!errors?.shortCircuitCurrent}
        />
        {errors?.shortCircuitCurrent && <Text variation="error">{errors.shortCircuitCurrent}</Text>}
      </Flex>
      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="voltageAtMaximumPower">{t('solarPanels.voltageAtMaximumPower')}</Label>
        <Input
          id="voltageAtMaximumPower"
          type="number"
          value={characteristics.voltageAtMaximumPower}
          onChange={(e) => onChange({ ...characteristics, voltageAtMaximumPower: e.target.value })}
          placeholder={t('solarPanels.voltageAtMaximumPowerPlaceholder')}
          hasError={!!errors?.voltageAtMaximumPower}
        />
        {errors?.voltageAtMaximumPower && <Text variation="error">{errors.voltageAtMaximumPower}</Text>}
      </Flex>
      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="currentAtMaximumPower">{t('solarPanels.currentAtMaximumPower')}</Label>
        <Input
          id="currentAtMaximumPower"
          type="number"
          value={characteristics.currentAtMaximumPower}
          onChange={(e) => onChange({ ...characteristics, currentAtMaximumPower: e.target.value })}
          placeholder={t('solarPanels.currentAtMaximumPowerPlaceholder')}
          hasError={!!errors?.currentAtMaximumPower}
        />
        {errors?.currentAtMaximumPower && <Text variation="error">{errors.currentAtMaximumPower}</Text>}
      </Flex>
    </Flex>
  );
}

function ModuleForm({
  module,
  onChange,
  onDelete,
  errors,
  t
}: {
  module: ModuleInput;
  onChange: (module: ModuleInput) => void;
  onDelete?: () => void;
  errors?: {
    power?: string;
    characteristics?: {
      stc?: Record<string, string>;
      noct?: Record<string, string>;
      nmot?: Record<string, string>;
    };
  };
  t: (key: string) => string;
}) {
  const [activeTab, setActiveTab] = useState<'stc' | 'noct' | 'nmot'>('stc');

  useEffect(() => {
    setActiveTab('stc');
  }, []);

  return (
    <Flex direction="column" gap="1rem">
      <Grid templateColumns="1fr auto" gap="1rem" alignItems="flex-start">
        <Flex direction="column" gap="0.5rem">
          <Label htmlFor="power">{t('solarPanels.modulePower')}</Label>
          <Input
            id="power"
            type="number"
            value={module.power}
            onChange={(e) => onChange({ ...module, power: e.target.value })}
            placeholder={t('solarPanels.modulePowerPlaceholder')}
            hasError={!!errors?.power}
          />
          {errors?.power && <Text variation="error">{errors.power}</Text>}
        </Flex>
        {onDelete && (
          <Button variation="destructive" onClick={onDelete} style={{ marginTop: '32px' }}>
            {t('solarPanels.delete')}
          </Button>
        )}
      </Grid>

      <Divider />

      <Flex direction="row" gap="1rem">
        <Button
          variation={activeTab === 'stc' ? 'primary' : 'link'}
          onClick={() => setActiveTab('stc')}
        >
          {t('solarPanels.characteristics.stc')}
          {errors?.characteristics?.stc && (
            <Text variation="error" fontSize="small" marginLeft="0.5rem">
              ⚠️
            </Text>
          )}
        </Button>
        <Button
          variation={activeTab === 'noct' ? 'primary' : 'link'}
          onClick={() => setActiveTab('noct')}
        >
          {t('solarPanels.characteristics.noct')}
          {errors?.characteristics?.noct && (
            <Text variation="error" fontSize="small" marginLeft="0.5rem">
              ⚠️
            </Text>
          )}
        </Button>
        <Button
          variation={activeTab === 'nmot' ? 'primary' : 'link'}
          onClick={() => setActiveTab('nmot')}
        >
          {t('solarPanels.characteristics.nmot')}
          {errors?.characteristics?.nmot && (
            <Text variation="error" fontSize="small" marginLeft="0.5rem">
              ⚠️
            </Text>
          )}
        </Button>
      </Flex>

      {activeTab === 'stc' && (
        <CharacteristicsForm
          characteristics={module.characteristics.stc}
          onChange={(value) => onChange({
            ...module,
            characteristics: {
              ...module.characteristics,
              stc: value
            }
          })}
          errors={errors?.characteristics?.stc}
          t={t}
        />
      )}
      {activeTab === 'noct' && (
        <CharacteristicsForm
          characteristics={module.characteristics.noct}
          onChange={(value) => onChange({
            ...module,
            characteristics: {
              ...module.characteristics,
              noct: value
            }
          })}
          errors={errors?.characteristics?.noct}
          t={t}
        />
      )}
      {activeTab === 'nmot' && (
        <CharacteristicsForm
          characteristics={module.characteristics.nmot}
          onChange={(value) => onChange({
            ...module,
            characteristics: {
              ...module.characteristics,
              nmot: value
            }
          })}
          errors={errors?.characteristics?.nmot}
          t={t}
        />
      )}
    </Flex>
  );
}

const emptyCharacteristics: PanelCharacteristicsInput = {
  maximumPower: '',
  openCircuitVoltage: '',
  shortCircuitCurrent: '',
  voltageAtMaximumPower: '',
  currentAtMaximumPower: '',
};

const emptyModule: ModuleInput = {
  power: '',
  characteristics: {
    stc: { ...emptyCharacteristics },
    noct: { ...emptyCharacteristics },
    nmot: { ...emptyCharacteristics },
  }
};

export default function SolarPanelFormClient({ solarPanel, onSuccess }: SolarPanelFormProps) {
  const t = useTranslation();
  const client = generateClient<Schema>();

  const [name, setName] = useState(solarPanel?.name || '');
  const [manufacturerId, setManufacturerId] = useState(solarPanel?.manufacturerId || '');
  const [temperatureCoefficientOfVOC, setTemperatureCoefficientOfVOC] = useState(
    solarPanel?.temperatureCoefficientOfVOC?.toString() || '0'
  );
  const [temperatureCoefficientOfISC, setTemperatureCoefficientOfISC] = useState(
    solarPanel?.temperatureCoefficientOfISC?.toString() || '0'
  );
  const [temperatureCoefficientOfPmax, setTemperatureCoefficientOfPmax] = useState(
    solarPanel?.temperatureCoefficientOfPmax?.toString() || '0'
  );
  const [manufacturers, setManufacturers] = useState<Array<{ id: string; name: string }>>([]);
  const [modules, setModules] = useState<ModuleInput[]>([]);
  const [activeModuleIndex, setActiveModuleIndex] = useState('0');
  const [errors, setErrors] = useState<{
    name?: string;
    manufacturerId?: string;
    modules?: Record<number, {
      power?: string;
      characteristics?: {
        stc?: Record<string, string>;
        noct?: Record<string, string>;
        nmot?: Record<string, string>;
      };
    }>;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Устанавливаем вкладку STC по умолчанию при монтировании компонента
  useEffect(() => {
    // Если это редактирование существующей панели, устанавливаем вкладку STC
    if (solarPanel?.id) {
      setActiveModuleIndex('0');
    }
  }, [solarPanel?.id]);

  const handleModuleTabChange = (e: FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const value = target.getAttribute('data-value') || '0';
    setActiveModuleIndex(value);
  };

  useEffect(() => {
    console.log('Current activeModuleIndex:', activeModuleIndex);
  }, [activeModuleIndex]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);

        // Загружаем производителей
        const manufacturersResult = await client.models.Manufacturer.list();
        if (!mounted) return;
        
        if (manufacturersResult.data) {
          setManufacturers(manufacturersResult.data);
        }

        // Если редактируем панель, загружаем модули и их характеристики
        if (solarPanel?.id) {
          // Проверяем, есть ли доступ к модели Module
          if (!client.models.Module) {
            console.warn('Module model is not available yet in SolarPanelFormClient');
            setIsLoading(false);
            return;
          }

          try {
            const modulesResult = await client.models.Module.list({
              filter: { solarPanelId: { eq: solarPanel.id } }
            });

            if (!mounted) return;

            if (modulesResult.data && modulesResult.data.length > 0) {
              const loadedModules: ModuleInput[] = [];

              for (const solarPanelModule of modulesResult.data) {
                // Проверяем, есть ли доступ к модели PanelCharacteristics
                if (!client.models.PanelCharacteristics) {
                  console.warn('PanelCharacteristics model is not available yet in SolarPanelFormClient');
                  continue;
                }

                try {
                  const characteristicsResult = await client.models.PanelCharacteristics.list({
                    filter: { moduleId: { eq: solarPanelModule.id } }
                  });

                  if (!mounted) return;

                  const moduleInput: ModuleInput = {
                    id: solarPanelModule.id,
                    power: solarPanelModule.power.toString(),
                    characteristics: {
                      stc: { ...emptyCharacteristics },
                      noct: { ...emptyCharacteristics },
                      nmot: { ...emptyCharacteristics },
                    }
                  };

                  if (characteristicsResult.data) {
                    characteristicsResult.data.forEach((char: any) => {
                      const data = {
                        maximumPower: char.maximumPower.toString(),
                        openCircuitVoltage: char.openCircuitVoltage.toString(),
                        shortCircuitCurrent: char.shortCircuitCurrent.toString(),
                        voltageAtMaximumPower: char.voltageAtMaximumPower.toString(),
                        currentAtMaximumPower: char.currentAtMaximumPower.toString(),
                      };

                      switch (char.type) {
                        case 'STC':
                          moduleInput.characteristics.stc = data;
                          break;
                        case 'NOCT':
                          moduleInput.characteristics.noct = data;
                          break;
                        case 'NMOT':
                          moduleInput.characteristics.nmot = data;
                          break;
                      }
                    });
                  }

                  loadedModules.push(moduleInput);
                } catch (err) {
                  console.error('Error loading characteristics for module:', err);
                  // Продолжаем обработку других модулей даже при ошибке с одним из них
                }
              }

              setModules(loadedModules);
            } else {
              // Если нет модулей, добавляем пустой модуль по умолчанию
              setModules([{ ...emptyModule }]);
            }
          } catch (err) {
            console.error('Error loading modules for panel:', err);
            // При ошибке загрузки модулей добавляем пустой модуль
            setModules([{ ...emptyModule }]);
          }
        } else {
          // Для новой панели добавляем пустой модуль
          setModules([{ ...emptyModule }]);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error loading data:', error);
        setErrors({ name: t('errors.unknown') });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const validateModule = (module: ModuleInput, index: number) => {
    const moduleErrors: {
      power?: string;
      characteristics?: {
        stc?: Record<string, string>;
        noct?: Record<string, string>;
        nmot?: Record<string, string>;
      };
    } = {};

    // Проверка мощности модуля
    if (!module.power) {
      moduleErrors.power = t('errors.powerRequired');
    }

    // Проверяем, заполнены ли какие-либо характеристики
    const hasStcValues = Object.values(module.characteristics.stc).some(value => value !== '');
    const hasNoctValues = Object.values(module.characteristics.noct).some(value => value !== '');
    const hasNmotValues = Object.values(module.characteristics.nmot).some(value => value !== '');

    // Если нет ни одних заполненных характеристик, требуем хотя бы одни
    if (!hasStcValues && !hasNoctValues && !hasNmotValues) {
      if (!moduleErrors.characteristics) {
        moduleErrors.characteristics = {};
      }
      moduleErrors.characteristics.stc = {
        maximumPower: t('errors.atLeastOneCharacteristicsRequired')
      };
    } else {
      // Проверяем только те характеристики, которые начали заполнять
      if (hasStcValues) {
        const stcErrors: Record<string, string> = {};
        if (!module.characteristics.stc.maximumPower) {
          stcErrors.maximumPower = t('errors.maximumPowerRequired');
        }
        if (!module.characteristics.stc.openCircuitVoltage) {
          stcErrors.openCircuitVoltage = t('errors.openCircuitVoltageRequired');
        }
        if (!module.characteristics.stc.shortCircuitCurrent) {
          stcErrors.shortCircuitCurrent = t('errors.shortCircuitCurrentRequired');
        }
        if (!module.characteristics.stc.voltageAtMaximumPower) {
          stcErrors.voltageAtMaximumPower = t('errors.voltageAtMaximumPowerRequired');
        }
        if (!module.characteristics.stc.currentAtMaximumPower) {
          stcErrors.currentAtMaximumPower = t('errors.currentAtMaximumPowerRequired');
        }

        if (Object.keys(stcErrors).length > 0) {
          if (!moduleErrors.characteristics) {
            moduleErrors.characteristics = {};
          }
          moduleErrors.characteristics.stc = stcErrors;
        }
      }

      if (hasNoctValues) {
        const noctErrors: Record<string, string> = {};
        if (!module.characteristics.noct.maximumPower) {
          noctErrors.maximumPower = t('errors.maximumPowerRequired');
        }
        if (!module.characteristics.noct.openCircuitVoltage) {
          noctErrors.openCircuitVoltage = t('errors.openCircuitVoltageRequired');
        }
        if (!module.characteristics.noct.shortCircuitCurrent) {
          noctErrors.shortCircuitCurrent = t('errors.shortCircuitCurrentRequired');
        }
        if (!module.characteristics.noct.voltageAtMaximumPower) {
          noctErrors.voltageAtMaximumPower = t('errors.voltageAtMaximumPowerRequired');
        }
        if (!module.characteristics.noct.currentAtMaximumPower) {
          noctErrors.currentAtMaximumPower = t('errors.currentAtMaximumPowerRequired');
        }

        if (Object.keys(noctErrors).length > 0) {
          if (!moduleErrors.characteristics) {
            moduleErrors.characteristics = {};
          }
          moduleErrors.characteristics.noct = noctErrors;
        }
      }

      if (hasNmotValues) {
        const nmotErrors: Record<string, string> = {};
        if (!module.characteristics.nmot.maximumPower) {
          nmotErrors.maximumPower = t('errors.maximumPowerRequired');
        }
        if (!module.characteristics.nmot.openCircuitVoltage) {
          nmotErrors.openCircuitVoltage = t('errors.openCircuitVoltageRequired');
        }
        if (!module.characteristics.nmot.shortCircuitCurrent) {
          nmotErrors.shortCircuitCurrent = t('errors.shortCircuitCurrentRequired');
        }
        if (!module.characteristics.nmot.voltageAtMaximumPower) {
          nmotErrors.voltageAtMaximumPower = t('errors.voltageAtMaximumPowerRequired');
        }
        if (!module.characteristics.nmot.currentAtMaximumPower) {
          nmotErrors.currentAtMaximumPower = t('errors.currentAtMaximumPowerRequired');
        }

        if (Object.keys(nmotErrors).length > 0) {
          if (!moduleErrors.characteristics) {
            moduleErrors.characteristics = {};
          }
          moduleErrors.characteristics.nmot = nmotErrors;
        }
      }
    }

    return moduleErrors;
  };

  const handleSubmit = async () => {
    try {
      const newErrors: typeof errors = {};

      // Проверка названия панели
      if (!name.trim()) {
        newErrors.name = t('errors.nameRequired');
      }

      // Проверка производителя
      if (!manufacturerId) {
        newErrors.manufacturerId = t('errors.manufacturerRequired');
      }

      // Проверка модулей
      if (modules.length === 0) {
        newErrors.modules = { 0: { power: t('errors.moduleRequired') } };
      } else {
        const moduleErrors: Record<number, ReturnType<typeof validateModule>> = {};
        let hasErrors = false;

        modules.forEach((module, index) => {
          const moduleError = validateModule(module, index);
          if (Object.keys(moduleError).length > 0) {
            moduleErrors[index] = moduleError;
            hasErrors = true;
          }
        });

        if (hasErrors) {
          newErrors.modules = moduleErrors;
        }
      }

      // Если есть ошибки, обновляем состояние и прерываем отправку
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Очищаем ошибки перед отправкой
      setErrors({});

      // Создаем или обновляем панель
      const panelData = {
        name,
        manufacturerId,
        temperatureCoefficientOfVOC: parseFloat(temperatureCoefficientOfVOC),
        temperatureCoefficientOfISC: parseFloat(temperatureCoefficientOfISC),
        temperatureCoefficientOfPmax: parseFloat(temperatureCoefficientOfPmax),
      };

      let panelId: string;

      if (solarPanel?.id) {
        // Обновляем существующую панель
        const result = await client.models.SolarPanel.update({
          id: solarPanel.id,
          ...panelData,
        });
        if (!result.data) throw new Error('Failed to update panel');
        panelId = solarPanel.id;

        // Проверяем, есть ли доступ к модели Module
        if (!client.models.Module) {
          console.warn('Module model is not available yet in handleSubmit');
          setErrors({ modules: { 0: { power: t('errors.moduleNotAvailable') } } });
          return;
        }

        // Получаем список существующих модулей
        try {
          const existingModules = await client.models.Module.list({
            filter: { solarPanelId: { eq: panelId } }
          });

          if (existingModules.data) {
            // Создаем карту существующих модулей по ID
            const existingModulesMap = new Map(
              existingModules.data.map(module => [module.id, module])
            );

            // Модули для удаления (те, которых нет в текущем списке)
            const moduleIdsToKeep = new Set(modules.filter(m => m.id).map(m => m.id));
            const modulesToDelete = existingModules.data.filter(m => !moduleIdsToKeep.has(m.id));

            // Удаляем ненужные модули и их характеристики
            for (const solarPanelModule of modulesToDelete) {
              // Проверяем, есть ли доступ к модели PanelCharacteristics
              if (client.models.PanelCharacteristics) {
                // Сначала удаляем характеристики модуля
                try {
                  const existingCharacteristics = await client.models.PanelCharacteristics.list({
                    filter: { moduleId: { eq: solarPanelModule.id } }
                  });

                  if (existingCharacteristics.data) {
                    await Promise.all(
                      existingCharacteristics.data.map(char => 
                        client.models.PanelCharacteristics.delete({ id: char.id })
                      )
                    );
                  }
                } catch (err) {
                  console.error('Error deleting characteristics for module:', err);
                }
              }

              // Затем удаляем сам модуль
              try {
                await client.models.Module.delete({ id: solarPanelModule.id });
              } catch (err) {
                console.error('Error deleting module:', err);
              }
            }
          }
        } catch (err) {
          console.error('Error handling existing modules:', err);
        }
      } else {
        // Создаем новую панель
        const result = await client.models.SolarPanel.create(panelData);
        if (!result.data) throw new Error('Failed to create panel');
        panelId = result.data.id;
      }

      // Проверяем, есть ли доступ к модели Module
      if (!client.models.Module) {
        console.warn('Module model is not available yet for creating modules');
        // Даже если модуль не доступен, мы создали панель, так что можно завершить
        onSuccess();
        return;
      }

      // Создаем или обновляем модули и их характеристики
      for (const moduleInput of modules) {
        let moduleId: string;

        if (moduleInput.id) {
          // Обновляем существующий модуль
          try {
            const result = await client.models.Module.update({
              id: moduleInput.id,
              power: parseFloat(moduleInput.power),
              solarPanelId: panelId,
            });
            if (!result.data) throw new Error('Failed to update module');
            moduleId = moduleInput.id;

            // Проверяем, есть ли доступ к модели PanelCharacteristics
            if (client.models.PanelCharacteristics) {
              // Удаляем существующие характеристики модуля
              try {
                const existingCharacteristics = await client.models.PanelCharacteristics.list({
                  filter: { moduleId: { eq: moduleId } }
                });

                if (existingCharacteristics.data) {
                  await Promise.all(
                    existingCharacteristics.data.map(char => 
                      client.models.PanelCharacteristics.delete({ id: char.id })
                    )
                  );
                }
              } catch (err) {
                console.error('Error deleting characteristics for existing module:', err);
              }
            }
          } catch (err) {
            console.error('Error updating module:', err);
            continue; // Пропускаем этот модуль и переходим к следующему
          }
        } else {
          // Создаем новый модуль
          try {
            const result = await client.models.Module.create({
              power: parseFloat(moduleInput.power),
              solarPanelId: panelId,
            });
            if (!result.data) throw new Error('Failed to create module');
            moduleId = result.data.id;
          } catch (err) {
            console.error('Error creating module:', err);
            continue; // Пропускаем этот модуль и переходим к следующему
          }
        }

        // Проверяем, есть ли доступ к модели PanelCharacteristics
        if (!client.models.PanelCharacteristics) {
          console.warn('PanelCharacteristics model is not available yet for creating characteristics');
          continue;
        }

        // Создаем характеристики для модуля
        const createCharacteristicsPromises = [];

        // STC
        if (Object.values(moduleInput.characteristics.stc).every(value => value !== '')) {
          try {
            createCharacteristicsPromises.push(
              client.models.PanelCharacteristics.create({
                type: 'STC',
                maximumPower: parseFloat(moduleInput.characteristics.stc.maximumPower),
                openCircuitVoltage: parseFloat(moduleInput.characteristics.stc.openCircuitVoltage),
                shortCircuitCurrent: parseFloat(moduleInput.characteristics.stc.shortCircuitCurrent),
                voltageAtMaximumPower: parseFloat(moduleInput.characteristics.stc.voltageAtMaximumPower),
                currentAtMaximumPower: parseFloat(moduleInput.characteristics.stc.currentAtMaximumPower),
                moduleId: moduleId,
              })
            );
          } catch (err) {
            console.error('Error creating STC characteristics:', err);
          }
        }

        // NOCT
        if (Object.values(moduleInput.characteristics.noct).every(value => value !== '')) {
          try {
            createCharacteristicsPromises.push(
              client.models.PanelCharacteristics.create({
                type: 'NOCT',
                maximumPower: parseFloat(moduleInput.characteristics.noct.maximumPower),
                openCircuitVoltage: parseFloat(moduleInput.characteristics.noct.openCircuitVoltage),
                shortCircuitCurrent: parseFloat(moduleInput.characteristics.noct.shortCircuitCurrent),
                voltageAtMaximumPower: parseFloat(moduleInput.characteristics.noct.voltageAtMaximumPower),
                currentAtMaximumPower: parseFloat(moduleInput.characteristics.noct.currentAtMaximumPower),
                moduleId: moduleId,
              })
            );
          } catch (err) {
            console.error('Error creating NOCT characteristics:', err);
          }
        }

        // NMOT
        if (Object.values(moduleInput.characteristics.nmot).every(value => value !== '')) {
          try {
            createCharacteristicsPromises.push(
              client.models.PanelCharacteristics.create({
                type: 'NMOT',
                maximumPower: parseFloat(moduleInput.characteristics.nmot.maximumPower),
                openCircuitVoltage: parseFloat(moduleInput.characteristics.nmot.openCircuitVoltage),
                shortCircuitCurrent: parseFloat(moduleInput.characteristics.nmot.shortCircuitCurrent),
                voltageAtMaximumPower: parseFloat(moduleInput.characteristics.nmot.voltageAtMaximumPower),
                currentAtMaximumPower: parseFloat(moduleInput.characteristics.nmot.currentAtMaximumPower),
                moduleId: moduleId,
              })
            );
          } catch (err) {
            console.error('Error creating NMOT characteristics:', err);
          }
        }

        try {
          await Promise.all(createCharacteristicsPromises);
        } catch (err) {
          console.error('Error creating characteristics batch:', err);
        }
      }

      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ name: t('errors.unknown') });
    }
  };

  const handleModuleChange = (index: number, moduleInput: ModuleInput) => {
    const newModules = [...modules];
    newModules[index] = moduleInput;
    setModules(newModules);
  };

  const handleAddModule = () => {
    const newModules = [...modules, { ...emptyModule }];
    setModules(newModules);
    const newIndex = newModules.length - 1;
    setActiveModuleIndex(newIndex.toString());
    // Ensure the new module's characteristics are initialized
    if (!newModules[newIndex].characteristics) {
      newModules[newIndex].characteristics = {
        stc: { ...emptyCharacteristics },
        noct: { ...emptyCharacteristics },
        nmot: { ...emptyCharacteristics },
      };
    }
  };

  const handleDeleteModule = (index: number) => {
    if (modules.length <= 1) return;
    const newModules = [...modules];
    newModules.splice(index, 1);
    setModules(newModules);
    if (parseInt(activeModuleIndex) >= index && parseInt(activeModuleIndex) > 0) {
      setActiveModuleIndex((parseInt(activeModuleIndex) - 1).toString());
    }
  };

  if (isLoading) {
    return <Text>{t('common.loading')}</Text>;
  }

  return (
    <Flex direction="column" gap="1.5rem" as="form" onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}>
      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="name">{t('solarPanels.name')}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('solarPanels.namePlaceholder')}
          hasError={!!errors.name}
          required
        />
        {errors.name && <Text variation="error">{errors.name}</Text>}
      </Flex>

      <Flex direction="column" gap="0.5rem">
        <Label htmlFor="manufacturerId">{t('solarPanels.selectManufacturer')}</Label>
        <SelectField
          id="manufacturerId"
          label=""
          value={manufacturerId}
          onChange={(e) => setManufacturerId(e.target.value)}
          placeholder={t('solarPanels.chooseManufacturer')}
          hasError={!!errors.manufacturerId}
          required
        >
          {manufacturers.map((manufacturer) => (
            <option key={manufacturer.id} value={manufacturer.id}>
              {manufacturer.name}
            </option>
          ))}
        </SelectField>
        {errors.manufacturerId && <Text variation="error">{errors.manufacturerId}</Text>}
      </Flex>

      <Grid templateColumns="1fr 1fr 1fr" gap="1rem">
        <Flex direction="column" gap="0.5rem">
          <Label htmlFor="temperatureCoefficientOfVOC">
            {t('solarPanels.temperatureCoefficientOfVOC')}
          </Label>
          <Input
            id="temperatureCoefficientOfVOC"
            type="number"
            value={temperatureCoefficientOfVOC}
            onChange={(e) => setTemperatureCoefficientOfVOC(e.target.value)}
            required
          />
        </Flex>
        <Flex direction="column" gap="0.5rem">
          <Label htmlFor="temperatureCoefficientOfISC">
            {t('solarPanels.temperatureCoefficientOfISC')}
          </Label>
          <Input
            id="temperatureCoefficientOfISC"
            type="number"
            value={temperatureCoefficientOfISC}
            onChange={(e) => setTemperatureCoefficientOfISC(e.target.value)}
            required
          />
        </Flex>
        <Flex direction="column" gap="0.5rem">
          <Label htmlFor="temperatureCoefficientOfPmax">
            {t('solarPanels.temperatureCoefficientOfPmax')}
          </Label>
          <Input
            id="temperatureCoefficientOfPmax"
            type="number"
            value={temperatureCoefficientOfPmax}
            onChange={(e) => setTemperatureCoefficientOfPmax(e.target.value)}
            required
          />
        </Flex>
      </Grid>

      <Divider />

      <Flex direction="column" gap="1rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={5}>{t('solarPanels.modules')}</Heading>
          <Button onClick={handleAddModule}>
            + {t('solarPanels.addModule')}
          </Button>
        </Flex>
        <Flex direction="row" gap="0.5rem" wrap="wrap">
          {modules.map((module, index) => (
            <Button
              key={`module-button-${index}`}
              onClick={() => setActiveModuleIndex(index.toString())}
              variation={activeModuleIndex === index.toString() ? 'primary' : 'link'}
            >
              {module.power ? `${module.power}W` : t('solarPanels.newModule')}
              {errors.modules?.[index] && (
                <Text variation="error" fontSize="small" marginLeft="0.5rem">
                  ⚠️
                </Text>
              )}
            </Button>
          ))}
        </Flex>
        {modules.length > 0 && modules[parseInt(activeModuleIndex)] && (
          <Card>
            <ModuleForm
              module={modules[parseInt(activeModuleIndex)]}
              onChange={(moduleInput) => handleModuleChange(parseInt(activeModuleIndex), moduleInput)}
              onDelete={modules.length > 1 ? () => handleDeleteModule(parseInt(activeModuleIndex)) : undefined}
              errors={errors.modules?.[parseInt(activeModuleIndex)]}
              t={t}
            />
          </Card>
        )}
      </Flex>

      <button type="submit" style={{ display: 'none' }}></button>
    </Flex>
  );
} 