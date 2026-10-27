import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBSpinner,
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/users/Login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);

        if (res.data.user.type === 'admin') {
          navigate('/admin');
        } else {
          navigate(from === '/admin' ? '/home' : from);
        }
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (!err.response) {
        toast.error('Cannot connect to backend server. Please verify the Express server is running on http://localhost:8001.');
      } else {
        toast.error(err.response?.data?.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="auth-page-wrapper py-5">
      <MDBContainer>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <MDBCard className="shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="bg-primary p-4 text-center text-white">
                <div className="brand-icon-box mx-auto mb-2 bg-white text-primary">
                  <MDBIcon fas icon="hotel" />
                </div>
                <h4 className="fw-bold mb-1">Welcome Back</h4>
                <p className="mb-0 text-white-50 small">Access your HotelPro reservations and dashboard</p>
              </div>

              <MDBCardBody className="p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Email Address</label>
                    <MDBInput
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Password</label>
                    <MDBInput
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <MDBBtn
                    type="submit"
                    color="primary"
                    className="w-100 py-3 rounded-3 fw-bold bg-gradient-gold border-0 shadow-sm mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <MDBIcon fas icon="sign-in-alt" className="me-2" /> Sign In
                      </>
                    )}
                  </MDBBtn>

                  <div className="text-center mb-4">
                    <span className="text-muted small">Don't have an account yet? </span>
                    <Link to="/signup" className="fw-bold text-primary small text-decoration-none">
                      Create an Account
                    </Link>
                  </div>

                  {/* Demo Credentials Helper Box */}
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <MDBIcon fas icon="bolt" className="text-warning" />
                      <span className="fw-bold small text-dark">One-Click Demo Credentials</span>
                    </div>
                    <div className="d-flex gap-2">
                      <MDBBtn
                        type="button"
                        size="sm"
                        color="secondary"
                        outline
                        className="flex-grow-1"
                        onClick={() => handleQuickLogin('customer@hotelpro.com', 'customer123')}
                      >
                        <MDBIcon fas icon="user" className="me-1" /> Customer
                      </MDBBtn>
                      <MDBBtn
                        type="button"
                        size="sm"
                        color="dark"
                        outline
                        className="flex-grow-1"
                        onClick={() => handleQuickLogin('admin@hotelpro.com', 'admin123')}
                      >
                        <MDBIcon fas icon="user-shield" className="me-1" /> Admin
                      </MDBBtn>
                    </div>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </div>
        </div>
      </MDBContainer>
    </div>
  );
};

export default Login;
