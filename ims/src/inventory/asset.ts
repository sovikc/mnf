import { UUID } from './uuid';
import { Errors } from './errors';
import { getMessage, getNumericTypeMessage, incorrectFieldSize, incorrectNumeric } from './validators';

interface Asset {
  id: string;
  name: string;
  length: number;
  breadth: number;
  depth: number;
  active: boolean;
  location?: string;
}

/* export enum Status {
  Active = 'Active',
  Offline = 'Offline',
} */

function nameChecker(name: string): Error | null {
  if (incorrectFieldSize(name, 1, 255)) {
    return getMessage('Asset name', 1, 255);
  }
  return null;
}

function dimensionChecker(length: any, breadth: any, depth: any): Error | null {
  const dimensionName: string = '';
  let counter = 0;
  if (incorrectNumeric(length)) {
    dimensionName.concat('Length');
    counter += 1;
  }

  if (incorrectNumeric(breadth)) {
    if (counter > 0) dimensionName.concat(', ');
    dimensionName.concat('Breadth');
    counter += 1;
  }

  if (incorrectNumeric(depth)) {
    if (counter > 0) dimensionName.concat(', ');
    dimensionName.concat('Depth');
    counter += 1;
  }

  if (counter > 0) {
    return getNumericTypeMessage(dimensionName);
  }

  return null;
}

export function buildMakeAsset(uuid: UUID) {
  return function makeAsset(
    name: string,
    length: number,
    breadth: number,
    depth: number,
    active: boolean,
    id = uuid.make(),
    location?: string,
  ): Asset | Error {
    const nameCheckFailed = nameChecker(name);
    if (nameCheckFailed != null) {
      return nameCheckFailed;
    }

    const dimensionCheckFailed = dimensionChecker(length, breadth, depth);
    if (dimensionCheckFailed != null) {
      return dimensionCheckFailed;
    }

    const asset: Asset = {
      name,
      length,
      breadth,
      depth,
      active,
      id,
      location,
    };
    if (!uuid.isValid(asset.id)) {
      const err: Error = new Error('Asset must have a valid ID');
      err.name = Errors.RuntimeError;
      return err;
    }
    return asset;
  };
}
