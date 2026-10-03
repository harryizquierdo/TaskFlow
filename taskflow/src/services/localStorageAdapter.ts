/**
 * Abstracción para leer y escribir datos en LocalStorage.
 * Aísla al resto de la aplicación de la API nativa del navegador.
 * Requirements: 4.1, 4.2, 4.3
 */
export class LocalStorageAdapter {
  private readonly key: string

  constructor(key: string) {
    this.key = key
  }

  /**
   * Lee y deserializa el valor almacenado.
   * Si no existe o el JSON está corrupto devuelve null (Req 4.2).
   */
  load<T>(): T | null {
    try {
      const raw = localStorage.getItem(this.key)
      if (raw === null) return null
      return JSON.parse(raw) as T
    } catch (err) {
      console.error(
        `[LocalStorageAdapter] Error al leer la clave "${this.key}". Restaurando estado vacío.`,
        err,
      )
      return null
    }
  }

  /**
   * Serializa y persiste el valor.
   * Si la escritura falla lo registra en consola sin romper la aplicación.
   */
  save<T>(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value))
    } catch (err) {
      console.error(
        `[LocalStorageAdapter] Error al guardar la clave "${this.key}".`,
        err,
      )
    }
  }

  /** Elimina la clave del almacenamiento. */
  clear(): void {
    try {
      localStorage.removeItem(this.key)
    } catch (err) {
      console.error(
        `[LocalStorageAdapter] Error al limpiar la clave "${this.key}".`,
        err,
      )
    }
  }
}
