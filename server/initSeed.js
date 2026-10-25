const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const Room = require('./models/roomModel');

const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return; // Already initialized
    }

    console.log('[AutoSeed] Database is fresh. Seeding default Admin, Customer, and Rooms...');

    const adminSalt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', adminSalt);

    const custSalt = await bcrypt.genSalt(10);
    const custPassword = await bcrypt.hash('customer123', custSalt);

    // Create Admin User
    const adminUser = new User({
      user_id: 'USR_ADM001',
      name: 'System Administrator',
      email: 'admin@hotelpro.com',
      password: adminPassword,
      phone: '+1 (555) 019-2831',
      type: 'admin',
    });
    await adminUser.save();

    // Create Customer User
    const customerUser = new User({
      user_id: 'USR_CST001',
      name: 'John Doe',
      email: 'customer@hotelpro.com',
      password: custPassword,
      phone: '+1 (555) 012-3456',
      type: 'customer',
    });
    await customerUser.save();

    // Initial Rooms
    const initialRooms = [
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

    await Room.insertMany(initialRooms);
    console.log('[AutoSeed] Fresh seed successful with demo users and luxury rooms.');
  } catch (err) {
    console.error('[AutoSeed] Error auto-seeding:', err.message);
  }
};

module.exports = autoSeedIfEmpty;
