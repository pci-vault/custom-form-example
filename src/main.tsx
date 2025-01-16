import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App, { AppProps } from './App.tsx'

const createCustomForm = (element: HTMLElement, options: AppProps) => {
  createRoot(element).render(
    <StrictMode>
      <App {...options} />
    </StrictMode>
  );
}

export { createCustomForm }
