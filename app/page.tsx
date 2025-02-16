"use client";

import '@aws-amplify/ui-react/styles.css';
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import ManufacturerCreateForm from '@/ui-components/ManufacturerCreateForm';
import { Card, Grid, SelectField } from '@aws-amplify/ui-react';
import SolarPanelCreateForm from '@/ui-components/SolarPanelCreateForm';
// import { ManufacturerSelectField } from './components/ManufacturerSelectField';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [manufacturerList, setTodos] = useState<Array<Schema["Manufacturer"]["type"]>>([]);

  function listManufacturer() {
    client.models.Manufacturer.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listManufacturer();
  }, []);

  function deleteManufacturer(id: string) {
    client.models.Manufacturer.delete({ id })
  }

  return (
    <main>
      <Grid
        columnGap="0.5rem"
        rowGap="0.5rem"
        templateColumns="1fr 1fr 1fr"
        templateRows="1fr 3fr 1fr"
      >
        <Card
          columnStart="1"
          columnEnd="-1"
        >
          Voltage calculator
        </Card>
        <Card
          columnStart="1"
          columnEnd="1"
        >
          <SelectField
            label="Manufacturer"
            descriptiveText="Which manufacturer of solar panels?"
          >
            {manufacturerList.map((manufacturer) => (<option key={manufacturer.id}>{manufacturer.name}</option>))}
          </SelectField>
        </Card>
        <Card
          columnStart="1"
          columnEnd="-1"
        >
          <SolarPanelCreateForm/>
          Footer
        </Card>
      </Grid>
      <ManufacturerCreateForm />
      {/* <ManufacturerSelectField/> */}
      <h1>Manufactur list</h1>
      <ul>
        {manufacturerList.map((manufacturer) => (
          <li
            onClick={() => deleteManufacturer(manufacturer.id)}
            key={manufacturer.id}>{manufacturer.name}</li>
        ))}
      </ul>
      {/* <div>
        🥳 App successfully hosted. Try creating a new manufacturer.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div> */}
    </main>
  );
}