import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  // TODO: validate using yup
  const { keys } = req.body;
  const { fields } = await req.db.collection('fields').findOne({})

  const keyToFieldMap = {};
  fields.forEach(field => keyToFieldMap[field.key] = field);
  const newFields = keys.map(key => keyToFieldMap[key]);

  console.log('reorder')
  console.log(newFields);

  await req.db.collection('fields').findOneAndReplace({}, { fields: newFields });

  res.statusCode = 200;
  res.json(newFields);
});

export default handler;