import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  // TODO: validate using yup
  const { key, name, type } = JSON.parse(req.body);
  const { fields } = await req.db.collection('fields').findOne({})
  const newFields = fields.concat({ key, name, type });
  await req.db.collection('fields').findOneAndReplace({}, { fields: newFields });
  res.statusCode = 200;
  res.json({}); // TODO
});

export default handler;