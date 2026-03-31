const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationTokenExpires: { type: Date, default: null },
    githubId: { type: String, default: null, unique: true, sparse: true }, // Added for github auth
    profile: {
        bio: { type: String, default: '' },
        country: { type: String, default: '' },
        interests: { type: [String], default: [] },
        hobbies: { type: [String], default: [] },
        familyRole: { type: String, default: '' },
        badges: { type: [String], default: [] },
        photoUrl: { type: String, default: '/assets/img/team/neer.jpg' }, // Fixed default
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;