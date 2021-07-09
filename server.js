import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParse from "body-parser";
import {createServer} from "http";
import {Server} from "socket.io";
import userRoutes from "./routes/UserRoute.js";
import loginRoutes from "./routes/LoginRoute.js";
import setqRoutes from "./routes/SetqRoute.js";
import playerRoute from "./routes/PlayerRoute.js";
import questionRoutes from "./routes/QuestionRoute.js";
import eventRoutes from "./routes/EventRoute.js";
import timerRoutes from "./routes/TimerRoute.js";
import upload from "./routes/FileManagerRoute.js";
import loginPageRoutes from "./routes/LoginPageRoute.js";
import setqPageRoutes from "./routes/SetqPageRoute.js";
import questionPageRoutes from "./routes/QuestionPageRoute.js";
import {getListPlayerByPin} from "./controllers/PlayerController.js";
import {createResult, getListResultQuestionNumber} from "./controllers/ResultQuestionNumberController.js";
import session from "express-session";
import { nextTick } from "process";
const app = express();

//DotEnv
dotenv.config();
const port = process.env.PORT || 4343;
const url = process.env.DB_URL;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(bodyParse.json({limit: '50mb'}));
app.use(bodyParse.urlencoded({limit: '50mb', extended: true}));
app.use(session({secret:"wer3432r343r3r3rwr23", resave:false, saveUninitialized:true}));
app.use ((req, res, next) => {
    // Website you wish to allow to connect
    
    res.setHeader('Access-Control-Allow-Origin', 'https://doankhoapham.herokuapp.com');
    //res.setHeader('Access-Control-Allow-Origin', 'http://172.16.160.122:3030');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.locals.url = req.originalUrl;
    next();
});

const server = createServer(app);
const io = new Server(server); 
app.io = io;

server.listen(port);

//Connect to MonggoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.log("Error connecting to database: " + error.message);
    });

app.use("/api/", [userRoutes, upload, loginRoutes, setqRoutes, playerRoute, questionRoutes, eventRoutes, timerRoutes]);

app.use("/", [loginPageRoutes, setqPageRoutes, questionPageRoutes]);

app.get("/testSocKet", function(req, res){
    res.render("socketio");
});

io.on("connection", function(socket){
    console.log("New Id " + socket.id);
    var data = socket.handshake.query.data;
    socket.join(parseInt(data));
    socket.phong = parseInt(data);
    socket.on("disconnect", function(){
        console.log("User disconnected");
    });
    //Thêm user vào nhóm
    socket.on("C_AddGroup_S", function(data){
        socket.join(parseInt(data.setq_pin));
        socket.phong = parseInt(data.setq_pin);
        //Lấy danh sách user của nhóm
        console.log("Playgame Pin1", data.setq_pin);
        const list = getListPlayerByPin(data.setq_pin)
        .then((dataPlayer) => {
            io.sockets.in(socket.phong).emit("S_SendPlayerList_C", dataPlayer);
        })
        .catch((err) => {
            console.log(err);
        });   
    });
    
    socket.on("ResultQuestionNumber", function(data){
        createResult(data)
        .then((newResult)=> {
            getListResultQuestionNumber(data.question_id, data.setq_id)
            .then((list) => {
                socket.emit("S_SendResultQuestionNumber_C", list);
                socket.broadcast.to(socket.phong).emit("S_SendResultQuestionNumberBroadCast_C", list);
            })
        });
        
    });
});

app.get("/play/:_id", function(req, res){
    res.render("play", {pin: req.params._id});
});

export default io;