/**
 * Representa una tarea en TaskFlow.
 * Requirements: 1.1, 2.1, 4.1
 */
export interface Task {
  /** Identificador único de la tarea (UUID v4). */
  id: string

  /** Título de la tarea. No puede estar vacío. */
  title: string

  /** Estado de la tarea: false = pendiente, true = completada. */
  completed: boolean

  /** Fecha de creación en formato ISO 8601 (ej: 2026-10-03T12:00:00.000Z). */
  createdAt: string
}

/**
 * Estados de filtro disponibles para la lista de tareas.
 * Requirements: 3.1, 3.3
 */
export type FilterState = 'all' | 'pending' | 'completed'

/**
 * Payload para crear una nueva tarea.
 * Solo requiere el título; el resto lo genera el servicio.
 */
export type CreateTaskPayload = Pick<Task, 'title'>
