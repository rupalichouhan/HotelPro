import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBSpinner,
} from 'mdb-react-ui-kit';
import API from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const defaultCatalogRooms = [
  {
    room_id: 'RM_101',
    roomNumber: '101',
    type: 'Deluxe',
    rent: 220,
    count: 2,
    description:
      'Sophisticated deluxe room featuring a plush king-sized bed, city skyline panorama, Italian marble bathroom, high-speed WiFi, smart television, and 24-hour room service.',
    photos: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
    currentBookings: [],
  },
  {
    room_id: 'RM_201',
    roomNumber: '201',
    type: 'Super Deluxe',
    rent: 290,
    count: 2,
    description:
      'Spacious super deluxe room with private balcony overlooking the pool, deep soaking jacuzzi tub, complimentary gourmet breakfast buffet, and premium espresso machine.',
    photos: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    ],
    currentBookings: [],
  },
  {
    room_id: 'RM_301',
    roomNumber: '301',
    type: 'Suite',
    rent: 395,
    count: 1,
    description:
      'Luxury grand suite offering separate master living and dining quarters, panoramic oceanfront views, double vanity marble bath, and dedicated concierge butler service.',
    photos: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    ],
    currentBookings: [],
  },
  {
    room_id: 'RM_401',
    roomNumber: '401',
    type: 'Family Suite',
    rent: 340,
    count: 2,
    description:
      'Thoughtfully appointed family suite designed for comfort, featuring two interconnected bedrooms, convenient kitchenette, gaming console, and spacious lounge.',
    photos: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
    currentBookings: [],
  },
  {
    room_id: 'RM_102',
    roomNumber: '102',
    type: 'Standard',
    rent: 140,
    count: 3,
    description:
      'Warm and comfortable standard room equipped with a queen mattress, ergonomic work desk, high-speed fiber internet, rainfall shower, and tea/coffee making amenities.',
    photos: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    ],
    currentBookings: [],
  },
];

const UserHome = () => {
  const { user } = useAuth();

  const [allRooms, setAllRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [fromdate, setFromdate] = useState('');
  const [todate, setTodate] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Booking Modal State
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await API.get('/rooms/getallrooms');
      if (res.data.success && res.data.rooms && res.data.rooms.length > 0) {
        setAllRooms(res.data.rooms);
        setFilteredRooms(res.data.rooms);
      } else {
        setAllRooms(defaultCatalogRooms);
        setFilteredRooms(defaultCatalogRooms);
      }
    } catch (err) {
      console.warn('API error, displaying catalog fallback:', err);
      setAllRooms(defaultCatalogRooms);
      setFilteredRooms(defaultCatalogRooms);
    } finally {
      setLoading(false);
    }
  };

  // Helper date overlap checker
  const isRoomAvailableForDates = (room, startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return true;
    if (!room.currentBookings || room.currentBookings.length === 0) return true;

    const reqStart = new Date(startDateStr).getTime();
    const reqEnd = new Date(endDateStr).getTime();

    if (isNaN(reqStart) || isNaN(reqEnd) || reqStart >= reqEnd) return true;

    let overlaps = 0;
    const active = room.currentBookings.filter((b) => b.status !== 'cancelled');
    for (const b of active) {
      const bStart = new Date(b.fromdate).getTime();
      const bEnd = new Date(b.todate).getTime();
      if (reqStart < bEnd && reqEnd > bStart) {
        overlaps++;
      }
    }

    return overlaps < (room.count || 1);
  };

  // Apply filters whenever searchKey, selectedType, fromdate, or todate changes
  useEffect(() => {
    let result = [...allRooms];

    // Filter by Search Keyword
    if (searchKey.trim()) {
      const key = searchKey.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.roomNumber.toLowerCase().includes(key) ||
          r.type.toLowerCase().includes(key) ||
          r.description.toLowerCase().includes(key)
      );
    }

    // Filter by Room Type
    if (selectedType !== 'all') {
      result = result.filter(
        (r) => r.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Filter by Date Availability
    if (fromdate && todate) {
      result = result.filter((r) => isRoomAvailableForDates(r, fromdate, todate));
    }

    setFilteredRooms(result);
  }, [searchKey, selectedType, fromdate, todate, allRooms]);

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setBookingModalOpen(true);
  };

  const clearFilters = () => {
    setSearchKey('');
    setSelectedType('all');
    setFromdate('');
    setTodate('');
    setFilteredRooms(allRooms);
  };

  // Unique Room Types for dropdown
  const roomTypes = ['all', ...new Set(allRooms.map((r) => r.type))];

  return (
    <div className="user-home-page py-4">
      <MDBContainer>
        {/* Personalized Welcome Banner */}
        <div className="user-welcome-card p-4 rounded-4 mb-4 text-white shadow-sm d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-warning text-dark text-uppercase px-2 py-1">
                {user?.type === 'admin' ? 'Administrator' : 'Valued Guest'}
              </span>
              <span className="small text-white-50">Member ID: {user?.user_id || 'USR_001'}</span>
            </div>
            <h2 className="fw-bold mb-1">
              Welcome back, {user?.name || 'Guest'}!
            </h2>
            <p className="mb-0 text-white-50">
              Select your travel dates and discover tailor-made hotel experiences.
            </p>
          </div>
          <div className="mt-3 mt-md-0 d-flex gap-2">
            <MDBBtn
              color="light"
              className="rounded-pill shadow-sm text-primary fw-bold"
              onClick={fetchRooms}
            >
              <MDBIcon fas icon="sync-alt" className="me-2" /> Refresh Rooms
            </MDBBtn>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <MDBCard className="border-0 shadow-sm rounded-4 mb-4 filter-panel">
          <MDBCardBody className="p-4">
            <div className="row g-3 align-items-end">
              {/* Date Pickers */}
              <div className="col-md-3">
                <label className="form-label small fw-bold text-muted mb-1">
                  <MDBIcon fas icon="calendar-day" className="me-1 text-primary" /> Check-in Date
                </label>
                <MDBInput
                  type="date"
                  value={fromdate}
                  onChange={(e) => setFromdate(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-bold text-muted mb-1">
                  <MDBIcon fas icon="calendar-check" className="me-1 text-primary" /> Check-out Date
                </label>
                <MDBInput
                  type="date"
                  value={todate}
                  onChange={(e) => setTodate(e.target.value)}
                />
              </div>

              {/* Room Type Selector */}
              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted mb-1">
                  <MDBIcon fas icon="tag" className="me-1 text-primary" /> Room Type
                </label>
                <select
                  className="form-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Room Types</option>
                  {roomTypes
                    .filter((t) => t !== 'all')
                    .map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                </select>
              </div>

              {/* Keyword Search */}
              <div className="col-md-3">
                <label className="form-label small fw-bold text-muted mb-1">
                  <MDBIcon fas icon="search" className="me-1 text-primary" /> Search Rooms
                </label>
                <MDBInput
                  type="text"
                  placeholder="Room # or amenities..."
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                />
              </div>

              {/* Reset Filter Button */}
              <div className="col-md-1">
                <MDBBtn
                  color="light"
                  className="w-100 border p-2"
                  onClick={clearFilters}
                  title="Clear Filters"
                >
                  <MDBIcon fas icon="times" />
                </MDBBtn>
              </div>
            </div>

            {fromdate && todate && (
              <div className="mt-3 p-2 px-3 bg-light rounded-3 d-flex align-items-center gap-2 small text-muted border">
                <MDBIcon fas icon="info-circle" className="text-info" />
                <span>
                  Showing available inventory between <strong>{fromdate}</strong> and{' '}
                  <strong>{todate}</strong>.
                </span>
              </div>
            )}
          </MDBCardBody>
        </MDBCard>

        {/* Room Inventory Grid */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0 text-dark">
            Available Suites & Rooms ({filteredRooms.length})
          </h5>
          <span className="text-muted small">Instant online payment & confirmation</span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <MDBSpinner role="status" color="primary">
              <span className="visually-hidden">Loading hotel rooms...</span>
            </MDBSpinner>
            <p className="text-muted mt-2">Checking real-time room availability...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-5">
            <MDBIcon fas icon="bed" size="3x" className="text-muted mb-3" />
            <h5 className="fw-bold text-dark">No Rooms Found</h5>
            <p className="text-muted col-md-6 mx-auto mb-4">
              We couldn't find any rooms matching your current dates or filters. Try adjusting your dates or resetting search criteria.
            </p>
            <MDBBtn color="primary" onClick={clearFilters}>
              Reset All Filters
            </MDBBtn>
          </div>
        ) : (
          <MDBRow className="g-4">
            {filteredRooms.map((room) => (
              <MDBCol md="6" lg="4" key={room._id || room.room_id}>
                <RoomCard
                  room={room}
                  onBookNow={handleBookNow}
                  fromdate={fromdate}
                  todate={todate}
                />
              </MDBCol>
            ))}
          </MDBRow>
        )}
      </MDBContainer>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          open={bookingModalOpen}
          setOpen={setBookingModalOpen}
          room={selectedRoom}
          initialFromDate={fromdate}
          initialToDate={todate}
          onBookingSuccess={fetchRooms}
        />
      )}
    </div>
  );
};

export default UserHome;
