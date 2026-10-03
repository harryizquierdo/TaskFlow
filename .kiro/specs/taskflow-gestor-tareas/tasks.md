# Plan de Implementación

- [x] 1. Implementar modelo de datos Task
  - Crear entidad Task y tipos TypeScript asociados.
  - _Requirements: 1.1, 2.1, 4.1_
  - _Evidence: src/types/task.ts_

- [x] 2. Implementar servicio de persistencia
  - Crear TaskService y LocalStorageAdapter para almacenamiento local.
  - Incluir recuperación segura ante datos corruptos (estado vacío).
  - _Requirements: 1.1, 4.1, 4.2, 4.3_
  - _Evidence: src/services/taskService.ts_
  - _Depends on: 1_

- [x] 3. Implementar formulario de creación de tareas
  - Validar títulos vacíos y registrar tareas nuevas.
  - _Requirements: 1.1, 1.2, 1.3_
  - _Evidence: src/components/TaskForm.tsx_
  - _Depends on: 2_

- [x] 4. Implementar listado y visualización de tareas
  - Mostrar tareas almacenadas y sus estados.
  - _Requirements: 1.3_
  - _Evidence: src/components/TaskList.tsx_
  - _Depends on: 2_

- [x] 5. Implementar marcado de tareas completadas
  - Permitir cambio de estado con persistencia.
  - Incluir guarda defensiva en TaskService para IDs inexistentes.
  - _Requirements: 2.1, 2.2, 2.3_
  - _Evidence: src/components/TaskItem.tsx_
  - _Depends on: 4_

- [x] 6. Implementar filtros por estado
  - Agregar filtros para tareas pendientes, completadas y todas.
  - Mantener filtro activo hasta cambio explícito del usuario.
  - _Requirements: 3.1, 3.2, 3.3_
  - _Evidence: src/components/FilterBar.tsx_
  - _Depends on: 4_

- [x] 7. Implementar pruebas funcionales básicas
  - Verificar creación, completado, filtrado y persistencia.
  - _Requirements: 1.1, 2.1, 3.1, 4.1_
  - _Evidence: tests/taskflow.spec.ts_
  - _Depends on: 3, 5, 6_

- [x] 8. Implementar Property-Based Testing con fast-check
  - Cubrir las 4 propiedades definidas en el diseño: persistencia consistente, toggle reversible, filtrado coherente y estabilidad ante IDs inexistentes.
  - Usar fast-check como generador de entradas aleatorias y Vitest como runner.
  - El adaptador debe ser simulado en memoria para aislar las propiedades del navegador.
  - _Requirements: 1.1, 2.1, 2.2, 3.1, 4.1, 4.3_
  - _Evidence: tests/property/taskService.property.test.ts_
  - _Depends on: 2_
