import React, { useEffect, useState } from "react"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminFeedbacks } from "../services/api"
import { toast } from "react-toastify"
const Stars = ({rating}) => <div className="d-flex gap-1">{[1,2,3,4,5].map(s=><i key={s} className={`ti ti-star${s<=Math.round(rating)?"-filled":""}`} style={{color:"#FFAE1F",fontSize:14}}/>)}</div>
export default function ManageFeedbacks({ setIsAuthenticated, adminName }) {
  const [feedbacks, setFeedbacks] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => { getAdminFeedbacks().then(r => setFeedbacks(r.data.data || [])).catch(() => toast.error("Failed")).finally(() => setLoading(false)) }, [])
  const avg = feedbacks.length?(feedbacks.reduce((s,f)=>s+f.rating,0)/feedbacks.length).toFixed(1):0
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4"><h4 className="fw-bold mb-1">Customer Feedbacks</h4><p className="text-muted mb-0">Monitor all reviews and ratings.</p></div>
      {!loading&&(<div className="row g-3 mb-4">{[{l:"Total Reviews",v:feedbacks.length},{l:"Avg Rating",v:`${avg}/5`},{l:"5 Stars",v:feedbacks.filter(f=>f.rating===5).length}].map((s,i)=>(<div key={s.l} className="col-md-4"><div className="card"><div className="card-body py-3"><p className="text-muted mb-1" style={{fontSize:12}}>{s.l}</p><h4 className="fw-bold mb-0">{s.v}</h4></div></div></div>))}</div>)}
      <DataTable title="All Feedbacks" columns={["Customer","Equipment","Rating","Review","Date"]}
        data={feedbacks} loading={loading} searchKeys={["user.name","equipment.name","feedback"]} emptyMessage="No feedbacks yet."
        renderRow={(f,idx)=>(
          <tr key={f._id}>
            <td>{idx}</td>
            <td><p className="mb-0 fw-semibold" style={{fontSize:13}}>{f.user?.name||"—"}</p><small className="text-muted">{f.user?.email}</small></td>
            <td><span style={{fontSize:13}}>{f.equipment?.name||"—"}</span></td>
            <td><Stars rating={f.rating}/><small className="text-muted">{f.rating}/5</small></td>
            <td><span style={{fontSize:13,color:"#697a8d"}}>"{f.feedback?.slice(0,70)}{f.feedback?.length>70?"...":""}"</span></td>
            <td><span className="text-muted" style={{fontSize:12}}>{f.datetime?new Date(f.datetime).toLocaleDateString("en-IN"):"—"}</span></td>
          </tr>
        )}
      />
    </AdminLayout>
  )
}
