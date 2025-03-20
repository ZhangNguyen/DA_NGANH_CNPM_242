const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        adafruit_username: {type: String},
        adafruit_key: {type: String},
        email: {type: String, required: true, unique: true},
        phone: {type: String, required: true}
    },
    {timestamps: true});
const User = mongoose.model('User', userSchema);
export default User;