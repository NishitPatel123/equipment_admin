import React from "react";
import { Link, useLocation } from "react-router-dom";

const groups = [
  {
    cap: "MAIN",
    items: [{ to: "/", icon: "ti ti-layout-dashboard", label: "Dashboard" }],
  },
  {
    cap: "INVENTORY",
    items: [
      { to: "/manage-categories", icon: "ti ti-tags", label: "Categories" },
      { to: "/manage-equipment", icon: "ti ti-tool", label: "Equipment" },
    ],
  },
  {
    cap: "RENTALS",
    items: [
      {
        to: "/manage-bookings",
        icon: "ti ti-calendar",
        label: "Bookings",
      },
      { to: "/manage-payments", icon: "ti ti-credit-card", label: "Payments" },
    ],
  },
  {
    cap: "USERS",
    items: [
      { to: "/manage-users", icon: "ti ti-users", label: "Customers" },
      { to: "/manage-feedbacks", icon: "ti ti-star", label: "Feedbacks" },
    ],
  },
  {
    cap: "ACCOUNT",
    items: [{ to: "/profile", icon: "ti ti-user-circle", label: "My Profile" }],
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <Link
            to="/"
            className="text-nowrap logo-img d-flex align-items-center gap-2"
          >
            <span style={{ fontSize: 24 }}>⚙️</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#2A3547" }}>
              Rent<span style={{ color: "#5D87FF" }}>Equip</span>
            </span>
          </Link>
          <div
            className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
            id="sidebarCollapse"
          >
            <i className="ti ti-x fs-8" />
          </div>
        </div>
        <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
          <ul id="sidebarnav">
            {groups.map((g) => (
              <React.Fragment key={g.cap}>
                <li className="nav-small-cap">
                  <i className="ti ti-dots nav-small-cap-icon fs-4" />
                  <span className="hide-menu">{g.cap}</span>
                </li>
                {g.items.map((item) => (
                  <li
                    key={item.to}
                    className={`sidebar-item${pathname === item.to ? " selected" : ""}`}
                  >
                    <Link
                      to={item.to}
                      className={`sidebar-link${pathname === item.to ? " active" : ""}`}
                      aria-expanded="false"
                    >
                      <span>
                        <i className={item.icon} />
                      </span>
                      <span className="hide-menu">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
