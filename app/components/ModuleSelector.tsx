import { Button, Card, Flex, Text, Grid } from '@aws-amplify/ui-react';
import { Module, PanelCharacteristics } from '../types';

interface ModuleSelectorProps {
  modules: Module[];
  selectedModuleId: string | null;
  onModuleSelect: (moduleId: string) => void;
}

export default function ModuleSelector({ modules, selectedModuleId, onModuleSelect }: ModuleSelectorProps) {
  return (
    <Flex direction="column" gap="1rem">
      <Flex direction="row" gap="0.5rem" wrap="wrap">
        {modules.map((module) => (
          <Button
            key={module.id}
            variation={selectedModuleId === module.id ? "primary" : "link"}
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