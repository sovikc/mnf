import { Pool } from 'pg';
import { makeRepository } from './repository';

function port(): number {
  const dbPort = process.env.DB_PORT;
  if (!dbPort) {
    return 5432;
  }
  const portNumber = parseInt(dbPort, 10);
  if (Number.isNaN(portNumber)) {
    return 5432;
  }
  return portNumber;
}

const connectionPool = new Pool({
  host: process.env.DB_HOST,
  port: port(),
  max: 20,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const repository = makeRepository(connectionPool);
