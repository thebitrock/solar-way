import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Manufacturer: a
    .model({
      name: a.string().required(),
      solarPanels: a.hasMany('SolarPanel', 'manufacturerId')
    })
    .authorization((allow) => [allow.guest()]),
  SolarPanel: a
    .model({
      manufacturer: a.belongsTo('Manufacturer', 'manufacturerId'),
      manufacturerId: a.id().required(),
      name: a.string().required(),
      temperatureCoefficientOfVOC: a.float().required(),
      temperatureCoefficientOfISC: a.float().required(),
      temperatureCoefficientOfPmax: a.float().required(),
      modules: a.hasMany('Module', 'solarPanelId')
    })
    .authorization((allow) => [allow.guest()]),
  Module: a
    .model({
      power: a.float().required(),
      solarPanel: a.belongsTo('SolarPanel', 'solarPanelId'),
      solarPanelId: a.id().required(),
      characteristics: a.hasMany('PanelCharacteristics', 'moduleId')
    })
    .authorization((allow) => [allow.guest()]),
  PanelCharacteristics: a
    .model({
      maximumPower: a.float().required(),
      openCircuitVoltage: a.float().required(),
      shortCircuitCurrent: a.float().required(),
      voltageAtMaximumPower: a.float().required(),
      currentAtMaximumPower: a.float().required(),
      module: a.belongsTo('Module', 'moduleId'),
      moduleId: a.id().required(),
      type: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
