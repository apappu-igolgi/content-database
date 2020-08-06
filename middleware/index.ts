import nextConnect from 'next-connect';
import database, { RequestWithDB } from './database';

const middleware = nextConnect();
middleware.use(database);
export default middleware;

export type ExtendedRequest = RequestWithDB // & [types of any other middleware used]
export type ExtendedResponse = {} // replace if any middleware extends type of response
