const { register, login, logout } = require('../controllers/Authcontroller');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cons = require('../codes');

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

jest.mock('../models/User', () => ({
  findOne: jest.fn(),
  save: jest.fn()
}));

describe('Authentication Controller', () => {
  describe('register', () => {

    it('should handle registration failure if user already exists', async () => {
      const req = {
        body: {
          username: 'existinguser',
          password: 'testpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mocking User.findOne to return existing user
      const existingUser = { username: 'existinguser' };
      User.findOne.mockResolvedValue(existingUser);

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'existinguser' });
      expect(res.status).toHaveBeenCalledWith(cons.badrequest);
      expect(res.json).toHaveBeenCalledWith({ message: cons.userexists });
    });

    it('should handle registration failure due to internal server error', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'testpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mocking User.findOne to throw an error
      User.findOne.mockRejectedValue(new Error('Database error'));

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(res.status).toHaveBeenCalledWith(cons.internalerror);
      expect(res.json).toHaveBeenCalledWith({ message: cons.internalerror });
    });
  });

  describe('login', () => {
    it('should login an existing user', async () => {
      const req = {
        body: {
          username: 'existinguser',
          password: 'testpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mocking User.findOne to return user object
      const existingUser = {
        _id: 'userId',
        username: 'existinguser',
        password: 'hashedPassword'
      };
      User.findOne.mockResolvedValue(existingUser);

      // Mocking bcrypt.compare to return true
      bcrypt.compare.mockResolvedValue(true);

      // Mocking jwt.sign to return token
      jwt.sign.mockReturnValue('jwtToken');

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'existinguser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 'userId' }, process.env.JWT_SECRET ?? 'defaultSecret', { expiresIn: '1h' });
      expect(res.status).toHaveBeenCalledWith(cons.ok);
      expect(res.json).toHaveBeenCalledWith({ userId: 'userId', token: 'jwtToken' });
    });

    it('should handle login failure if user does not exist', async () => {
      const req = {
        body: {
          username: 'nonexistentuser',
          password: 'testpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mocking User.findOne to return null
      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'nonexistentuser' });
      expect(res.status).toHaveBeenCalledWith(cons.unauthorized);
      expect(res.json).toHaveBeenCalledWith({ message: cons.invalidLogin });
    });

    it('should handle login failure if password is incorrect', async () => {
      const req = {
        body: {
          username: 'existinguser',
          password: 'incorrectpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mocking User.findOne to return user object
      const existingUser = {
        _id: 'userId',
        username: 'existinguser',
        password: 'hashedPassword'
      };
      User.findOne.mockResolvedValue(existingUser);

      // Mocking bcrypt.compare to return false
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'existinguser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('incorrectpassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(cons.unauthorized);
      expect(res.json).toHaveBeenCalledWith({ message: cons.invalidLogin });
    });

    it('should handle login failure due to internal server error', async () => {
      const req = {
        body: {
          username: 'existinguser',
          password: 'testpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mocking User.findOne to throw an error
      User.findOne.mockRejectedValue(new Error('Database error'));

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'existinguser' });
      expect(res.status).toHaveBeenCalledWith(cons.internalerror);
      expect(res.json).toHaveBeenCalledWith({ message: cons.internalerror });
    });
  });

  describe('logout', () => {
    it('should logout the user', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await logout(req, res);

      expect(res.status).toHaveBeenCalledWith(cons.ok);
      expect(res.json).toHaveBeenCalledWith({ message: cons.logout });
    });
  });
});
