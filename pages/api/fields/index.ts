import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import middleware, { ExtendedRequest, ExtendedResponse } from '../../../middleware';
import { Field, handleErrors, fieldSchema } from '../../../util/api';

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

// Retrieves the list of fields
handler.get<ExtendedRequest, ExtendedResponse>((req, res) => {
  handleErrors(req, res, async () => {
    const { fields }: { fields: [Field] } = await req.db.collection('fields').findOne({});
    res.statusCode = 200;
    res.json(fields);
  })
});

// Adds the provided new fields to the list of fields
handler.post<ExtendedRequest, ExtendedResponse>((req, res) => {
  handleErrors(req, res, async () => {
    const newFields: [Field] = req.body;
    await yup.array().min(1).of(fieldSchema).validate(newFields);

    const { fields }: { fields: [Field] } = await req.db.collection('fields').findOne({});
    const keys = new Set(fields.map(({ key }) => key));
    newFields.forEach(field => {
      if (keys.has(field.key)) {
        throw Error(`Field with key '${field.key}' already exists`);
      }
      fields.push(field);
      keys.add(field.key);
    })
    await req.db.collection('fields').findOneAndReplace({}, { fields });

    res.statusCode = 200;
    res.json(fields);
  })
});

// Updates fields given an old key, and new field data
handler.put<ExtendedRequest, ExtendedResponse>((req, res) => {
  handleErrors(req, res, async () => {
    const fieldUpdates: [{ oldKey: string, field: Field }] = req.body;
    await yup.array().min(1).of(yup.object({
      oldKey: yup.string().required(),
      field: fieldSchema.required(),
    })).validate(fieldUpdates);

    const { fields }: { fields: [Field] } = await req.db.collection('fields').findOne({})

    const oldToNewKeyMap: { [key: string]: string } = {};

    fieldUpdates.forEach(({ oldKey, field }) => {
      const fieldIndex = fields.findIndex(field => field.key === oldKey);
      if (fieldIndex < 0) {
        throw Error(`No field found with key: '${oldKey}'`);
      }
      if (fields[fieldIndex].locked) {
        throw Error(`Cannot update locked field: '${oldKey}'`);
      }

      fields.splice(fieldIndex, 1, { ...fields[fieldIndex], ...field }); // update field
      oldToNewKeyMap[oldKey] = field.key; // used later to update videos
    });

    // save updated fields to the database
    await req.db.collection('fields').findOneAndReplace({}, { fields });
    
    // update the keys for every video with any of those fields
    const fieldsToAdd = {};
    Object.entries(oldToNewKeyMap).forEach(([oldKey, newKey]) => fieldsToAdd[newKey] = `$${oldKey}`);
    await req.db.collection('videos').updateMany({}, [
      { $set: fieldsToAdd }, // first add the new keys with the value referenced by the old key
      { $unset: Object.keys(oldToNewKeyMap) } // then remove all the old keys
    ]);

    res.statusCode = 200;
    res.json(fields);
  });
});

// Deletes fields identified by the provided keys
handler.delete<ExtendedRequest, ExtendedResponse>((req, res) => {
  handleErrors(req, res, async () => {
    const keys: [string] = req.body;
    await yup.array().min(1).of(yup.string()).validate(keys);
  
    const { fields }: { fields: [Field] } = await req.db.collection('fields').findOne({})
  
    keys.forEach(key => {
      const fieldIndex = fields.findIndex(field => field.key === key);
      if (fieldIndex < 0) {
        throw Error(`No field found with key: '${key}'`);
      }
      if (fields[fieldIndex].locked) {
        throw Error(`Cannot delete locked field: '${key}'`);
      }
  
      fields.splice(fieldIndex, 1); // remove field
    })

    // save fields to database
    await req.db.collection('fields').findOneAndReplace({}, { fields });
  
    // remove corresponding key from all videos with that key
    const keysObject = {};
    keys.forEach(key => keysObject[key] = '');
    await req.db.collection('videos').updateMany({}, { $unset: keysObject });
  
    res.statusCode = 200;
    res.json(fields);
  })
});

export default handler;