const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationTokenExpires: { type: Date, default: null },
    profile: {
        bio: { type: String, default: '' },
        country: { type: String, default: '' },
        interests: { type: [String], default: [] }, // Changed from String to Array
        hobbies: { type: [String], default: [] },   // Changed from String to Array
        familyRole: { type: String, default: '' },
        badges: { type: [String], default: [] },
        photoUrl: { type: String, default: 'Url not found' },
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;