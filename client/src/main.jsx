import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

// ABSOLUTE TOP SHIM: Fix for React 19 findDOMNode removal
const findDOMNodeShim = (instance) => {
  if (!instance) return null;
  if (instance instanceof HTMLElement) return instance;
  return null;
};

// Patch the global ReactDOM object which legacy libraries look for
// @ts-ignore
const patched = { ...ReactDOM, findDOMNode: findDOMNodeShim };
// @ts-ignore
window.ReactDOM = patched;
// @ts-ignore
window.ReactDOM.default = patched;

import { StrictMode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

ReactDOMClient.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
