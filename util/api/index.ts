import { Db } from "mongodb";
import { NextApiResponse, NextApiRequest } from "next";
import * as yup from 'yup';
import { type } from "os";

export type FieldType = "number" | "string" | "image"
export type Field = {
  key: string,
  type: FieldType,
  locked?: boolean,
}

export type Filters = { [key: string]: { '>': number, '<': number, '=': string | number, contains: string | number } };

export const fieldSchema: yup.ObjectSchema<Field> = yup.object({
  key: yup.string().required(),
  type: yup.string().oneOf(['number', 'string', 'image']).required(),
  locked: yup.boolean(),
});

export const getFields = (db: Db) => db.collection('fields').find().toArray();

export const getFieldToTypeMap = async (db: Db): Promise<{ [key: string]: FieldType }> => {
  const { fields }: { fields: [Field] } = await db.collection('fields').findOne({});
  const fieldToType = {};
  fields.forEach(({ key, type }) => fieldToType[key] = type);
  return fieldToType;
}

export const filtersToQuery = async (filters: Filters, db: Db) => {
  const fieldsToType = await getFieldToTypeMap(db);
  const query: { [key: string]: any } = {};
  if (filters) {
    Object.entries(filters).forEach(([key, filter]) => {
      query[key] = {};
      if (fieldsToType[key] === 'number') {
        if (filter['>'] !== undefined) query[key].$gt = Number(filter['>']);
        if (filter['<'] !== undefined) query[key].$lt = Number(filter['<']);
        if (filter['='] !== undefined) query[key] = Number(filter['=']);
      } else if (fieldsToType[key] === 'string') {
        if (filter.contains !== undefined) query[key] = { $regex: filter.contains, $options: 'i' };
        if (filter['='] !== undefined) query[key] = filter['='];
      }
    });
  }
  return query;
}

export const handleErrors = async (req: NextApiRequest, res: NextApiResponse, func: Function) => {
  try {
    await func();
  } catch(e) {
    const error = <Error>e;
    console.log('Request to', req.url, 'with body', req.body, 'failed.');
    console.error(e);

    res.statusCode = 400;
    const { name, message } = error;
    res.json({ name, message });
  }
}

export const valueToFieldType = (value): FieldType => {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') {
    if (value.startsWith('data:image/')) {
      return 'image';
    }
  }
  return 'string';
}
