import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '../../src/components/TaskForm'
import { TaskList } from '../../src/components/TaskList'
import { FilterBar } from '../../src/components/FilterBar'
import type { Task } from '../../src/types/task'

// ─── Fixtures ───────────────────────────────────────────────────────────────
function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: crypto.randomUUID(),
    title: 'Tarea de prueba',
    completed: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

// ─── TaskForm ────────────────────────────────────────────────────────────────
describe('TaskForm', () => {
  it('llama onSubmit con el título cuando el formulario es válido (Req 1.1)', async () => {
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByRole('textbox'), 'Nueva tarea')
    await userEvent.click(screen.getByRole('button', { name: /agregar/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith('Nueva tarea')
  })

  it('muestra error y no llama onSubmit si el título está vacío (Req 1.2)', async () => {
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /agregar/i }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/no puede estar vacío/i)
  })

  it('limpia el campo tras un envío exitoso', async () => {
    render(<TaskForm onSubmit={vi.fn()} />)
    const input = screen.getByRole('textbox')

    await userEvent.type(input, 'Tarea temporal')
    await userEvent.click(screen.getByRole('button', { name: /agregar/i }))

    expect(input).toHaveValue('')
  })

  it('borra el error cuando el usuario empieza a escribir', async () => {
    render(<TaskForm onSubmit={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: /agregar/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

// ─── TaskList ────────────────────────────────────────────────────────────────
describe('TaskList', () => {
  it('muestra estado vacío cuando no hay tareas (Req 3.2)', () => {
    render(<TaskList tasks={[]} filter="all" onToggle={vi.fn()} />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('muestra las tareas existentes (Req 1.3)', () => {
    const tasks = [makeTask({ title: 'Tarea A' }), makeTask({ title: 'Tarea B' })]
    render(<TaskList tasks={tasks} filter="all" onToggle={vi.fn()} />)
    expect(screen.getByText('Tarea A')).toBeInTheDocument()
    expect(screen.getByText('Tarea B')).toBeInTheDocument()
  })

  it('filtra correctamente por "pending" (Req 3.1)', () => {
    const tasks = [
      makeTask({ title: 'Pendiente', completed: false }),
      makeTask({ title: 'Hecha', completed: true }),
    ]
    render(<TaskList tasks={tasks} filter="pending" onToggle={vi.fn()} />)
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.queryByText('Hecha')).not.toBeInTheDocument()
  })

  it('filtra correctamente por "completed" (Req 3.1)', () => {
    const tasks = [
      makeTask({ title: 'Pendiente', completed: false }),
      makeTask({ title: 'Hecha', completed: true }),
    ]
    render(<TaskList tasks={tasks} filter="completed" onToggle={vi.fn()} />)
    expect(screen.queryByText('Pendiente')).not.toBeInTheDocument()
    expect(screen.getByText('Hecha')).toBeInTheDocument()
  })

  it('muestra estado vacío con mensaje específico para filtro sin resultados (Req 3.2)', () => {
    const tasks = [makeTask({ completed: false })]
    render(<TaskList tasks={tasks} filter="completed" onToggle={vi.fn()} />)
    const empty = screen.getByTestId('empty-state')
    expect(empty).toHaveTextContent(/no has completado/i)
  })

  it('llama onToggle con el id correcto al hacer click en checkbox (Req 2.1)', async () => {
    const onToggle = vi.fn()
    const task = makeTask({ title: 'Toggleable' })
    render(<TaskList tasks={[task]} filter="all" onToggle={onToggle} />)

    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith(task.id)
  })
})

// ─── FilterBar ────────────────────────────────────────────────────────────────
describe('FilterBar', () => {
  const counts = { all: 5, pending: 3, completed: 2 }

  it('renderiza los tres filtros', () => {
    render(
      <FilterBar activeFilter="all" onFilterChange={vi.fn()} counts={counts} />,
    )
    expect(screen.getByRole('button', { name: /todas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pendientes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /completadas/i })).toBeInTheDocument()
  })

  it('el filtro activo tiene aria-pressed=true (Req 3.3)', () => {
    render(
      <FilterBar activeFilter="pending" onFilterChange={vi.fn()} counts={counts} />,
    )
    expect(screen.getByRole('button', { name: /pendientes/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: /todas/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('llama onFilterChange con el valor correcto al hacer click (Req 3.1)', async () => {
    const onChange = vi.fn()
    render(
      <FilterBar activeFilter="all" onFilterChange={onChange} counts={counts} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /completadas/i }))
    expect(onChange).toHaveBeenCalledWith('completed')
  })
})
