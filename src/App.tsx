import PWABadge from './PWABadge.tsx'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes.tsx'
import { Toaster } from 'react-hot-toast'
import { HomeProvider } from './pages/Home/HomeContextProvider.tsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <HomeProvider>
          <AppRoutes />
        </HomeProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 2000,
            style: {
              borderRadius: 0,
            },
          }}
        />
      </BrowserRouter>
      <PWABadge />
    </>
  )
}

export default App
