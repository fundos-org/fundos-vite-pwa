import PWABadge from './PWABadge.tsx'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes.tsx'

function App() {

  return (
    <>
      <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      <PWABadge />
    </>
  )
}

export default App
