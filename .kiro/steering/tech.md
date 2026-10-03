---
inclusion: always
---

# TaskFlow — Tech

## Stack Principal

| Tecnología | Versión mínima | Rol |
|------------|----------------|-----|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Tipado estático |
| Vite | 5.x | Bundler y dev server |
| LocalStorage API | — (nativa) | Persistencia local |
| CSS Modules | — | Estilos por componente |

## Dependencias de Producción

- `react`
- `react-dom`

## Dependencias de Desarrollo

- `typescript`
- `vite`
- `vitest`
- `@testing-library/react`
- `@testing-library/user-event`
- `fast-check`

## Estrategia de Persistencia

- Almacenamiento local mediante LocalStorage (API nativa del navegador).
- Sin base de datos ni backend.
- Recuperación segura ante datos corruptos (restaurar estado vacío).

## Estrategia de Pruebas

- Vitest para pruebas unitarias de servicios y utilidades.
- React Testing Library para pruebas de componentes.
- fast-check para Property-Based Testing de lógica de negocio.

## Convenciones de Código

- Componentes en PascalCase.
- Hooks personalizados en camelCase iniciando por `use`.
- Archivos TypeScript con tipado estricto (`strict: true` en tsconfig).
- Una responsabilidad principal por componente.
- Sin lógica de negocio dentro de componentes UI.

## Restricciones Técnicas

- Proyecto exclusivamente frontend. Sin backend.
- No usar servicios externos ni APIs de red.
- No implementar autenticación.
- No implementar sincronización cloud.
- No almacenar credenciales ni datos sensibles en LocalStorage.

## Seguridad

- Validar entradas del usuario antes de persistir.
- Recuperar errores de datos corruptos en LocalStorage sin romper la aplicación.

## Comandos Principales

| Acción | Comando |
|--------|---------|
| Instalar dependencias | `npm install` |
| Desarrollo local | `npm run dev` |
| Build de producción | `npm run build` |
| Ejecutar pruebas | `npm run test` |

## Objetivo Técnico

Mantener una arquitectura simple, fácil de entender y adecuada para demostrar las capacidades de Kiro sin introducir complejidad innecesaria.
