import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppShell } from './AppShell'

describe('AppShell responsive navigation', () => {
  it('opens, traps, closes, and restores focus for the mobile menu', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<AppShell activePage="dashboard" title="Tổng quan" onNavigate={onNavigate}><p>Nội dung</p></AppShell>)

    const menuButton = screen.getByRole('button', { name: 'Mở menu điều hướng' })
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(document.querySelector('#primary-sidebar')).toHaveClass('sidebar--open')
    expect(document.querySelector('.sidebar__close')).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(menuButton).toHaveFocus())
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(menuButton)
    await user.click(screen.getByRole('button', { name: 'Bài tập' }))
    expect(onNavigate).toHaveBeenCalledWith('assignments')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(menuButton).toHaveFocus())
  })
})
