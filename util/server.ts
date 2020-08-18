import { Db } from "mongodb";
import { NextApiResponse } from "next";

export type FieldType = "number" | "string" | "image"
export type Field = {
  key: string,
  type: FieldType,
  locked?: boolean,
}

export type Filters = { [key: string]: { gt: number, lt: number, equals: string | number, contains: string | number } };

export const getFields = (db: Db) => db.collection('fields').find().toArray();

export const getFieldToTypeMap = async (db: Db): Promise<{ [key: string]: FieldType }> => {
  const { fields } = await db.collection('fields').findOne({});
  const fieldToType = {};
  fields.forEach(({ key, type }) => fieldToType[key] = type);
  return fieldToType;
}

export const filtersToQuery = async (filters: Filters, db: Db) => {
  const fieldsToType = await getFieldToTypeMap(db);
  const query = {};
  if (filters) {
    Object.entries(filters).forEach(([key, { gt, lt, equals, contains }]) => {
      query[key] = {};
      if (fieldsToType[key] === 'number') {
        if (gt !== undefined) query[key].$gt = Number(gt);
        if (lt !== undefined) query[key].$lt = Number(lt);
        if (equals !== undefined) query[key] = Number(equals);
      } else if (fieldsToType[key] === 'string') {
        if (contains !== undefined) query[key] = { $regex: contains, $options: 'i' };
        if (equals !== undefined) query[key] = equals;
      }
    });
  }
  return query;
}

export const handleErrors = async (res: NextApiResponse, func: Function) => {
  try {
    await func();
  } catch(e) {
    const error = <Error>e;
    res.statusCode = 400;
    const { name, message } = error;
    res.json({ name, message });
  }
}