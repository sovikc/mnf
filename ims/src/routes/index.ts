import express, { Request, Response } from 'express';

export const router = express.Router();

const apis = `Welcome, following are the APIs available from this server.
---------------------------------------------------------------------------
---------------------------------------------------------------------------

POST         /operators

--------------------------------

POST         /sessions

--------------------------------

POST         /centres

--------------------------------

PATCH        /centres/:id

--------------------------------

DELETE       /centres/:id

--------------------------------
`;

router.get('/', function index(req: Request, res: Response) {
  res.send(apis);
});
