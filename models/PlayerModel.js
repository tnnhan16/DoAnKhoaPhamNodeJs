import mongoose from "mongoose";

const playerSchema = mongoose.Schema({
    player_nickname: {
        type: String,
        unique: true
    },
    player_flag: Number,
    setq_id: mongoose.SchemaTypes.ObjectId,
    player_avatar: String
});

export default mongoose.model("Player", playerSchema);