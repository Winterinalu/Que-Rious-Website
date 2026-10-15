import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import EmailConfirmationPage from './EmailConfirmationPage.jsx'

const isEmailConfirmationRoute = window.location.pathname.replace(/\/$/, '') === '/auth/confirm'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isEmailConfirmationRoute ? <EmailConfirmationPage /> : <App />}
  </StrictMode>,
)
