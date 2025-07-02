import PWABadge from './PWABadge.tsx'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes.tsx'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
  position="top-center"
  reverseOrder={false}
/>
        </BrowserRouter>
      <PWABadge />
    </>
  )
}

export default App
