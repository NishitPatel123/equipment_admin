import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminUsers, updateUserStatus } from "../services/api"
const BACKEND = "https://equipment-user-n5bb.onrender.com"
export default function ManageUsers({ setIsAuthenticated, adminName }) {
  const [users, setUsers] = useState([]); const [loading, setLoading] = useState(true); const [toggling, setToggling] = useState(null)
  const fetch = async () => { setLoading(true); try { const r = await getAdminUsers(); setUsers(r.data.data || []) } catch { toast.error("Failed") } finally { setLoading(false) } }
  useEffect(() => { fetch() }, [])
  const handleToggle = async (u) => {
    const ns = u.status === "Active" ? "Inactive" : "Active"
    if (!window.confirm(`${ns === "Active" ? "Activate" : "Deactivate"} ${u.name}?`)) return
    setToggling(u._id)
    try { const r = await updateUserStatus({ user_id: u._id, status: ns }); if (r.data.success) { toast.success(`User ${ns}!`); fetch() } }
    catch (err) { toast.error(err.response?.data?.message || "Failed!") } finally { setToggling(null) }
  }
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4"><h4 className="fw-bold mb-1">Manage Customers</h4><p className="text-muted mb-0">View and manage all registered users.</p></div>
      {!loading && (<div className="row g-3 mb-4">
        {[{l:"Total Users",v:users.length},{l:"Active",v:users.filter(u=>u.status==="Active").length},{l:"Inactive",v:users.filter(u=>u.status==="Inactive").length}].map((s,i)=>(
          <div key={s.l} className="col-md-4"><div className="card"><div className="card-body py-3"><p className="text-muted mb-1" style={{fontSize:12}}>{s.l}</p><h4 className="fw-bold mb-0">{s.v}</h4></div></div></div>
        ))}
      </div>)}
      <DataTable title="All Customers" columns={["Avatar","Name","Email","Phone","Status","Joined","Action"]}
        data={users} loading={loading} searchKeys={["name","email","phone","status"]} emptyMessage="No users yet."
        renderRow={(u,idx)=>(
          <tr key={u._id}>
            <td>{idx}</td>
            <td>{u.profile_image?<img src={`${BACKEND}${u.profile_image}`} alt="" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>:<div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#FBA31C,#c57a00)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:14}}>{u.name?.charAt(0)}</div>}</td>
            <td><strong style={{fontSize:13}}>{u.name}</strong></td>
            <td><span style={{fontSize:13}}>{u.email}</span></td>
            <td><span style={{fontSize:13}}>{u.phone||"—"}</span></td>
            <td><span className={`badge ${u.status==="Active"?"bg-success":"bg-danger"}`}>{u.status}</span></td>
            <td><span className="text-muted" style={{fontSize:12}}>{u.created_at?new Date(u.created_at).toLocaleDateString("en-IN"):"—"}</span></td>
            <td><button className={`btn btn-sm ${u.status==="Active"?"btn-outline-danger":"btn-outline-success"}`} onClick={()=>handleToggle(u)} disabled={toggling===u._id}>{toggling===u._id?<span className="spinner-border spinner-border-sm"/>:u.status==="Active"?"Deactivate":"Activate"}</button></td>
          </tr>
        )}
      />
    </AdminLayout>
  )
}
