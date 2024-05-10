import type { TaskEntity } from 'api/@types/task';
import { Loading } from 'components/Loading/Loading';
import { useAtom } from 'jotai';
import { BasicHeader } from 'pages/@components/BasicHeader/BasicHeader';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import { returnNull } from 'utils/returnNull';
import { userAtom } from '../atoms/user';
import styles from './index.module.css';

const Home = () => {
  const [user] = useAtom(userAtom);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [tasks, setTasks] = useState<TaskEntity[]>();
  const [label, setLabel] = useState('');
  const [image, setImage] = useState<File>();
  const [previewImageUrl, setPreviewImageUrl] = useState<string>();
  const inputLabel = (e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };
  const inputFile = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0]);
  };
  const fetchTasks = async () => {
    const tasks = await apiClient.private.tasks.$get().catch(returnNull);

    if (tasks !== null) setTasks(tasks);
  };
  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileRef.current) return;

    await apiClient.private.tasks.post({ body: { label, image } }).catch(returnNull);
    setLabel('');
    setImage(undefined);
    setPreviewImageUrl(undefined);
    fileRef.current.value = '';
    await fetchTasks();
  };
  const toggleDone = async (task: TaskEntity) => {
    await apiClient.private.tasks
      ._taskId(task.id)
      .patch({ body: { done: !task.done } })
      .catch(returnNull);
    await fetchTasks();
  };
  const deleteTask = async (task: TaskEntity) => {
    await apiClient.private.tasks._taskId(task.id).delete().catch(returnNull);
    await fetchTasks();
  };

  useEffect(() => {
    if (!user) return;

    fetchTasks();
  }, [user]);

  useEffect(() => {
    if (!image) return;

    const newUrl = URL.createObjectURL(image);
    setPreviewImageUrl(newUrl);
    return () => {
      URL.revokeObjectURL(newUrl);
    };
  }, [image]);

  if (!tasks || !user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <div className={styles.container}>
        <div className={styles.title}>Welcome to frourio!</div>

        <div className={styles.main}>
          <div className={styles.card}>
            <form onSubmit={createTask}>
              {previewImageUrl && <img src={previewImageUrl} className={styles.taskImage} />}
              <div className={styles.controls}>
                <input
                  value={label}
                  className={styles.textInput}
                  type="text"
                  placeholder="Todo task"
                  onChange={inputLabel}
                />
                <input
                  type="file"
                  ref={fileRef}
                  accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
                  onChange={inputFile}
                />
                <input className={styles.btn} disabled={label === ''} type="submit" value="ADD" />
              </div>
            </form>
          </div>
          {tasks.map((task) => (
            <div key={task.id} className={styles.card}>
              {task.image && (
                <img src={task.image.url} alt={task.label} className={styles.taskImage} />
              )}
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
    </>
  );
};

export default Home;
