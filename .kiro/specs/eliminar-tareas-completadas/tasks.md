# Plan de Implementación

- [ ] 1. Implementar `TaskService.deleteTask(id)`
  - Añadir método `deleteTask(id: string): boolean` en `src/services/taskService.ts`.
  - Si el ID no existe: `console.error` y `return false`.
  - Si existe: `splice`, `adapter.save(tasks)`, `return true`.
  - _Requirements: 2.3, 2.5_
  - _Evidence: src/services/taskService.ts_
  - _Depends on: —_

- [ ] 2. Añadir pruebas unitarias para `deleteTask`
  - Añadir `describe('deleteTask()')` en `tests/unit/taskService.test.ts`.
  - Casos: elimina tarea existente, devuelve `false` para ID inexistente, persiste el array resultante.
  - _Requirements: 2.3, 2.5_
  - _Evidence: tests/unit/taskService.test.ts_
  - _Depends on: 1_

- [ ] 3. Exponer `deleteTask` en `useTasks`
  - Añadir `deleteTask` en `src/hooks/useTasks.ts` usando `useCallback`.
  - Si `service.deleteTask(id)` devuelve `true`: `setTasks(prev => prev.filter(t => t.id !== id))`.
  - Añadir `deleteTask` al objeto retornado por el hook.
  - _Requirements: 2.3, 2.4_
  - _Evidence: src/hooks/useTasks.ts_
  - _Depends on: 1_

- [ ] 4. Actualizar `TaskItem` con botón de borrado y confetí
  - Añadir prop `onDelete: (id: string) => void` a `TaskItemProps`.
  - Renderizar `<button className={styles.deleteBtn} aria-label="Eliminar tarea" onClick={() => onDelete(task.id)}>🗑️</button>` condicionalmente cuando `task.completed === true`.
  - En el `onChange` del checkbox: si `!task.completed` (transición a completada), verificar `prefers-reduced-motion` y llamar a `confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })`.
  - Envolver el disparo de confetí en try/catch para no bloquear el toggle.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2_
  - _Evidence: src/components/TaskItem.tsx_
  - _Depends on: —_

- [ ] 5. Añadir estilos para el botón de borrado
  - Añadir `.deleteBtn` en `src/components/TaskItem.module.css`.
  - _Requirements: 2.1_
  - _Evidence: src/components/TaskItem.module.css_
  - _Depends on: 4_

- [ ] 6. Actualizar `TaskList` con prop `onDelete`
  - Añadir `onDelete: (id: string) => void` a `TaskListProps`.
  - Pasar `onDelete={onDelete}` a cada `<TaskItem>`.
  - _Requirements: 2.3_
  - _Evidence: src/components/TaskList.tsx_
  - _Depends on: 4_

- [ ] 7. Conectar `deleteTask` en `App.tsx`
  - Desestructurar `deleteTask` de `useTasks()`.
  - Pasar `onDelete={deleteTask}` a `<TaskList>`.
  - _Requirements: 2.3_
  - _Evidence: src/App.tsx_
  - _Depends on: 3, 6_

- [ ] 8. Actualizar pruebas de integración
  - En `tests/integration/components.test.tsx`: añadir casos para `TaskItem` y `TaskList`.
  - Verificar que el botón `🗑️` aparece para tareas completadas y no para pendientes (Req 2.1, 2.2).
  - Verificar que `onDelete` es llamado con el ID correcto al pulsar el botón.
  - Mockear `canvas-confetti` con `vi.mock('canvas-confetti')` y verificar que se llama al completar una tarea.
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3_
  - _Evidence: tests/integration/components.test.tsx_
  - _Depends on: 4, 6_
