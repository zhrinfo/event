
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/login'
import Accueil from './pages/acceuil'
import Dashboard from './pages/Dashboard'
import AjouterEvent from './pages/ajouteEvent'
import Events from './pages/Events'
import ReservationPage from './pages/ReservationPage'
import PaymentPage from './pages/PaymentPage'
import ProfilePage from './pages/ProfilePage'
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ajouter-event" element={<AjouterEvent />} />
        <Route path="/events" element={<Events />} />
        <Route path="/reserve/:eventId" element={<ReservationPage />} />
        <Route path="/payment/:reservationId" element={<PaymentPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        
        {/* Route protégée pour les admins */}
       
      </Routes>
    </>
  )
}

export default App
