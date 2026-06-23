import React, { useEffect, useState } from "react"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminPayments } from "../services/api"
import { toast } from "react-toastify"
export default function ManagePayments({ setIsAuthenticated, adminName }) {
  const [payments, setPayments] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => { getAdminPayments().then(r => setPayments(r.data.data || [])).catch(() => toast.error("Failed")).finally(() => setLoading(false)) }, [])
  const revenue = payments.filter(p => p.status === "Success").reduce((s, p) => s + (p.amount || 0), 0)
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4"><h4 className="fw-bold mb-1">Payment Transactions</h4><p className="text-muted mb-0">Monitor all Razorpay payment records.</p></div>
      {!loading && (<div className="row g-3 mb-4">
        {[{l:"Total Revenue",v:`₹${revenue.toLocaleString("en-IN")}`,c:"#5D87FF"},{l:"Successful",v:payments.filter(p=>p.status==="Success").length,c:"#13DEB9"},{l:"Failed/Other",v:payments.filter(p=>p.status!=="Success").length,c:"#FA896B"}].map(s=>(
          <div key={s.l} className="col-md-4"><div className="card" style={{borderLeft:`4px solid ${s.c}`}}><div className="card-body py-3"><p className="text-muted mb-1" style={{fontSize:12}}>{s.l}</p><h4 className="fw-bold mb-0" style={{color:s.c}}>{s.v}</h4></div></div></div>
        ))}
      </div>)}
      <DataTable title="All Payments" columns={["Customer","Amount","Payment ID","Date","Status"]}
        data={payments} loading={loading} searchKeys={["user.name","razorpay_payment_id","status"]} emptyMessage="No payments yet."
        renderRow={(p,idx)=>(
          <tr key={p._id}>
            <td>{idx}</td>
            <td><p className="mb-0 fw-semibold" style={{fontSize:13}}>{p.user?.name||"—"}</p><small className="text-muted">{p.user?.email}</small></td>
            <td><strong style={{color:"#5D87FF",fontSize:15}}>₹{p.amount}</strong></td>
            <td><code style={{fontSize:11}}>{p.razorpay_payment_id?.slice(0,16)||"—"}</code></td>
            <td><span className="text-muted" style={{fontSize:12}}>{p.date?new Date(p.date).toLocaleDateString("en-IN"):"—"}</span></td>
            <td><span className={`badge ${p.status==="Success"?"bg-success":"bg-danger"}`}>{p.status}</span></td>
          </tr>
        )}
      />
    </AdminLayout>
  )
}
