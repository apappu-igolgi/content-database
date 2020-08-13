import { NextApiRequest, NextApiResponse } from 'next';

export default async function database(req: NextApiRequest, res: NextApiResponse, next) {
  if (req.headers["content-type"] === 'application/json') {
    return next();
  }

  res.statusCode = 415;
  res.json({
    name: "Unsupported Content Type",
  })
}
