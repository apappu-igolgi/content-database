import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';
import { ObjectID } from 'mongodb';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  const {_id, ...video} = JSON.parse(req.body)
  try {
    await req.db.collection('videos').updateOne({ _id: new ObjectID(_id) }, { $set: video });
  } catch(e) {
    console.error(e);
  }
  res.statusCode = 200;
  res.json(video);
});

export default handler;