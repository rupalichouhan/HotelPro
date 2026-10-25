import React, { useState, useEffect } from 'react';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBInput,
  MDBIcon,
  MDBSpinner,
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ open, setOpen, room, initialFromDate, initialToDate, onBookingSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fromdate, setFromdate] = useState(initialFromDate || '');
  const [todate, setTodate] = useState(initialToDate || '');
  const [guestName, setGuestName] = useState('');
  const [totaldays, setTotaldays] = useState(1);
  const [totalAmount, setTotalAmount] = useState(room?.rent || 0);
  const [loading, setLoading] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardholderName, setCardholderName] = useState('');
  const [expMonthYear, setExpMonthYear] = useState('12/28');
  const [cvv, setCvv] = useState('123');

  useEffect(() => {
    if (user?.name) {
      setGuestName(user.name);
      setCardholderName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (initialFromDate) setFromdate(initialFromDate);
    if (initialToDate) setTodate(initialToDate);
  }, [initialFromDate, initialToDate]);

  // Recalculate days and total amount whenever dates change
  useEffect(() => {
    if (fromdate && todate && room) {
      const d1 = new Date(fromdate);
      const d2 = new Date(todate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setTotaldays(diffDays);
        setTotalAmount(diffDays * room.rent);
      } else {
        setTotaldays(0);
        setTotalAmount(0);
      }
    } else if (room) {
      setTotaldays(1);
      setTotalAmount(room.rent);
    }
  }, [fromdate, todate, room]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warn('Please log in first to complete your booking.');
      setOpen(false);
      navigate('/login');
      return;
    }

    if (!fromdate || !todate) {
      toast.error('Please select both Check-in and Check-out dates.');
      return;
    }

    if (totaldays <= 0) {
      toast.error('Check-out date must be after Check-in date.');
      return;
    }

    if (!guestName.trim()) {
      toast.error('Please enter the primary guest name.');
      return;
    }

    if (!cardNumber || !cvv || !expMonthYear || !cardholderName) {
      toast.error('Please fill in complete payment card details.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Simulate Payment Authorization
      await API.post('/payments/pay', {
        cardNumber,
        cvvcode: cvv,
        expmonthyear: expMonthYear,
        cardholdername: cardholderName,
        amount: totalAmount,
      });

      // Step 2: Book Room with CardDetails
      const bookingPayload = {
        room_id: room.room_id || room._id,
        user_id: user.user_id || user.id || user._id,
        name: guestName.trim(),
        fromdate,
        todate,
        totaldays,
        totalAmount,
        cardDetails: {
          cardNumber,
          cvvcode: cvv,
          expmonthyear: expMonthYear,
          cardholdername: cardholderName,
        },
      };

      const res = await API.post('/bookings/bookroom', bookingPayload);

      if (res.data.success) {
        toast.success(`🎉 Booking confirmed! Reservation ID: ${res.data.booking.booking_id}`);
        setOpen(false);
        if (onBookingSuccess) {
          onBookingSuccess();
        }
        navigate('/mybookings');
      } else {
        toast.error(res.data.message || 'Booking could not be completed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      const msg = err.response?.data?.message || 'Booking failed. Room might already be reserved.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <MDBModal open={open} setOpen={setOpen} tabIndex="-1">
      <MDBModalDialog size="lg" centered>
        <MDBModalContent className="rounded-4 border-0 shadow-2xl overflow-hidden">
          <MDBModalHeader className="bg-primary text-white py-3 border-0">
            <MDBModalTitle className="d-flex align-items-center gap-2">
              <MDBIcon fas icon="calendar-check" />
              Confirm Reservation - Room {room.roomNumber} ({room.type})
            </MDBModalTitle>
            <MDBBtn
              className="btn-close btn-close-white"
              color="none"
              onClick={() => setOpen(false)}
            ></MDBBtn>
          </MDBModalHeader>

          <form onSubmit={handleBookingSubmit}>
            <MDBModalBody className="p-4">
              {/* Room Summary Header */}
              <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-4 border">
                <img
                  src={room.photos?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80'}
                  alt={room.type}
                  className="rounded-3 object-cover shadow-sm"
                  style={{ width: '90px', height: '70px' }}
                />
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-1">Room {room.roomNumber} - {room.type}</h6>
                  <span className="text-muted small d-block mb-1">
                    Rate: <strong>${room.rent}</strong> / night &bull; Max: {room.count * 2} Guests
                  </span>
                  <span className="badge bg-success-subtle text-success border border-success-subtle">
                    Instant Confirmation Guaranteed
                  </span>
                </div>
                <div className="text-end">
                  <span className="text-muted small d-block">Estimated Total</span>
                  <span className="fs-4 fw-bold text-primary">${totalAmount}</span>
                </div>
              </div>

              {/* Booking Details Section */}
              <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <MDBIcon fas icon="user-clock" className="text-primary" /> Stay & Guest Details
              </h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Primary Guest Name</label>
                  <MDBInput
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="Full Guest Name"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted">Check-In Date</label>
                  <MDBInput
                    type="date"
                    value={fromdate}
                    onChange={(e) => setFromdate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted">Check-Out Date</label>
                  <MDBInput
                    type="date"
                    value={todate}
                    onChange={(e) => setTodate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Price Calculation Banner */}
              <div className="p-3 bg-primary bg-opacity-10 rounded-3 mb-4 d-flex justify-content-between align-items-center border border-primary border-opacity-25">
                <div>
                  <span className="fw-bold text-primary d-block">
                    Total Duration: {totaldays} {totaldays === 1 ? 'Night' : 'Nights'}
                  </span>
                  <small className="text-muted">
                    (${room.rent} &times; {totaldays} nights) + Taxes & Hotel Fees included
                  </small>
                </div>
                <div className="text-end">
                  <span className="fs-3 fw-bold text-primary">${totalAmount}</span>
                </div>
              </div>

              {/* Payment Card Section */}
              <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <MDBIcon fas icon="credit-card" className="text-success" /> Secure Online Payment
              </h6>
              <div className="p-3 border rounded-3 bg-light">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Cardholder Full Name</label>
                    <MDBInput
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      required
                      placeholder="Name on card"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Card Number</label>
                    <MDBInput
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Expiration Date (MM/YY)</label>
                    <MDBInput
                      value={expMonthYear}
                      onChange={(e) => setExpMonthYear(e.target.value)}
                      required
                      placeholder="12/28"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">CVV / CVC</label>
                    <MDBInput
                      type="password"
                      maxLength="4"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                      placeholder="•••"
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 mt-3 text-muted small">
                  <MDBIcon fas icon="lock" className="text-success" />
                  <span>256-bit SSL encrypted & tokenized payment security</span>
                </div>
              </div>
            </MDBModalBody>

            <MDBModalFooter className="border-0 bg-light py-3">
              <MDBBtn color="secondary" type="button" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </MDBBtn>
              <MDBBtn
                color="primary"
                type="submit"
                className="bg-gradient-gold border-0 fw-bold px-4"
                disabled={loading || totaldays <= 0}
              >
                {loading ? (
                  <>
                    <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <MDBIcon fas icon="check-circle" className="me-2" />
                    Authorize & Pay ${totalAmount}
                  </>
                )}
              </MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default BookingModal;
