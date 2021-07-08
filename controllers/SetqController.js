import Setq from "../models/SetqModel.js";

export function createSetq(req, res){
    const setq = new Setq({
        setq_title: req.body.setq_title,
        setq_description: req.body.setq_description,
        setq_visibility: req.body.setq_visibility,
        setq_pin: 0,
        setq_image: req.body.setq_image,
        setq_max_player: req.body.setq_max_player??10,
        setq_created_by: req.session.user_id
    });
    return setq
            .save()
            .then((newSetq) => {
                res.status(201).json({
                    "result": 1,
                    "data": newSetq
                });
            })
            .catch((err) => {
                res.status(500).json({
                    "result": 0,
                    "message": err.message
                });
            });       
}
export function getAllSetq(req, res){
    Setq.find()
    .select("_id setq_title setq_description setq_visibility setq_image setq_created_by setq_pin")
    .then((allSetq) => {
        return res.status(200).json({
            "result": 1,
            "data": allSetq
        });
    })
    .catch((err) => {
        res.status(500).json({
            "result": 0,
            "message": err.message,
        });
    });
}
export function getSingleSetq(req, res){
    const id = req.params._id;
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
export function updateSetq(req, res){
    const id = req.params._id;
    const updateObject = req.body;
    Setq.findByIdAndUpdate({ _id:id }, { $set:updateObject }, {new: true})
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
}
export function deleteSetq(req, res) {
    const id = req.params._id;
    // Delete row
    Setq.findByIdAndRemove(id)
      .exec()
      .then((setq) => {
            if(!setq) {
                res.status(404).json({
                    "result": 0,
                    "message": "Không tìm thấy bộ câu hỏi với id:  " + id
                });
            }else{
                return res.status(204).json({
                    "result": 1,
                    "message": 'Xóa bộ câu hỏi thành công.'
                });
            }
            
        })
      .catch((err) => res.status(500).json({
        "result": 0,
        "message": err.message,
    }));
}