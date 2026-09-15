import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import PatientCaregiver from '../models/patientCaregiver.model.js';

// Generate JWT token
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

// Handle user registration
export async function register(req, res) {
  try {
    const parsedData = registerSchema.parse(req.body);
    
    const exists = await User.findOne({ 
      $or: [{ email: parsedData.email }, { username: parsedData.username }] 
    });
    
    if (exists) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    let caretaker = null;
    if (parsedData.role === 'Patient' && parsedData.caretakerUsername) {
      caretaker = await User.findOne({ username: parsedData.caretakerUsername, role: 'Caretaker' });
      if (!caretaker) {
        return res.status(400).json({ error: 'Caretaker username not found' });
      }
    }

    const user = await User.create(parsedData);
    const token = generateToken(user._id);

    // If patient and provided valid caretaker, map them
    if (caretaker) {
      await PatientCaregiver.create({
        caregiverId: caretaker._id,
        patientId: user._id
      });
    }

    res.status(201).json({
      user: { 
        id: user._id, 
        username: user.username, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token
    });
  } catch (error) {
    if (error.errors) return res.status(400).json({ errors: error.errors });
    res.status(500).json({ error: 'Server error' });
  }
}

// Handle user login
export async function login(req, res) {
  try {
    const parsedData = loginSchema.parse(req.body);

    const user = await User.findOne({ email: parsedData.email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(parsedData.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.status(200).json({
      user: { 
        id: user._id, 
        username: user.username, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token
    });
  } catch (error) {
    if (error.errors) return res.status(400).json({ errors: error.errors });
    res.status(500).json({ error: 'Server error' });
  }
}