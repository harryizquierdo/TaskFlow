import type { Task } from '../types/task'
import styles from './TaskItem.module.css'

interface TaskItemProps {
  task: Task
  /** Llamado cuando el usuario activa/desactiva el estado de la tarea. */
  onToggle: (id: string) => void
}

/**
 * Representa una tarea individual.
 * Muestra diferenciación visual para tareas completadas (Req 2.3).
 * Delega el cambio de estado al padre mediante onToggle (Req 2.1).
 * Requirements: 2.1, 2.2, 2.3
 */
export function TaskItem({ task, onToggle }: TaskItemProps) {
  const checkboxId = `task-checkbox-${task.id}`

  return (
    <li
      className={`${styles.item} ${task.completed ? styles.completed : ''}`}
      aria-label={`Tarea: ${task.title}${task.completed ? ', completada' : ', pendiente'}`}
    >
      <input
        id={checkboxId}
        type="checkbox"
        className={styles.checkbox}
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Marcar "${task.title}" como ${task.completed ? 'pendiente' : 'completada'}`}
      />
      <label htmlFor={checkboxId} className={styles.label}>
        <span className={styles.title}>{task.title}</span>
        <span className={styles.date}>
          {new Date(task.createdAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </label>
    </li>
  )
}
