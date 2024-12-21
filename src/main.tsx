import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
<<<<<<< HEAD
import App from './App'
import { AuthProvider } from './AuthContext'
=======
import App from './App1'
>>>>>>> 471e48a26195e28cf5bcebe18b630ec3c0e7cf24

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
