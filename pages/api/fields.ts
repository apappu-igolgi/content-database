import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.get<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  const { fields } = await req.db.collection('fields').findOne({});
  res.statusCode = 200;
  res.json(fields);
});

export default handler;