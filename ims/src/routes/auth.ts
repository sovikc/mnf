import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

// eslint-disable-next-line consistent-return
export function verify(req: Request, res: Response, next: any) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET as string);
    // eslint-disable-next-line dot-notation
    req.body.user = verified as string;
    next();
  } catch (err) {
    return res.status(401).send('Access Denied');
  }
}
