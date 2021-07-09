//Insert question and answers into array
var question = [];
var countDownStart = 3;
//Socket.io

const socket = io("https://doankhoapham.herokuapp.com" + "?data=" + setq_pin);
//const socket = io("http://172.16.160.122:3030" + "?data=" + setq_pin);

socket.on("CountDownStart", function(data){
    console.log(data + " giây nữa bắt đầu.");
    countDownStart = data;
    if (countDownStart==0 && question != undefined && question.answers != undefined){
        document.getElementById("spinner").style.display = "none";
        showQuetions(question.question, question.answers);
        queCounter(question.question.question_flag + 1, question.maxQuestion);
        quiz_box.classList.add("activeQuiz");            
    }
});
socket.on("CountDownQuestion", function(data){
    console.log("Còn " + data + " s.");
    startTimer(data);
});

$('#example-horizontal').barrating('show', {
    theme: 'bars-horizontal',
    reverse: true,
    hoverState: false,
    readonly: true
});
    

//selecting all required elements
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

// if startQuiz button clicked
start_btn.onclick = ()=>{
    document.getElementById("start").style.display = "none";
    info_box.classList.add("activeInfo"); //show info box
}

// if exitQuiz button clicked
exit_btn.onclick = ()=>{
    document.getElementById("start").style.display = "block";
    info_box.classList.remove("activeInfo"); //hide info box
}

// if continueQuiz button clicked
continue_btn.onclick = ()=>{
    $('button.restart, button.quit').css({"display":"none"});
    question = [];
    let data = JSON.stringify({"setq_pin":parseInt(setq_pin)});
    $.ajax({
        type: 'POST',
        url: "/api/play",
        data: data,                   
        contentType: 'application/json',
        success: function (data) {
            if (data.result == 1){
                console.log(data);
                question.question = data.question;
                question.answers = data.answers;
                question.maxQuestion = data.maxQuestion;
                data.answers.forEach(element => {
                    if (element.answer_flag == true){
                        question.corrAnswer = element;
                        return;
                    }
                });
                info_box.classList.remove("activeInfo");
                document.getElementById("spinner").style.display = "block";

                if (countDownStart==0 && question != undefined && question.answers != undefined){
                    document.getElementById("spinner").style.display = "none";
                    showQuetions(question.question, question.answers);
                    queCounter(question.question.question_flag + 1, question.maxQuestion);
                    quiz_box.classList.add("activeQuiz");            
                }
            }
        },   
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);                        
        }
    });  
}

let timeValue =  0;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if quitQuiz button clicked
quit_quiz.onclick = ()=>{
    window.location.reload(); //reload the current window
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked
next_btn.onclick = ()=>{
    next_btn.classList.remove("show"); //hide the next button
    question = [];
    let data = JSON.stringify({"setq_pin":parseInt(setq_pin)});
    $.ajax({
        type: 'POST',
        url: "/api/play",
        data: data,                   
        contentType: 'application/json',
        success: function (data) {
            info_box.classList.remove("activeInfo");
            quiz_box.classList.remove("activeQuiz");
            if (data.result == 1){
                question.question = data.question;
                question.answers = data.answers;
                question.maxQuestion = data.maxQuestion;
                data.answers.forEach(element => {
                    if (element.answer_flag == true){
                        question.corrAnswer = element;
                        return;
                    }
                });
                if(data.question.question_flag + 1 <= data.maxQuestion){
                    timeText.textContent = "Thời gian:"; //change the timeText to Time Left
                    next_btn.classList.remove("show"); //hide the next button
                }else{
                    next_btn.innerHTML = "Kết thúc"
                }
                document.getElementById("spinner").style.display = "block";

                if (countDownStart==0 && question != undefined && question.answers != undefined){
                    document.getElementById("spinner").style.display = "none";
                    showQuetions(question.question, question.answers);
                    queCounter(question.question.question_flag + 1, question.maxQuestion);
                    quiz_box.classList.add("activeQuiz");            
                }
            }
            else{
                console.log("kết quả", data.data);
                showResult(); //calling showResult function
            }
        },   
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);                        
        }
    });
}

// getting questions and options from array
function showQuetions(question, answers){
    if(question != undefined && answers != undefined){
        const que_text = document.querySelector(".que_text");
        //creating a new span and div tag for question and option and passing the value using array index
        let que_tag = '<span>'+ question.question_title +'</span>';
        let option_tag = '<div class="option"><span>'+ answers[0].answer_title +'</span></div>'
        + '<div class="option"><span>'+ answers[1].answer_title +'</span></div>'
        + '<div class="option"><span>'+ answers[2].answer_title +'</span></div>'
        + '<div class="option"><span>'+ answers[3].answer_title +'</span></div>';
        que_text.innerHTML = que_tag; //adding new span tag inside que_tag
        option_list.innerHTML = option_tag; //adding new div tag inside option_tag
        const option = option_list.querySelectorAll(".option");
    }
}
// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function showResult(){
    info_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.remove("activeQuiz"); //hide quiz box
    result_box.classList.add("activeResult"); //show result box
    const scoreText = result_box.querySelector(".score_text");
}

function startTimer(time){
    timeCount.textContent = time; //changing the value of timeCount with time value
    if(time < 9){ //if timer is less than 9
        let addZero = timeCount.textContent; 
        timeCount.textContent = "0" + addZero; //add a 0 before time value
    }
    if(time == 0){ //if timer is less than 0
        timeText.textContent = "Hết giờ!"; //change the time text to time off
        const allOptions = option_list.children.length; //getting all option items
        let correcAns = question.corrAnswer.answer_title; //getting correct answer from array
        for(i=0; i < allOptions; i++){
            if(option_list.children[i].textContent == correcAns){ //if there is an option which is matched to an array answer
                option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                console.log("Time Off: Auto selected correct answer.");
            }
        }
        for(i=0; i < allOptions; i++){
            option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
        }
        next_btn.classList.add("show"); //show the next button if user selected any option
        $('button.restart, button.quit').css({"display":"block"});
    }
}

function queCounter(index, maxQuestion){
    //creating a new span tag and passing the question number and total question
    let totalQueCounTag = '<span><p>'+ index +'</p> / <p>'+ maxQuestion +'</p> câu</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  //adding new span tag inside bottom_ques_counter
}