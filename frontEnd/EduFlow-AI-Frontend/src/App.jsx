import { useState } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { StateProvider } from './context/StateContext'

function App() {
  return (
    <StateProvider>
      <AppRoutes />
    </StateProvider>
  )
}

export default App
