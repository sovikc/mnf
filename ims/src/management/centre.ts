import { Repository, makeAddress, makeLocation, makeShoppingCentre } from '../inventory/maker';
import { ErrorMessages, Errors } from '../inventory/errors';

export function makeManageShoppingCentres(repository: Repository) {
  async function createShoppingCentre(
    userID: string,
    name: string,
    lineOne: string,
    city: string,
    state: string,
    postCode: string,
    country: string,
    lineTwo?: string,
  ) {
    const address = makeAddress(lineOne, city, state, postCode, country, lineTwo);
    if (address instanceof Error) {
      throw address;
    }
    const shoppingCentre = makeShoppingCentre(name, address);
    if (shoppingCentre instanceof Error) {
      throw shoppingCentre;
    }

    // check if there is an existing record in DB with all this combination
    const centres = await repository.findCentreMatch(shoppingCentre).catch((err) => {
      throw err;
    });
    const matchingCenterExists = centres.length > 0;
    if (matchingCenterExists) {
      const err = new Error(ErrorMessages.CentreExists); // 'This Shopping Centre already exists'
      err.name = Errors.ConflictError;
      throw err;
    }

    const centreID = await repository.storeCentre(shoppingCentre, userID).catch((err) => {
      throw err;
    });

    shoppingCentre.id = centreID;

    return shoppingCentre;
  }

  async function createLocation(userID: string, centreID: string, code: string) {
    if (centreID && centreID.trim().length === 0) {
      const err = new Error(ErrorMessages.ValidCentreID); // 'Please enter a valid centreID'
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    if (code && code.trim().length === 0) {
      const err = new Error(ErrorMessages.ValidLocationCode); // 'Please enter a valid location code'
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    // check if there is an existing record in DB with all this combination
    const centre = await repository.findCentreByID(centreID).catch((err) => {
      throw err;
    });

    if (!centre) {
      const err = new Error(ErrorMessages.ValidCentreID); // 'Please enter a valid centreID'
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    const location = makeLocation(code);
    if (location instanceof Error) {
      throw location;
    }

    // check if there is an existing record in DB with all this combination
    const matchingLocation = await repository.findLocationMatch(code, centreID).catch((err) => {
      throw err;
    });

    if (matchingLocation) {
      const err = new Error(ErrorMessages.LocationExists); // 'This Location already exists'
      err.name = Errors.ConflictError;
      throw err;
    }

    const locationID = await repository.storeLocation(location, centreID, userID).catch((err) => {
      throw err;
    });

    location.id = locationID;

    return location;
  }

  return { createShoppingCentre, createLocation };

  // updateShoppingCentre
  // removeShoppingCentre - should also remove all the Assets allocations
}
