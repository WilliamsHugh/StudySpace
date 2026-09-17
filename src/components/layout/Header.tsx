import type { RefObject } from 'react'

interface HeaderProps {
  title: string
  onMenuClick: () => void
  menuOpen: boolean
  menuButtonRef: RefObject<HTMLButtonElement | null>
}

export function Header({ title, onMenuClick, menuOpen, menuButtonRef }: HeaderProps) {
  return (
    <header className="header">
      <button
        aria-controls="primary-sidebar"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
        className="menu-button"
        onClick={onMenuClick}
        ref={menuButtonRef}
        type="button"
      >☰</button>
      <div className="header__title"><p className="eyebrow">Không gian học tập</p><h1>{title}</h1></div>
      <div className="header__actions">
        <button className="icon-button" type="button" aria-label="Thông báo">♢</button>
        <div className="avatar avatar--small">MA</div>
      </div>
    </header>
  )
}
