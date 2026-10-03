import { useState, type FormEvent } from 'react'
import styles from './TaskForm.module.css'

interface TaskFormProps {
  /** Llamado cuando el usuario envía un título válido. */
  onSubmit: (title: string) => void
}

/**
 * Formulario para registrar nuevas tareas.
 * Valida que el título no esté vacío antes de notificar al padre.
 * Requirements: 1.1, 1.2
 */
export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = title.trim()

    if (trimmed.length === 0) {
      setError('El título no puede estar vacío.')
      return
    }

    setError(null)
    onSubmit(trimmed)
    setTitle('')
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label="Crear nueva tarea"
      noValidate
    >
      <div className={styles.inputRow}>
        <label htmlFor="task-title" className={styles.label}>
          Nueva tarea
        </label>
        <input
          id="task-title"
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError(null)
          }}
          placeholder="¿Qué necesitas hacer?"
          aria-describedby={error ? 'task-title-error' : undefined}
          aria-invalid={error !== null}
          autoComplete="off"
        />
        <button type="submit" className={styles.button}>
          Agregar
        </button>
      </div>

      {error && (
        <p
          id="task-title-error"
          className={styles.error}
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </form>
  )
}
