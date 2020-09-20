import { makeManageShoppingCentres } from './centre';
import { makeManageAssets } from './asset';
import { repository } from '../postgres/index';

export const { createShoppingCentre, createLocation } = makeManageShoppingCentres(repository);
export const { createAsset, updateAsset, allocateAsset, deallocateAsset } = makeManageAssets(repository);

// export default createShoppingCentre;
