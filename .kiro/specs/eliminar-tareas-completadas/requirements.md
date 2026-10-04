# Documento de Requisitos

## Introducción

Esta funcionalidad amplía TaskFlow con dos comportamientos nuevos: celebración visual al completar una tarea y la posibilidad de eliminar tareas completadas.

## Requisitos

### Requisito 1

**Historia de Usuario:** Como usuario, quiero recibir un refuerzo positivo visual cuando marco una tarea como completada, para sentir satisfacción por el logro.

#### Criterios de Aceptación

1.1. WHEN el usuario marque una tarea como completada (transición de `completed: false` a `completed: true`) THEN el sistema SHALL disparar un efecto de confetí en pantalla mediante la librería `canvas-confetti`.
1.2. IF la tarea ya estaba completada antes del toggle THEN el sistema SHALL NOT disparar el efecto de confetí (solo se produce en la transición a completado, no al desmarcar).
1.3. WHILE el efecto de confetí esté activo THEN el sistema SHALL mantener la interfaz completamente funcional sin bloquear ninguna acción del usuario.
1.4. IF el usuario tiene activada la preferencia del sistema `prefers-reduced-motion` THEN el sistema SHALL omitir el efecto de confetí para respetar la accesibilidad.

### Requisito 2

**Historia de Usuario:** Como usuario, quiero eliminar tareas completadas que ya no necesito, para mantener mi lista limpia y organizada.

#### Criterios de Aceptación

2.1. WHEN una tarea tenga `completed: true` THEN el sistema SHALL mostrar un icono de eliminación (`🗑️`) visible en el componente `TaskItem` de esa tarea.
2.2. IF una tarea tiene `completed: false` THEN el sistema SHALL NOT mostrar el icono de eliminación.
2.3. WHEN el usuario pulse el icono de eliminación de una tarea completada THEN el sistema SHALL eliminar esa tarea del estado de la aplicación y del `LocalStorage`.
2.4. AFTER eliminar una tarea THEN el sistema SHALL actualizar la lista visible inmediatamente sin recargar la página.
2.5. IF el identificador de la tarea a eliminar no existe en el almacenamiento THEN el sistema SHALL registrar el error en consola y no modificar el estado de ninguna tarea.
