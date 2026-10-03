import { useTasks } from './hooks/useTasks'
import { TaskForm } from './components/TaskForm'
import { FilterBar } from './components/FilterBar'
import { TaskList } from './components/TaskList'
import styles from './App.module.css'

/**
 * Componente raíz de TaskFlow.
 * Orquesta el estado central (useTasks) y compone la UI.
 */
export function App() {
  const { tasks, filter, counts, addTask, toggleTask, changeFilter } = useTasks()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>TaskFlow</h1>
        <p className={styles.subtitle}>Gestiona tus tareas de forma simple</p>
      </header>

      <main className={styles.main}>
        <TaskForm onSubmit={(title) => addTask({ title })} />

        <section aria-label="Lista de tareas">
          <FilterBar
            activeFilter={filter}
            onFilterChange={changeFilter}
            counts={counts}
          />
          <TaskList tasks={tasks} filter={filter} onToggle={toggleTask} />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>
          {counts.pending} pendiente{counts.pending !== 1 ? 's' : ''} ·{' '}
          {counts.completed} completada{counts.completed !== 1 ? 's' : ''}
        </p>
      </footer>
    </div>
  )
}
