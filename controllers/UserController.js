import User from "../models/UserModel.js";

// Bcryptjs
import bcrypt from "bcryptjs";

export function createUser(req, res){
    User.find({"$or": [{"user_username":req.body.user_username}, {"user_email":req.body.user_email}]}, function(err, data){
        if(data.length==0){
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.user_password, salt, function(err, hash) {
                    if(err){
                        res.status(500).json({
                            "result":0, 
                            "message":"Lỗi mã hóa mật khẩu."
                        });
                    }else
                    {
                        // Save user to Mongo Server
                        const newUser = User({
                            user_firstname: req.body.user_firstname,
                            user_lastname: req.body.user_lastname,
                            user_gender: req.body.user_gender,
                            user_email: req.body.user_email,
                            user_username: req.body.user_username,
                            user_password: hash,
                            user_phone: req.body.user_phone,
                            user_address: req.body.user_address,
                            user_avatar: req.body.user_avatar,
                        });

                        return newUser
                                .save()
                                .then((newUser) => {
                                    res.status(201).json({
                                        "result": 1,
                                        "data": newUser
                                    });
                                })
                                .catch((err) => {
                                    res.status(500).json({
                                        "result": 0,
                                        "message": err.message
                                    });
                                });       

                    }
                });
            });

        }
        else{
            res.status(200).json({
                "result":0, 
                "message":"Email hoặc username đã được đăng ký."
            });
        }
    });
    
}

export function getAllUser(req, res){
    User.find()
    .select("_id user_firstname user_lastname user_gender user_email user_username user_password user_phone user_address user_avatar user_created_at")
    .then((allUser) => {
        return res.status(200).json({
            "result": 1,
            "data": allUser
        });
    })
    .catch((err) => {
        res.status(500).json({
            "result": 0,
            "message": err.message,
        });
    });
}
export function getSingleUser(req, res){
    const id = req.params._id;
    User.findById(id)
        .then((singleUser) => {
            return res.status(200).json({
                "result": 1,
                "data": singleUser,
            });
        })
        .catch((err) => {
            res.status(500).json({
                "result": 0,
                "message": err.message,
            });
        });

}
export function updateUser(req, res){
    const id = req.params._id;
    const updateObject = req.body;
    User.findByIdAndUpdate({ _id:id }, { $set:updateObject }, {new: true})
    .exec()
    .then((user) => {
        if(!user) {
            res.status(404).json({
                "result": 0,
                "message": "Không tìm được user với id: " + id
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
                "message": "Không tìm được user với id: " + id
            }); 
        }else {
            res.status(500).json({
                "result": 0,
                "message": err.message
            });
        }    
    });
}
export function deleteUser(req, res) {
    const id = req.params._id;
    User.findByIdAndRemove(id)
      .exec()
      .then((user) => {
            if(!user) {
                res.status(404).json({
                    "result": 0,
                    "message": "Không tìm được user với id: " + id
                });
            }else{
                return res.status(204).json({
                    "result": 1,
                    "message": 'Xóa user thành công.'
                });
            }
            
        })
      .catch((err) => res.status(500).json({
        "result": 0,
        "message": err.message,
      }));
  }