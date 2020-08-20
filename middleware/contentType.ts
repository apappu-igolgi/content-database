import { NextApiRequest, NextApiResponse } from 'next';

export default async function contentType(req: NextApiRequest, res: NextApiResponse, next) {
  if (req.headers["content-type"] === 'application/json') {
    return next();
  }

  res.statusCode = 415;
  res.json({
    name: "Unsupported Content Type",
    message: "Please use JSON for the request body and make sure the Content-Type header is set to 'application/json'"
  })
}
