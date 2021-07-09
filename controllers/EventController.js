import io from "../server.js";
import Player from "../models/PlayerModel.js";
import Setq from "../models/SetqModel.js";
import Timer from "../models/TimerModel.js";
import {getQuestion, getAnswersOfQuestion, countQuestion} from "./QuestionController.js";
import {getListResultQuestionNumber, getListResultEnd} from "./ResultQuestionNumberController.js";

var nextNumberQuestion = 0;
export function playGame(req, res){
    getFullDataOfQuestion(req.body.setq_pin, nextNumberQuestion)
    .then((data)=> {
        if (data.question != undefined){
            console.log("Data: ", data);
            nextNumberQuestion = data.question.question_flag + 1;
            var timeleft = 3;
            var downloadTimer = setInterval(function(){
                if(timeleft < 0){
                    clearInterval(downloadTimer);
                    io.sockets.in(Number(req.body.setq_pin)).emit("PlayGame", [data.question,data.answers, data.maxQuestion]);
                    var timerOfQuestion = data.timer.timer_sec;
                    var downloadTimer2 = setInterval(function(){
                        if(timerOfQuestion < 0){
                            clearInterval(downloadTimer2);
                            io.sockets.in(Number(req.body.setq_pin)).emit("FinishQuestionNumber", "Thời gian câu hỏi số " + parseInt(data.question.question_flag + 1) + " đã hết.");
                        } else {
                            io.sockets.in(Number(req.body.setq_pin)).emit("CountDownQuestion", timerOfQuestion);
                            console.log("CountDownQuestion", timerOfQuestion);
                        }
                        timerOfQuestion -= 1;
                    }, 1000);
                } else {       
                    io.sockets.in(Number(req.body.setq_pin)).emit("CountDownStart", timeleft);
                }
                timeleft -= 1;
            }, 1000);
            res.json({
                result: 1,
                question: data.question,
                answers: data.answers,
                maxQuestion: data.maxQuestion,
                message: "Đang trả lời câu hỏi thứ " + nextNumberQuestion + " trong bộ " + data.maxQuestion + " câu hỏi."
            });
        }
        else {
            nextNumberQuestion = 0;
            getSetqWithPin(req.body.setq_pin).then((setq) => {
                Setq.findOneAndUpdate({_id: setq._id },{$set: {setq_playing:0}}, {new: true }).exec();
                getListResultEnd(setq._id).then((list) => {
                    io.sockets.in(Number(req.body.setq_pin)).emit("SendResultEnd", list);
                    res.json({
                        result: 0,
                        data: list
                    });
                });
            })
            
        }
            
          
    });
            
}

export function showPoint(req, res){
    const question_id = req.body.question_id;
    const setq_pin = req.body.setq_pin;
    getSetqWithPin(setq_pin).then((setq)=>{
        if (setq!=0){
            getListResultQuestionNumber(question_id, setq._id)
            .then((data) => {
                io.sockets.in(Number(setq_pin)).emit("S_SendResultQuestionNumber_C", data);
                res.json({
                    result: 0,
                    data: data
                });
            });
        }
        
    });
    
}

export function hostGame(req, res){
    //console.log(req.body);
    makePin(4).then((pin)=> {
        req.body.setq_pin = pin;
        const updateObject = req.body;
        Setq.findByIdAndUpdate({ _id:req.params._id }, { $set:updateObject }, {new: true})
        .exec()
        .then((setq) => {
            if(!setq) {
                res.status(404).json({
                    "result": 0,
                    "message": "Không tìm thấy bộ câu hỏi với id: " + id
                });
            }
            else {
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
    });

}
//Lấy bộ câu hỏi dựa vào pin
const getSetqWithPin = async (pin) => {
    try {
        const setq = await Setq.findOne({setq_pin: pin});
        if (setq!=null){
            return setq;
        } 
        else {
            return 0;
        }  
    } catch(err) {
        console.log(err);
    }
}

//Lấy thời gian của câu hỏi
const getTimeOfQuestion = async (timer_id) => {
    try {
        const timer = await Timer.findOne({_id: timer_id});
        if (timer!=null){
            return timer;
        } 
        else {
            return 0;
        }  
    } catch(err) {
        console.log(err);
    }
}

//Lấy nội dung câu hỏu và đáp án của câu hỏi đó
const getFullDataOfQuestion = async(setq_pin, n) => {
    var data = [];
    var setq = await getSetqWithPin(setq_pin);
    if (setq!=0){
        //Doi setq_playing thanh 1 khi bat dau choi
        Setq.findOneAndUpdate({_id: setq._id },{$set: {setq_playing:0}}, {new: true }).exec();
        var question = await getQuestion(n,setq._id);
        var maxQuestion = await countQuestion(setq._id);

        if (question!=0){
            var answers = await getAnswersOfQuestion(question._id);
            var timer = await getTimeOfQuestion(question.timer_id);
            data.question = question;
            data.answers = answers;
            data.maxQuestion = maxQuestion;
            data.timer = timer;
            return data;
        }
    }    
    return data;
}

const makePin = async(length) => {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

