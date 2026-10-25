import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedRooms();
  }, []);

  const fetchFeaturedRooms = async () => {
    try {
      setLoading(true);
      const res = await API.get('/rooms/getallrooms');
      if (res.data.success) {
        setRooms(res.data.rooms.slice(0, 3)); // Display top 3 featured
      }
    } catch (err) {
      console.error('Error fetching featured rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (room) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedRoom(room);
    setBookingModalOpen(true);
  };

  return (
    <div className="landing-page">
      <HeroCarousel />

      {/* Feature Highlights Banner */}
      <section className="py-5 bg-white border-bottom">
        <MDBContainer>
          <MDBRow className="text-center g-4">
            <MDBCol md="4">
              <div className="p-4 rounded-4 feature-box h-100 bg-light border">
                <div className="feature-icon mb-3 text-warning">
                  <MDBIcon fas icon="crown" size="2x" />
                </div>
                <h5 className="fw-bold mb-2">Five-Star Luxury</h5>
                <p className="text-muted small mb-0">
                  Immerse yourself in opulence with designer furnishings, master craftsmanship, and bespoke concierge services.
                </p>
              </div>
            </MDBCol>

            <MDBCol md="4">
              <div className="p-4 rounded-4 feature-box h-100 bg-light border">
                <div className="feature-icon mb-3 text-primary">
                  <MDBIcon fas icon="shield-alt" size="2x" />
                </div>
                <h5 className="fw-bold mb-2">Guaranteed Best Rates</h5>
                <p className="text-muted small mb-0">
                  Book directly through HotelPro with transparent pricing, zero hidden fees, and instant reservation confirmations.
                </p>
              </div>
            </MDBCol>

            <MDBCol md="4">
              <div className="p-4 rounded-4 feature-box h-100 bg-light border">
                <div className="feature-icon mb-3 text-success">
                  <MDBIcon fas icon="utensils" size="2x" />
                </div>
                <h5 className="fw-bold mb-2">Michelin Dining & Spa</h5>
                <p className="text-muted small mb-0">
                  Savor world-class culinary excellence and unwind in our thermal spa sanctuaries and heated oceanfront pools.
                </p>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      {/* Featured Suites Section */}
      <section className="py-5 bg-light">
        <MDBContainer>
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <span className="text-primary fw-bold text-uppercase small tracking-wide">
                Premier Accommodations
              </span>
              <h2 className="fw-bold display-6 mb-1 text-dark">Featured Rooms & Suites</h2>
              <p className="text-muted mb-0">Handpicked retreats crafted for ultimate indulgence</p>
            </div>
            <Link to="/home">
              <MDBBtn outline color="primary" className="rounded-pill px-4 mt-3 mt-md-0">
                View All Rooms <MDBIcon fas icon="arrow-right" className="ms-2" />
              </MDBBtn>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <MDBSpinner role="status" color="primary">
                <span className="visually-hidden">Loading suites...</span>
              </MDBSpinner>
              <p className="text-muted mt-2">Loading hotel inventory...</p>
            </div>
          ) : (
            <MDBRow className="g-4">
              {rooms.map((room) => (
                <MDBCol md="6" lg="4" key={room._id || room.room_id}>
                  <RoomCard room={room} onBookNow={handleBookNow} />
                </MDBCol>
              ))}
            </MDBRow>
          )}
        </MDBContainer>
      </section>

      {/* Quick Call to Action Strip */}
      <section className="py-5 bg-dark text-white text-center">
        <MDBContainer className="py-3">
          <h2 className="fw-bold mb-3">Ready for an Unforgettable Getaway?</h2>
          <p className="lead text-white-50 col-lg-8 mx-auto mb-4">
            Reserve your suite now to enjoy complimentary gourmet breakfast and airport limousine transfer.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/home">
              <MDBBtn color="warning" size="lg" className="px-5 rounded-pill fw-bold text-dark">
                Browse Availability
              </MDBBtn>
            </Link>
          </div>
        </MDBContainer>
      </section>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          open={bookingModalOpen}
          setOpen={setBookingModalOpen}
          room={selectedRoom}
        />
      )}
    </div>
  );
};

export default LandingPage;
