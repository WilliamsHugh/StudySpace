import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('closes from the close button, backdrop, and Escape key', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { rerender } = render(<Modal title="Thêm môn học" onClose={onClose}>Nội dung</Modal>)

    await user.click(screen.getByRole('button', { name: 'Đóng' }))
    expect(onClose).toHaveBeenCalledTimes(1)

    onClose.mockClear()
    rerender(<Modal title="Thêm môn học" onClose={onClose}>Nội dung</Modal>)
    fireEvent.mouseDown(screen.getByRole('presentation'))
    expect(onClose).toHaveBeenCalledTimes(1)

    onClose.mockClear()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when a user presses inside the dialog', () => {
    const onClose = vi.fn()
    render(<Modal title="Thêm môn học" onClose={onClose}>Nội dung</Modal>)

    fireEvent.mouseDown(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('traps focus and restores it to the opener after closing', async () => {
    const user = userEvent.setup()

    function Harness() {
      const [open, setOpen] = useState(false)
      return <><button type="button" onClick={() => setOpen(true)}>Mở popup</button>{open && <Modal title="Biểu mẫu" onClose={() => setOpen(false)}><input aria-label="Nội dung" /><button type="button">Lưu</button></Modal>}</>
    }

    render(<Harness />)
    const opener = screen.getByRole('button', { name: 'Mở popup' })
    await user.click(opener)

    const closeButton = screen.getByRole('button', { name: 'Đóng' })
    const saveButton = screen.getByRole('button', { name: 'Lưu' })
    expect(closeButton).toHaveFocus()
    await user.tab({ shift: true })
    expect(saveButton).toHaveFocus()
    await user.tab()
    expect(closeButton).toHaveFocus()

    await user.click(closeButton)
    expect(opener).toHaveFocus()
  })
})
