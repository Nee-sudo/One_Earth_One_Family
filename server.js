require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const session = require('express-session');
const nodemailer = require('nodemailer');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');


// Constants
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/one_earth_one_family';
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

// Models
const User = require('./models/User');
// const Member = require('./models/Profiles');

// App Setup
const app = express();
//set engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('OEOF'));
app.use(express.static('public'));
app.use(express.static('public copy'));
app.use('/uploads', express.static('static/uploads'));
// Static Files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Storage Setup (Uploads to "public/images/")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/"); // Save files in 'public/images/'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});
 
const upload = multer({ storage });

// API to Upload Image
app.post("/upload", authenticateJWT, upload.single("file"), async (req, res) => {
    console.log('Request received:', req.file);
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        const sanitizedFilename = req.file.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
        const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
        req.imageUrl = `${baseUrl}/img/${sanitizedFilename}`;
        console.log('Image uploaded successfully:', req.imageUrl);

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 'profile.photoUrl': req.imageUrl },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ imageUrl: req.imageUrl }); // Move this line to the end of the success case
    } catch (error) {
        console.error('Error updating photoUrl:', error.message);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});

// Session Setup
app.use(
    session({
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Change to true in production with HTTPS
    })
);

// Connect to MongoDB
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Database connection error:', err));

// Middleware for JWT Authentication
function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized: Token missing' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

app.get('/signup', (req, res) => {
    res.render('signup');
})
// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// app.get('/dashboards', (req, res) => {
//     res.sendFile(__dirname + '/public copy/dashboards.html');
// });
app.get('/dashboards', (req, res) => {
    res.render('dashboards');
})
// app.get('/dashboard', (req, res) => {

//     res.render('dashbaords');
// });
app.get('/editProfile', (req, res) => {
    res.render('index_form');
});
app.get('/profile', (req, res) => {
    res.render('userProfile');
});
app.post('/api/signup', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const user = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            verified: false,
            verificationToken,
            verificationTokenExpires,
        });

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const publicUrl = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
        const verificationUrl = `${publicUrl}/api/verify/${verificationToken}`;
        // const verificationUrl = `http://localhost:${PORT}/api/verify/${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Click <a href="${verificationUrl}">here</a> to verify your account.</p>`,
        });

        res.status(201).json({ message: 'User registered. Verification email sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/api/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token, verificationTokenExpires: { $gt: new Date() } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        user.verified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        // Generate JWT
        const jwtToken = jwt.sign({ id: user._id, username: user.first_name, email: user.email, profile: user.profile }, SECRET_KEY, { expiresIn: '1h' });
        res.redirect(`/dashboards?token=${jwtToken}`);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
// giving permission to display
app.get('/api/user', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json(decoded);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
app.get('/api/user', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Get full user data without password
        console.log("rewuest came on /api/user")

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            country: user.profile?.country || 'Not provided',
            interests: user.profile?.interests || 'Not provided',
            hobbies: user.profile?.hobbies || 'Not provided',
            familyRole: user.profile?.familyRole || 'Not provided',
            badges: user.profile?.badges || 'Not provided',
            photoUrl: user.profile?.photoUrl || 'Not provided'
        });
        console.log("loaded  user data", user);
    } catch (error) {
        console.error('Error in /api/user:', error);
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
});

// GET: Fetch all profiles (optional)
app.get('/profileList', (req, res) => {
    res.render('profileList');
});
app.get('/userProfile', (req, res) => {
    res.render('userProfile');                                                  
});
app.get('/api/profiles/:id', async (req, res) => {
    console.log('Request received:', req.params.id);
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
});

app.get('/api/profiles', async (req, res) => {
    try {
        // Fetch all users, excluding their passwords
        const users = await User.find().select('-password');

        // Check if no users are found
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Map the user data to a simplified structure
        const userList = users.map(user => ({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            // email: user.email,
            country: user.profile?.country || 'Not provided',
            interests: user.profile?.interests || 'Not provided',
            hobbies: user.profile?.hobbies || 'Not provided',
            familyRole: user.profile?.familyRole || 'Not provided',
        }));

        // Send the response
        res.json(userList);
        console.log('User list loaded successfully for homepage:', userList);
    } catch (error) {
        console.error('Error in /api/profiles:', error);
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
});

// Protect the user data route
// Serve static files

app.post('/submit-profile', authenticateJWT, upload.single('Photo'), async (req, res) => {
    try {
        const { bio, country, interests, hobbies, familyRole, badges } = req.body;
        console.log('Type of hobbies:', typeof hobbies, hobbies);
        console.log('Type of interests:', typeof interests, interests);
        const parsedHobbies = typeof hobbies === 'string' ? JSON.parse(hobbies) : hobbies;
        const parsedInterests = typeof interests === 'string' ? JSON.parse(interests) : interests;

        let photoUrl = req.body.existingPhotoUrl; // Retain existing URL if no new upload
        if (req.file) { // If a new file was uploaded
            const sanitizedFilename = req.file.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
            const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
            photoUrl = `${baseUrl}/img/${sanitizedFilename}`;
            console.log("photo url", photoUrl);
        }

        if (!bio || !country || !familyRole) {
            return res.status(400).json({ message: 'Missing required fields: bio, country, or familyRole.' });
        }
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized access. User ID is missing.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
            'profile.bio': bio,
            'profile.country': country,
            'profile.interests': Array.isArray(parsedInterests) ? parsedInterests : [],
            'profile.hobbies': Array.isArray(parsedHobbies) ? parsedHobbies : [],
            'profile.familyRole': familyRole,
            'profile.badges': Array.isArray(badges) ? badges : [],
            // 'profile.photoUrl': global.imageUrl, // Store the global image URL here
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const token = jwt.sign(
            {
                userId: updatedUser._id,
                username: updatedUser.first_name,
                email: updatedUser.email,
                profile: updatedUser.profile,
            },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Profile updated successfully!',
            profile: updatedUser.profile,
            token,
        });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});
app.get('/login', (req, res) => {

    res.render('login');
});
// Login again Endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Check if the user is verified
        if (!user.verified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, username: user.first_name, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({ token, message: 'Login successful!' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});

app.post('/api/loginn', async (req, res) => {
    const { email } = req.body;
    console.log('request came', email);

    try {
        // Find user by email
        const user = await User.findOne({ email });
        console.log("user details", user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Check if the user is verified
        if (!user.verified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });

        }

        const profileData = {

            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            bio: user.profile?.bio || 'Not provided',
            country: user.profile?.country || 'Not provided',
            interests: user.profile?.interests || 'Not provided',
            hobbies: user.profile?.hobbies || 'Not provided',
            familyRole: user.profile?.familyRole || 'Not provided',
            badges: user.profile?.badges || 'Not provided',
            photoUrl: user.profile?.photoUrl || 'Not provided'
        };

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, username: 'eeraj', email: user.email, hobbies: user.profile.hobbies },
            SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );
        console.log("toke details", token);
        // res.json( { userId: user._id, username: 'eeraj', email: user.email ,hobbies:user.profile.hobbies });
        const hobbies = user.profile.hobbies;
        console.log(hobbies);
        res.status(200).json({
            token, message: 'Details fetched done!',
            bio: user.profile?.bio || 'Not provided',
            hobbies: user.profile.hobbies,
            country: user.profile?.country || 'Not provided',
            interests: user.profile?.interests || 'Not provided',
            familyRole: user.profile?.familyRole || 'Not provided',
            badges: user.profile?.badges || 'Not provided',
            photoUrl: user.profile?.photoUrl || 'Not provided'
        });
    } catch (error) {
        console.error('Error during data fetching:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
