import cuid from 'cuid';
import { UUID } from '../inventory/uuid';

const ID: UUID = {
  make(): string {
    return cuid();
  },
  isValid(id: string): boolean {
    return cuid.isCuid(id);
  },
};

export default ID;