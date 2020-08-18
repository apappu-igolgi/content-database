import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';
import { Field } from '../../util/server';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  // TODO: validate using yup
  const { keys }: { keys: [string] } = req.body;
  const { fields }: { fields: [Field] } = await req.db.collection('fields').findOne({})

  const keyToFieldMap: { [key: string]: Field } = {};
  fields.forEach(field => keyToFieldMap[field.key] = field);
  const newFields = keys.map(key => keyToFieldMap[key]);

  await req.db.collection('fields').findOneAndReplace({}, { fields: newFields });

  res.statusCode = 200;
  res.json(newFields);
});

export default handler;