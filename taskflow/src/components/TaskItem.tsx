import confetti from 'canvas-confetti'
import type { Task } from '../types/task'
import styles from './TaskItem.module.css'

interface TaskItemProps {
  task: Task
  /** Llamado cuando el usuario activa/desactiva el estado de la tarea. */
  onToggle: (id: string) => void
  /** Llamado cuando el usuario pulsa el botón de eliminar (solo visible en tareas completadas). */
  onDelete: (id: string) => void
}

/**
 * Representa una tarea individual.
 * Muestra diferenciación visual para tareas completadas (Req 2.3).
 * Delega el cambio de estado al padre mediante onToggle (Req 2.1).
 * Muestra botón de borrado solo en tareas completadas (Req 2.1, 2.2).
 * Dispara confetí al completar una tarea (Req 1.1, 1.2, 1.3, 1.4).
 * Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2
 */
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const checkboxId = `task-checkbox-${task.id}`

  const handleChange = () => {
    // Disparar confetí solo en la transición pendiente → completada (Req 1.1, 1.2)
    if (!task.completed) {
      try {
        // Respetar preferencia de movimiento reducido (Req 1.4)
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
        if (!prefersReducedMotion) {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
        }
      } catch {
        // El fallo de confetí no debe bloquear el toggle (Req 1.3)
      }
    }
    onToggle(task.id)
  }

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
        onChange={handleChange}
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
      {task.completed && (
        <button
          className={styles.deleteBtn}
          aria-label="Eliminar tarea"
          onClick={() => onDelete(task.id)}
        >
          🗑️
        </button>
      )}
    </li>
  )
}
