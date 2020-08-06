import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';
import { ObjectID } from 'mongodb';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  const idsToDelete = JSON.parse(req.body);
  const deletedCount = await req.db.collection('videos').deleteMany({ _id: { $in: idsToDelete.map(id => new ObjectID(id)) }});
  res.statusCode = 200;
  res.json(deletedCount);
});

export default handler;