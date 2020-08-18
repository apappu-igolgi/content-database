import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';
import { Field } from '../../util/server';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  // TODO: validate using yup
  const field: Field = req.body;
  const { fields }: { fields: [Field] } = await req.db.collection('fields').findOne({})
  const newFields = fields.concat(field);
  await req.db.collection('fields').findOneAndReplace({}, { fields: newFields });
  res.statusCode = 200;
  res.json(newFields);
});

export default handler;