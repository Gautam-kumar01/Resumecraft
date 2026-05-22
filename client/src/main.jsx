import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as ReactDOM from 'react-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

// Fix for React 19 findDOMNode removal (required by legacy libraries like react-quill)
if (!ReactDOM.findDOMNode) {
  const shim = (instance) => {
    if (!instance) return null;
    if (instance instanceof HTMLElement) return instance;
    return null;
  };
  // @ts-ignore
  ReactDOM.findDOMNode = shim;
  // Also attach to window for bundled libraries that might look for global ReactDOM
  // @ts-ignore
  window.ReactDOM = { ...ReactDOM, findDOMNode: shim };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
