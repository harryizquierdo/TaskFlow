/**
 * Spec funcional E2E de TaskFlow.
 * Verifica los flujos completos de creación, completado, filtrado y persistencia.
 * Requirements: 1.1, 2.1, 3.1, 4.1
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TaskService } from '../src/services/taskService'
import { LocalStorageAdapter } from '../src/services/localStorageAdapter'
import type { FilterState } from '../src/types/task'

// ── Simula el estado completo de la aplicación sin UI ─────────────────────
function buildApp() {
  const store = new Map<string, string>()
  const adapter = new LocalStorageAdapter('e2e')

  vi.spyOn(adapter, 'load').mockImplementation(() => {
    const raw = store.get('e2e')
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  })
  vi.spyOn(adapter, 'save').mockImplementation((v) => {
    store.set('e2e', JSON.stringify(v))
  })

  const service = new TaskService(adapter)
  let filter: FilterState = 'all'

  return {
    service,
    getFilter: () => filter,
    setFilter: (f: FilterState) => { filter = f },
    getVisible: () => {
      const all = service.getAll()
      if (filter === 'pending') return all.filter((t) => !t.completed)
      if (filter === 'completed') return all.filter((t) => t.completed)
      return all
    },
    /** Simula el "cierre y reapertura" creando un nuevo servicio con el mismo adapter */
    reopen: () => new TaskService(adapter),
  }
}

describe('TaskFlow — Spec Funcional', () => {
  let app: ReturnType<typeof buildApp>

  beforeEach(() => {
    app = buildApp()
  })

  // ─── Req 1.1: Crear tarea ────────────────────────────────────────────────
  it('Req 1.1 — Crear una tarea la almacena y la hace visible', () => {
    app.service.create({ title: 'Preparar presentación' })
    const visible = app.getVisible()
    expect(visible).toHaveLength(1)
    expect(visible[0].title).toBe('Preparar presentación')
    expect(visible[0].completed).toBe(false)
  })

  it('Req 1.1 — Crear múltiples tareas las muestra todas en filtro "all"', () => {
    app.service.create({ title: 'Tarea 1' })
    app.service.create({ title: 'Tarea 2' })
    app.service.create({ title: 'Tarea 3' })
    expect(app.getVisible()).toHaveLength(3)
  })

  // ─── Req 2.1: Completar tarea ────────────────────────────────────────────
  it('Req 2.1 — Marcar tarea como completada actualiza su estado', () => {
    const task = app.service.create({ title: 'Hacer ejercicio' })
    app.service.toggleCompleted(task.id)

    const updated = app.service.getAll().find((t) => t.id === task.id)
    expect(updated?.completed).toBe(true)
  })

  it('Req 2.1 — La tarea completada sigue visible en filtro "all"', () => {
    const task = app.service.create({ title: 'Comprar pan' })
    app.service.toggleCompleted(task.id)
    expect(app.getVisible()).toHaveLength(1)
  })

  // ─── Req 3.1: Filtrar por estado ─────────────────────────────────────────
  it('Req 3.1 — Filtro "pending" solo muestra tareas pendientes', () => {
    app.service.create({ title: 'Pendiente 1' })
    const completada = app.service.create({ title: 'Completada' })
    app.service.toggleCompleted(completada.id)

    app.setFilter('pending')
    const visible = app.getVisible()
    expect(visible).toHaveLength(1)
    expect(visible[0].title).toBe('Pendiente 1')
  })

  it('Req 3.1 — Filtro "completed" solo muestra tareas completadas', () => {
    app.service.create({ title: 'Pendiente' })
    const completada = app.service.create({ title: 'Hecha' })
    app.service.toggleCompleted(completada.id)

    app.setFilter('completed')
    const visible = app.getVisible()
    expect(visible).toHaveLength(1)
    expect(visible[0].title).toBe('Hecha')
  })

  it('Req 3.3 — El filtro se conserva tras múltiples operaciones', () => {
    app.setFilter('pending')
    app.service.create({ title: 'Nueva tarea' })
    expect(app.getFilter()).toBe('pending') // filtro no cambia solo
  })

  // ─── Req 4.1: Persistencia entre sesiones ────────────────────────────────
  it('Req 4.1 — Las tareas se recuperan tras reabrir la aplicación', () => {
    app.service.create({ title: 'Tarea persistida' })
    const completada = app.service.create({ title: 'Completada persistida' })
    app.service.toggleCompleted(completada.id)

    // Simula cierre y reapertura del navegador
    const newSession = app.reopen()
    const recovered = newSession.getAll()

    expect(recovered).toHaveLength(2)
    expect(recovered.find((t) => t.title === 'Tarea persistida')?.completed).toBe(false)
    expect(recovered.find((t) => t.title === 'Completada persistida')?.completed).toBe(true)
  })

  it('Req 4.2 — Datos corruptos en storage se ignoran y se devuelve []', () => {
    const adapter = new LocalStorageAdapter('corrupt')
    vi.spyOn(adapter, 'load').mockReturnValue('INVALID_JSON_STRUCTURE' as unknown as never)
    const freshService = new TaskService(adapter)
    expect(freshService.getAll()).toEqual([])
  })
})
