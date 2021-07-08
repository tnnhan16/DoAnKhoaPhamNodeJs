import Answer from "../models/AnswerModel.js";

export function createAnswers(req, res){
    var listAnswer = req.body;
    console.log(req.body);

    // const answers = new Answer({
    //     answer_title: req.body.question_title,
    //     answer_image: req.body.question_image,
    //     setq_id: req.body.setq_id,
    //     time_id: req.body.time_id,
    //     question_flag: 0
    // });
    // return question
    //         .save()
    //         .then((newQuestion) => {
    //             res.status(201).json({
    //                 "result": 1,
    //                 "data": newQuestion
    //             });
    //         })
    //         .catch((err) => {
    //             res.status(500).json({
    //                 "result": 0,
    //                 "message": err.message
    //             });
    //         });       
}