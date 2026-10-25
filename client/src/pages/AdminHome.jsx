import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBIcon,
  MDBSpinner,
  MDBBadge,
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminHome = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  // Data states
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Room form state
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('Deluxe');
  const [rent, setRent] = useState('');
  const [count, setCount] = useState(1);
  const [description, setDescription] = useState('');
  const [photoUrls, setPhotoUrls] = useState('');
  const [submittingRoom, setSubmittingRoom] = useState(false);

  // Search filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, roomsRes, usersRes] = await Promise.all([
        API.get('/bookings/getallbookings'),
        API.get('/rooms/getallrooms'),
        API.get('/users/getallusers'),
      ]);

      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
      if (roomsRes.data.success) setRooms(roomsRes.data.rooms);
      if (usersRes.data.success) setUsers(usersRes.data.users);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast.error('Failed to load some admin data from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabName) => {
    if (tabName === activeTab) return;
    setActiveTab(tabName);
  };

  // Handle Add Room Submit
  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (!roomNumber || !rent || !description) {
      toast.error('Please fill in room number, rent, and description.');
      return;
    }

    setSubmittingRoom(true);
    try {
      const photosArray = photoUrls
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter(Boolean);

      const payload = {
        roomNumber: String(roomNumber).trim(),
        type: roomType,
        rent: Number(rent),
        count: Number(count) || 1,
        description: description.trim(),
        photos: photosArray.length > 0 ? photosArray : undefined,
      };

      const res = await API.post('/rooms/addroom', payload);
      if (res.data.success) {
        toast.success(`Room #${res.data.room.roomNumber} created successfully!`);
        // Reset form
        setRoomNumber('');
        setRent('');
        setDescription('');
        setPhotoUrls('');
        setCount(1);
        // Refresh data and switch to rooms tab
        fetchAllData();
        setActiveTab('rooms');
      } else {
        toast.error(res.data.message || 'Failed to add room.');
      }
    } catch (err) {
      console.error('Add room error:', err);
      toast.error(err.response?.data?.message || 'Error occurred while creating room.');
    } finally {
      setSubmittingRoom(false);
    }
  };

  // Handle Delete Room
  const handleDeleteRoom = async (roomId, roomNum) => {
    if (!window.confirm(`Are you sure you want to delete Room #${roomNum} from inventory?`)) {
      return;
    }

    try {
      const res = await API.delete(`/rooms/deleteroom/${roomId}`);
      if (res.data.success) {
        toast.success(`Room #${roomNum} deleted.`);
        fetchAllData();
      } else {
        toast.error(res.data.message || 'Failed to delete room.');
      }
    } catch (err) {
      console.error('Delete room error:', err);
      toast.error(err.response?.data?.message || 'Error deleting room.');
    }
  };

  // Admin Cancel Booking
  const handleAdminCancelBooking = async (bookingId, roomId) => {
    if (!window.confirm(`Cancel reservation #${bookingId}?`)) return;

    try {
      const res = await API.post('/bookings/cancelbooking', {
        booking_id: bookingId,
        room_id: roomId,
      });

      if (res.data.success) {
        toast.success(`Reservation #${bookingId} has been cancelled.`);
        fetchAllData();
      } else {
        toast.error(res.data.message || 'Failed to cancel booking.');
      }
    } catch (err) {
      console.error('Admin cancel booking error:', err);
      toast.error(err.response?.data?.message || 'Error cancelling booking.');
    }
  };

  // Filtered lists
  const filteredBookings = bookings.filter(
    (b) =>
      b.booking_id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.room_id.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch))
  );

  return (
    <div className="admin-home-page py-5">
      <MDBContainer>
        {/* Admin Header */}
        <div className="admin-header-card p-4 rounded-4 mb-4 text-white shadow-sm d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger text-uppercase px-2 py-1">Hotel Management Control</span>
              <span className="small text-white-50">Administrator: {user?.name}</span>
            </div>
            <h2 className="fw-bold mb-1">HotelPro Operations Dashboard</h2>
            <p className="mb-0 text-white-50">Oversee reservations, room inventory, customer records, and properties</p>
          </div>
          <div className="mt-3 mt-md-0 d-flex gap-2">
            <MDBBtn color="light" className="rounded-pill shadow-sm" onClick={fetchAllData}>
              <MDBIcon fas icon="sync-alt" className="me-2" /> Refresh
            </MDBBtn>
          </div>
        </div>

        {/* Quick KPI Stats Bar */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="p-3 bg-white rounded-4 shadow-sm border d-flex align-items-center gap-3">
              <div className="kpi-icon bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
                <MDBIcon fas icon="receipt" size="lg" />
              </div>
              <div>
                <span className="text-muted small text-uppercase d-block">Reservations</span>
                <h4 className="fw-bold mb-0 text-dark">{bookings.length}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="p-3 bg-white rounded-4 shadow-sm border d-flex align-items-center gap-3">
              <div className="kpi-icon bg-warning bg-opacity-10 text-warning p-3 rounded-circle">
                <MDBIcon fas icon="bed" size="lg" />
              </div>
              <div>
                <span className="text-muted small text-uppercase d-block">Total Rooms</span>
                <h4 className="fw-bold mb-0 text-dark">{rooms.length}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="p-3 bg-white rounded-4 shadow-sm border d-flex align-items-center gap-3">
              <div className="kpi-icon bg-success bg-opacity-10 text-success p-3 rounded-circle">
                <MDBIcon fas icon="dollar-sign" size="lg" />
              </div>
              <div>
                <span className="text-muted small text-uppercase d-block">Revenue</span>
                <h4 className="fw-bold mb-0 text-dark">
                  $
                  {bookings
                    .filter((b) => b.status === 'booked')
                    .reduce((acc, b) => acc + (b.totalAmount || 0), 0)
                    .toLocaleString()}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="p-3 bg-white rounded-4 shadow-sm border d-flex align-items-center gap-3">
              <div className="kpi-icon bg-info bg-opacity-10 text-info p-3 rounded-circle">
                <MDBIcon fas icon="users" size="lg" />
              </div>
              <div>
                <span className="text-muted small text-uppercase d-block">System Users</span>
                <h4 className="fw-bold mb-0 text-dark">{users.length}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation using MDBTabs strictly */}
        <MDBCard className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
          <div className="bg-light border-bottom px-3 pt-3">
            <MDBTabs className="nav-tabs-admin">
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => handleTabClick('bookings')}
                  active={activeTab === 'bookings'}
                  className="fw-bold d-flex align-items-center gap-2 py-3 px-4"
                >
                  <MDBIcon fas icon="calendar-check" /> All Bookings ({bookings.length})
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => handleTabClick('rooms')}
                  active={activeTab === 'rooms'}
                  className="fw-bold d-flex align-items-center gap-2 py-3 px-4"
                >
                  <MDBIcon fas icon="hotel" /> All Rooms ({rooms.length})
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => handleTabClick('addroom')}
                  active={activeTab === 'addroom'}
                  className="fw-bold d-flex align-items-center gap-2 py-3 px-4"
                >
                  <MDBIcon fas icon="plus-circle" /> Add New Room
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => handleTabClick('users')}
                  active={activeTab === 'users'}
                  className="fw-bold d-flex align-items-center gap-2 py-3 px-4"
                >
                  <MDBIcon fas icon="users-cog" /> All Users ({users.length})
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>
          </div>

          <MDBCardBody className="p-4">
            <MDBTabsContent>
              {/* TAB 1: ALL BOOKINGS */}
              <MDBTabsPane open={activeTab === 'bookings'}>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">System Reservations Directory</h5>
                  <div className="col-md-4 mt-2 mt-md-0">
                    <MDBInput
                      type="text"
                      placeholder="Filter by Booking ID, Guest, or Room..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <MDBSpinner role="status" color="primary" />
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <MDBIcon fas icon="inbox" size="3x" className="mb-2" />
                    <p>No reservations found matching criteria.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <MDBTable hover align="middle" className="mb-0">
                      <MDBTableHead className="bg-light">
                        <tr>
                          <th>Booking ID</th>
                          <th>Room</th>
                          <th>Guest Name</th>
                          <th>Dates (From - To)</th>
                          <th>Days</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {filteredBookings.map((b) => (
                          <tr key={b._id || b.booking_id}>
                            <td>
                              <span className="fw-bold text-primary">#{b.booking_id}</span>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                Room {b.room_id}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <span className="fw-bold">{b.name}</span>
                                <span className="text-muted small" style={{ fontSize: '11px' }}>
                                  User ID: {b.user_id}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="small">
                                {b.fromdate} <MDBIcon fas icon="arrow-right" className="small mx-1 text-muted" /> {b.todate}
                              </span>
                            </td>
                            <td>{b.totaldays}</td>
                            <td>
                              <span className="fw-bold text-success">${b.totalAmount}</span>
                            </td>
                            <td>
                              {b.status === 'booked' ? (
                                <MDBBadge pill color="success">
                                  Confirmed
                                </MDBBadge>
                              ) : (
                                <MDBBadge pill color="danger">
                                  Cancelled
                                </MDBBadge>
                              )}
                            </td>
                            <td>
                              {b.status === 'booked' && (
                                <MDBBtn
                                  color="danger"
                                  size="sm"
                                  outline
                                  onClick={() => handleAdminCancelBooking(b.booking_id, b.room_id)}
                                  title="Cancel Booking"
                                >
                                  Cancel
                                </MDBBtn>
                              )}
                            </td>
                          </tr>
                        ))}
                      </MDBTableBody>
                    </MDBTable>
                  </div>
                )}
              </MDBTabsPane>

              {/* TAB 2: ALL ROOMS */}
              <MDBTabsPane open={activeTab === 'rooms'}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">Hotel Inventory & Active Suites</h5>
                  <MDBBtn
                    color="primary"
                    size="sm"
                    className="rounded-pill bg-gradient-gold border-0"
                    onClick={() => setActiveTab('addroom')}
                  >
                    <MDBIcon fas icon="plus" className="me-1" /> Add New Suite
                  </MDBBtn>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <MDBSpinner role="status" color="primary" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <MDBTable hover align="middle" className="mb-0">
                      <MDBTableHead className="bg-light">
                        <tr>
                          <th>Room</th>
                          <th>Category</th>
                          <th>Nightly Rent</th>
                          <th>Capacity</th>
                          <th>Active Bookings</th>
                          <th>Description Preview</th>
                          <th>Actions</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {rooms.map((r) => (
                          <tr key={r._id || r.room_id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={r.photos?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=100&q=80'}
                                  alt=""
                                  style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                  className="rounded-circle shadow-sm"
                                />
                                <div>
                                  <span className="fw-bold d-block">Room {r.roomNumber}</span>
                                  <span className="text-muted small" style={{ fontSize: '11px' }}>
                                    {r.room_id}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-dark bg-opacity-75">{r.type}</span>
                            </td>
                            <td>
                              <span className="fw-bold text-primary">${r.rent}</span> / night
                            </td>
                            <td>Max {r.count * 2} Guests</td>
                            <td>
                              <span className="badge bg-info text-white">
                                {(r.currentBookings || []).filter((b) => b.status !== 'cancelled').length} Active
                              </span>
                            </td>
                            <td style={{ maxWidth: '250px' }}>
                              <p className="text-muted small text-truncate mb-0">
                                {r.description}
                              </p>
                            </td>
                            <td>
                              <MDBBtn
                                color="danger"
                                size="sm"
                                outline
                                onClick={() => handleDeleteRoom(r._id || r.room_id, r.roomNumber)}
                                title="Delete Room"
                              >
                                <MDBIcon fas icon="trash" />
                              </MDBBtn>
                            </td>
                          </tr>
                        ))}
                      </MDBTableBody>
                    </MDBTable>
                  </div>
                )}
              </MDBTabsPane>

              {/* TAB 3: ADD ROOM */}
              <MDBTabsPane open={activeTab === 'addroom'}>
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <h5 className="fw-bold text-dark mb-1">Add New Room to Hotel Inventory</h5>
                    <p className="text-muted small mb-4">
                      Create and publish new luxury rooms, executive suites, or standard accommodations.
                    </p>

                    <form onSubmit={handleAddRoom}>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted">Room Number</label>
                          <MDBInput
                            type="text"
                            placeholder="e.g. 502"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted">Room Type</label>
                          <select
                            className="form-select"
                            value={roomType}
                            onChange={(e) => setRoomType(e.target.value)}
                          >
                            <option value="Deluxe">Deluxe Room</option>
                            <option value="Super Deluxe">Super Deluxe Suite</option>
                            <option value="Suite">Presidential Grand Suite</option>
                            <option value="Family Suite">Family Interconnected Suite</option>
                            <option value="Standard">Standard Comfort Room</option>
                            <option value="Executive">Executive Club Room</option>
                          </select>
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted">Rent Price ($ per night)</label>
                          <MDBInput
                            type="number"
                            min="1"
                            placeholder="e.g. 250"
                            value={rent}
                            onChange={(e) => setRent(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted">Capacity Units / Count</label>
                          <MDBInput
                            type="number"
                            min="1"
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">Room Description & Amenities</label>
                        <MDBTextArea
                          rows={3}
                          placeholder="Describe room furnishings, view, bedding, bathroom, and special amenities..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label small fw-bold text-muted">
                          Photo URLs (comma or newline separated)
                        </label>
                        <MDBTextArea
                          rows={2}
                          placeholder="https://images.unsplash.com/..., https://..."
                          value={photoUrls}
                          onChange={(e) => setPhotoUrls(e.target.value)}
                        />
                        <small className="text-muted">
                          If omitted, high-resolution default luxury photography will be assigned automatically.
                        </small>
                      </div>

                      <MDBBtn
                        type="submit"
                        color="primary"
                        className="py-3 px-4 rounded-3 fw-bold bg-gradient-gold border-0"
                        disabled={submittingRoom}
                      >
                        {submittingRoom ? (
                          <>
                            <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
                            Publishing Room...
                          </>
                        ) : (
                          <>
                            <MDBIcon fas icon="check-circle" className="me-2" /> Publish Room to Inventory
                          </>
                        )}
                      </MDBBtn>
                    </form>
                  </div>
                </div>
              </MDBTabsPane>

              {/* TAB 4: ALL USERS */}
              <MDBTabsPane open={activeTab === 'users'}>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">Registered System Accounts</h5>
                  <div className="col-md-4 mt-2 mt-md-0">
                    <MDBInput
                      type="text"
                      placeholder="Search users by name, email, or phone..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <MDBSpinner role="status" color="primary" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <MDBIcon fas icon="user-slash" size="3x" className="mb-2" />
                    <p>No user accounts found.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <MDBTable hover align="middle" className="mb-0">
                      <MDBTableHead className="bg-light">
                        <tr>
                          <th>User ID</th>
                          <th>Full Name</th>
                          <th>Email Address</th>
                          <th>Phone</th>
                          <th>Account Type</th>
                          <th>Registered Date</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {filteredUsers.map((u) => (
                          <tr key={u._id || u.user_id}>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {u.user_id || u._id}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className={`avatar-circle small-avatar ${
                                    u.type === 'admin' ? 'bg-danger' : 'bg-primary'
                                  } text-white`}
                                >
                                  {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="fw-bold">{u.name}</span>
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td>{u.phone || 'N/A'}</td>
                            <td>
                              {u.type === 'admin' ? (
                                <MDBBadge color="danger" pill className="text-uppercase">
                                  <MDBIcon fas icon="shield-alt" className="me-1" /> Admin
                                </MDBBadge>
                              ) : (
                                <MDBBadge color="primary" pill className="text-uppercase">
                                  <MDBIcon fas icon="user" className="me-1" /> Customer
                                </MDBBadge>
                              )}
                            </td>
                            <td>
                              <span className="text-muted small">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </MDBTableBody>
                    </MDBTable>
                  </div>
                )}
              </MDBTabsPane>
            </MDBTabsContent>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default AdminHome;
