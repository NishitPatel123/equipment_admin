import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getAdminBookings, updateBooking } from "../services/api";
const BACKEND = "https://equipment-admin-6p93.onrender.com";
export default function ManageBookings({ setIsAuthenticated, adminName }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const fetch = async () => {
    setLoading(true);
    try {
      const r = await getAdminBookings();
      setBookings(r.data.data || []);
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await updateBooking({ id: modal._id, status });
      if (r.data.success) {
        toast.success("Booking updated!");
        setModal(null);
        fetch();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed!");
    } finally {
      setSaving(false);
    }
  };
  const badge = (s) => {
    const m = {
      Pending: "bg-warning text-dark",
      Approved: "bg-success",
      Cancelled: "bg-danger",
    };
    return <span className={`badge ${m[s] || "bg-secondary"}`}>{s}</span>;
  };
  const payBadge = (s) => {
    const m = {
      Success: "bg-success",
      Pending: "bg-warning text-dark",
      Failed: "bg-danger",
    };
    return (
      <span className={`badge ${m[s] || "bg-secondary"}`}>
        {s || "Pending"}
      </span>
    );
  };
  const counts = {
    pending: bookings.filter((b) => b.status === "Pending").length,
    approved: bookings.filter((b) => b.status === "Approved").length,
    cancelled: bookings.filter((b) => b.status === "Cancelled").length,
  };
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Manage Bookings</h4>
        <p className="text-muted mb-0">
          View and update all equipment rental bookings.
        </p>
      </div>
      <div className="alert alert-info mb-4" style={{ fontSize: 13 }}>
        <i className="ti ti-info-circle me-2" />
        <strong>Approval Required:</strong> Users place bookings with "Pending"
        status. You must approve before they can pay.
      </div>
      {!loading && (
        <div className="row g-3 mb-4">
          {[
            { l: "Total", v: bookings.length, c: "#5D87FF" },
            { l: "Pending", v: counts.pending, c: "#FFAE1F" },
            { l: "Approved", v: counts.approved, c: "#13DEB9" },
            { l: "Cancelled", v: counts.cancelled, c: "#FA896B" },
          ].map((s) => (
            <div key={s.l} className="col-md-3">
              <div className="card" style={{ borderLeft: `4px solid ${s.c}` }}>
                <div className="card-body py-3">
                  <p className="text-muted mb-1" style={{ fontSize: 12 }}>
                    {s.l}
                  </p>
                  <h4 className="fw-bold mb-0" style={{ color: s.c }}>
                    {s.v}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <DataTable
        title="All Bookings"
        columns={[
          "Customer",
          "Equipment",
          "Dates",
          "Qty",
          "Days",
          "Amount",
          "Status",
          "Payment",
          "Action",
        ]}
        data={bookings}
        loading={loading}
        searchKeys={["user.name", "equipment.name", "status"]}
        emptyMessage="No bookings yet."
        renderRow={(b, idx) => (
          <tr key={b._id}>
            <td>{idx}</td>
            <td>
              <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>
                {b.user?.name || "—"}
              </p>
              <small className="text-muted">{b.user?.email}</small>
            </td>
            <td>
              <div className="d-flex align-items-center gap-2">
                {b.equipment?.image && (
                  <img
                    src={`${BACKEND}${b.equipment.image}`}
                    alt=""
                    style={{
                      width: 36,
                      height: 28,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <p
                  className="text-sm font-weight-bold mb-0"
                  style={{ fontSize: 12 }}
                >
                  {b.equipment?.name || "—"}
                </p>
              </div>
            </td>
            <td>
              <small className="text-muted">
                {b.start_date
                  ? new Date(b.start_date).toLocaleDateString("en-IN")
                  : "—"}
              </small>
              <br />
              <small className="text-muted">
                →
                {b.end_date
                  ? new Date(b.end_date).toLocaleDateString("en-IN")
                  : "—"}
              </small>
            </td>
            <td>
              <span className="badge bg-light-primary text-primary">
                {b.quantity}
              </span>
            </td>
            <td>
              <span className="text-muted" style={{ fontSize: 12 }}>
                {b.rental_days}d
              </span>
            </td>
            <td>
              <strong style={{ color: "#5D87FF" }}>₹{b.total_amount}</strong>
            </td>
            <td>{badge(b.status)}</td>
            <td>{payBadge(b.payment_status)}</td>
            <td>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  setModal(b);
                  setStatus(b.status);
                }}
                title="Update"
              >
                <i className="ti ti-edit" />
              </button>
            </td>
          </tr>
        )}
      />
      {modal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Update Booking Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModal(null)}
                />
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div
                    className="alert alert-light text-sm mb-3"
                    style={{ fontSize: 13 }}
                  >
                    <p className="mb-1">
                      <strong>Customer:</strong> {modal.user?.name}
                    </p>
                    <p className="mb-1">
                      <strong>Equipment:</strong> {modal.equipment?.name}
                    </p>
                    <p className="mb-1">
                      <strong>Dates:</strong>{" "}
                      {modal.start_date
                        ? new Date(modal.start_date).toLocaleDateString("en-IN")
                        : "—"}{" "}
                      →{" "}
                      {modal.end_date
                        ? new Date(modal.end_date).toLocaleDateString("en-IN")
                        : "—"}
                    </p>
                    <p className="mb-0">
                      <strong>Amount:</strong> ₹{modal.total_amount} (
                      {modal.quantity} unit{modal.quantity > 1 ? "s" : ""} ×{" "}
                      {modal.rental_days} day{modal.rental_days > 1 ? "s" : ""})
                    </p>
                  </div>
                  <div className="alert alert-info" style={{ fontSize: 12 }}>
                    ⚠️ Setting to <strong>Approved</strong> allows the customer
                    to pay for this booking.
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Booking Status
                    </label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
