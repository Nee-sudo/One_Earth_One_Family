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
const router = express.Router();
// App Setup
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Constants
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || '';
const SECRET_KEY = process.env.SECRET_KEY || '';

// Models
const User = require('./models/User');
// const Member = require('./models/Profiles');
const Thought = require('./models/Thought');
const authenticateJWT = require('./middleware/authenticateJWT');
const thoughtsRoutes = require('./routes/thoughts');
app.use('/api', thoughtsRoutes);
//set engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('OEOF'));
app.use(express.static('public'));
app.use(express.static('public copy'));
app.use('/uploads', express.static('static/uploads'));
// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin: ["http://localhost:4000","https://oneearthonefamily.up.vercel.app","https://one-earth-one-family.onrender.com"], // Allow both localhost and deployed frontend
    methods: ["GET", "POST"],
    credentials: true }));
// Storage Setup (Uploads to "public/images/")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets/img/team"); // Save files in 'public/images/'
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
        // const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
        req.imageUrl = `assets/img/team/${sanitizedFilename}`;
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
app.get('/edit-details', (req, res) => {
    res.render('edit-details');
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
            html: `
            <p>Dear ${first_name},</p>
            <p>Thank you for registering with One Earth One Family. Please click the button below to verify your email address and complete your registration:</p>
            <p><a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
            <p>If you did not create an account, please ignore this email.</p>
            <p>Best regards,<br/>The One Earth One Family Team</p>
            `,
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
        const jwtToken = jwt.sign(
            { 
            id: user._id, 
            username: user.first_name, 
            email: user.email, 
            profile: user.profile, 
            userImage: user.profile?.photoUrl || 'Not provided' 
            }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );
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
        console.log("loaded  user data loaded", user);
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
        let users = await User.find().select('-password -password');
        
        if (users.length === 0) {
            // Simple seed without email check if empty - avoids dup issues
            const sampleUsers = [
                {
                    first_name: 'Demo',
                    last_name: 'User1',
                    email: 'demo1@local.test',
                    password: '$2b$10$dummyhash',
                    verified: true,
                    profile: {
                        bio: 'Demo member 1',
                        country: 'Local',
                        familyRole: 'Member',
                        photoUrl: 'assets/img/team/neer.jpg'
                    }
                },
                {
                    first_name: 'Demo',
                    last_name: 'User2',
                    email: 'demo2@local.test',
                    password: '$2b$10$dummyhash',
                    verified: true,
                    profile: {
                        bio: 'Demo member 2',
                        country: 'Local', 
                        familyRole: 'Member',
                        photoUrl: 'assets/img/team/irina.jpg'
                    }
                }
            ];
            await User.insertMany(sampleUsers);
            users = await User.find().select('-password');
            console.log('Seeded 2 demo users.');
        }

        const userList = users.map(user => ({
            id: user._id,
            first_name: user.first_name,
            country: user.profile?.country || 'N/A',
            familyRole: user.profile?.familyRole || 'Member',
            bio: user.profile?.bio || 'No bio',
            image: user.profile?.photoUrl || '/assets/img/team/neer.jpg'
        })).slice(0, 8); // Limit for UI

        res.json(userList);
    } catch (error) {
        console.error('Profiles error:', error.message);
        // Fallback demo data
        res.json([
            {
                id: 'demo1',
                first_name: 'Neeraj',
                country: 'India',
                familyRole: 'Founder',
                bio: 'Local demo - images work!',
                image: '/assets/img/team/neer.jpg'
            },
            {
                id: 'demo2',
                first_name: 'Irina',
                country: 'Russia',
                familyRole: 'Member',
                bio: 'Local demo - no errors!',
                image: '/assets/img/team/irina.jpg'
            }
        ]);
    }
});

// Protect the user data route
// Serve static files

app.post('/submit-profile', authenticateJWT, upload.single('Photo'), async (req, res) => {
    try {
        const { bio, country, interests, hobbies, familyRole, badges } = req.body;
        // console.log('Type of hobbies:', typeof hobbies, hobbies);
        // console.log('Type of interests:', typeof interests, interests);
        const parsedHobbies = typeof hobbies === 'string' ? JSON.parse(hobbies) : hobbies;
        const parsedInterests = typeof interests === 'string' ? JSON.parse(interests) : interests;

        let photoUrl = req.body.existingPhotoUrl; // Retain existing URL if no new upload
        if (req.file) { // If a new file was uploaded
            const sanitizedFilename = req.file.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
            // const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
            photoUrl = `assets/img/team/${sanitizedFilename}`;
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
//Edit-profile
app.post('/edit-profile', authenticateJWT, async (req, res) => {
    try {
        console.log('Request received:', req.body);
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                'email': req.body.email,
                'password': hashedPassword,
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
            message: 'Details updated!',
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
            { id: user._id, username: user.first_name, email: user.email ,userImage: user.profile?.photoUrl },
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
            {
                id: user._id,
                username: user.first_name,
                email: user.email,
                userImage: user.profile?.photoUrl || 'assets/img/default.jpg' // Store image
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        
        // console.log("toke details", token);
        // res.json( { userId: user._id, username: 'eeraj', email: user.email ,hobbies:user.profile.hobbies });
        const hobbies = user.profile.hobbies;
        // console.log(hobbies);
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
