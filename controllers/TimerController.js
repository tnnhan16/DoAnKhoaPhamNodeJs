import Timer from "../models/TimerModel.js";

export function createTimer(req, res){
    const timer = new Timer({
        timer_sec: req.body.timer_sec,
        timer_flag: 1
    });
    return timer
            .save()
            .then((newTimer) => {
                res.status(201).json({
                    "result": 1,
                    "data": newTimer
                });
            })
            .catch((err) => {
                res.status(500).json({
                    "result": 0,
                    "message": err.message
                });
            });    
}