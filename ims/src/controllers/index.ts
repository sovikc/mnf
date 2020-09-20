import { makeAddCentre, makeAddLocation } from './centre';
import { makeAddAsset, makeAllocateAsset, makeDeallocateAsset, makeUpdateAsset } from './asset';
import {
  allocateAsset,
  createAsset,
  createLocation,
  createShoppingCentre,
  deallocateAsset,
  updateAsset,
} from '../management/index';

const addCentre = makeAddCentre(createShoppingCentre);
const addLocation = makeAddLocation(createLocation);
const addAsset = makeAddAsset(createAsset);
const modifyAsset = makeUpdateAsset(updateAsset);
const allocateAssetToCentre = makeAllocateAsset(allocateAsset);
const deallocateAssetFromCentre = makeDeallocateAsset(deallocateAsset);

export { addCentre, addLocation, addAsset, modifyAsset, allocateAssetToCentre, deallocateAssetFromCentre };
