import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../common/AdminLayout";
import { getDashboardStats } from "../services/api";

export default function Dashboard({ setIsAuthenticated, adminName }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((r) => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers,
          icon: "ti-users",
          color: "#5D87FF",
          bg: "#ECF2FF",
        },
        {
          label: "Categories",
          value: stats.totalCategories,
          icon: "ti-tags",
          color: "#13DEB9",
          bg: "#E6FFFA",
        },
        {
          label: "Total Equipment",
          value: stats.totalEquipment,
          icon: "ti-tool",
          color: "#FFAE1F",
          bg: "#FEF5E5",
        },
        {
          label: "Available",
          value: stats.availableEquip,
          icon: "ti-circle-check",
          color: "#13DEB9",
          bg: "#E6FFFA",
        },
        {
          label: "Rented",
          value: stats.rentedEquip,
          icon: "ti-clock",
          color: "#FA896B",
          bg: "#FBF2EF",
        },
        {
          label: "Total Bookings",
          value: stats.totalBookings,
          icon: "ti-calendar",
          color: "#5D87FF",
          bg: "#ECF2FF",
        },
        {
          label: "Pending",
          value: stats.pendingBookings,
          icon: "ti-hourglass",
          color: "#FFAE1F",
          bg: "#FEF5E5",
        },
        {
          label: "Approved",
          value: stats.approvedBookings,
          icon: "ti-thumb-up",
          color: "#13DEB9",
          bg: "#E6FFFA",
        },
        {
          label: "Cancelled",
          value: stats.cancelledBookings,
          icon: "ti-x",
          color: "#FA896B",
          bg: "#FBF2EF",
        },
        {
          label: "Revenue",
          value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
          icon: "ti-currency-rupee",
          color: "#5D87FF",
          bg: "#ECF2FF",
        },
        {
          label: "Avg Rating",
          value: `${stats.avgRating}/5`,
          icon: "ti-star",
          color: "#FFAE1F",
          bg: "#FEF5E5",
        },
      ]
    : [];

  const badge = (s) => {
    const m = {
      Pending: "bg-warning text-dark",
      Approved: "bg-success",
      Cancelled: "bg-danger",
      Success: "bg-success",
      Failed: "bg-danger",
    };
    return <span className={`badge ${m[s] || "bg-secondary"}`}>{s}</span>;
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dashboard ⚙️</h4>
          <p className="text-muted mb-0">
            Welcome back, <strong>{adminName}</strong>! Here's your platform
            overview.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/manage-equipment" className="btn btn-primary btn-sm">
            <i className="ti ti-plus me-1" />
            Add Equipment
          </Link>
          <Link
            to="/manage-bookings"
            className="btn btn-outline-primary btn-sm"
          >
            <i className="ti ti-calendar-check me-1" />
            Bookings
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            {cards.map((c, i) => (
              <div key={i} className="col-xl-3 col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between">
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          background: c.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className={`ti ${c.icon}`}
                          style={{ fontSize: 24, color: c.color }}
                        />
                      </div>
                      <h3
                        className="fw-bold mb-0"
                        style={{ color: c.color, fontSize: "1.6rem" }}
                      >
                        {c.value}
                      </h3>
                    </div>
                    <p
                      className="text-muted mb-0 mt-3 fw-semibold"
                      style={{ fontSize: 13 }}
                    >
                      {c.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Recent Bookings</h5>
              <Link
                to="/manage-bookings"
                className="btn btn-sm btn-outline-primary"
              >
                View All
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Customer</th>
                      <th>Equipment</th>
                      <th>Dates</th>
                      <th>Qty</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!stats?.recentBookings?.length ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">
                          No bookings yet
                        </td>
                      </tr>
                    ) : (
                      stats.recentBookings.map((b, i) => (
                        <tr key={b._id || i}>
                          <td>
                            <p
                              className="mb-0 fw-semibold"
                              style={{ fontSize: 13 }}
                            >
                              {b.user?.name || "—"}
                            </p>
                            <small className="text-muted">
                              {b.user?.email}
                            </small>
                          </td>
                          <td>
                            <span style={{ fontSize: 13 }}>
                              {b.equipment?.name || "—"}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {b.start_date
                                ? new Date(b.start_date).toLocaleDateString(
                                    "en-IN",
                                  )
                                : "—"}
                            </small>
                            <br />
                            <small className="text-muted">
                              →{" "}
                              {b.end_date
                                ? new Date(b.end_date).toLocaleDateString(
                                    "en-IN",
                                  )
                                : "—"}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-light-primary text-primary">
                              {b.quantity}
                            </span>
                          </td>
                          <td>
                            <strong style={{ color: "#5D87FF" }}>
                              ₹{b.total_amount}
                            </strong>
                          </td>
                          <td>{badge(b.status)}</td>
                          <td>{badge(b.payment_status || "Pending")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Recent Payments</h5>
              <Link
                to="/manage-payments"
                className="btn btn-sm btn-outline-primary"
              >
                View All
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Payment ID</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!stats?.recentPayments?.length ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          No payments yet
                        </td>
                      </tr>
                    ) : (
                      stats.recentPayments.map((p, i) => (
                        <tr key={p._id || i}>
                          <td>
                            <p
                              className="mb-0 fw-semibold"
                              style={{ fontSize: 13 }}
                            >
                              {p.user?.name || "—"}
                            </p>
                            <small className="text-muted">
                              {p.user?.email}
                            </small>
                          </td>
                          <td>
                            <strong style={{ color: "#5D87FF", fontSize: 15 }}>
                              ₹{p.amount}
                            </strong>
                          </td>
                          <td>
                            <code style={{ fontSize: 11 }}>
                              {p.razorpay_payment_id?.slice(0, 16) || "—"}
                            </code>
                          </td>
                          <td>
                            <span
                              className="text-muted"
                              style={{ fontSize: 12 }}
                            >
                              {p.date
                                ? new Date(p.date).toLocaleDateString("en-IN")
                                : "—"}
                            </span>
                          </td>
                          <td>{badge(p.status)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
