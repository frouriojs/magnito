import { expect, test } from 'vitest';
import { apiClient } from '../apiClient';
import { DELETE, GET, PATCH, POST } from '../utils';

test(GET(apiClient.private.tasks), async () => {
  const res = await apiClient.private.tasks.get();

  expect(res.status).toEqual(200);
});

test(POST(apiClient.private.tasks), async () => {
  const res = await apiClient.private.tasks.post({ body: { label: 'a' } });

  expect(res.status).toEqual(201);
});

test(PATCH(apiClient.private.tasks), async () => {
  const task = await apiClient.private.tasks.$post({ body: { label: 'a' } });
  const res = await apiClient.private.tasks.patch({ body: { taskId: task.id, label: 'b' } });

  expect(res.status).toEqual(204);
});

test(DELETE(apiClient.private.tasks), async () => {
  const task = await apiClient.private.tasks.$post({ body: { label: 'a' } });
  const res = await apiClient.private.tasks.delete({ body: { taskId: task.id } });

  expect(res.status).toEqual(204);
});

test(PATCH(apiClient.private.tasks._taskId('_taskId')), async () => {
  const task = await apiClient.private.tasks.$post({ body: { label: 'a' } });
  const res = await apiClient.private.tasks._taskId(task.id).patch({ body: { label: 'b' } });

  expect(res.status).toEqual(204);
});

test(DELETE(apiClient.private.tasks._taskId('_taskId')), async () => {
  const task = await apiClient.private.tasks.$post({ body: { label: 'a' } });
  const res = await apiClient.private.tasks._taskId(task.id).delete();

  expect(res.status).toEqual(204);

  const task2 = await apiClient.private.tasks.$post({ body: { label: 'b', image: new Blob([]) } });
  const res2 = await apiClient.private.tasks._taskId(task2.id).delete();

  expect(res2.status === 204).toBeTruthy();
});
