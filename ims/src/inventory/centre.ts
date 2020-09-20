import { UUID } from './uuid';
import { Errors } from './errors';
import { getMessage, getMissingAttributeMessage, incorrectFieldSize } from './validators';

interface ShoppingCentre {
  id: string;
  name: string;
  address: Address;
  locations?: Location[];
}

interface Address {
  lineOne: string;
  lineTwo?: string;
  city: string;
  state: string;
  postCode: string;
  country: string;
}

interface Location {
  id: string;
  code: string;
}

export function buildMakeAddress() {
  return function makeAddress(
    lineOne: string,
    city: string,
    state: string,
    postCode: string,
    country: string,
    lineTwo?: string,
  ): Address | Error {
    const address: Address = {
      lineOne,
      city,
      state,
      postCode,
      country,
      lineTwo,
    };

    const addressCheckFailed = addressChecker(address);
    if (addressCheckFailed != null) {
      return addressCheckFailed;
    }

    return address;
  };
}

function addressChecker(address: Address): Error | null {
  if (!address) {
    return getMissingAttributeMessage('Address');
  }
  if (incorrectFieldSize(address.lineOne, 1, 255)) {
    return getMessage('Address Line One', 1, 255);
  }
  if (address.lineTwo && incorrectFieldSize(address.lineTwo, 1, 150)) {
    return getMessage('Address Line Two', 1, 150);
  }
  if (incorrectFieldSize(address.city, 1, 255)) {
    return getMessage('City', 1, 255);
  }
  if (incorrectFieldSize(address.state, 1, 255)) {
    return getMessage('State', 1, 255);
  }
  if (incorrectFieldSize(address.postCode, 1, 50)) {
    return getMessage('Postal Code', 1, 50);
  }
  if (incorrectFieldSize(address.country, 1, 50)) {
    return getMessage('Country', 1, 50);
  }

  return null;
}

function nameChecker(name: string): Error | null {
  if (incorrectFieldSize(name, 1, 50)) {
    return getMessage('Shopping Centre name', 1, 255);
  }
  return null;
}

export function buildMakeShoppingCentre(uuid: UUID) {
  return function makeShoppingCentre(name: string, address: Address, id = uuid.make()): ShoppingCentre | Error {
    const nameCheckFailed = nameChecker(name);
    if (nameCheckFailed != null) {
      return nameCheckFailed;
    }

    const addressCheckFailed = addressChecker(address);
    if (addressCheckFailed != null) {
      return addressCheckFailed;
    }

    const shoppingCentre: ShoppingCentre = {
      id,
      name,
      address,
    };
    if (!uuid.isValid(shoppingCentre.id)) {
      const err: Error = new Error('ShoppingCentre must have a valid ID');
      err.name = Errors.RuntimeError;
      return err;
    }
    return shoppingCentre;
  };
}

function locationChecker(code: string): Error | null {
  if (incorrectFieldSize(code, 1, 50)) {
    return getMessage('Location code', 1, 50);
  }
  return null;
}

export function buildMakeLocation(uuid: UUID) {
  return function makeLocation(code: string, id = uuid.make()): Location | Error {
    const locationCheckFailed = locationChecker(code);
    if (locationCheckFailed != null) {
      return locationCheckFailed;
    }

    const location: Location = {
      id,
      code,
    };
    if (!uuid.isValid(location.id)) {
      const err: Error = new Error('ShoppingCentre must have a valid ID');
      err.name = Errors.RuntimeError;
      return err;
    }
    return location;
  };
}
