import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  const video = JSON.parse(req.body);
  await req.db.collection('videos').insertOne(video);
  res.statusCode = 200;
  res.json(video);
});

export default handler;