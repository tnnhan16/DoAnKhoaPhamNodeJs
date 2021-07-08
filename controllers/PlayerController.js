import Player from "../models/PlayerModel.js";
import Setq from "../models/SetqModel.js";
//import io from "../server.js";

export function playerJoin(req, res){
    const name = req.body.player_nickname;
    const flag = 0;
    const avatar = req.body.player_avatar;
    const pin = req.body.setq_pin;
    var maxPlayer, nowPlayer;
    if (name === "" || pin === ""){
        if (name === ""){
            return res.status(400).json({
                "result": 0,
                "message": "Mời bạn nhập nickname."
            });
        }
        else if (pin === ""){
            return res.status(400).json({
                "result": 0,
                "data": "Mời bạn nhập mã pin.",
            });
        } 
    }
    else {

        Setq.findOne({setq_pin : pin})
        .select('_id setq_title setq_description setq_playing setq_image setq_visibility setq_created_by')
        .then((setq) => {
            if(setq == null) {
                res.status(404).json({
                    "result": 0,
                    "message": "Phòng không tồn tại, vui lòng nhập lại mã pin."
                });
            }
            else {
                if (setq.setq_playing == 0){
                    countNowPlayer(setq._id).then((data)=>{
                        nowPlayer = data;
                        countMaxPlayer(pin).then((data)=>{
                            maxPlayer = data;
                            if(nowPlayer<maxPlayer){
                                const newPlayer = Player({
                                    player_nickname: name,
                                    player_flag: 0,
                                    setq_id: setq._id,
                                    player_avatar: avatar??""
                                }).save()
                                    .then((newPlayer) => {
                                        res.status(200).json({
                                            "result": 1,
                                            "data": setq,
                                            "player_id": newPlayer._id
                                        });
                                    })
                                    .catch((err) => {
                                        res.status(500).json({
                                            "result": 0,
                                            "message": "Nickname đã tồn tại."
                                        });
                                    });   
                            }
                            else {
                                res.status(200).json({
                                    "result": 0,
                                    "message": "Phòng đã đầy, vui lòng nhập phòng khác."
                                });
                            }
                        });
                    });
                } else {
                    res.status(501).json({
                        "result": 0,
                        "message": "Phòng này đã bắt đầu chơi, vui lòng đợi hoặc nhập phòng khác."
                    }); 
                }              
            } 
        })
        .catch((err) => {
            res.status(500).json({
                "result": 0,
                "message": "Phòng không tồn tại, vui lòng nhập lại mã pin."
            });
                
        }); 
    }        
}

export const getListPlayerByPin = async (pin) => {
    try {
        const setq = await Setq.findOne({setq_pin: pin});
        if (setq!=null){
            const listPlayer = await Player.find({setq_id: setq._id}).sort({'_id': -1});
            return listPlayer;
        }   
    } catch(err) {
        console.log(err);
    }
}

const countMaxPlayer = async(pin) => {
    try {
        const setq = await Setq.findOne({setq_pin: pin});
        if (setq!=null){           
            return setq.setq_max_player;
        }   
    } catch(err) {
        console.log(err);
    }
}

const countNowPlayer = async(id) => {
    try {
        const list = await Player.countDocuments({setq_id: id});
        if (list!=null){           
            return list;
        } 
    }
    catch(err){
        console.log(err);
    }
}

export const getNickName = async(player_id) => {
    const player = await Player.findById(player_id);
    if (player!=undefined){
        return player;
    }
    else return 0;
}