import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.get<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  const filters = req.query.filters ? JSON.parse(decodeURIComponent(<string>req.query.filters)) : undefined;

  let query = undefined;
  if (filters) {
    query = {};
    Object.entries(filters).forEach(([key, { gt, lt, equals, contains }]) => {
      query[key] = {};
      if (typeof gt === 'number') query[key].$gt = gt;
      if (typeof lt === 'number') query[key].$lt = lt;
      if (typeof contains !== 'object') query[key] = { $text: { $search: contains } };
      if (typeof equals !== 'object') query[key] = equals;
    });
  }

  const count = await req.db.collection('videos').find(query).count();
  res.statusCode = 200;
  res.json(count);
});

export default handler;