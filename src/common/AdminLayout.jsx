import React from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import Footer from "./Footer"
export default function AdminLayout({ children, setIsAuthenticated, adminName }) {
  return (
    <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
      <Sidebar />
      <div className="body-wrapper">
        <Navbar setIsAuthenticated={setIsAuthenticated} adminName={adminName} />
        <div className="container-fluid" style={{ padding: "24px" }}>{children}</div>
        <Footer />
      </div>
    </div>
  )
}
