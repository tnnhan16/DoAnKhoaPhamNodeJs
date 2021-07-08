import mongoose from "mongoose";

const timerSchema = mongoose.Schema({
    timer_sec: Number,
    timer_flag: Number,
});

export default mongoose.model("Timer", timerSchema);