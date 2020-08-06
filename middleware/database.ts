
import { MongoClient, Db } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.MONGODB_CONNECTION_STRING;
const client = new MongoClient(uri, { useNewUrlParser: true });

export interface RequestWithDB { dbClient: MongoClient, db: Db }

export default async function database(req: NextApiRequest & RequestWithDB, res: NextApiResponse, next) {
  if (!client.isConnected()) {
    await client.connect();
  }

  req.dbClient = client;
  req.db = client.db('video-organizer');
  
  return next();
}
