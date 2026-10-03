# Documento de Requisitos

## Introducción

TaskFlow es una aplicación web ligera para la gestión personal de tareas. Permite crear, visualizar, completar y filtrar tareas almacenadas localmente, ofreciendo una experiencia simple para el seguimiento de actividades diarias.

## Requisitos

### Requisito 1

**Historia de Usuario:** Como usuario, quiero registrar nuevas tareas, para organizar mis actividades pendientes.

#### Criterios de Aceptación

1.1. WHEN el usuario registre una nueva tarea THEN el sistema SHALL almacenar la tarea y mostrarla en la lista.
1.2. IF el usuario intenta crear una tarea sin título THEN el sistema SHALL mostrar un mensaje de validación.
1.3. WHILE existan tareas registradas THEN el sistema SHALL mantenerlas visibles en la lista activa (respetando el filtro en curso).

### Requisito 2

**Historia de Usuario:** Como usuario, quiero marcar tareas como completadas, para conocer mi progreso.

#### Criterios de Aceptación

2.1. WHEN el usuario marque una tarea como completada THEN el sistema SHALL actualizar su estado inmediatamente.
2.2. IF el sistema recibe un identificador de tarea que no existe en el almacenamiento THEN el sistema SHALL registrar el error y no modificar el estado de ninguna tarea.
2.3. WHILE una tarea permanezca completada THEN el sistema SHALL mostrarla con una representación visual diferenciada.

### Requisito 3

**Historia de Usuario:** Como usuario, quiero filtrar tareas por estado, para localizar rápidamente actividades relevantes.

#### Criterios de Aceptación

3.1. WHEN el usuario seleccione un filtro THEN el sistema SHALL mostrar únicamente las tareas correspondientes.
3.2. IF no existen tareas para el filtro seleccionado THEN el sistema SHALL mostrar un estado vacío informativo.
3.3. WHILE un filtro permanezca activo THEN el sistema SHALL conservar dicho filtro hasta que el usuario lo cambie explícitamente.

### Requisito 4

**Historia de Usuario:** Como usuario, quiero conservar mis tareas entre sesiones, para no perder información al cerrar el navegador.

#### Criterios de Aceptación

4.1. WHEN el usuario cierre y vuelva a abrir la aplicación THEN el sistema SHALL recuperar las tareas previamente almacenadas.
4.2. IF los datos almacenados son inválidos o corruptos THEN el sistema SHALL restaurar un estado seguro vacío.
4.3. WHILE la aplicación esté en uso THE sistema SHALL sincronizar los cambios con el almacenamiento local.
