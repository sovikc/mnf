import { ErrorCodes } from '../inventory/errors';
import { HttpResponse } from './response';

export function makeAddAsset(addSignageAsset: any) {
  return async function addAsset(httpRequest: any): Promise<HttpResponse> {
    const { body } = httpRequest;

    if (!body.user.id || !body.name || !body.length || !body.breadth || !body.depth || !body.active) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A mandatory attribute was missing. Please try again.',
        },
      };
    }

    try {
      const asset = await addSignageAsset(body.user.id, body.name, body.length, body.breadth, body.depth, body.active);

      const data: any = {};
      data.type = 'Asset';
      data.id = asset.id;
      data.attributes = {};
      data.attributes.name = asset.name;
      data.attributes.active = asset.active;
      data.attributes.length = asset.length;
      data.attributes.breadth = asset.breadth;
      data.attributes.depth = asset.depth;
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: { data },
      };
    } catch (e) {
      console.log(e);
      let msg = e.message;
      let code = ErrorCodes[e.name];
      if (!ErrorCodes[e.name] || ErrorCodes[e.name] === 500) {
        msg = 'An unknown error has occured.';
        code = 500;
      }

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: code,
        body: {
          error: msg,
        },
      };
    }
  };
}

export function makeAllocateAsset(allocateAssetFromCentre: any) {
  return async function allocateAsset(httpRequest: any): Promise<HttpResponse> {
    const { body, params } = httpRequest;

    if (!body.user.id || !params.id || !body.centreId || !body.locationCode) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A mandatory attribute was missing. Please try again.',
        },
      };
    }

    try {
      const asset = await allocateAssetFromCentre(body.user.id, params.id, body.centreId, body.locationCode);

      const data: any = {};
      data.type = 'Asset';
      data.id = asset.id;
      data.attributes = {};
      data.attributes.name = asset.name;
      data.attributes.active = asset.active;
      data.attributes.length = asset.length;
      data.attributes.breadth = asset.breadth;
      data.attributes.depth = asset.depth;
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: { data },
      };
    } catch (e) {
      console.log(e);
      let msg = e.message;
      let code = ErrorCodes[e.name];
      if (!ErrorCodes[e.name] || ErrorCodes[e.name] === 500) {
        msg = 'An unknown error has occured.';
        code = 500;
      }

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: code,
        body: {
          error: msg,
        },
      };
    }
  };
}

export function makeDeallocateAsset(deallocateAssetFromCentre: any) {
  return async function deallocateAsset(httpRequest: any): Promise<HttpResponse> {
    const { body, params } = httpRequest;

    if (!body.user.id || !params.id) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A mandatory attribute was missing. Please try again.',
        },
      };
    }

    try {
      const asset = await deallocateAssetFromCentre(body.user.id, params.id);

      const data: any = {};
      data.type = 'Asset';
      data.id = asset.id;
      data.attributes = {};
      data.attributes.name = asset.name;
      data.attributes.active = asset.active;
      data.attributes.length = asset.length;
      data.attributes.breadth = asset.breadth;
      data.attributes.depth = asset.depth;
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: { data },
      };
    } catch (e) {
      console.log(e);
      let msg = e.message;
      let code = ErrorCodes[e.name];
      if (!ErrorCodes[e.name] || ErrorCodes[e.name] === 500) {
        msg = 'An unknown error has occured.';
        code = 500;
      }

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: code,
        body: {
          error: msg,
        },
      };
    }
  };
}

export function makeUpdateAsset(updateSignageAsset: any) {
  return async function updateAsset(httpRequest: any): Promise<HttpResponse> {
    const { body, params } = httpRequest;

    if (!body.user.id || !params.id) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A mandatory attribute was missing. Please try again.',
        },
      };
    }

    try {
      const asset = await updateSignageAsset(
        body.user.id,
        params.id,
        body.name,
        body.length,
        body.breadth,
        body.depth,
        body.active,
      );

      const data: any = {};
      data.type = 'Asset';
      data.id = asset.id;
      data.attributes = {};
      data.attributes.name = asset.name;
      data.attributes.active = asset.active;
      data.attributes.length = asset.length;
      data.attributes.breadth = asset.breadth;
      data.attributes.depth = asset.depth;
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: { data },
      };
    } catch (e) {
      console.log(e);
      let msg = e.message;
      let code = ErrorCodes[e.name];
      if (!ErrorCodes[e.name] || ErrorCodes[e.name] === 500) {
        msg = 'An unknown error has occured.';
        code = 500;
      }

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: code,
        body: {
          error: msg,
        },
      };
    }
  };
}
