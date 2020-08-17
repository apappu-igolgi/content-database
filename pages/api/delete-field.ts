import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  const { key } = req.body;
  const { fields } = await req.db.collection('fields').findOne({})
  const newFields = fields.filter(field => field.key !== key);
  await req.db.collection('fields').findOneAndReplace({}, { fields: newFields });
  res.statusCode = 200;
  res.json({}); // TODO
});

export default handler;