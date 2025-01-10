const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    interests: { type: String },
    hobbies: { type: String },
    familyRole: { type: String, required: true },
    badges: { type: [String] }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
