import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminCategories, addCategory, updateCategory, deleteCategory } from "../services/api"

const BACKEND = "https://equipment-admin-6p93.onrender.com"

export default function ManageCategories({ setIsAuthenticated, adminName }) {
  const [cats, setCats] = useState([]); const [loading, setLoading] = useState(true); const [modal, setModal] = useState(false); const [editing, setEditing] = useState(null); const [form, setForm] = useState({ name: "", status: "Active" }); const [imgFile, setImgFile] = useState(null); const [preview, setPreview] = useState(null); const [saving, setSaving] = useState(false)

  const fetch = async () => { setLoading(true); try { const r = await getAdminCategories(); setCats(r.data.data || []) } catch { toast.error("Failed") } finally { setLoading(false) } }
  useEffect(() => { fetch() }, [])

  const openAdd = () => { setEditing(null); setForm({ name: "", status: "Active" }); setImgFile(null); setPreview(null); setModal(true) }
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, status: c.status || "Active" }); setImgFile(null); setPreview(c.image ? `${BACKEND}${c.image}` : null); setModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData(); fd.append("name", form.name)
      if (editing) { fd.append("id", editing._id); fd.append("status", form.status) }
      if (imgFile) fd.append("image", imgFile)
      const res = editing ? await updateCategory(fd) : await addCategory(fd)
      if (res.data.success) { toast.success(editing ? "Updated!" : "Added!"); setModal(false); fetch() }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return
    try { const r = await deleteCategory(id); if (r.data.success) { toast.success("Deleted!"); fetch() } }
    catch (err) { toast.error(err.response?.data?.message || "Failed!") }
  }

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4"><h4 className="fw-bold mb-1">Manage Categories</h4><p className="text-muted mb-0">Add and manage equipment categories.</p></div>
      <DataTable title="All Categories" columns={["Image", "Name", "Status", "Actions"]}
        data={cats} loading={loading} searchKeys={["name", "status"]} emptyMessage="No categories yet."
        headerAction={<button className="btn btn-primary" onClick={openAdd}><i className="ti ti-plus me-1" />Add Category</button>}
        renderRow={(c, idx) => (
          <tr key={c._id}>
            <td>{idx}</td>
            <td>{c.image ? <img src={`${BACKEND}${c.image}`} alt={c.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : <div style={{ width: 48, height: 48, borderRadius: 8, background: "linear-gradient(135deg,#FBA31C,#c57a00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚙️</div>}</td>
            <td><strong style={{ fontSize: 14 }}>{c.name}</strong></td>
            <td><span className={`badge ${c.status === "Active" ? "bg-success" : "bg-danger"}`}>{c.status || "Active"}</span></td>
            <td><div className="d-flex gap-1"><button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(c)}><i className="ti ti-edit" /></button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}><i className="ti ti-trash" /></button></div></td>
          </tr>
        )}
      />
      {modal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title fw-bold">{editing ? "Edit Category" : "Add Category"}</h5><button type="button" className="btn-close" onClick={() => setModal(false)} /></div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="text-center mb-4">
                    <div style={{ position: "relative", display: "inline-block" }}>
                      {preview ? <img src={preview} alt="" style={{ width: 90, height: 90, borderRadius: 10, objectFit: "cover", border: "2px dashed #5D87FF" }} onError={e => e.target.style.display = "none"} /> : <div style={{ width: 90, height: 90, borderRadius: 10, background: "linear-gradient(135deg,#FBA31C,#c57a00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>⚙️</div>}
                      <label htmlFor="cat-img" style={{ position: "absolute", bottom: -6, right: -6, width: 26, height: 26, borderRadius: "50%", background: "#5D87FF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, border: "2px solid #fff" }}>
                        <i className="ti ti-camera" /><input id="cat-img" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)) } }} />
                      </label>
                    </div>
                    <p className="text-muted mt-2 mb-0" style={{ fontSize: 12 }}>Click to upload image</p>
                  </div>
                  <div className="mb-3"><label className="form-label fw-semibold">Category Name *</label><input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Excavators, Cranes" required /></div>
                  {editing && (<div className="mb-3"><label className="form-label fw-semibold">Status</label><select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>)}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <><span className="spinner-border spinner-border-sm me-1" />{editing ? "Updating..." : "Adding..."}</> : (editing ? "Update" : "Add Category")}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
