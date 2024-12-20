import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import App from './App1'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </StrictMode>,
)
