import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fc from 'fast-check'
import { TaskService } from '../../src/services/taskService'
import { LocalStorageAdapter } from '../../src/services/localStorageAdapter'

function makeInMemoryService(): TaskService {
  const store = new Map<string, string>()
  const adapter = new LocalStorageAdapter('prop-test')

  vi.spyOn(adapter, 'load').mockImplementation(() => {
    const raw = store.get('prop-test')
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  })
  vi.spyOn(adapter, 'save').mockImplementation((value) => {
    store.set('prop-test', JSON.stringify(value))
  })

  return new TaskService(adapter)
}

describe('TaskService — Property-Based Tests', () => {
  let service: TaskService

  beforeEach(() => {
    service = makeInMemoryService()
  })

  it('crear N tareas → getAll() siempre devuelve exactamente N tareas', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }).map((s) => s.trim()).filter((s) => s.length > 0), {
          minLength: 1,
          maxLength: 20,
        }),
        (titles) => {
          service = makeInMemoryService()
          titles.forEach((t) => service.create({ title: t }))
          expect(service.getAll()).toHaveLength(titles.length)
        },
      ),
    )
  })

  it('toggle dos veces sobre cualquier tarea devuelve al estado original', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }).map((s) => s.trim()).filter((s) => s.length > 0), (title) => {
        service = makeInMemoryService()
        const task = service.create({ title })
        const original = task.completed

        service.toggleCompleted(task.id)
        service.toggleCompleted(task.id)

        const restored = service.getAll().find((t) => t.id === task.id)
        expect(restored?.completed).toBe(original)
      }),
    )
  })

  it('toggleCompleted con ID inexistente nunca modifica el número de tareas', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 1 }).map((s) => s.trim()).filter((s) => s.length > 0),
          { minLength: 0, maxLength: 10 },
        ),
        fc.string({ minLength: 1 }),
        (titles, fakeId) => {
          service = makeInMemoryService()
          titles.forEach((t) => service.create({ title: t }))
          const before = service.getAll()
          service.toggleCompleted(`fake-${fakeId}`)
          expect(service.getAll()).toHaveLength(before.length)
          expect(service.getAll().map((t) => t.id)).toEqual(before.map((t) => t.id))
        },
      ),
    )
  })

  it('los títulos creados se conservan exactamente tras serialización', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 })
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
        (title) => {
          service = makeInMemoryService()
          service.create({ title })
          const stored = service.getAll()
          expect(stored[0].title).toBe(title)
        },
      ),
    )
  })
})
