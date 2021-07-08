import multer from "multer";
import express from "express";
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()  + "-" + file.originalname)
    }
}); 
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("avatar");

router.get("/uploadFile", function(req, res){
    res.render("testUpload");
});
router.post("/uploadFile", function(req, res){
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading.");
            res.json({
                result: 0,
                data: "A Multer error occurred when uploading."
            });
        } else if (err) {
            console.log("An unknown error occurred when uploading." + err);
            res.json({
                result: 0,
                data: "A Multer error occurred when uploading." + err
            });
        }else{
            console.log("Upload is okay");
            console.log(req.file); // Thông tin file đã upload
            res.json({
                result: 1,
                data: req.file.filename
            });
        }
    });
});

export default router;
