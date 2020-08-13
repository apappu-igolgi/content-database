// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../middleware';
import { Filters, filtersToQuery } from '../../util/server';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.get<ExtendedRequest, ExtendedResponse>((req, res) => {
  // Note: both start and end are inclusive
  const start = Number(req.query.start);
  const end = Number(req.query.end);
  const filters : Filters = req.query.filters ? JSON.parse(decodeURIComponent(<string>req.query.filters)) : undefined;

  const schema = yup.object().shape({
    start: yup.number().required().positive().integer().min(0),
    end: yup.number().required().positive().integer().min(start),
    filters: yup.object().nullable(),
  });

  schema.validate({ start, end, filters }).then(async () => {
    const query = await filtersToQuery(filters, req.db);

    const videos = await req.db.collection('videos')
      .find(query)
      .sort({ _id: 1 })
      .skip(start)
      .limit(end - start + 1) // +1 because we want end to be inclusive
      .toArray();
    
    res.statusCode = 200;
    res.json(videos);
  }).catch(err => {
    console.error(err);
    res.statusCode = 400;
    res.json({ error: err.name, details: err.errors.join('\n') });
  });
});


export default handler;
