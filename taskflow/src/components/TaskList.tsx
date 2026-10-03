import type { Task, FilterState } from '../types/task'
import { TaskItem } from './TaskItem'
import styles from './TaskList.module.css'

interface TaskListProps {
  tasks: Task[]
  filter: FilterState
  onToggle: (id: string) => void
}

/**
 * Muestra la lista de tareas aplicando el filtro activo.
 * Renderiza un estado vacío informativo si no hay tareas para el filtro (Req 3.2).
 * Requirements: 1.3, 3.1, 3.2
 */
export function TaskList({ tasks, filter, onToggle }: TaskListProps) {
  const filtered = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed
    if (filter === 'completed') return task.completed
    return true // 'all'
  })

  const emptyMessages: Record<FilterState, string> = {
    all: 'No hay tareas aún. ¡Agrega tu primera tarea!',
    pending: 'No hay tareas pendientes.',
    completed: 'Aún no has completado ninguna tarea.',
  }

  if (filtered.length === 0) {
    return (
      <p
        className={styles.empty}
        aria-live="polite"
        data-testid="empty-state"
      >
        {emptyMessages[filter]}
      </p>
    )
  }

  return (
    <ul
      className={styles.list}
      aria-label={`Lista de tareas: ${filter === 'all' ? 'todas' : filter === 'pending' ? 'pendientes' : 'completadas'}`}
    >
      {filtered.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} />
      ))}
    </ul>
  )
}
