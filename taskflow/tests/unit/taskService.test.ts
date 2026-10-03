import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TaskService } from '../../src/services/taskService'
import { LocalStorageAdapter } from '../../src/services/localStorageAdapter'

/**
 * Crea un LocalStorageAdapter respaldado por un Map en memoria.
 * Evita dependencia real de localStorage en pruebas unitarias.
 */
function makeInMemoryAdapter(): LocalStorageAdapter {
  const store = new Map<string, string>()
  const adapter = new LocalStorageAdapter('test')

  vi.spyOn(adapter, 'load').mockImplementation(() => {
    const raw = store.get('test')
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  })

  vi.spyOn(adapter, 'save').mockImplementation((value) => {
    store.set('test', JSON.stringify(value))
  })

  vi.spyOn(adapter, 'clear').mockImplementation(() => {
    store.delete('test')
  })

  return adapter
}

describe('TaskService', () => {
  let service: TaskService
  let adapter: LocalStorageAdapter

  beforeEach(() => {
    adapter = makeInMemoryAdapter()
    service = new TaskService(adapter)
  })

  // ─── Req 1.1: crear tarea ────────────────────────────────────────────────
  describe('create()', () => {
    it('crea una tarea y la devuelve con los campos correctos (Req 1.1)', () => {
      const task = service.create({ title: 'Comprar leche' })
      expect(task.title).toBe('Comprar leche')
      expect(task.completed).toBe(false)
      expect(task.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      )
      expect(task.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('persiste la tarea y se recupera con getAll() (Req 1.1, 4.1)', () => {
      service.create({ title: 'Tarea A' })
      service.create({ title: 'Tarea B' })
      const tasks = service.getAll()
      expect(tasks).toHaveLength(2)
      expect(tasks.map((t) => t.title)).toEqual(['Tarea A', 'Tarea B'])
    })

    it('hace trim del título antes de guardar', () => {
      const task = service.create({ title: '  Leer libro  ' })
      expect(task.title).toBe('Leer libro')
    })

    // Req 1.2: título vacío
    it('lanza error si el título está vacío (Req 1.2)', () => {
      expect(() => service.create({ title: '' })).toThrow(
        'El título de la tarea no puede estar vacío.',
      )
    })

    it('lanza error si el título es solo espacios (Req 1.2)', () => {
      expect(() => service.create({ title: '   ' })).toThrow()
    })
  })

  // ─── Req 2.1, 2.2: toggleCompleted ──────────────────────────────────────
  describe('toggleCompleted()', () => {
    it('cambia completed de false a true (Req 2.1)', () => {
      const task = service.create({ title: 'Estudiar' })
      const result = service.toggleCompleted(task.id)
      expect(result).toBe(true)
      const updated = service.getAll().find((t) => t.id === task.id)
      expect(updated?.completed).toBe(true)
    })

    it('cambia completed de true a false (toggle doble)', () => {
      const task = service.create({ title: 'Ejercicio' })
      service.toggleCompleted(task.id)
      service.toggleCompleted(task.id)
      const updated = service.getAll().find((t) => t.id === task.id)
      expect(updated?.completed).toBe(false)
    })

    it('devuelve false y no modifica nada si el ID no existe (Req 2.2)', () => {
      service.create({ title: 'Tarea real' })
      const before = service.getAll()
      const result = service.toggleCompleted('id-inexistente-xyz')
      expect(result).toBe(false)
      expect(service.getAll()).toEqual(before)
    })
  })

  // ─── Req 4.1, 4.2: persistencia y recuperación ──────────────────────────
  describe('getAll()', () => {
    it('devuelve [] cuando no hay datos almacenados (Req 4.1)', () => {
      expect(service.getAll()).toEqual([])
    })

    it('descarta entradas corruptas y conserva las válidas (Req 4.2)', () => {
      vi.spyOn(adapter, 'load').mockReturnValueOnce([
        { id: '1', title: 'Válida', completed: false, createdAt: '2026-01-01T00:00:00Z' },
        { id: 2, title: 'Corrupta — id numérico' }, // inválida
        null,                                        // inválida
      ] as unknown[])

      const tasks = service.getAll()
      expect(tasks).toHaveLength(1)
      expect(tasks[0].title).toBe('Válida')
    })

    it('devuelve [] si el almacenamiento tiene JSON no-array (Req 4.2)', () => {
      vi.spyOn(adapter, 'load').mockReturnValueOnce({ corrupted: true } as unknown as never)
      expect(service.getAll()).toEqual([])
    })
  })
})
