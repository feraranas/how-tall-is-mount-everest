import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// window.onload = function () {
//   setTimeout(() => {
//     window.scrollTo(0, document.body.scrollHeight);
//   }, 0);
// };

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
