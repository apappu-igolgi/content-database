import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';
import { Field } from '../../util/server';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  // TODO: validate using yup
  const { oldKey, field } = req.body;

  const { fields }: { fields: [Field] } = await req.db.collection('fields').findOne({})
  const fieldIndex = fields.findIndex(field => field.key === oldKey);
  if (!fields[fieldIndex].locked) { // the field is only able to be updated if it's not locked
    // update the field and save to database
    fields.splice(fieldIndex, 1, { ...fields[fieldIndex], ...field });
    await req.db.collection('fields').findOneAndReplace({}, { fields });

    // update the key for every video with that field
    await req.db.collection('videos').updateMany({ [oldKey]: { $exists: true } }, [
      { $set: { [field.key]: `$${oldKey}` } }, // add the new key with the value referenced by the old key
      { $unset: oldKey }, // remove the old key
    ]);
  }

  res.statusCode = 200;
  res.json(fields);
});

export default handler;