import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'semantic-ui-css/semantic.min.css'
import 'react-quill/dist/quill.snow.css';

// modern structure for main.jsx
const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)