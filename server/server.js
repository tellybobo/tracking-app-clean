const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail'); 
const fs = require('fs');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4040;

const SHIPMENTS_FILE = path.join(__dirname, 'shipments.json');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use('/AdminLogin', express.static(path.join(__dirname, '/AdminLogin')));
app.use('/track-shipment', express.static(path.join(__dirname, '../ClientSide')));
app.use(express.static(path.join(__dirname, '/AdminLogin')));

// SendGrid Email sending function
async function sendEmailSendGrid(to, subject, text, html) {
    console.log(`📧 [SendGrid] Preparing email to: ${to}`);
    
    if (!process.env.SENDGRID_API_KEY) {
        console.error('❌ SendGrid API key not configured in .env file');
        return false;
    }

    try {
        const msg = {
            to: to,
            from: {
                name: process.env.FROM_NAME || 'Global Logistics',
                email: process.env.SENDGRID_FROM_EMAIL || process.env.GMAIL_USER
            },
            subject: subject,
            text: text,
            html: html
        };

        console.log('📧 [SendGrid] Sending email...');
        await sgMail.send(msg);
        console.log(`✅ [SendGrid] Email sent successfully to ${to}`);
        return true;
        
    } catch (error) {
        console.error('❌ [SendGrid] Email failed:', error.response?.body || error.message);
        return false;
    }
}

// Simple session storage
const activeSessions = new Set();

// SIMPLIFIED LOGIN
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'malik123') {
        const sessionId = Date.now().toString();
        activeSessions.add(sessionId);
        
        res.json({ 
            success: true, 
            message: 'Login successful!',
            sessionId: sessionId 
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Load shipments from file
let shipments = [];
if (fs.existsSync(SHIPMENTS_FILE)) {
    try {
        const data = fs.readFileSync(SHIPMENTS_FILE, 'utf-8');
        shipments = JSON.parse(data || '[]');
        console.log(`📦 Loaded ${shipments.length} shipments from file.`);
    } catch (error) {
        console.log('❌ Error reading shipments file:', error);
    }
}

// API Routes
app.get('/api/shipments', (req, res) => {
    res.json(shipments);
});

app.get('/api/shipments/:trackingNumber', (req, res) => {
    const trackingNumber = req.params.trackingNumber;
    console.log('🔍 Searching for shipment:', trackingNumber);
    
    const shipment = shipments.find(s => s.trackingNumber === trackingNumber);
    if (!shipment) {
        return res.status(404).json({
            success: false,
            error: 'Shipment not found'
        });
    }
    res.json(shipment);
});

// Route for editing shipments
app.get('/api/shipments/:trackingNumber', (req, res) => {
    const trackingNumber = req.params.trackingNumber;
    console.log('🔍 Edit mode - Fetching shipment:', trackingNumber);
    
    const shipment = shipments.find(s => s.trackingNumber === trackingNumber);
    if (!shipment) {
        return res.status(404).json({
            success: false,
            error: 'Shipment not found'
        });
    }
    res.json(shipment);
});

// FIXED: Combined create/update shipment endpoint with SendGrid emails
app.post('/api/shipments', async (req, res) => {
    console.log('🚨 SHIPMENT CREATION STARTED ======================');
    
    try {
        console.log('📥 Received shipment data:', req.body);
        const formData = req.body;

        // Check if this is an update
        const isUpdate = formData.isUpdate;
        const originalTracking = formData.originalTrackingNumber;

        // Remove internal fields before saving
        delete formData.isUpdate;
        delete formData.originalTrackingNumber;

        if (isUpdate && originalTracking) {
            // UPDATE EXISTING SHIPMENT
            console.log('🔄 Updating shipment:', originalTracking);
            
            const shipmentIndex = shipments.findIndex(s => s.trackingNumber === originalTracking);
            if (shipmentIndex === -1) {
                return res.status(404).json({ success: false, error: 'Shipment not found for update' });
            }

            formData.id = shipments[shipmentIndex].id;
            formData.createdAt = shipments[shipmentIndex].createdAt;
            formData.updatedAt = new Date().toISOString();
            
            shipments[shipmentIndex] = formData;
            console.log('✅ Shipment updated in memory:', formData.trackingNumber);

            await fs.promises.writeFile(SHIPMENTS_FILE, JSON.stringify(shipments, null, 2), 'utf-8');
            console.log('💾 Updated shipments saved to file');

            res.json({ 
                success: true, 
                id: formData.id,
                message: 'Shipment updated successfully!',
                isUpdate: true
            });

        } else {
            // CREATE NEW SHIPMENT
            console.log('➕ Creating new shipment');
            
            // Validate required fields
            if (!formData.customerEmail || !formData.customerName || !formData.trackingNumber) {
                console.log('❌ Missing required fields');
                return res.status(400).json({ 
                    success: false, 
                    error: 'Missing required fields' 
                });
            }

            // Check for duplicate tracking number
            const existingShipment = shipments.find(s => s.trackingNumber === formData.trackingNumber);
            if (existingShipment) {
                console.log('❌ Duplicate tracking number:', formData.trackingNumber);
                return res.status(400).json({ 
                    success: false, 
                    error: 'Tracking number already exists' 
                });
            }

            // Add timestamp and ID
            formData.id = Date.now().toString();
            formData.createdAt = new Date().toISOString();
            shipments.push(formData);
            console.log('✅ New shipment created in memory:', formData.trackingNumber);

            // Save to file FIRST
            await fs.promises.writeFile(SHIPMENTS_FILE, JSON.stringify(shipments, null, 2), 'utf-8');
            console.log('💾 New shipment saved to file');

            // Send response FIRST
            res.json({ 
                success: true, 
                id: formData.id,
                message: 'Shipment created successfully!',
                trackingNumber: formData.trackingNumber,
                isUpdate: false
            });

            // 🔥 FIXED: Send emails using SendGrid AFTER response
            console.log('📧 Calling SendGrid email function NOW...');
            
            const subject = `📦 Shipment Created: ${formData.trackingNumber}`;
            const text = `Your shipment has been created.\nTracking ID: ${formData.trackingNumber}`;
            const html = `
                <h2>Shipment Created</h2>
                <p><strong>Tracking ID:</strong> ${formData.trackingNumber}</p>
                <p><strong>Customer:</strong> ${formData.customerName}</p>
                <p><strong>Status:</strong> ${formData.status || 'Pending'}</p>
            `;

            const emailPromises = [];

            // Send to receiver (customerEmail)
            if (formData.customerEmail) {
                emailPromises.push(sendEmailSendGrid(formData.customerEmail, subject, text, html));
            }

            // Send to sender (sender email)
            if (formData.sender && formData.sender.email) {
                emailPromises.push(sendEmailSendGrid(formData.sender.email, subject, text, html));
            }

            // Send to admin
            if (process.env.ADMIN_EMAIL) {
                emailPromises.push(sendEmailSendGrid(process.env.ADMIN_EMAIL, subject, text, html));
            }

            // Wait for all emails to complete
            Promise.all(emailPromises)
                .then(results => {
                    console.log('📧 All emails sent successfully:', results);
                })
                .catch(error => {
                    console.error('❌ Some emails failed:', error);
                });
        }

    } catch (error) {
        console.error('❌ Error in shipment endpoint:', error);
        res.status(500).json({ success: false, error: 'Failed to process shipment: ' + error.message });
    }
});

// Test SendGrid endpoint (replaces test-gmail)
app.get('/api/test-sendgrid', async (req, res) => {
    console.log('🧪 Testing SendGrid configuration...');
    
    try {
        if (!process.env.SENDGRID_API_KEY) {
            return res.json({
                success: false,
                error: 'SendGrid API key missing in .env file'
            });
        }

        console.log('✅ SendGrid API key found');
        
        const result = await sendEmailSendGrid(
            process.env.SENDGRID_FROM_EMAIL || process.env.GMAIL_USER,
            'Test Email from Global Logistics - SendGrid',
            'This is a test email sent via SendGrid.',
            '<p>This is a test email sent via SendGrid.</p>'
        );

        res.json({
            success: result,
            message: result ? 'Test email sent successfully!' : 'Test email failed'
        });
        
    } catch (error) {
        console.error('❌ SendGrid test failed:', error);
        res.json({
            success: false,
            error: error.message
        });
    }
});

// Debug environment variables
app.get('/api/debug-env', (req, res) => {
    const envInfo = {
        sendgridApiKey: process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing',
        sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'globallogisticssite@gmail.com',
        fromName: process.env.FROM_NAME || 'Global Logistics Shipping Agency',
        adminEmail: process.env.ADMIN_EMAIL || 'globallogisticssite@gmail.com',
        port: process.env.PORT || 4040
    };
    
    res.json(envInfo);
});

// Other routes remain the same...
app.get('/AdminLogin/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/AdminLogin/index.html'));
});

app.get('/AdminLogin/shipment.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/AdminLogin/shipment.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/AdminLogin/login.html'));
});

app.get('/admin/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/AdminLogin/dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 SendGrid configured: ${process.env.SENDGRID_API_KEY ? '✅' : '❌'}`);
});