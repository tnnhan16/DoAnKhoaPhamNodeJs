import mongoose from "mongoose";

const answerSchema = mongoose.Schema({
    answer_title: {
        type: String,
        required: true,
        maxlength: 255,
    },
    answer_image: {
        type: String,
    },
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    answer_flag: {
        type: Boolean
    }
});

export default mongoose.model("Answer", answerSchema);