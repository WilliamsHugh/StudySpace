import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { StudySpaceProvider } from './state/StudySpaceContext'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><StudySpaceProvider><App /></StudySpaceProvider></StrictMode>,
)
