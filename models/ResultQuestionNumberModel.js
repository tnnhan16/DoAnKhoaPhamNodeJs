import mongoose from "mongoose";

const resultQuestionNumberSchema = mongoose.Schema({
    player_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    player_nickname: {
        type: String
    },
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    setq_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    point: {
        type: Number
    }
});

export default mongoose.model("ResultQuestionNumber", resultQuestionNumberSchema);