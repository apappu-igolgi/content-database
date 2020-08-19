import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../../middleware';
import { Field, handleErrors } from '../../../util/api';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

// Given a list of key, unlocks the corresponding fields
handler.post<ExtendedRequest, ExtendedResponse>((req, res) => {
  handleErrors(req, res, async () => {
    const keys: [string] = req.body;
    await yup.array().min(1).of(yup.string()).validate(keys);

    const { fields }: { fields: [Field] } = await req.db.collection('fields').findOne({});

    keys.forEach(key => fields.find(field => field.key === key).locked = false);
    await req.db.collection('fields').findOneAndReplace({}, { fields });

    res.statusCode = 200;
    res.json(fields);
  });
});

export default handler;