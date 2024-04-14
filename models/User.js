const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['admin', 'regular'],
        default: 'regular'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
