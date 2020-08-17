import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  // TODO: validate using yup
  const { oldKey, key, type } = req.body;

  // update the field
  const { fields } = await req.db.collection('fields').findOne({})
  const fieldToUpdate = fields.find(field => field.key === oldKey);
  fieldToUpdate.key = key;
  fieldToUpdate.type = type;
  await req.db.collection('fields').findOneAndReplace({}, { fields });

  // update the key for every video with that field
  await req.db.collection('videos').updateMany({ [oldKey]: { $exists: true } }, [
    { $set: { [key]: `$${oldKey}` } }, // add the new key with the value referenced by the old key
    { $unset: oldKey }, // remove the old key
  ]);

  res.statusCode = 200;
  res.json({}); // TODO
});

export default handler;