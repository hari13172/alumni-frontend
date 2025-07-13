import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router";
import App from './App';
import { ThemeProvider } from './theme/theme-provider';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <Sonner position='top-right' richColors />
      <ThemeProvider defaultTheme='light' storageKey='alumini-theme'>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </StrictMode>,
)



