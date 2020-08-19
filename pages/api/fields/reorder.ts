import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';

import middleware, { ExtendedRequest, ExtendedResponse } from '../../../middleware';
import { Field, handleErrors } from '../../../util/api';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

// Reorders the fields by the provided order of keys
handler.post<ExtendedRequest, ExtendedResponse>((req, res) => {
  handleErrors(req, res, async () => {
    const keys: [string] = req.body;
    await yup.array().min(1).of(yup.string()).validate(keys);
  
    const { fields }: { fields: [Field] } = await req.db.collection('fields').findOne({})
  
    const keyToFieldMap: { [key: string]: Field } = {};
    fields.forEach(field => keyToFieldMap[field.key] = field);
    const newFields = keys.map(key => keyToFieldMap[key]);
  
    await req.db.collection('fields').findOneAndReplace({}, { fields: newFields });
  
    res.statusCode = 200;
    res.json(newFields);
  })
});

export default handler;