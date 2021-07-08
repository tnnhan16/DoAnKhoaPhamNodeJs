import Question from "../models/QuestionModel.js";
import Answer from "../models/AnswerModel.js";
import multer from "multer";
import Timer from "../models/TimerModel.js";

export function createQuestion(req, res){
    const question_title = req.body.question_title;
    const question_image = req.body.question_image;
    const setq_id = req.body.setq_id;
    const timer_id = req.body.timer_id;
    const answers = req.body.answers;
    Question.countDocuments({setq_id: setq_id}).exec()
    .then((count) => {
        const question = new Question({
            question_title: question_title,
            question_image: question_image??"",
            setq_id: setq_id,
            timer_id: timer_id,
            question_flag: (count > 0) ? count++:0
        });
        return question
                .save()
                .then((newQuestion) => {
                    saveAnswer(answers, newQuestion._id).then((data)=>{
                        res.status(201).json({
                            "result": 1,
                            "data": newQuestion
                        });
                    }).catch((err)=>{
                        res.status(500).json({
                            "result": 0,
                            "message": "Lỗi lưu câu trả lời."
                        });
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        "result": 0,
                        "message": "Lỗi lưu câu hỏi: " + err.message
                    });
                });  
    })
    .catch((error)=>{ 
        res.status(500).json({
            "result": 0,
            "message": err.message
        });
    });       
}

export function updateQuestion(req, res){
    var id = req.body._id;
    var updateObject = req.body;
    Question.findByIdAndUpdate({ _id:id }, { $set:updateObject }, {new: true})
    .exec()
    .then((question) => {
        if(!question) {
            return res.status(404).json({
                        "result": 0,
                        "message": "Không tìm thấy bộ câu hỏi với id: " + id
                    });
        }
        else {
            req.body.answers.forEach((answer) => {
                Answer.findByIdAndUpdate({_id: answer._id}, { $set:answer }, {new: true})
                .exec()
                .then((an) => {
                    console.log("Update answer success");
                }).catch((error)=>{
                    console.log(error.message);
                });
             });
             return res.status(200).json({
                "result": 1,
                "data": updateObject,
            });
        }
    })
    .catch((err) => {
        if(err.kind === "ObjectId"){
            res.status(404).json({
                "result": 0,
                "message": "Không tìm thấy bộ câu hỏi với id: " + id
            }); 
        }else {
            res.status(500).json({
                "result": 0,
                "message": err.message
            });
        }    
    });
}

export function deleteQuestion(req, res) {
    const id = req.body._id;
    // Delete row
    Question.findByIdAndRemove(id)
      .exec()
      .then((question) => {
            if(!question) {
                res.status(404).json({
                    "result": 0,
                    "message": "Không tìm thấy bộ câu hỏi với id:  " + id
                });
            }else{
                Answer.remove({question_id: id})
                .exec()
                .then((an) => {
                    console.log("Delete answer success");
                }).catch((error)=>{
                    console.log(error.message);
                });
                 return res.status(200).json({
                    "result": 1,
                    "message": 'Xóa câu hỏi thành công.'
                });
            }
       })
      .catch((err) => res.status(500).json({
        "result": 0,
        "message": err.message,
    }));
}

const saveAnswer = async(answers, q_id) => {
    var result = answers.map(function(el) {
        var o = Object.assign({}, el);
        o.question_id = q_id;
        return o;
    });
    await Answer.insertMany(result)
    .then(function(){ 
        console.log("Answers inserted");
    }).catch(function(error){ 
        console.log(error)
    });
}

export var getQuestion = async(questionN, s_id) => {
    try {
        const countQuestion = await Question.countDocuments({setq_id: s_id});
        if(questionN<=countQuestion){
            const question = await Question.findOne({setq_id: s_id, question_flag: questionN});
            if (question!=null){ 
                return question;
            }
            else {
                return 0;
            } 
         
        }else return 0; 
        
    } catch(err) {
        console.log(err);
    }
}

export const getAnswersOfQuestion = async(q_id) => {
    try {
        const answers = await Answer.find({question_id: q_id}).sort({'_id': 1});
        if (answers!=null){ 
            return answers;
        }
        else {
            return 0;
        }   
    } catch(err) {
        console.log(err);
    }
}

export const countQuestion = async(s_id) => {
    try {
        const question = await Question.countDocuments({setq_id: s_id});
        return question; 
        
    } catch(err) {
        console.log(err);
    }
}



