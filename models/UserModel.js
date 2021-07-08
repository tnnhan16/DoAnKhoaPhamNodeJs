import mongoose from "mongoose";

mongoose.Promise = global.Promise;
const userSchema = new mongoose.Schema({
    user_firstname: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    user_lastname: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    user_gender: {
        type: Number,
    },
    user_email: {
        type: String,
        required: true,
        maxlength: 100,
    },
    user_username: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3,
        unique: true
    },
    user_password: {
        type: String,
        required: true,
        maxlength: 200,
        minlength: 6
    },
    user_phone: {
        type: String,
        maxlength: 10,
    },
    user_address: {
        type: String,
    },
    user_avatar: {
        type: String,
    },
    user_isdeleted: {
        type: Boolean,
        default: false,
    },
    user_active: {
        type: Boolean,
        default: true,
    },
    user_created_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("User", userSchema);