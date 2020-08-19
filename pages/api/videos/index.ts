import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import { ObjectID } from 'mongodb';

import middleware, { ExtendedRequest, ExtendedResponse } from '../../../middleware';
import { Filters, filtersToQuery, handleErrors, Field, valueToFieldType } from '../../../util/api';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

// Given a start and end number, and filters, retrieves the corresponding list of videos
handler.get<ExtendedRequest, ExtendedResponse>((req, res) => {
  handleErrors(req, res, async () => {
    // Note: both start and end are inclusive
    const start = Number(req.query.start);
    const end = Number(req.query.end);
    const filters: Filters = req.query.filters ? JSON.parse(decodeURIComponent(<string>req.query.filters)) : undefined;

    const schema = yup.object().shape({
      start: yup.number().required().positive().integer().min(0),
      end: yup.number().required().positive().integer().min(start),
      filters: yup.object().nullable(),
    });

    await schema.validate({ start, end, filters });
    const query = await filtersToQuery(filters, req.db);

    const videos = await req.db.collection('videos')
      .find(query)
      .sort({ _id: 1 })
      .skip(start)
      .limit(end - start + 1) // +1 because we want end to be inclusive
      .toArray();

    res.statusCode = 200;
    res.json(videos);
  });
});

// Given a list of video objects, adds them to the database, as well as any new fields found in those videos
handler.post<ExtendedRequest, ExtendedResponse>((req, res) => {
  handleErrors(req, res, async () => {
    const videos: [any] = req.body;
    await yup.array().min(1).validate(videos);
    await req.db.collection('videos').insertMany(videos);

    // Add any new fields found in the provided videos
    const { fields }: { fields: [Field] } = await req.db.collection('fields').findOne({});
    const fieldKeysSet = new Set(fields.map(({ key }) => key));
    videos.forEach(video => {
      Object.entries(video).forEach(([key, value]) => {
        if (key !== '_id' && !fieldKeysSet.has(key)) {
          fields.push({ key, type: valueToFieldType(value) });
          fieldKeysSet.add(key);
        }
      });
    });
    await req.db.collection('fields').findOneAndReplace({}, { fields });

    const newCount = await req.db.collection('videos').find({}).count();
    res.statusCode = 200;
    res.json(newCount);
  });
});

// Updates the fields of a video identified by the provided _id
handler.put<ExtendedRequest, ExtendedResponse>((req, res) => {
  handleErrors(req, res, async () => {
    const updatedVideos: [any] = req.body;
    await yup.array().min(1).of(yup.object({ _id: yup.string().required() })).validate(updatedVideos);

    updatedVideos.forEach(async ({ _id, ...video }) => {
      await req.db.collection('videos').updateOne({ _id: new ObjectID(_id) }, { $set: video });
    })
    
    res.statusCode = 200;
    res.json(updatedVideos);
  });
});

// Given a list of ids, deletes the corresponding videos
handler.delete<ExtendedRequest, ExtendedResponse>((req, res) => {
  handleErrors(req, res, async () => {
    const idsToDelete: [string] = req.body;
    await yup.array().min(1).of(yup.string()).validate(idsToDelete);

    await req.db.collection('videos').deleteMany({ _id: { $in: idsToDelete.map(id => new ObjectID(id)) } });

    const newCount = await req.db.collection('videos').find({}).count();
    res.statusCode = 200;
    res.json(newCount);
  });
});

export default handler;
