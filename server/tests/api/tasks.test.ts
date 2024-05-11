import { expect, test } from 'vitest';
import { apiClient } from './apiClient';
import { DELETE, GET, PATCH, POST } from './utils';

test(GET(apiClient.tasks), async () => {
  const res = await apiClient.tasks.get();

  expect(res.status).toEqual(200);
});

test(POST(apiClient.tasks), async () => {
  const res = await apiClient.tasks.post({ body: { label: 'a' } });

  expect(res.status).toEqual(201);
});

test(PATCH(apiClient.tasks), async () => {
  const task = await apiClient.tasks.$post({ body: { label: 'a' } });
  const res = await apiClient.tasks.patch({ body: { taskId: task.id, label: 'b' } });

  expect(res.status).toEqual(204);
});

test(DELETE(apiClient.tasks), async () => {
  const task = await apiClient.tasks.$post({ body: { label: 'a' } });
  const res = await apiClient.tasks.delete({ body: { taskId: task.id } });

  expect(res.status).toEqual(204);
});

test(PATCH(apiClient.tasks._taskId('_taskId')), async () => {
  const task = await apiClient.tasks.$post({ body: { label: 'a' } });
  const res = await apiClient.tasks._taskId(task.id).patch({ body: { label: 'b' } });

  expect(res.status).toEqual(204);
});

test(DELETE(apiClient.tasks._taskId('_taskId')), async () => {
  const task = await apiClient.tasks.$post({ body: { label: 'a' } });
  const res = await apiClient.tasks._taskId(task.id).delete();

  expect(res.status).toEqual(204);
});
