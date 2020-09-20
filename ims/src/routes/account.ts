import express, { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export const account = express.Router();

account.post('/register', function register(req: Request, res: Response) {
  res.send('Register');
});

account.post('/login', function login(req: Request, res: Response) {
  const token = jwt.sign({ id: 'ckf86rol70001z10fb3oy3ph5' }, process.env.TOKEN_SECRET as string);
  res.header('auth-token', token).send(token);
});
