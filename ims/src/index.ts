/* eslint-disable import/first */
import express, { Request, Response } from 'express';
import * as http from 'http';
import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/.env` });

import { router } from './routes/index';
import { centres } from './routes/centre';
import { assets } from './routes/asset';
import { account } from './routes/account';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
app.use('/account', account);
app.use('/assets', assets);
app.use('/centres', centres);
app.use(function unmatched(req: Request, res: Response) {
  return res.status(404).send('Invalid Request');
});

const { PORT = 3000 } = process.env;
const server = http.createServer(app);
server.listen(PORT, function startup() {
  console.log('server listening on', PORT);
});
