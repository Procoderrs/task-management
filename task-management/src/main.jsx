import { createRoot } from 'react-dom/client'
import { BoardProvider } from './context/boardContext.jsx'
import './index.css'
import App from './App.jsx'
import { StrictMode } from 'react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BoardProvider>
     <App />
  </BoardProvider>
  </StrictMode>
)
