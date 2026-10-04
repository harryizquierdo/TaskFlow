import { useState, useCallback } from 'react'
import { TaskService } from '../services/taskService'
import type { Task, FilterState, CreateTaskPayload } from '../types/task'

// Instancia singleton del servicio — se crea una sola vez por sesión
const service = new TaskService()

/**
 * Hook central que gestiona el estado de tareas y el filtro activo.
 * Encapsula toda la lógica de negocio fuera de los componentes UI.
 * Requirements: 1.1, 2.1, 3.1, 3.3, 4.1, 4.3
 */
export function useTasks() {
  // Inicializa desde LocalStorage (Req 4.1)
  const [tasks, setTasks] = useState<Task[]>(() => service.getAll())
  const [filter, setFilter] = useState<FilterState>('all')

  /**
   * Crea una nueva tarea y actualiza el estado (Req 1.1, 4.3).
   * Propaga el error de título vacío al componente llamador (Req 1.2).
   */
  const addTask = useCallback((payload: CreateTaskPayload) => {
    const created = service.create(payload)
    setTasks((prev) => [...prev, created])
  }, [])

  /**
   * Alterna el estado completado de una tarea (Req 2.1, 2.2, 4.3).
   * Si el ID no existe el servicio lo registra y el estado no cambia.
   */
  const toggleTask = useCallback((id: string) => {
    const success = service.toggleCompleted(id)
    if (success) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      )
    }
  }, [])

  /**
   * Cambia el filtro activo (Req 3.1, 3.3).
   * El filtro se conserva hasta que se llame de nuevo a esta función.
   */
  const changeFilter = useCallback((next: FilterState) => {
    setFilter(next)
  }, [])

  /**
   * Elimina una tarea completada por su ID (Req 2.3, 2.4).
   * Si el servicio no encuentra el ID, el estado no cambia.
   */
  const deleteTask = useCallback((id: string) => {
    const success = service.deleteTask(id)
    if (success) {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    }
  }, [])

  // Conteos para FilterBar
  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }

  return { tasks, filter, counts, addTask, toggleTask, changeFilter, deleteTask }
}
