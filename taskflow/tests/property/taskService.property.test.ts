/**
 * Property-Based Tests — TaskService
 *
 * Verifica las 4 invariantes de dominio definidas en design.md §Estrategia de Pruebas.
 * Framework: fast-check   Runner: Vitest
 *
 * El adaptador se simula en memoria para aislar cada propiedad del navegador
 * y garantizar que cada ejecución de fc.assert parte de un estado limpio.
 */
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { TaskService } from '../../src/services/taskService'
import { LocalStorageAdapter } from '../../src/services/localStorageAdapter'
import type { FilterState } from '../../src/types/task'

// ─── Árbitros reutilizables ───────────────────────────────────────────────────

/** Título válido: string no-vacío después de trim. */
const validTitle = fc
  .string({ minLength: 1, maxLength: 200 })
  .map((s) => s.trim())
  .filter((s) => s.length > 0)

/** Array de al menos 1 título válido. */
const titleArray = (min = 1, max = 20) =>
  fc.array(validTitle, { minLength: min, maxLength: max })

// ─── Fábrica de servicio en memoria ──────────────────────────────────────────

/**
 * Crea un TaskService respaldado por un Map en memoria.
 * Cada llamada devuelve una instancia completamente aislada.
 */
function makeService(): TaskService {
  const store = new Map<string, string>()
  const key = 'prop-test'
  const adapter = new LocalStorageAdapter(key)

  // Reemplazamos la implementación real de load/save sin tocar localStorage
  Object.defineProperty(adapter, 'load', {
    value: () => {
      const raw = store.get(key)
      if (!raw) return null
      try {
        return JSON.parse(raw)
      } catch {
        return null
      }
    },
  })

  Object.defineProperty(adapter, 'save', {
    value: (value: unknown) => {
      store.set(key, JSON.stringify(value))
    },
  })

  return new TaskService(adapter)
}

// ─── Helpers de filtrado (replican la lógica de useTasks / TaskList) ─────────

function applyFilter(service: TaskService, filter: FilterState) {
  const all = service.getAll()
  if (filter === 'all') return all
  if (filter === 'completed') return all.filter((t) => t.completed)
  return all.filter((t) => !t.completed)
}

// ─── Propiedades ──────────────────────────────────────────────────────────────

describe('TaskService — Property-Based Tests', () => {
  /**
   * Property 1 — Persistencia consistente (Req 4.1, 4.3)
   *
   * Para cualquier lista de N títulos válidos, después de crear las tareas y
   * recuperarlas, el servicio SHALL conservar exactamente N tareas con los
   * mismos títulos en el mismo orden.
   */
  it('Property 1 — crear N tareas: getAll() conserva exactamente N tareas con los mismos títulos', () => {
    fc.assert(
      fc.property(titleArray(1, 20), (titles) => {
        const svc = makeService()
        titles.forEach((t) => svc.create({ title: t }))

        const stored = svc.getAll()

        expect(stored).toHaveLength(titles.length)
        expect(stored.map((t) => t.title)).toEqual(titles)
      }),
    )
  })

  /**
   * Property 2 — Toggle reversible / idempotencia doble (Req 2.1)
   *
   * Para cualquier tarea válida, alternar completed dos veces SHALL restaurar
   * el estado booleano original: toggle(toggle(x)) === x.
   */
  it('Property 2 — toggle dos veces restaura el estado original', () => {
    fc.assert(
      fc.property(validTitle, (title) => {
        const svc = makeService()
        const task = svc.create({ title })
        const original = task.completed // siempre false al crear, pero la propiedad no lo asume

        svc.toggleCompleted(task.id)
        svc.toggleCompleted(task.id)

        const restored = svc.getAll().find((t) => t.id === task.id)
        expect(restored?.completed).toBe(original)
      }),
    )
  })

  /**
   * Property 3 — Filtrado coherente (Req 3.1, 3.2, 3.3)
   *
   * Para cualquier conjunto mixto de tareas:
   * a) Filtrar por 'completed' devuelve SOLO tareas completadas.
   * b) Filtrar por 'pending'   devuelve SOLO tareas pendientes.
   * c) pending ∪ completed = all  (sin pérdida ni duplicados).
   */
  it('Property 3 — filtrado coherente: resultado respeta el criterio y la unión reconstituye all', () => {
    fc.assert(
      fc.property(
        titleArray(0, 15),
        fc.array(fc.boolean(), { minLength: 0, maxLength: 15 }),
        (titles, toggleFlags) => {
          const svc = makeService()
          const created = titles.map((t) => svc.create({ title: t }))

          // Alternar según el flag correspondiente (se recorta al tamaño menor)
          const len = Math.min(created.length, toggleFlags.length)
          for (let i = 0; i < len; i++) {
            if (toggleFlags[i]) svc.toggleCompleted(created[i].id)
          }

          const all       = applyFilter(svc, 'all')
          const completed = applyFilter(svc, 'completed')
          const pending   = applyFilter(svc, 'pending')

          // a) Solo completadas en 'completed'
          expect(completed.every((t) => t.completed)).toBe(true)

          // b) Solo pendientes en 'pending'
          expect(pending.every((t) => !t.completed)).toBe(true)

          // c) La unión sin duplicados reconstituye 'all' (por IDs)
          const unionIds = new Set([
            ...completed.map((t) => t.id),
            ...pending.map((t) => t.id),
          ])
          expect(unionIds.size).toBe(all.length)
        },
      ),
    )
  })

  /**
   * Property 4 — Estabilidad ante IDs inexistentes (Req 2.2)
   *
   * Para cualquier colección de tareas válidas, llamar a toggleCompleted con
   * un ID que no existe SHALL dejar la colección inalterada: mismo tamaño y
   * mismos IDs en el mismo orden.
   */
  it('Property 4 — toggleCompleted con ID inexistente no altera la colección', () => {
    fc.assert(
      fc.property(
        titleArray(0, 10),
        fc.string({ minLength: 1 }),
        (titles, fakeSuffix) => {
          const svc = makeService()
          titles.forEach((t) => svc.create({ title: t }))

          const before = svc.getAll()
          const fakeId = `__nonexistent__${fakeSuffix}`

          svc.toggleCompleted(fakeId)

          const after = svc.getAll()
          expect(after).toHaveLength(before.length)
          expect(after.map((t) => t.id)).toEqual(before.map((t) => t.id))
        },
      ),
    )
  })
})
