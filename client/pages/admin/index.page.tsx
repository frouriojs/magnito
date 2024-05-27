import type { TaskEntity } from 'api/@types/task';
import { Loading } from 'components/Loading/Loading';
import { Layout } from 'layouts/Layout';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import { returnNull } from 'utils/returnNull';
import styles from './index.module.css';

const Admin = () => {
  const [tasks, setTasks] = useState<TaskEntity[]>();
  const [label, setLabel] = useState('');
  const fetchTasks = async () => {
    const tasks = await apiClient.tasks.$get().catch(returnNull);

    if (tasks !== null) setTasks(tasks);
  };
  const createTask = async (e: FormEvent) => {
    e.preventDefault();

    await apiClient.tasks.post({ body: { label } }).catch(returnNull);
    setLabel('');
    await fetchTasks();
  };
  const toggleDone = async (task: TaskEntity) => {
    await apiClient.tasks
      ._taskId(task.id)
      .patch({ body: { done: !task.done } })
      .catch(returnNull);
    await fetchTasks();
  };
  const deleteTask = async (task: TaskEntity) => {
    await apiClient.tasks._taskId(task.id).delete().catch(returnNull);
    await fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (!tasks) return <Loading visible />;

  return (
    <Layout
      pageRole="admin"
      content={(user) => (
        <div className={styles.container}>
          <div>Todo list of {user.name}</div>
          <div className={styles.main}>
            <div className={styles.card}>
              <form onSubmit={createTask}>
                <div className={styles.controls}>
                  <input
                    value={label}
                    className={styles.textInput}
                    type="text"
                    placeholder="Todo task"
                    onChange={(e) => setLabel(e.target.value)}
                  />
                  <input className={styles.btn} disabled={label === ''} type="submit" value="ADD" />
                </div>
              </form>
            </div>
            {tasks.map((task) => (
              <div key={task.id} className={styles.card}>
                <div className={styles.controls}>
                  <input type="checkbox" checked={task.done} onChange={() => toggleDone(task)} />
                  <span>{task.label}</span>
                  <input
                    type="button"
                    value="DELETE"
                    className={styles.btn}
                    onClick={() => deleteTask(task)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
};

export default Admin;
