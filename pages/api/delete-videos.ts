import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { ObjectID } from 'mongodb';
import * as yup from 'yup';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';
import { handleErrors } from '../../util/server';


const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
  handleErrors(res, async () => {
    const idsToDelete = req.body;
    await yup.array().of(yup.string()).validate(idsToDelete);
    const { deletedCount } = await req.db.collection('videos').deleteMany({ _id: { $in: idsToDelete.map(id => new ObjectID(id)) }});
    res.statusCode = 200;
    res.json(deletedCount);
  });
});

export default handler;