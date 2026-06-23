import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../services/api";
import { setToken } from "../auth/authService";
export default function Login({ setIsAuthenticated, setAdminName }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      if (res.data.success) {
        if (res.data.userData?.session?.role !== "Admin") {
          toast.error("Admin accounts only!");
          return;
        }
        setToken(res.data.token);
        setIsAuthenticated(true);
        setAdminName(res.data.userData?.session?.name || "Admin");
        toast.success("Welcome, Admin! ⚙️");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="page-wrapper" id="main-wrapper" data-layout="vertical">
      <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center justify-content-center w-100">
          <div className="row justify-content-center w-100">
            <div className="col-md-8 col-lg-6 col-xxl-3">
              <div className="card mb-0">
                <div className="card-body p-4">
                  <div className="text-center py-3 mb-2">
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        background: "linear-gradient(135deg,#FBA31C,#c57a00)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        margin: "0 auto 12px",
                      }}
                    >
                      ⚙️
                    </div>
                    <h4 className="fw-bold mb-1">RentEquip Admin</h4>
                    <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                      Sign in to manage the platform
                    </p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="admin@rentequip.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-4" style={{ position: "relative" }}>
                      <label className="form-label fw-semibold">Password</label>
                      <input
                        type={showPass ? "text" : "password"}
                        className="form-control"
                        placeholder="············"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        style={{
                          position: "absolute",
                          right: 12,
                          top: 34,
                          background: "none",
                          border: "none",
                          color: "#5A6A85",
                          cursor: "pointer",
                          fontSize: 18,
                          lineHeight: 1,
                        }}
                      >
                        <i
                          className={`ti ${showPass ? "ti-eye-off" : "ti-eye"}`}
                        />
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2 fs-5 mb-4 rounded-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
