import type { FilterState } from '../types/task'
import styles from './FilterBar.module.css'

interface FilterBarProps {
  activeFilter: FilterState
  /** Llamado cuando el usuario cambia el filtro activo. */
  onFilterChange: (filter: FilterState) => void
  /** Conteo de tareas por estado para mostrar en los botones. */
  counts: { all: number; pending: number; completed: number }
}

const FILTERS: { value: FilterState; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
]

/**
 * Barra de filtros por estado de tarea.
 * Mantiene el filtro activo hasta que el usuario lo cambie (Req 3.3).
 * Requirements: 3.1, 3.2, 3.3
 */
export function FilterBar({ activeFilter, onFilterChange, counts }: FilterBarProps) {
  return (
    <nav
      className={styles.bar}
      aria-label="Filtrar tareas por estado"
      role="navigation"
    >
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={`${styles.button} ${activeFilter === value ? styles.active : ''}`}
          onClick={() => onFilterChange(value)}
          aria-pressed={activeFilter === value}
          aria-label={`${label} (${counts[value]})`}
        >
          {label}
          <span
            className={`${styles.badge} ${activeFilter === value ? styles.badgeActive : ''}`}
            aria-hidden="true"
          >
            {counts[value]}
          </span>
        </button>
      ))}
    </nav>
  )
}
