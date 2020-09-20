import express from 'express';
import { addAsset, allocateAssetToCentre, deallocateAssetFromCentre, modifyAsset } from '../controllers/index';
import { handle } from './handler';
import { verify } from './auth';

export const assets = express.Router();

assets.post('/', verify, handle(addAsset));
assets.patch('/:id', verify, handle(modifyAsset));
assets.post('/:id/allocate', verify, handle(allocateAssetToCentre));
assets.delete('/:id/allocate', verify, handle(deallocateAssetFromCentre));
