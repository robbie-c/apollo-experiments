import "reflect-metadata";

import { join } from "path";
import { Connection, createConnection } from "typeorm";
import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";
const parentDir = join(__dirname, "..");

const connectionOpts: MongoConnectionOptions = {
  type: "mongodb",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 27017,
  database: process.env.DB_NAME || "apollo-experiments",
  entities: [`${parentDir}/entities/*.ts`],
  synchronize: true,
  useNewUrlParser: true
};

const connection: Promise<Connection> = createConnection(connectionOpts);

export default connection;
