---
inclusion: always
---

# TaskFlow — Structure

## Estructura de Directorios

```
project-root/
├── .kiro/
│   ├── specs/
│   │   └── taskflow-gestor-tareas/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   ├── steering/
│   ├── hooks/
│   ├── agents/
│   └── settings/
├── src/
│   ├── components/    # Componentes React (UI)
│   ├── services/      # Lógica de negocio y persistencia
│   ├── types/         # Interfaces y tipos TypeScript
│   ├── hooks/         # Custom hooks de React
│   └── assets/        # Recursos estáticos
├── tests/
│   ├── unit/          # Pruebas unitarias (servicios, utilidades)
│   ├── integration/   # Pruebas de componentes con Testing Library
│   ├── property/      # Property-Based Testing con fast-check
│   └── taskflow.spec.ts  # Spec funcional E2E
├── public/
├── index.html
└── package.json
```

## Responsabilidades por Directorio

### src/components
Componentes visuales React. Un componente por archivo. Sin lógica de negocio.

### src/services
Lógica de negocio y acceso a persistencia. Un servicio por responsabilidad.

### src/types
Interfaces y tipos TypeScript centralizados. Importados por componentes y servicios.

### src/hooks
Custom hooks de React para lógica reutilizable de UI.

### tests/unit
Pruebas unitarias de servicios y utilidades puras.

### tests/integration
Pruebas de componentes React con React Testing Library.

### tests/property
Pruebas de propiedades con fast-check para lógica de negocio.

### .kiro/specs
Especificaciones generadas y mantenidas mediante el flujo Spec-Driven Development de Kiro.

### .kiro/steering
Contexto permanente del proyecto. Leído por Kiro en cada sesión.

## Convenciones

- Un componente por archivo.
- Un servicio por responsabilidad.
- Tipado estricto en TypeScript (`strict: true`).
- Evitar lógica de negocio dentro de componentes UI.
- Mantener componentes pequeños y reutilizables.
- Nombres de archivos de componentes en PascalCase (`TaskForm.tsx`).
- Nombres de archivos de servicios en camelCase (`taskService.ts`).
- Nombres de archivos de tipos en camelCase (`task.ts`).

## Patrones Recomendados

- **Component Pattern** para UI: componentes presentacionales desacoplados.
- **Service Layer** para persistencia: toda operación de datos pasa por `TaskService`.
- **Type Definitions centralizadas** en `src/types/`.

## Gestión de Archivos Kiro

Los archivos en `.kiro/specs/` y `.kiro/steering/` son mantenidos por el agente Kiro dentro del flujo de trabajo establecido. No deben editarse manualmente fuera de una sesión de Kiro activa, para garantizar consistencia entre artefactos.

## Objetivo de Organización

Mantener una estructura simple, fácilmente navegable y consistente para futuras sesiones de trabajo en Kiro.
