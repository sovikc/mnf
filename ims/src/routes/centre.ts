import express, { Request, Response } from 'express';
import { addCentre, addLocation } from '../controllers/index';
import { handle } from './handler';
import { verify } from './auth';

export const centres = express.Router();

centres.post('/pro', verify, function pro(req: Request, res: Response): any {
  /* const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET as string);
    const userID = verified;
    console.log(userID);
  } catch (err) {
    return res.status(400).send('Invalid token');
  } */

  return res.status(200).send('Welcome');
});

centres.post('/', verify, handle(addCentre));
centres.post('/:id/locations', verify, handle(addLocation));
/* centres.post('/:id/locations', verify, function pro(req: Request, res: Response): any {
  console.log('id: ', req.params.id);
  res.status(200).send(req.params.id);
});*/
