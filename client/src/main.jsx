import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { AuthProvider } from '@/provider/AuthProvider.jsx'
import { SettingsProvider } from '@/provider/SettingsProvider.jsx'
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider.jsx'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppRouter from './pages/routes/Router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <SettingsProvider>
          <TooltipProvider>
            <AppRouter />
            <Toaster />
          </TooltipProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
