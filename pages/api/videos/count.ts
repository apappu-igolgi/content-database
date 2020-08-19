import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../../middleware';
import { Filters, filtersToQuery, handleErrors } from '../../../util/api';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.get<ExtendedRequest, ExtendedResponse>((req, res) => {
  handleErrors(req, res, async () => {
    const filters: Filters = req.query.filters ? JSON.parse(decodeURIComponent(<string>req.query.filters)) : undefined;
    await yup.object().nullable().validate(filters);

    const query = await filtersToQuery(filters, req.db);
    const count = await req.db.collection('videos').find(query).count();
    res.statusCode = 200;
    res.json(count);
  });
});

export default handler;