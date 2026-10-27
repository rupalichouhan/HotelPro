import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <MDBFooter className="text-center text-lg-start text-white bg-dark pt-4 mt-auto">
      <MDBContainer className="p-4">
        <MDBRow>
          <MDBCol lg="4" md="6" className="mb-4 mb-md-0">
            <h5 className="text-uppercase fw-bold text-warning mb-3 d-flex align-items-center gap-2">
              <MDBIcon fas icon="hotel" /> HotelPro
            </h5>
            <p className="text-muted small">
              HotelPro provides seamless hospitality management, ultra-luxury accommodations, and effortless booking solutions for discerning global travelers.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#!" className="text-white me-2">
                <MDBIcon fab icon="facebook-f" />
              </a>
              <a href="#!" className="text-white me-2">
                <MDBIcon fab icon="twitter" />
              </a>
              <a href="#!" className="text-white me-2">
                <MDBIcon fab icon="instagram" />
              </a>
              <a href="#!" className="text-white">
                <MDBIcon fab icon="linkedin-in" />
              </a>
            </div>
          </MDBCol>

          <MDBCol lg="2" md="6" className="mb-4 mb-md-0">
            <h6 className="text-uppercase fw-bold mb-3 text-light">Quick Links</h6>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none hover-light">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/rooms" className="text-muted text-decoration-none hover-light">
                  Rooms & Suites
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/home" className="text-muted text-decoration-none hover-light">
                  Check Dates
                </Link>
              </li>
              <li>
                <Link to="/mybookings" className="text-muted text-decoration-none hover-light">
                  My Reservations
                </Link>
              </li>
            </ul>
          </MDBCol>

          <MDBCol lg="3" md="6" className="mb-4 mb-md-0">
            <h6 className="text-uppercase fw-bold mb-3 text-light">Room Categories</h6>
            <ul className="list-unstyled mb-0 small text-muted">
              <li className="mb-2">Executive Presidential Suite</li>
              <li className="mb-2">Super Deluxe Oceanview</li>
              <li className="mb-2">Premium Deluxe Suite</li>
              <li>Family Interconnected Suite</li>
            </ul>
          </MDBCol>

          <MDBCol lg="3" md="6" className="mb-4 mb-md-0">
            <h6 className="text-uppercase fw-bold mb-3 text-light">Contact & Concierge</h6>
            <p className="text-muted small mb-2">
              <MDBIcon fas icon="map-marker-alt" className="me-2 text-warning" />
              100 Oceanfront Boulevard, Suite 500
            </p>
            <p className="text-muted small mb-2">
              <MDBIcon fas icon="envelope" className="me-2 text-warning" />
              reservations@hotelpro.com
            </p>
            <p className="text-muted small mb-0">
              <MDBIcon fas icon="phone-alt" className="me-2 text-warning" />
              +1 (800) 555-HOTELPRO
            </p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <div className="text-center p-3 text-muted border-top border-secondary small" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        &copy; {new Date().getFullYear()} HotelPro Management System. All Rights Reserved.
      </div>
    </MDBFooter>
  );
};

export default Footer;
