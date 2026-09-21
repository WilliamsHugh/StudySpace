import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import type { PageId } from '../../App'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface AppShellProps extends PropsWithChildren {
  activePage: PageId
  title: string
  onNavigate: (page: PageId) => void
}

export function AppShell({ activePage, title, onNavigate, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const navigate = (page: PageId) => {
    onNavigate(page)
    setMenuOpen(false)
    if (menuOpen) requestAnimationFrame(() => menuButtonRef.current?.focus())
  }

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
        return
      }

      if (event.key === 'Tab') {
        const sidebar = document.getElementById('primary-sidebar')
        const focusable = Array.from(sidebar?.querySelectorAll<HTMLElement>('button:not([disabled])') ?? [])
        const first = focusable[0]
        const last = focusable.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.classList.add('menu-open')
    document.querySelector<HTMLElement>('#primary-sidebar button')?.focus()
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onClose={closeMenu} onNavigate={navigate} open={menuOpen} />
      {menuOpen && <button className="backdrop" aria-label="Đóng menu điều hướng" onClick={closeMenu} />}
      <div className="app-shell__main">
        <Header menuButtonRef={menuButtonRef} menuOpen={menuOpen} title={title} onMenuClick={() => setMenuOpen((open) => !open)} />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
