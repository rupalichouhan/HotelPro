const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Room = require('../models/roomModel');

// Set up storage for uploaded room photos
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'room-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed'));
  },
});

// @route   GET /api/rooms/getallrooms
// @desc    Retrieve all rooms in the system
router.get('/getallrooms', async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve rooms',
      error: error.message,
    });
  }
});

// @route   GET /api/rooms/getroombyid/:id
// @desc    Get single room details by _id or room_id
router.get('/getroombyid/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let room = null;

    if (id.startsWith('RM_')) {
      room = await Room.findOne({ room_id: id });
    } else {
      try {
        room = await Room.findById(id);
      } catch (e) {
        room = await Room.findOne({ room_id: id });
      }
    }

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    return res.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error('Error getting room by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get room details',
      error: error.message,
    });
  }
});

// @route   POST /api/rooms/addroom
// @desc    Add a new room (supports both JSON body with image URLs and multipart file uploads)
router.post('/addroom', upload.array('images', 5), async (req, res) => {
  try {
    const { roomNumber, description, type, rent, count, photos: photosBody, room_id } = req.body;

    if (!roomNumber || !description || !type || !rent) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomNumber, description, type, and rent',
      });
    }

    // Check duplicate room number
    const existing = await Room.findOne({ roomNumber: String(roomNumber).trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Room number ${roomNumber} already exists in the system`,
      });
    }

    // Gather photos from uploads and/or body
    let photosList = [];

    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map((f) => `http://localhost:8001/uploads/${f.filename}`);
      photosList.push(...uploadedUrls);
    }

    if (photosBody) {
      if (Array.isArray(photosBody)) {
        photosList.push(...photosBody);
      } else if (typeof photosBody === 'string') {
        try {
          const parsed = JSON.parse(photosBody);
          if (Array.isArray(parsed)) photosList.push(...parsed);
          else photosList.push(photosBody);
        } catch (e) {
          // Comma or newline separated or single URL
          const split = photosBody.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
          photosList.push(...split);
        }
      }
    }

    // Fallback default high quality hotel room image if none provided
    if (photosList.length === 0) {
      photosList.push(
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
      );
    }

    const newRoom = new Room({
      room_id: room_id || 'RM_' + (roomNumber ? roomNumber : Math.floor(1000 + Math.random() * 9000)),
      roomNumber: String(roomNumber).trim(),
      description: description.trim(),
      photos: photosList,
      type: type.trim(),
      rent: Number(rent),
      count: count ? Number(count) : 1,
      currentBookings: [],
    });

    const savedRoom = await newRoom.save();

    return res.status(201).json({
      success: true,
      message: 'Room added successfully',
      room: savedRoom,
    });
  } catch (error) {
    console.error('Error adding room:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add room',
      error: error.message,
    });
  }
});

// @route   DELETE /api/rooms/deleteroom/:id
// @desc    Delete a room from inventory
router.delete('/deleteroom/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (id.startsWith('RM_')) {
      deleted = await Room.findOneAndDelete({ room_id: id });
    } else {
      try {
        deleted = await Room.findByIdAndDelete(id);
      } catch (e) {
        deleted = await Room.findOneAndDelete({ room_id: id });
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Room not found for deletion',
      });
    }

    return res.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete room',
      error: error.message,
    });
  }
});

module.exports = router;
