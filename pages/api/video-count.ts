import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';
import { Filters, filtersToQuery } from '../../util/server';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.get<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  const filters: Filters = req.query.filters ? JSON.parse(decodeURIComponent(<string>req.query.filters)) : undefined;
  const query = await filtersToQuery(filters, req.db);
  const count = await req.db.collection('videos').find(query).count();
  res.statusCode = 200;
  res.json(count);
});

export default handler;