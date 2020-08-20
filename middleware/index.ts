import nextConnect from 'next-connect';
import database, { RequestWithDB } from './database';
import contentType from './contentType';

const middleware = nextConnect();
middleware.use(database);
middleware.use(contentType)
export default middleware;

export type ExtendedRequest = RequestWithDB // & [types of any other middleware used]
export type ExtendedResponse = {} // replace if any middleware extends type of response
