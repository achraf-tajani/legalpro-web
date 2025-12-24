import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './config/i18n.config'
import './index.css'
import './styles/theme.css'
import './styles/calendar.css';
import './styles/sweetalert.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)