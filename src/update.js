"use strict";

import Sequelize from "sequelize";
import SchemaLoader from "./server/schema/SchemaLoader";
import { getCurrentMonth } from "./core/utils";

function padded(val) {
  const padding = val < 10 ? "0" : "";
  return padding + val;
}

function format(date) {
  return date.getFullYear() + "-" +
    padded(date.getMonth() + 1) + "-" + 
    padded(date.getDate()); 
}

const dbUser = process.env.DB_USER || "omatalous";
const dbPassword = process.env.DB_PASSWORD || "omatalous";
const sequelize = new Sequelize("omatalous", dbUser, dbPassword, {  
  host: process.env.DB_HOSTNAME || process.env.PG_PORT_5432_TCP_ADDR || "localhost",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

const schemaLoader = new SchemaLoader(sequelize);
const [ User, Transaction, Copy ] = [
  schemaLoader.loadSchema("User"),
  schemaLoader.loadSchema("Transaction"),
  schemaLoader.loadSchema("Copy")
];

const now = new Date();
Transaction.selectAll({ 
  type: "repeating",
  $or: [
    { repeatValue: now.getDay() },
    { repeatValue: now.getDate() }
  ]
})
.then(async (transactions) => {
  
  console.log(`Found ${transactions.length} repeating txs`);
  for (let tx of transactions) {

    try {

      const today = format(now);
      console.log("Check for copies at", today);
      const copies = await Copy.selectAll({ 
        transaction: tx.uuid,
        date: today
      });
      
      console.log("Found copies", copies.length);

      if (copies.length === 0) {

        let copy = Object.assign({}, tx.json());
        console.log("Copying tx", tx.uuid);
        delete copy.uuid;
        delete copy.repeats;
        delete copy.repeatValue;
        copy.type = "copy";
        copy.month = getCurrentMonth();

        copy = await Transaction.schema.create(copy);
        console.log("Created copy", copy.uuid); 

        const copyRecord = await Copy.schema.create({
          user: tx.user,
          transaction: tx.uuid,
          copy: copy.uuid,
          date: today
        });

        console.log(`Copy record: ${copyRecord.transaction} => ${copyRecord.copy}`);

      }

    } catch (err) {
      console.log("TX COPY ERR!!!", err);
    }

  }

})
.catch((err) => {
  console.log("UPDATE ERROR!!!", err);
});

