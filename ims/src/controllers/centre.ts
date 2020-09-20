import { ErrorCodes } from '../inventory/errors';
import { HttpResponse } from './response';

export function makeAddCentre(addShoppingCentre: any) {
  return async function addCentre(httpRequest: any): Promise<HttpResponse> {
    const { body } = httpRequest;

    if (
      !body.user.id ||
      !body.name ||
      !body.address ||
      !body.address.lineOne ||
      !body.address.city ||
      !body.address.postCode ||
      !body.address.country
    ) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A manadatory attribute was missing. Please try again.',
        },
      };
    }

    try {
      const centre = await addShoppingCentre(
        body.user.id,
        body.name,
        body.address.lineOne,
        body.address.city,
        body.address.state,
        body.address.postCode,
        body.address.country,
        body.address.lineTwo,
      );

      const data: any = {};
      data.type = 'ShoppingCentre';
      data.id = centre.id;
      data.attributes = {};
      data.attributes.name = centre.name;
      data.attributes.address = centre.address;
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

export function makeAddLocation(addCentreLocation: any) {
  return async function addLocation(httpRequest: any): Promise<HttpResponse> {
    const { body, params } = httpRequest;

    if (!body.user.id || !params.id || !body.code) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A mandatory attribute or parameter was missing. Please try again.',
        },
      };
    }

    try {
      const location = await addCentreLocation(body.user.id, params.id, body.code);
      const data: any = {};
      data.type = 'Location';
      data.id = location.id;
      data.attributes = {};
      data.attributes.code = location.code;
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
