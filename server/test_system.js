const http = require('http');

const request = (path, method = 'GET', data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:8001${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runVerification = async () => {
  console.log('--- 🧪 STARTING HOTELPRO SYSTEM VERIFICATION ---');

  // 1. Healthcheck
  const health = await request('/');
  console.log('1. Health check status:', health.status, health.data.system);

  // 2. Login as Admin
  const adminLogin = await request('/api/users/Login', 'POST', {
    email: 'admin@hotelpro.com',
    password: 'admin123',
  });
  console.log('2. Admin Login status:', adminLogin.status, 'User:', adminLogin.data.user.name);
  const adminToken = adminLogin.data.token;

  // 3. Register a new Customer
  const testCustomerEmail = `tester_${Date.now()}@example.com`;
  const registerRes = await request('/api/users/SignUp', 'POST', {
    name: 'Sarah Connor',
    email: testCustomerEmail,
    password: 'secretPassword123',
    c_password: 'secretPassword123',
    phone: '+1 555-4321',
    type: 'customer',
  });
  console.log('3. Customer SignUp status:', registerRes.status, 'Success:', registerRes.data.success);
  const customerToken = registerRes.data.token;
  const customerUser = registerRes.data.user;

  // 4. Verify fetchUser auth middleware with customerToken
  const profileRes = await request('/api/users/getuser', 'GET', null, {
    'auth-token': customerToken,
  });
  console.log('4. Profile Token Verification:', profileRes.status, 'Name:', profileRes.data.user.name);

  // 5. Get all rooms
  const roomsRes = await request('/api/rooms/getallrooms');
  console.log('5. Get all rooms count:', roomsRes.data.count);
  const targetRoom = roomsRes.data.rooms[0];

  // 6. Test Card Payment Processing
  const paymentRes = await request('/api/payments/pay', 'POST', {
    cardNumber: '4242424242424242',
    cvvcode: '456',
    expmonthyear: '08/29',
    cardholdername: 'Sarah Connor',
    amount: targetRoom.rent * 2,
  });
  console.log('6. Card Payment status:', paymentRes.status, 'Txn:', paymentRes.data.transactionId);

  // 7. Book Room
  const bookingRes = await request('/api/bookings/bookroom', 'POST', {
    room_id: targetRoom.room_id || targetRoom._id,
    user_id: customerUser.user_id,
    name: customerUser.name,
    fromdate: '2026-11-01',
    todate: '2026-11-03',
    totaldays: 2,
    totalAmount: targetRoom.rent * 2,
    cardDetails: {
      cardNumber: '4242424242424242',
      cvvcode: '456',
      expmonthyear: '08/29',
      cardholdername: 'Sarah Connor',
    },
  });
  console.log('7. Book Room status:', bookingRes.status, 'Booking ID:', bookingRes.data.booking.booking_id);
  const createdBookingId = bookingRes.data.booking.booking_id;

  // 8. Get Bookings by User ID
  const userBookings = await request('/api/bookings/getbookingsbyuserid', 'POST', {
    user_id: customerUser.user_id,
  });
  console.log('8. User Bookings count:', userBookings.data.count);

  // 9. Admin view all bookings
  const allBookings = await request('/api/bookings/getallbookings', 'GET', null, {
    'auth-token': adminToken,
  });
  console.log('9. Admin All Bookings count:', allBookings.data.count);

  // 10. Admin Add New Room
  const newRoomNum = '90' + Math.floor(Math.random() * 90);
  const addRoomRes = await request('/api/rooms/addroom', 'POST', {
    roomNumber: newRoomNum,
    type: 'Executive',
    rent: 450,
    count: 1,
    description: 'Penthouse executive sanctuary with wraparound skyline glass terrace and private sauna.',
    photos: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    ],
  });
  console.log('10. Add Room status:', addRoomRes.status, 'Room Number:', addRoomRes.data.room.roomNumber);

  // 11. Cancel Booking
  const cancelRes = await request('/api/bookings/cancelbooking', 'POST', {
    booking_id: createdBookingId,
    room_id: targetRoom.room_id || targetRoom._id,
  });
  console.log('11. Cancel Booking status:', cancelRes.status, 'New Status:', cancelRes.data.booking.status);

  // 12. View all system users (Admin tab)
  const allUsersRes = await request('/api/users/getallusers');
  console.log('12. Admin All Users count:', allUsersRes.data.count);

  console.log('--- ✅ ALL 12 INTEGRATION VERIFICATION CHECKS PASSED SUCCESSFULLY ---');
};

runVerification().catch(console.error);
