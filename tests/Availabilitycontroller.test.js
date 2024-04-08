const Availability = require('../models/availability');
const { setAvailability, getAvailableSlots } = require('../controllers/AvailabilityController');
const cons = require('../codes');

jest.mock('../models/availability', () => ({
  bulkWrite: jest.fn(),
  findOne: jest.fn()
}));

describe('Availability Controller', () => {
  describe('setAvailability', () => {
    it('should set availability successfully', async () => {
      const req = {
        body: {
          availability: [
            { day: 'Thursday', slots: ['9:00', '10:00', '11:00'] },
            { day: 'Wednesday', slots: ['10:00', '11:00', '12:00'] }
          ]
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mocking Availability.bulkWrite to succeed
      Availability.bulkWrite.mockResolvedValue();

      await setAvailability(req, res);

      expect(Availability.bulkWrite).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(cons.ok);
      expect(res.json).toHaveBeenCalledWith({ message: 'Availability set successfully' });
    });

    it('should handle errors during setting availability', async () => {
      const req = {
        body: {
          availability: [
            { day: 'Wednesday', slots: ['9:00', '10:00', '11:00'] }
          ]
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mocking Availability.bulkWrite to throw an error
      Availability.bulkWrite.mockRejectedValue(new Error('Database error'));

      await setAvailability(req, res);

      expect(Availability.bulkWrite).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(cons.internalerror);
      expect(res.json).toHaveBeenCalledWith({ message: cons.internalerror });
    });
  });

  describe('getAvailableSlots', () => {
    it('should get available slots for a given date', async () => {
      const req = {
        params: {
          date: '2024-04-10'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mocking Availability.findOne to return availability data
      const availability = {
        day: 'Thursday',
        slots: ['9:00', '10:00', '11:00']
      };
      Availability.findOne.mockResolvedValue(availability);

      await getAvailableSlots(req, res);

      expect(Availability.findOne).toHaveBeenCalledWith({ day: 'Monday' });
      expect(res.status).toHaveBeenCalledWith(cons.ok);
      expect(res.json).toHaveBeenCalledWith({ date: '2024-04-10', day: 'Monday', availableSlots: ['9:00', '10:00', '11:00'] });
    });

    it('should handle unavailable slots for a given date', async () => {
      const req = {
        params: {
          date: '2024-04-11'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mocking Availability.findOne to return null
      Availability.findOne.mockResolvedValue(null);

      await getAvailableSlots(req, res);

      expect(Availability.findOne).toHaveBeenCalledWith({ day: 'Wednesday' });
      expect(res.status).toHaveBeenCalledWith(cons.notfound);
      expect(res.json).toHaveBeenCalledWith({ message: 'Availability not found for Wednesday' });
    });

    it('should handle errors during getting available slots', async () => {
      const req = {
        params: {
          date: '2024-04-10'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mocking Availability.findOne to throw an error
      Availability.findOne.mockRejectedValue(new Error('Database error'));

      await getAvailableSlots(req, res);

      expect(Availability.findOne).toHaveBeenCalledWith({ day: 'Monday' });
      expect(res.status).toHaveBeenCalledWith(cons.internalerror);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});
