import mongoose from "mongoose";

mongoose.Promise = global.Promise;
const setqSchema = new mongoose.Schema({
    setq_title: {
        type: String,
        required: true,
        maxlength: 100,
        minlength: 3
    },
    setq_description: {
        type: String
    },
    setq_visibility: {
        type: Number,
        default: 0
        // 0: Only you; 1: Everyone
    },
    setq_image: {
        type: String,
    },
    setq_pin: {
        type: Number,
        maxlength: 6
    },
    setq_max_player: {
        type: Number,
        default: 0
    },
    setq_playing: {
        type: Number,
        default: 0
    },
    setq_created_at: {
        type: Date,
        default: Date.now,
    },
    setq_created_by: {
        type: mongoose.Schema.Types.ObjectId,
    },
});

export default mongoose.model("Setq", setqSchema);