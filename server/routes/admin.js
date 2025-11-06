const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const path = require('path')
const router = express.Router();

// In a real app, you would store this in a database
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
// For a real app, you should hash the password and store it securely
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('malik123', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Admin login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if username matches
        if (username !== ADMIN_USERNAME) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Compare password with hashed version
        const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { username: username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({ 
            message: 'Login successful', 
            token: token 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected admin dashboard route (requires valid JWT token and admin role)

router.get('/dashboard.html', authenticateToken, requireAdmin, (req, res) => {
    res.json({ 
        message: 'Welcome to Achille global Logistics',
        user: req.user,
        stats: {
            totalUsers: 150,
            activeUsers: 120,
            pendingItems: 5
        }
    });
    res.sendFile(path.join(__dirname, '../AdminLogin/dashboard.html'));
});


// Get current user profile (requires valid JWT token)


router.get('/profile', authenticateToken, (req, res) => {
    res.json({ 
        message: 'User profile',
        user: req.user
    });
});


module.exports = router;