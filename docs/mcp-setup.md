# Configuración y validación del MCP

## Objetivo dentro del aplicativo

Permitir que Kiro consulte documentación actualizada de React, TypeScript, Vite y fast-check durante futuras tareas de desarrollo de TaskFlow.

## Servidor seleccionado y razón de la elección

Servidor seleccionado: Context7

Razones:

- Acceso a documentación técnica actualizada.
- Útil para React, TypeScript y librerías del proyecto.
- Aporta valor real durante la implementación.
- Menor complejidad que integrar APIs externas.

## Herramientas que se utilizarán

Las herramientas expuestas por Context7 para búsqueda y consulta de documentación técnica.

## Prerrequisitos

- Node.js instalado.
- npm instalado.
- Kiro IDE instalado.

## Instalación desde PowerShell

Verificar Node.js:

```powershell
node --version
```

Verificar npm:

```powershell
npm --version
```

La instalación del servidor será gestionada por Kiro mediante:

```powershell
npx -y @upstash/context7-mcp
```

## Configuración externa o web

No requiere cuentas externas ni configuración web.

## Variables de entorno y secretos

No requiere credenciales.

No almacenar secretos.

## Activación en Kiro

1. Abrir Kiro IDE.
2. Presionar `Ctrl + Shift + P`.
3. Ejecutar:

   ```
   Kiro: Open workspace MCP config (JSON)
   ```

4. Verificar que exista:

   ```
   .kiro/settings/mcp.json
   ```

5. Guardar el archivo.
6. Abrir el panel MCP Servers.
7. Verificar que Context7 aparezca disponible.

## Prueba funcional

Prompt sugerido:

```
Busca documentación actualizada sobre React useEffect y resume los cambios más importantes.
```

## Resultado esperado

Kiro debe consultar documentación mediante Context7 y devolver referencias relevantes para React.

## Seguridad y permisos

- No realiza escrituras.
- No modifica archivos.
- No requiere secretos.
- Riesgo bajo asociado únicamente a consultas de documentación.

## Solución de problemas

### El servidor no aparece

- Verificar Node.js.
- Verificar npm.
- Guardar nuevamente mcp.json.
- Revisar panel MCP Servers.

### Error de conexión

- Abrir MCP Servers.
- Clic derecho sobre el servidor.
- Seleccionar Show MCP Logs.
- Revisar mensajes de error.

## Desinstalación o reversión

Eliminar el bloque correspondiente dentro de:

.kiro/settings/mcp.json

Guardar cambios y reiniciar Kiro si es necesario.
