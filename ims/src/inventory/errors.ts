export enum Errors {
  RuntimeError = 'Runtime Error',
  ConflictError = 'Conflicting Entity',
  InvalidRequestError = 'Invalid Request',
  InvalidAttributeError = 'Invalid Attribute',
  DataNotFoundError = 'Data Not Found',
}

enum codes {
  RuntimeError = 500,
  ConflictError = 409,
  InvalidRequestError = 400,
  InvalidAttributeError = 422,
  DataNotFoundError = 404,
}

export const ErrorCodes: { [key: string]: codes } = {
  [Errors.RuntimeError]: codes.RuntimeError,
  [Errors.ConflictError]: codes.ConflictError,
  [Errors.InvalidRequestError]: codes.InvalidRequestError,
  [Errors.InvalidAttributeError]: codes.InvalidAttributeError,
  [Errors.DataNotFoundError]: codes.DataNotFoundError,
};

export enum ErrorMessages {
  UnknownError = 'There was an unknown error',
  ValidCentreID = 'Please enter a valid centreID',
  CentreExists = 'This Shopping Centre already exists',
  NonExistentCentre = `This Shopping Centre doesn't exist`,
  ValidLocationCode = 'Please enter a valid location code',
  LocationExists = 'This Location already exists',
  NonExistentLocationInCentre = 'This Location code does not exist in this Shopping Centre',
  AssetExists = 'An Asset with this name already exists',
  ValidAssetID = 'Asset ID is necessary to update the Asset information',
  NonExistentAsset = 'This Asset does not exist',
  AssetAllocationConflict = 'There is an asset allocated to this location. Please remove the current allocation before reallocating another asset',
}
