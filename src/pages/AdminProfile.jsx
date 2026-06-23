import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import { getProfile, updateProfile, changePassword } from "../services/api"

const BACKEND = "https://equipment-user-n5bb.onrender.com"

export default function AdminProfile({ setIsAuthenticated, adminName }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("info")
  const [saving, setSaving] = useState(false)
  const [changing, setChanging] = useState(false)
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({ name: "", phone: "" })
  const [passForm, setPassForm] = useState({ newPassword: "", confirm: "" })

  const fetch = async () => {
    try {
      const r = await getProfile()
      const d = r.data.data
      setProfile(d)
      setForm({ name: d.name || "", phone: d.phone || "" })
    } catch { toast.error("Failed to load profile") }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const handleSave = async (e) => {
    e?.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      fd.append("name", form.name); fd.append("phone", form.phone)
      if (imgFile) fd.append("profile_image", imgFile)
      const r = await updateProfile(fd)
      if (r.data.success) { toast.success("Profile updated!"); setImgFile(null); setPreview(null); fetch() }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setSaving(false) }
  }

  const handlePass = async (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirm) { toast.error("Passwords don't match!"); return }
    setChanging(true)
    try {
      const r = await changePassword({ email: profile.email, newPassword: passForm.newPassword })
      if (r.data.success) { toast.success("Password changed!"); setPassForm({ newPassword: "", confirm: "" }) }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setChanging(false) }
  }

  const avatarSrc = preview ? preview : profile?.profile_image ? `${BACKEND}${profile.profile_image}` : null

  if (loading) return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
    </AdminLayout>
  )

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">My Profile</h4>
        <p className="text-muted mb-0">Manage your admin account information.</p>
      </div>

      <div className="row g-4">
        {/* Left — avatar card */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body text-center p-4">
              <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid #5D87FF" }} onError={e => e.target.style.display = "none"} />
                ) : (
                  <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,#FBA31C,#c57a00)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 38 }}>
                    {profile?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
                <label htmlFor="admin-av" style={{ position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: "50%", background: "#5D87FF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, border: "2px solid #fff" }}>
                  <i className="ti ti-camera" />
                  <input id="admin-av" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)) } }} />
                </label>
              </div>
              <h5 className="fw-bold mb-1">{profile?.name}</h5>
              <span className="badge bg-primary mb-3">Administrator</span>

              <div className="d-flex flex-column gap-2 text-start mt-3">
                {[
                  { i: "ti-mail", l: "Email", v: profile?.email },
                  { i: "ti-phone", l: "Phone", v: profile?.phone || "—" },
                  { i: "ti-user-check", l: "Role", v: profile?.role || "Admin" },
                ].map(x => (
                  <div key={x.l} className="d-flex align-items-start gap-2 p-2 rounded" style={{ background: "#f6f9ff" }}>
                    <i className={`ti ${x.i} mt-1`} style={{ color: "#5D87FF", fontSize: 16, flexShrink: 0 }} />
                    <div>
                      <p className="text-muted mb-0" style={{ fontSize: 11 }}>{x.l}</p>
                      <p className="fw-semibold mb-0" style={{ fontSize: 13 }}>{x.v}</p>
                    </div>
                  </div>
                ))}
              </div>

              {imgFile && (
                <button className="btn btn-primary w-100 mt-3" onClick={handleSave} disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : "💾 Save New Photo"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right — tabs */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header p-0">
              <ul className="nav nav-tabs card-header-tabs ms-0" style={{ borderBottom: "none" }}>
                {[{ k: "info", l: "Account Info", i: "ti-user" }, { k: "password", l: "Change Password", i: "ti-lock" }].map(t => (
                  <li key={t.k} className="nav-item">
                    <button className={`nav-link fw-semibold${tab === t.k ? " active" : ""}`} style={{ borderRadius: 0, fontSize: 14 }} onClick={() => setTab(t.k)}>
                      <i className={`ti ${t.i} me-1`} />{t.l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-body p-4">
              {tab === "info" && (
                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Full Name</label>
                      <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Admin Name" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Phone</label>
                      <input type="tel" className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Email <span className="text-muted fw-normal" style={{ fontSize: 12 }}>(cannot change)</span></label>
                      <input type="email" className="form-control" value={profile?.email || ""} disabled style={{ background: "#f6f9ff" }} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Role <span className="text-muted fw-normal" style={{ fontSize: 12 }}>(system controlled)</span></label>
                      <input type="text" className="form-control" value={profile?.role || "Admin"} disabled style={{ background: "#f6f9ff" }} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : <><i className="ti ti-check me-1" />Save Changes</>}
                    </button>
                  </div>
                </form>
              )}

              {tab === "password" && (
                <form onSubmit={handlePass}>
                  <div className="alert alert-warning" style={{ fontSize: 13 }}>
                    <i className="ti ti-alert-triangle me-1" />New password must be at least 6 characters.
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">New Password *</label>
                      <input type="password" className="form-control" value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} placeholder="Min 6 characters" required minLength={6} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Confirm Password *</label>
                      <input type="password" className="form-control" value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} placeholder="Repeat password" required />
                      {passForm.confirm && (
                        <div className={`form-text ${passForm.newPassword === passForm.confirm ? "text-success" : "text-danger"}`}>
                          {passForm.newPassword === passForm.confirm ? "✓ Passwords match" : "✗ Passwords don't match"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="btn btn-primary" disabled={changing}>
                      {changing ? <><span className="spinner-border spinner-border-sm me-1" />Updating...</> : <><i className="ti ti-lock me-1" />Update Password</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
