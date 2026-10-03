---
name: task-prioritizer
description: Analiza tareas, propone prioridades y divide actividades grandes en tareas más pequeñas y ejecutables.
---

# Task Prioritizer

## Propósito

Ayudar a organizar tareas de trabajo personal mediante técnicas simples de priorización y descomposición.

## Cuándo debe activarse

- Cuando el usuario tenga una lista de tareas.
- Cuando existan tareas demasiado grandes o ambiguas.
- Cuando el usuario solicite ayuda para priorizar actividades.
- Cuando se necesite crear un plan de trabajo simple.

## Cuándo no debe activarse

- Cuando el usuario solicite programación o implementación técnica.
- Cuando la tarea requiera acceso a datos externos.
- Cuando exista un Skill más especializado para el dominio solicitado.

## Entradas esperadas

- Lista de tareas.
- Objetivos del usuario.
- Fechas límite opcionales.
- Restricciones conocidas.

## Procedimiento

1. Analizar cada tarea.
2. Detectar tareas ambiguas.
3. Identificar tareas demasiado grandes.
4. Proponer subdivisiones razonables.
5. Clasificar las tareas según impacto y urgencia.
6. Generar un orden de ejecución sugerido.

## Salidas esperadas

- Lista priorizada.
- Dependencias identificadas.
- Subtareas recomendadas.
- Riesgos detectados.
- Próximo paso sugerido.

## Límites

- No modifica archivos.
- No ejecuta acciones.
- No consulta servicios externos.
- No estima tiempos complejos.

## Dependencias

Ninguna.

## Recursos

La guía de criterios de priorización y señales de ambigüedad está disponible en:

#[[file:references/overview.md]]
