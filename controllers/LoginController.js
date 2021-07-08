import User from "../models/UserModel.js";
import Token from "../models/TokenModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
dotenv.config();
const secret = process.env.SECRET;

export function userLogin(req, res){
    //Check Username
    User.findOne({user_username:req.body.user_username}, function(err, data){
        if (err){
            res.status(500).json({
                "result": 0,
                "message": err.message
            });
        }else {
            if (!data){
                res.status(501).json({
                    "result": 0,
                    "message": "Username không tồn tại."
                });
            }else {
                bcrypt.compare(req.body.user_password, data.user_password, function(err, resUser){
                    if (err){
                        res.status(500).json({
                            "result": 0,
                            "message": "Lỗi server, không compare được mật khẩu."
                        });
                    }else {
                        if (resUser===true){
                            //Login successfully
                            req.session.user_username = data.user_username;
                            req.session.user_id = data._id;
                            jwt.sign({
                                user_id: data._id,
                                user_username: data.user_username,
                                user_firstname: data.user_firstname,
                                user_lastname: data.user_lastname,
                                user_firstname: data.user_firstname,
                                user_gender: data.user_gender,
                                user_email: data.user_email,
                                user_phone: data.user_phone,
                                user_address: data.user_address,
                                user_avatar: data.user_avatar,
                                user_active: data.user_active, 
                                user_created_at: data.user_created_at,
                                user_browser: req.headers
                            }, secret, {expiresIn:Math.floor(Date.now()/1000)+60*60*24*30*3}, function(err, token){
                                if (err){
                                    //Create Token Fail
                                    res.status(500).json({
                                        "result": 0,
                                        "message": "Lỗi server, không tạo được token."
                                    });
                                }else {
                                    //Save Token
                                    var curToken = Token({
                                        Token: token,
                                        User: data._id,
                                        RegisterDate: Date.now(),
                                        State: true
                                    });
                                    curToken.save()
                                        .then((curToken) => {
                                            res.status(201).json({
                                                "result": 1,
                                                "token": token
                                            });
                                        })
                                        .catch((error) => {
                                            res.status(500).json({
                                                "result": 0,
                                                "message": "Lỗi server, không lưu được token."
                                            });
                                        });    
                                }
                            });
                        }else {
                            res.status(500).json({
                                "result": 0,
                                "message": "Mật khẩu không trùng khớp."
                            });
                        }
                    }
                });
            }
        }
    });
}

export function verifyToken(req, res){
    Token.findOne({Token:req.body.token, State: true}).select("_id").lean().then(result=>{
        if (!result) {
            //Token error or logout (State:false)
            res.status(401).json({
                "result": 0,
                "message": "Không tìm thấy token hoặc token đã hết hạn."
            });
        }
        else {
            jwt.verify(req.body.token, secret, function(err, decoded){
                if(!err && decoded !== undefined){
                    res.status(200).json({
                        "result": 1,
                        "user": decoded
                    });  
                }
                else{
                    res.status(500).json({
                        "result": 0,
                        "message": "Xác thực token lỗi."
                    });
                }
            });
        }
    });
    
}
export function userLogout(req, res){
    Token.findOneAndUpdate({Token:req.body.token}, {State:false}, function(err, result){
        if(err){
            res.status(500).json({
                "result": 0,
                "message": "Lỗi server, không cập nhật được trạng thái token."
            });
        }else {
            if (result == null){
                res.status(400).json({
                    "result": 0,
                    "message": "Token không tồn tại."
                });
            }
            else {
                res.session.destroy();
                res.status(200).json({
                    "result": 1,
                    "message": "Đăng xuất thành công."
                });
            }   
        }
    });
}
