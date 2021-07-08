import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
    question_title: {
        type: String,
        required: true,
        maxlength: 255,
    },
    question_image: {
        type: String,
    },
    setq_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    timer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    question_flag: {
        type:Number
    }
});

export default mongoose.model("Question", questionSchema);