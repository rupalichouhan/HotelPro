import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBIcon,
  MDBSpinner,
  MDBBadge,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [targetBooking, setTargetBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchMyBookings();
  }, [user]);

  const fetchMyBookings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const uid = user.user_id || user.id || user._id;
      const res = await API.post('/bookings/getbookingsbyuserid', { user_id: uid });
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching user bookings:', err);
      toast.error('Failed to load your reservations.');
    } finally {
      setLoading(false);
    }
  };

  const confirmCancel = (booking) => {
    setTargetBooking(booking);
    setCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!targetBooking) return;
    try {
      setCancelling(true);
      const res = await API.post('/bookings/cancelbooking', {
        booking_id: targetBooking.booking_id,
        room_id: targetBooking.room_id,
      });

      if (res.data.success) {
        toast.success(`Booking #${targetBooking.booking_id} has been cancelled.`);
        setCancelModal(false);
        setTargetBooking(null);
        fetchMyBookings();
      } else {
        toast.error(res.data.message || 'Failed to cancel reservation');
      }
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      toast.error(err.response?.data?.message || 'Error occurred while cancelling.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="my-bookings-page py-5">
      <MDBContainer>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <span className="text-primary fw-bold text-uppercase small tracking-wide">
              Customer Account Portal
            </span>
            <h2 className="fw-bold mb-1 text-dark">My Hotel Reservations</h2>
            <p className="text-muted mb-0">View all past and upcoming hotel stays, invoices, and statuses</p>
          </div>
          <div className="mt-3 mt-md-0 d-flex gap-2">
            <Link to="/home">
              <MDBBtn color="primary" className="rounded-pill bg-gradient-gold border-0">
                <MDBIcon fas icon="plus-circle" className="me-2" /> Book Another Room
              </MDBBtn>
            </Link>
            <MDBBtn color="light" className="rounded-pill border" onClick={fetchMyBookings}>
              <MDBIcon fas icon="sync-alt" />
            </MDBBtn>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <MDBSpinner role="status" color="primary">
              <span className="visually-hidden">Loading reservations...</span>
            </MDBSpinner>
            <p className="text-muted mt-2">Retrieving your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <MDBCard className="border-0 shadow-sm rounded-4 text-center p-5">
            <MDBCardBody>
              <div className="mb-3 text-muted">
                <MDBIcon fas icon="calendar-times" size="4x" />
              </div>
              <h4 className="fw-bold text-dark">No Reservations Found</h4>
              <p className="text-muted col-md-6 mx-auto mb-4">
                You haven't made any hotel reservations yet. Browse our luxury suites and reserve your next dream getaway today!
              </p>
              <Link to="/home">
                <MDBBtn color="primary" size="lg" className="rounded-pill bg-gradient-gold border-0 px-4">
                  Browse Available Rooms
                </MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        ) : (
          <div className="row g-4">
            {bookings.map((b) => (
              <div className="col-12" key={b._id || b.booking_id}>
                <MDBCard className="border-0 shadow-sm rounded-4 overflow-hidden booking-record-card">
                  <div
                    className={`p-3 d-flex flex-wrap justify-content-between align-items-center text-white ${
                      b.status === 'booked' ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <MDBIcon fas icon="receipt" />
                      <span className="fw-bold">Reservation ID: #{b.booking_id}</span>
                    </div>
                    <div>
                      {b.status === 'booked' ? (
                        <MDBBadge pill color="success" className="px-3 py-2 text-uppercase">
                          <MDBIcon fas icon="check-circle" className="me-1" /> Confirmed
                        </MDBBadge>
                      ) : (
                        <MDBBadge pill color="danger" className="px-3 py-2 text-uppercase">
                          <MDBIcon fas icon="times-circle" className="me-1" /> Cancelled
                        </MDBBadge>
                      )}
                    </div>
                  </div>

                  <MDBCardBody className="p-4">
                    <div className="row g-4 align-items-center">
                      <div className="col-md-3">
                        <span className="text-muted small text-uppercase d-block">Room / Unit Reference</span>
                        <h5 className="fw-bold text-dark mb-1">Room {b.room_id}</h5>
                        <span className="text-muted small">Guest Name: <strong>{b.name}</strong></span>
                      </div>

                      <div className="col-md-3">
                        <span className="text-muted small text-uppercase d-block">Stay Period</span>
                        <div className="d-flex align-items-center gap-2 text-dark fw-bold">
                          <span>{b.fromdate}</span>
                          <MDBIcon fas icon="arrow-right" className="small text-muted" />
                          <span>{b.todate}</span>
                        </div>
                        <span className="text-muted small">Duration: {b.totaldays} Nights</span>
                      </div>

                      <div className="col-md-3">
                        <span className="text-muted small text-uppercase d-block">Total Paid</span>
                        <h4 className="fw-bold text-primary mb-0">${b.totalAmount}</h4>
                        <span className="text-muted small">All taxes & fees included</span>
                      </div>

                      <div className="col-md-3 text-md-end">
                        {b.status === 'booked' ? (
                          <MDBBtn
                            color="danger"
                            outline
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={() => confirmCancel(b)}
                          >
                            <MDBIcon fas icon="ban" className="me-1" /> Cancel Booking
                          </MDBBtn>
                        ) : (
                          <span className="badge bg-light text-danger border p-2">
                            Reservation Voided
                          </span>
                        )}
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </div>
            ))}
          </div>
        )}
      </MDBContainer>

      {/* Cancellation Confirmation Dialog */}
      <MDBModal open={cancelModal} setOpen={setCancelModal} tabIndex="-1">
        <MDBModalDialog centered>
          <MDBModalContent className="rounded-4 border-0 shadow-lg">
            <MDBModalHeader className="bg-danger text-white border-0 py-3">
              <MDBModalTitle className="d-flex align-items-center gap-2">
                <MDBIcon fas icon="exclamation-triangle" /> Cancel Hotel Reservation
              </MDBModalTitle>
              <MDBBtn
                className="btn-close btn-close-white"
                color="none"
                onClick={() => setCancelModal(false)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className="p-4 text-center">
              <MDBIcon fas icon="calendar-times" size="3x" className="text-danger mb-3" />
              <h5 className="fw-bold mb-2">Are you sure you want to cancel?</h5>
              <p className="text-muted mb-0">
                You are about to cancel reservation <strong>#{targetBooking?.booking_id}</strong> for Room{' '}
                <strong>{targetBooking?.room_id}</strong>. The room will be made available to other guests immediately.
              </p>
            </MDBModalBody>
            <MDBModalFooter className="bg-light border-0 py-3">
              <MDBBtn color="secondary" onClick={() => setCancelModal(false)} disabled={cancelling}>
                Keep Reservation
              </MDBBtn>
              <MDBBtn color="danger" onClick={handleCancelBooking} disabled={cancelling}>
                {cancelling ? (
                  <>
                    <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel Reservation'
                )}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default MyBookings;
