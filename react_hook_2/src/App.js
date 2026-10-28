import { useCallback, useMemo, useReducer, useState } from 'react';
import { tasksReducer } from './tasksReducer.js';
import { useTheme } from './ThemeContext.jsx';
import { AddTaskForm } from './components/AddTaskForm.jsx';
import { TaskList } from './components/TaskList.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';

export default function App() {
  const { theme } = useTheme();
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  const [filter, setFilter] = useState('all');

  const handleAdd = useCallback((text) => {
    dispatch({ type: 'add', task: { id: Date.now(), text, done: false } });
  }, []);
  const handleToggle = useCallback((id) => dispatch({ type: 'toggle', id }), []);
  const handleRemove = useCallback((id) => dispatch({ type: 'remove', id }), []);

  const visibleTasks = useMemo(() => {
    if (filter === 'done') return tasks.filter((t) => t.done);
    if (filter === 'active') return tasks.filter((t) => !t.done);
    return tasks;
  }, [tasks, filter]);

  const doneCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);

  return (
    <div className={'app ' + theme}>
      <div className="card">
        <header className="top">
          <h1>Менеджер задач</h1>
          <ThemeToggle />
        </header>
        <AddTaskForm onAdd={handleAdd} />
        <div className="tabs">
          {[['all', 'Все'], ['active', 'Активные'], ['done', 'Готовые']].map(([key, label]) => (
            <button
              key={key}
              className={filter === key ? 'active' : ''}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="muted">Всего: {tasks.length}, выполнено: {doneCount}</p>
        <TaskList tasks={visibleTasks} onToggle={handleToggle} onRemove={handleRemove} />
      </div>
    </div>
  );
}
