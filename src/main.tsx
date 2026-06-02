import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PAGE_HEIGHT } from './config/scene.ts'

document.documentElement.style.setProperty('--page-height', `${PAGE_HEIGHT}px`);
document.documentElement.style.setProperty('--half-page-height', `${PAGE_HEIGHT / 2}px`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
