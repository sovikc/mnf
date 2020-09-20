import { Repository, makeAsset } from '../inventory/maker';
import { ErrorMessages, Errors } from '../inventory/errors';

export function makeManageAssets(repository: Repository) {
  async function createAsset(
    userID: string,
    name: string,
    length: number,
    breadth: number,
    depth: number,
    active: boolean,
  ) {
    const asset = makeAsset(name, length, breadth, depth, active);
    if (asset instanceof Error) {
      throw asset;
    }

    // check if there is an existing record in DB with this name
    const matchingAsset = await repository.findAssetMatch(name).catch((err) => {
      throw err;
    });

    if (matchingAsset) {
      const err = new Error(ErrorMessages.AssetExists); // An Asset with this name already exists.
      err.name = Errors.ConflictError;
      throw err;
    }

    const assetID = await repository.storeAsset(asset, userID).catch((err) => {
      throw err;
    });

    asset.id = assetID;

    return asset;
  }

  async function updateAsset(
    userID: string,
    assetID: string,
    name: string | undefined,
    length: number | undefined,
    breadth: number | undefined,
    depth: number | undefined,
    active: boolean | undefined,
  ) {
    if (!assetID) {
      const err = new Error(ErrorMessages.ValidAssetID); // 'Asset ID is necessary to update the Asset information'
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    // check if there is an existing record in DB with all this combination
    const asset = await repository.findAssetByID(assetID).catch((err) => {
      throw err;
    });
    if (!asset) {
      const err = new Error(ErrorMessages.NonExistentAsset); // `This Asset does'nt exist`
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    if (name && name !== asset.name) {
      const existingAsset = await repository.findAssetMatch(name).catch((err) => {
        throw err;
      });
      if (existingAsset) {
        const err = new Error(ErrorMessages.AssetExists); // 'An Asset with this name already exists'
        err.name = Errors.ConflictError;
        throw err;
      }
      asset.name = name;
    }

    if (length) {
      asset.length = length;
    }
    if (breadth) {
      asset.breadth = breadth;
    }
    if (depth) {
      asset.depth = depth;
    }

    let removeAssetAllocation = false;
    if (typeof active !== 'undefined') {
      asset.active = active;
      if (!active) {
        removeAssetAllocation = true;
      }
    }

    const numericID = await repository.updateAsset(asset, userID).catch((err) => {
      throw err;
    });

    if (numericID <= 0) {
      const err = new Error(ErrorMessages.UnknownError);
      err.name = Errors.RuntimeError;
      throw err;
    }

    if (removeAssetAllocation) {
      const allocation = await repository.findAssetAllocation(assetID).catch((err) => {
        throw err;
      });

      await repository.removeAllocation(allocation.centreID, allocation.locationID, assetID, userID).catch((err) => {
        throw err;
      });
    }

    return asset;
  }

  async function allocateAsset(userID: string, id: string, centreID: string, code: string) {
    const centre = await repository.findCentreByID(centreID).catch((err) => {
      throw err;
    });
    if (!centre) {
      const err = new Error(ErrorMessages.NonExistentCentre); // `This Shopping Centre doesn't exist`
      err.name = Errors.InvalidRequestError;
      throw err;
    }
    const location = await repository.findLocationMatch(code, centreID).catch((err) => {
      throw err;
    });
    if (!location) {
      const err = new Error(ErrorMessages.NonExistentLocationInCentre); // `This Location code doesn't exist in this Shopping Centre`
      err.name = Errors.InvalidRequestError;
      throw err;
    }
    // check if there is an existing record in DB with this id
    const asset = await repository.findAssetByID(id).catch((err) => {
      throw err;
    });
    // can only be allocated if asset = active and centre = correct and location = correct and location = !occupied
    if (!asset) {
      const err = new Error(ErrorMessages.NonExistentAsset); // `This Asset doesn't exist`
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    const allocation = await repository.findAllocationByLocation(centreID, location.id).catch((err) => {
      throw err;
    });
    if (allocation) {
      const err = new Error(ErrorMessages.AssetAllocationConflict);
      err.name = Errors.ConflictError;
      throw err;
    }

    await repository.storeAllocation(centreID, location.id, id, userID).catch((err) => {
      throw err;
    });

    asset.location = code;
    return asset;
  }

  async function deallocateAsset(userID: string, id: string) {
    // check if there is an existing record in DB with this id
    const asset = await repository.findAssetByID(id).catch((err) => {
      throw err;
    });
    // can only be allocated if asset = active and centre = correct and location = correct and location = !occupied
    if (!asset) {
      const err = new Error(`This Asset doesn't exist`);
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    const allocation = await repository.findAssetAllocation(id).catch((err) => {
      throw err;
    });
    if (!allocation) {
      const err = new Error(`There is no allocation for this asset.`);
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    const numericID = await repository
      .removeAllocation(allocation.centreID, allocation.locationID, id, userID)
      .catch((err) => {
        throw err;
      });

    if (numericID <= 0) {
      const err = new Error(ErrorMessages.UnknownError);
      err.name = Errors.RuntimeError;
      throw err;
    }

    return asset;
  }
  return { createAsset, allocateAsset, deallocateAsset, updateAsset };
}
