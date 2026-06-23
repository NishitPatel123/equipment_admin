import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import checkSession from "./auth/authService"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ManageCategories from "./pages/ManageCategories"
import ManageEquipment from "./pages/ManageEquipment"
import ManageBookings from "./pages/ManageBookings"
import ManageUsers from "./pages/ManageUsers"
import ManagePayments from "./pages/ManagePayments"
import ManageFeedbacks from "./pages/ManageFeedbacks"
import AdminProfile from "./pages/AdminProfile"

const Spin = () => (
  <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div className="spinner-border text-primary" />
  </div>
)

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminName, setAdminName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession().then(({ isAuth, session }) => {
      setIsAuthenticated(isAuth)
      if (session?.name) setAdminName(session.name)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spin />

  const p = { setIsAuthenticated, adminName }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} setAdminName={setAdminName} /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Dashboard {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-categories" element={isAuthenticated ? <ManageCategories {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-equipment" element={isAuthenticated ? <ManageEquipment {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-bookings" element={isAuthenticated ? <ManageBookings {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-users" element={isAuthenticated ? <ManageUsers {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-payments" element={isAuthenticated ? <ManagePayments {...p} /> : <Navigate to="/login" />} />
        <Route path="/manage-feedbacks" element={isAuthenticated ? <ManageFeedbacks {...p} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <AdminProfile {...p} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  )
}
