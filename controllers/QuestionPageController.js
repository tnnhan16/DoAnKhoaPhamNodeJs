import Question from "../models/QuestionModel.js";
import Answer from "../models/AnswerModel.js";

export function getSingleQuestion(req, res){
    var id = req.body._id;
    Question.findById(id)
        .then((singleQuestion) => {
            Answer.find({question_id: id})
                .select("_id answer_title answer_flag")
                .then((allAnswer) => {
                    return res.status(200).json({
                        "result": 1,
                        "data": singleQuestion,
                        "allAnswer": allAnswer
                    });
                })
        })
        .catch((err) => {
            res.status(500).json({
                "result": 0,
                "message": err.message,
            });
        });

}



