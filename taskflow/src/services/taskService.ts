import { LocalStorageAdapter } from './localStorageAdapter'
import type { Task, CreateTaskPayload } from '../types/task'

const STORAGE_KEY = 'taskflow:tasks'

/**
 * Genera un UUID v4 compatible con navegadores modernos.
 */
function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Valida que un objeto tiene la forma correcta de Task.
 * Usado para descartar datos corruptos o de versiones anteriores (Req 4.2).
 */
function isValidTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.completed === 'boolean' &&
    typeof t.createdAt === 'string'
  )
}

/**
 * Gestiona las operaciones CRUD sobre tareas y su persistencia.
 * Requirements: 1.1, 4.1, 4.2, 4.3
 */
export class TaskService {
  private readonly adapter: LocalStorageAdapter

  constructor(adapter: LocalStorageAdapter = new LocalStorageAdapter(STORAGE_KEY)) {
    this.adapter = adapter
  }

  /**
   * Recupera todas las tareas del almacenamiento.
   * Si los datos son inválidos o corruptos devuelve [] (Req 4.1, 4.2).
   */
  getAll(): Task[] {
    const raw = this.adapter.load<unknown[]>()
    if (!Array.isArray(raw)) return []

    const valid = raw.filter(isValidTask)
    if (valid.length !== raw.length) {
      console.error(
        '[TaskService] Se descartaron entradas inválidas del almacenamiento.',
      )
    }
    return valid
  }

  /**
   * Crea una nueva tarea y la persiste (Req 1.1, 4.3).
   * @throws {Error} Si el título está vacío (Req 1.2 — la UI también lo previene).
   */
  create(payload: CreateTaskPayload): Task {
    const title = payload.title.trim()
    if (title.length === 0) {
      throw new Error('El título de la tarea no puede estar vacío.')
    }

    const task: Task = {
      id: generateId(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    const tasks = this.getAll()
    tasks.push(task)
    this.adapter.save(tasks)
    return task
  }

  /**
   * Cambia el estado completado de una tarea existente (Req 2.1, 2.2, 4.3).
   * Si el ID no existe registra el error y devuelve false (Req 2.2).
   */
  toggleCompleted(id: string): boolean {
    const tasks = this.getAll()
    const index = tasks.findIndex((t) => t.id === id)

    if (index === -1) {
      console.error(
        `[TaskService] toggleCompleted: No se encontró la tarea con id "${id}".`,
      )
      return false
    }

    tasks[index] = { ...tasks[index], completed: !tasks[index].completed }
    this.adapter.save(tasks)
    return true
  }
}
