import ID from '../id/gen';
import { buildMakeAddress, buildMakeLocation, buildMakeShoppingCentre } from './centre';
import { buildMakeAsset } from './asset';

const makeAddress = buildMakeAddress();
const makeShoppingCentre = buildMakeShoppingCentre(ID);
const makeLocation = buildMakeLocation(ID);
const makeAsset = buildMakeAsset(ID);

export interface Repository {
  findCentreByID(centreID: string): Promise<any>;
  findCentreMatch(centre: any): Promise<any[]>;
  storeCentre(centre: any, createdBy: string): Promise<string>;
  findLocationMatch(code: string, centreID: string): Promise<any>;
  storeLocation(location: any, centreID: string, createdBy: string): Promise<string>;
  findAssetByID(assetID: string): Promise<any>;
  findAssetMatch(name: string): Promise<any>;
  storeAsset(asset: any, createdBy: string): Promise<string>;
  updateAsset(asset: any, createdBy: string): Promise<number>;
  findAllocationByLocation(centreID: string, locationID: string): Promise<any>;
  findAssetAllocation(assetID: string): Promise<any>;
  storeAllocation(centreID: string, locationID: any, assetID: any, userID: string): Promise<number>;
  removeAllocation(centreID: string, locationID: any, assetID: any, userID: string): Promise<number>;
}

export { makeAddress, makeAsset, makeLocation, makeShoppingCentre };
