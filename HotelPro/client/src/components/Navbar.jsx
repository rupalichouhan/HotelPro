import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBBtn,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdb-react-ui-kit';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [openNav, setOpenNav] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <MDBNavbar expand="lg" light className="bg-white shadow-sm sticky-top py-3 hotel-navbar">
      <MDBContainer>
        <MDBNavbarBrand href="/" className="d-flex align-items-center gap-2 brand-logo">
          <div className="brand-icon-box">
            <MDBIcon fas icon="hotel" className="text-white" />
          </div>
          <span className="brand-text">
            Hotel<span className="brand-highlight">Pro</span>
          </span>
        </MDBNavbarBrand>

        <MDBNavbarToggler
          type="button"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setOpenNav(!openNav)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar open={openNav}>
          <MDBNavbarNav className="ms-auto mb-2 mb-lg-0 align-items-center gap-lg-2">
            {!isAuthenticated ? (
              <>
                <MDBNavbarItem>
                  <MDBNavbarLink as={Link} to="/" active={isActive('/')} className="nav-custom-link">
                    Home
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink as={Link} to="/rooms" active={isActive('/rooms')} className="nav-custom-link">
                    Explore Rooms
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem className="ms-lg-3 d-flex gap-2">
                  <Link to="/login">
                    <MDBBtn outline color="dark" size="sm" className="px-3 rounded-pill">
                      Sign In
                    </MDBBtn>
                  </Link>
                  <Link to="/signup">
                    <MDBBtn color="primary" size="sm" className="px-3 rounded-pill bg-gradient-gold">
                      Register
                    </MDBBtn>
                  </Link>
                </MDBNavbarItem>
              </>
            ) : (
              <>
                {isAdmin ? (
                  <>
                    <MDBNavbarItem>
                      <MDBNavbarLink as={Link} to="/admin" active={isActive('/admin')} className="nav-custom-link">
                        <MDBIcon fas icon="tachometer-alt" className="me-1 text-primary" /> Admin Panel
                      </MDBNavbarLink>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                      <MDBNavbarLink as={Link} to="/home" active={isActive('/home')} className="nav-custom-link">
                        <MDBIcon fas icon="bed" className="me-1" /> Room Portal
                      </MDBNavbarLink>
                    </MDBNavbarItem>
                  </>
                ) : (
                  <>
                    <MDBNavbarItem>
                      <MDBNavbarLink as={Link} to="/home" active={isActive('/home')} className="nav-custom-link">
                        <MDBIcon fas icon="compass" className="me-1" /> Browse Rooms
                      </MDBNavbarLink>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                      <MDBNavbarLink as={Link} to="/mybookings" active={isActive('/mybookings')} className="nav-custom-link">
                        <MDBIcon fas icon="calendar-check" className="me-1 text-success" /> My Bookings
                      </MDBNavbarLink>
                    </MDBNavbarItem>
                  </>
                )}

                {/* User Profile Badge & Logout */}
                <MDBNavbarItem className="ms-lg-3">
                  <div className="d-flex align-items-center gap-2 user-badge-container p-1 pe-2 rounded-pill bg-light border">
                    <div className={`avatar-circle ${isAdmin ? 'bg-danger' : 'bg-primary'} text-white`}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="d-flex flex-column text-start">
                      <span className="user-nav-name fw-bold">{user?.name || 'User'}</span>
                      <span className="badge rounded-pill bg-secondary text-uppercase py-0" style={{ fontSize: '9px' }}>
                        {user?.type || 'Guest'}
                      </span>
                    </div>
                    <MDBBtn
                      color="link"
                      className="text-danger p-1 ms-1"
                      onClick={handleLogout}
                      title="Sign Out"
                    >
                      <MDBIcon fas icon="sign-out-alt" />
                    </MDBBtn>
                  </div>
                </MDBNavbarItem>
              </>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default Navbar;
