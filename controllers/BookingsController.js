const Booking = require('../models/booking');
const jwt = require('jsonwebtoken');
const cons = require('../codes');

exports.scheduleBooking = async (req, res) => {
  try {
    const token = req.body.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const { date, slot } = req.body;
    const existingBooking = await Booking.findOne({ date, 'slot.start': slot.start, 'slot.end': slot.end }) ?? null;
    if (existingBooking) {
      return res.status(cons.badrequest).json({ message: cons.notavailable });
    }
    const newBooking = new Booking({ userId, date, slot });
    await newBooking.save();
    res.status(cons.created).json({ message: cons.successful, booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(cons.internalerror).json({ message: cons.internalerror });
  }
};

exports.listBookedSlots = async (req, res) => {
  try {
    const bookedSlots = await Booking.find() ?? [];
    res.status(cons.ok).json({ bookedSlots });
  } catch (error) {
    console.error(error);
    res.status(cons.internalerror).json({ message: cons.internalerror });
  }
};

const Booking = require('../models/booking');
const jwt = require('jsonwebtoken');
const { scheduleBooking } = require('../controllers/scheduleBookingController');
const cons = require('../codes');

jest.mock('../models/booking', () => ({
  findOne: jest.fn(),
  save: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('scheduleBooking Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should schedule a booking successfully', async () => {
    const req = {
      body: {
        token: 'mockToken',
        date: '2024-04-10',
        slot: { start: '09:00', end: '10:00' }
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const decodedToken = { userId: 'mockUserId' };
    jwt.verify.mockReturnValue(decodedToken);
    Booking.findOne.mockResolvedValue(null);
    Booking.save.mockResolvedValue();

    await scheduleBooking(req, res);

    expect(jwt.verify).toHaveBeenCalledWith('mockToken', process.env.JWT_SECRET);
    expect(Booking.findOne).toHaveBeenCalledWith({ date: '2024-04-10', 'slot.start': '09:00', 'slot.end': '10:00' });
    expect(Booking.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(cons.created);
    expect(res.json).toHaveBeenCalledWith({ message: cons.successful, booking: expect.any(Object) });
  });

  it('should handle existing booking', async () => {
    const req = {
      body: {
        token: 'mockToken',
        date: '2024-04-10',
        slot: { start: '09:00', end: '10:00' }
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const decodedToken = { userId: 'mockUserId' };
    jwt.verify.mockReturnValue(decodedToken);
    Booking.findOne.mockResolvedValue({});

    await scheduleBooking(req, res);

    expect(jwt.verify).toHaveBeenCalledWith('mockToken', process.env.JWT_SECRET);
    expect(Booking.findOne).toHaveBeenCalledWith({ date: '2024-04-10', 'slot.start': '09:00', 'slot.end': '10:00' });
    expect(res.status).toHaveBeenCalledWith(cons.badrequest);
    expect(res.json).toHaveBeenCalledWith({ message: cons.notavailable });
  });

  it('should handle internal server error', async () => {
    const req = {
      body: {
        token: 'mockToken',
        date: '2024-04-10',
        slot: { start: '09:00', end: '10:00' }
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jwt.verify.mockImplementation(() => {
      throw new Error('JWT verification failed');
    });

    await scheduleBooking(req, res);

    expect(jwt.verify).toHaveBeenCalledWith('mockToken', process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(cons.internalerror);
    expect(res.json).toHaveBeenCalledWith({ message: cons.internalerror });
  });
});

const { listBookedSlots } = require('../controllers/listBookedSlotsController');
const cons = require('../codes');

jest.mock('../models/booking', () => ({
  find: jest.fn()
}));

describe('listBookedSlots Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list booked slots successfully', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const bookedSlots = [{}, {}];
    Booking.find.mockResolvedValue(bookedSlots);

    await listBookedSlots(req, res);

    expect(Booking.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(cons.ok);
    expect(res.json).toHaveBeenCalledWith({ bookedSlots });
  });

  it('should handle internal server error', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Booking.find.mockRejectedValue(new Error('Database error'));

    await listBookedSlots(req, res);

    expect(Booking.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(cons.internalerror);
    expect(res.json).toHaveBeenCalledWith({ message: cons.internalerror });
  });
});
