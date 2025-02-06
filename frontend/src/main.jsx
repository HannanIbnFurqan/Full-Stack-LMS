import { StrictMode } from 'react'
// import css
import './index.css'
// import 
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

// import components

createRoot(document.getElementById('root')).render(
  <Provider>
    <BrowserRouter>
      <App />
      <Toaster></Toaster>
    </BrowserRouter>
  </Provider>
)
