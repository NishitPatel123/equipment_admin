import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminEquipment, getAdminCategories, addEquipment, updateEquipment, deleteEquipment } from "../services/api"

const BACKEND = "https://equipment-admin-6p93.onrender.com"
const empty = { category_id: "", name: "", description: "", specification: "", price: "", total_qty: "", status: "Available" }

export default function ManageEquipment({ setIsAuthenticated, adminName }) {
  const [equipment, setEquipment] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const [eR, cR] = await Promise.all([getAdminEquipment(), getAdminCategories()])
      setEquipment(eR.data.data || [])
      setCategories(cR.data.data || [])
    } catch { toast.error("Failed to load") }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setImgFile(null); setPreview(null); setModal(true) }
  const openEdit = (eq) => {
    setEditing(eq)
    setForm({ category_id: String(eq.category_id || eq.category?._id || ""), name: eq.name, description: eq.description, specification: eq.specification, price: eq.price, total_qty: eq.total_qty, status: eq.status || "Available" })
    setImgFile(null); setPreview(eq.image ? `${BACKEND}${eq.image}` : null)
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      fd.append("category_id", form.category_id); fd.append("name", form.name)
      fd.append("description", form.description); fd.append("specification", form.specification)
      fd.append("price", form.price); fd.append("total_qty", form.total_qty)
      if (editing) { fd.append("id", editing._id); fd.append("status", form.status) }
      if (imgFile) fd.append("image", imgFile)
      const res = editing ? await updateEquipment(fd) : await addEquipment(fd)
      if (res.data.success) { toast.success(editing ? "Updated!" : "Added!"); setModal(false); fetch() }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this equipment?")) return
    try { const r = await deleteEquipment(id); if (r.data.success) { toast.success("Deleted!"); fetch() } }
    catch (err) { toast.error(err.response?.data?.message || "Failed!") }
  }

  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Manage Equipment</h4>
        <p className="text-muted mb-0">Add and manage rental equipment listings.</p>
      </div>

      <DataTable title="All Equipment" columns={["Image", "Name", "Category", "Price/Day", "Qty", "Status", "Actions"]}
        data={equipment} loading={loading} searchKeys={["name", "category.name", "status"]} emptyMessage="No equipment yet."
        headerAction={<button className="btn btn-primary" onClick={openAdd}><i className="ti ti-plus me-1" />Add Equipment</button>}
        renderRow={(eq, idx) => (
          <tr key={eq._id}>
            <td>{idx}</td>
            <td>{eq.image ? <img src={`${BACKEND}${eq.image}`} alt={eq.name} style={{ width: 52, height: 44, borderRadius: 6, objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : <div style={{ width: 52, height: 44, borderRadius: 6, background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚙️</div>}</td>
            <td>
              <p className="fw-semibold mb-0" style={{ fontSize: 13 }}>{eq.name}</p>
              <small className="text-muted">{eq.description?.slice(0, 40)}{eq.description?.length > 40 ? "..." : ""}</small>
            </td>
            <td><span className="badge bg-light-primary text-primary">{eq.category?.name || "—"}</span></td>
            <td><strong style={{ color: "#5D87FF" }}>₹{eq.price}</strong><small className="text-muted">/day</small></td>
            <td><span className="badge bg-secondary">{eq.total_qty}</span></td>
            <td><span className={`badge ${eq.status === "Available" ? "bg-success" : "bg-warning text-dark"}`}>{eq.status}</span></td>
            <td>
              <div className="d-flex gap-1">
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(eq)}><i className="ti ti-edit" /></button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(eq._id)}><i className="ti ti-trash" /></button>
              </div>
            </td>
          </tr>
        )}
      />

      {modal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editing ? "Edit Equipment" : "Add Equipment"}</h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Image */}
                  <div className="text-center mb-4">
                    <div style={{ position: "relative", display: "inline-block" }}>
                      {preview ? <img src={preview} alt="" style={{ width: 100, height: 80, borderRadius: 8, objectFit: "cover", border: "2px dashed #5D87FF" }} onError={e => e.target.style.display = "none"} /> : <div style={{ width: 100, height: 80, borderRadius: 8, background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>⚙️</div>}
                      <label htmlFor="eq-img" style={{ position: "absolute", bottom: -6, right: -6, width: 26, height: 26, borderRadius: "50%", background: "#5D87FF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, border: "2px solid #fff" }}>
                        <i className="ti ti-camera" /><input id="eq-img" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)) } }} />
                      </label>
                    </div>
                    <p className="text-muted mt-2 mb-0" style={{ fontSize: 12 }}>Click to upload equipment image</p>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Category *</label>
                      <select className="form-select" value={form.category_id} onChange={e => sf("category_id", e.target.value)} required>
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Equipment Name *</label>
                      <input type="text" className="form-control" value={form.name} onChange={e => sf("name", e.target.value)} placeholder="e.g. Excavator HMX300" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Description *</label>
                      <textarea className="form-control" rows={2} value={form.description} onChange={e => sf("description", e.target.value)} placeholder="Describe the equipment..." required />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Specifications *</label>
                      <input type="text" className="form-control" value={form.specification} onChange={e => sf("specification", e.target.value)} placeholder="e.g. 300W Power, 5m Reach, Operating Weight 2T" required />
                      <div className="form-text">Comma-separated technical specs shown to customers</div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Price/Day (₹) *</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input type="number" className="form-control" value={form.price} onChange={e => sf("price", e.target.value)} placeholder="500" min="1" required />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Total Quantity *</label>
                      <input type="number" className="form-control" value={form.total_qty} onChange={e => sf("total_qty", e.target.value)} placeholder="5" min="1" required />
                    </div>
                    {editing && (
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Status</label>
                        <select className="form-select" value={form.status} onChange={e => sf("status", e.target.value)}>
                          <option value="Available">Available</option>
                          <option value="Rented">Rented</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-1" />{editing ? "Updating..." : "Adding..."}</> : (editing ? "Update Equipment" : "Add Equipment")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
