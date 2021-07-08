import Setq from "../models/SetqModel.js";
import Timer from "../models/TimerModel.js";
import Question from "../models/QuestionModel.js";
import mongodb from "mongodb";

export function setqPage(req, res){
    if(!req.session.user_username) {
        res.redirect('/');
    } else {
        var ObjectId = mongodb.ObjectId;
        Setq.aggregate([
            { $lookup:
                {
                from: 'users',
                localField: 'setq_created_by',
                foreignField: '_id',
                as: 'userdetails'
                }
            },
            { $match: {
                $expr: { $eq: [ "$setq_created_by", new ObjectId(req.session.user_id) ]  },
            }},
            { $unwind: "$userdetails"},
            // {
            //     $lookup: {
            //         from: "questions",
            //         localField: "setq_id",
            //         foreignField: "_id",
            //         as: "questiondetails"
            //     }
            // },
            // { $unwind: "$questiondetails"},
            // {
            //     "$group": {
            //         "_id": "$questiondetails._id",
            //         "count": { "$sum": 1 }
            //     }
            // },
            // {
            //     "$group": {
            //         "_id": null,
            //         "total": { "$sum": "$count" }
            //     }
            // }
        ]).then((allSetq) => {
            console.log(allSetq);
            res.render("setq", {title: "Bộ câu hỏi", data: allSetq});
        })
        .catch((err) => {
            res.status(500).json({
                "result": 0,
                "message": err.message,
            });
        });
    }
}

export function setqCreatePage(req, res){
    if(!req.session.user_username) {
        res.redirect('/');
    } else {
        res.render("setqCreate", {title: "Tạo câu hỏi"});
    }
}

export function setqUpdatePage(req, res){
    if(!req.session.user_username) {
        res.redirect('/');
    }
    const id = req.params._id;
    if(id != ''){
        Setq.findById(id)
        .then((singleSetq) => {
            Timer.find()
            .select("_id timer_sec")
            .then((allTimer) => {
                Question.find({setq_id: id})
                .select("_id question_title question_image setq_id timer_id")
                .then((allQuestion) => {
                    res.render("setqUpdate", {title: "Sửa câu hỏi", data: singleSetq, allTimer: allTimer, allQuestion: allQuestion});
                })
            });
        })
    }
}

export function getSingleSetq(req, res){
    var id = req.body._id;
    Setq.findById(id)
        .then((singleSetq) => {
            return res.status(200).json({
                "result": 1,
                "data": singleSetq,
            });
        })
        .catch((err) => {
            res.status(500).json({
                "result": 0,
                "message": err.message,
            });
        });

}