import { Request, Response } from 'express';

export function handle(controller: any) {
  return async (req: Request, res: Response) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent'),
      },
    };
    try {
      const httpResponse = await controller(httpRequest);
      if (httpResponse.headers) {
        res.set(httpResponse.headers);
      }
      res.type('json');
      return res.status(httpResponse.statusCode).send(httpResponse.body);
    } catch (err) {
      return res.status(500).send({ error: 'An unkown error occurred.' });
    }
  };
}
