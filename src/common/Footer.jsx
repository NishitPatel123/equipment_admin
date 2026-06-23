import React from "react"
export default function Footer() {
  return (
    <footer className="py-4 px-4" style={{ background: "#fff", borderTop: "1px solid #ebf1f6" }}>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <p className="mb-0 text-muted" style={{ fontSize: 13 }}>© {new Date().getFullYear()} <strong>RentEquip</strong> Admin Panel</p>
        <p className="mb-0 text-muted" style={{ fontSize: 13 }}>Equipment Rental Management System ⚙️</p>
      </div>
    </footer>
  )
}
