import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [type, setType] = useState('customer');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !cPassword) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password !== cPassword) {
      toast.error('Passwords do not match. Please recheck.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/users/SignUp', {
        name,
        email,
        phone,
        password,
        c_password: cPassword,
        type,
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success('🎉 Account registered successfully! Welcome to HotelPro.');
        if (res.data.user.type === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.response?.data?.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper py-5">
      <MDBContainer>
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-6">
            <MDBCard className="shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="bg-primary p-4 text-center text-white">
                <div className="brand-icon-box mx-auto mb-2 bg-white text-primary">
                  <MDBIcon fas icon="user-plus" />
                </div>
                <h4 className="fw-bold mb-1">Create an Account</h4>
                <p className="mb-0 text-white-50 small">Join HotelPro for exclusive rates and seamless reservations</p>
              </div>

              <MDBCardBody className="p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Full Name</label>
                    <MDBInput
                      type="text"
                      placeholder="e.g. Alexander Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Email Address</label>
                      <MDBInput
                        type="email"
                        placeholder="alexander@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Phone Number</label>
                      <MDBInput
                        type="tel"
                        placeholder="+1 (555) 012-3456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Password</label>
                      <MDBInput
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Confirm Password</label>
                      <MDBInput
                        type="password"
                        placeholder="••••••••"
                        value={cPassword}
                        onChange={(e) => setCPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Account Role</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="roleType"
                          id="customerRole"
                          checked={type === 'customer'}
                          onChange={() => setType('customer')}
                        />
                        <label className="form-check-label small" htmlFor="customerRole">
                          Hotel Guest / Customer
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="roleType"
                          id="adminRole"
                          checked={type === 'admin'}
                          onChange={() => setType('admin')}
                        />
                        <label className="form-check-label small" htmlFor="adminRole">
                          Hotel Administrator
                        </label>
                      </div>
                    </div>
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
                        Registering...
                      </>
                    ) : (
                      <>
                        <MDBIcon fas icon="check-circle" className="me-2" /> Register Now
                      </>
                    )}
                  </MDBBtn>

                  <div className="text-center">
                    <span className="text-muted small">Already have an account? </span>
                    <Link to="/login" className="fw-bold text-primary small text-decoration-none">
                      Sign In
                    </Link>
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

export default SignUp;
