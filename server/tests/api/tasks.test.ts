import { expect, test } from 'vitest';
import { noCookieClient } from './apiClient';
import { DELETE, GET, PATCH, POST } from './utils';

test(GET(noCookieClient.tasks), async () => {
  const res = await noCookieClient.tasks.get();

  expect(res.status).toEqual(200);
});

test(POST(noCookieClient.tasks), async () => {
  const res = await noCookieClient.tasks.post({ body: { label: 'a' } });

  expect(res.status).toEqual(201);
});

test(PATCH(noCookieClient.tasks), async () => {
  const task = await noCookieClient.tasks.$post({ body: { label: 'a' } });
  const res = await noCookieClient.tasks.patch({ body: { taskId: task.id, label: 'b' } });

  expect(res.status).toEqual(204);
});

test(DELETE(noCookieClient.tasks), async () => {
  const task = await noCookieClient.tasks.$post({ body: { label: 'a' } });
  const res = await noCookieClient.tasks.delete({ body: { taskId: task.id } });

  expect(res.status).toEqual(204);
});

test(PATCH(noCookieClient.tasks._taskId('_taskId')), async () => {
  const task = await noCookieClient.tasks.$post({ body: { label: 'a' } });
  const res = await noCookieClient.tasks._taskId(task.id).patch({ body: { label: 'b' } });

  expect(res.status).toEqual(204);
});

test(DELETE(noCookieClient.tasks._taskId('_taskId')), async () => {
  const task = await noCookieClient.tasks.$post({ body: { label: 'a' } });
  const res = await noCookieClient.tasks._taskId(task.id).delete();

  expect(res.status).toEqual(204);
});
