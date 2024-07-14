import assert from 'assert';
import { InbucketAPIClient } from 'inbucket-js-client';

export const GET = (api: { $path: () => string }): string => `GET: ${api.$path()}`;
export const POST = (api: { $path: () => string }): string => `POST: ${api.$path()}`;
export const PATCH = (api: { $path: () => string }): string => `PATCH: ${api.$path()}`;
export const DELETE = (api: { $path: () => string }): string => `DELETE: ${api.$path()}`;

assert(process.env.INBUCKET_URL);

export const inbucketClient = new InbucketAPIClient(process.env.INBUCKET_URL);

export const fetchMailBodyAndTrash = async (email: string): Promise<string> => {
  const mailbox = await inbucketClient.mailbox(email);
  const message = await inbucketClient.message(email, mailbox[0].id);
  await inbucketClient.deleteMessage(email, mailbox[0].id);

  return message.body.text.trim();
};
