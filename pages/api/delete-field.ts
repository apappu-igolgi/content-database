import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';
import { Field } from '../../util/server';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  const { key }: { key: string } = req.body;
  const { fields }: { fields: [Field] } = await req.db.collection('fields').findOne({})

  const fieldIndex = fields.findIndex(field => field.key === key);
  if (!fields[fieldIndex].locked) { // locked fields cannot be removed
    // remove field
    fields.splice(fieldIndex, 1);
    await req.db.collection('fields').findOneAndReplace({}, { fields });

    // remove corresponding key from all videos with that key
    await req.db.collection('videos').updateMany({ [key]: { $exists: true } }, { $unset: { [key]: '' } });
  }

  res.statusCode = 200;
  res.json(fields);
});

export default handler;