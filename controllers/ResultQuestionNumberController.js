import ResultQuestionNumber from "../models/ResultQuestionNumberModel.js";
import {getNickName} from "./PlayerController.js";

export const createResult = async(data) => {
        const player = await getNickName(data.player_id);
        var point = 0;
        if (data.answer_flag == true){
            point = 10;//data.point*10
        }
        console.log("Diem", point);
        const result = new ResultQuestionNumber({
            player_id: data.player_id,
            question_id: data.question_id,
            player_nickname: player.player_nickname,
            setq_id: data.setq_id,
            point: point
        });
        return result
                .save()
                .then((newResult) => {
                    console.log("New result added")
                })
                .catch((err) => {
                    console.log(err.message);
                });  
}

export const getListResultQuestionNumber = async (question_id, setq_id) => {
    try {
        const listResultQuestionNumber = await ResultQuestionNumber.find({question_id: question_id, setq_id:setq_id}).sort({'point': -1});
        return listResultQuestionNumber; 
    } catch(err) {
        console.log(err);
    }
}

export const getListResultEnd = async (setq_id) => {
    try {
        const listSumResult = await ResultQuestionNumber.aggregate(
            [
                {$group : {_id:{player_id: "$player_id",setq_id:"$setq_id", player_nickname:"$player_nickname"}, totalPoint:{$sum:"$point"}}},
             
                {$sort: { totalPoint: -1 } }
            ]
        )
        return listSumResult; 
    } catch(err) {
        console.log(err);
    }
}

