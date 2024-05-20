import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx';
import Routes from './routes/index.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Routes/>
    </AuthContextProvider>
  </React.StrictMode>,
)
