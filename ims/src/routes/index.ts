import express, { Request, Response } from 'express';

export const router = express.Router();

const apis = `Welcome, following are the APIs available from this server.
---------------------------------------------------------------------------
---------------------------------------------------------------------------

POST         /centres

--------------------------------

POST         /centres/:id/locations

--------------------------------

POST         /assets

--------------------------------

PATCH        /assets/:id

--------------------------------

POST         /:id/allocate

--------------------------------

DELETE       /:id/allocate

--------------------------------
`;

router.get('/', function index(req: Request, res: Response) {
  res.send(apis);
});
