"use client";

import '@aws-amplify/ui-react/styles.css';
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import TodoCreateForm from "@/ui-components/TodoCreateForm";
import ManufacturerCreateForm from '@/ui-components/ManufacturerCreateForm';
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

  function createManufacturer() {
    client.models.Manufacturer.create({
      name: window.prompt("Manufacturer name"),
    });
  }

    
  function deleteManufacturer(id: string) {
    client.models.Manufacturer.delete({ id })
  }

  return (
    <main> 
      <ManufacturerCreateForm/>
      {/* <ManufacturerSelectField/> */}
      <h1>Manufactur list</h1>
      <button onClick={createManufacturer}>+ new</button>
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