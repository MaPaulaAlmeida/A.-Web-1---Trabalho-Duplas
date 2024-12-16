// SELECTING ALL REQUIRED ELEMENTS
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

// PLAY BACKGROUND MUSIC
const backgroundMusic = new Audio('music.MP3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.4;

// WHEN START BUTTON IS CLICKED
start_btn.onclick = () => {
    info_box.classList.add("activeInfo"); // SHOW INFO BOX
    backgroundMusic.play(); // START MUSIC
};

// WHEN EXIT BUTTON IS CLICKED
exit_btn.onclick = () => {
    window.location.href = "index.html"; // RETURN TO HOME PAGE
};

// WHEN CONTINUE BUTTON IS CLICKED
continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); // HIDE INFO BOX
    quiz_box.classList.add("activeQuiz"); // SHOW QUIZ BOX
    showQuestions(0); // SHOW FIRST QUESTION
    queCounter(1); // SHOW QUESTION COUNTER
    startTimer(15); // START TIMER
    startTimerLine(0); // START TIMELINE
};

// INITIAL VARIABLES
let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

// RESTART QUIZ BUTTON FUNCTIONALITY
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz"); // SHOW QUIZ BOX
    result_box.classList.remove("activeResult"); // HIDE RESULT BOX
    timeValue = 15; // RESET TIMER VALUE
    que_count = 0; // RESET QUESTION COUNTER
    que_numb = 1; // RESET QUESTION NUMBER
    userScore = 0; // RESET SCORE
    widthValue = 0; // RESET TIMELINE WIDTH
    showQuestions(que_count); // SHOW FIRST QUESTION
    queCounter(que_numb); // UPDATE QUESTION COUNTER
    clearInterval(counter); // CLEAR TIMER
    clearInterval(counterLine); // CLEAR TIMELINE
    startTimer(timeValue); // START TIMER
    startTimerLine(widthValue); // START TIMELINE
    timeText.textContent = "Tempo"; // RESET TIMER TEXT
};

// QUIT QUIZ BUTTON FUNCTIONALITY
quit_quiz.onclick = () => {
    window.location.href = "index.html"; // RETURN TO HOME PAGE
};

// NEXT BUTTON FUNCTIONALITY
const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

next_btn.onclick = () => {
    if (que_count < questions.length - 1) { // CHECK IF MORE QUESTIONS ARE LEFT
        que_count++; // INCREMENT QUESTION COUNTER
        que_numb++; // INCREMENT QUESTION NUMBER
        showQuestions(que_count); // SHOW NEXT QUESTION
        queCounter(que_numb); // UPDATE QUESTION COUNTER
        clearInterval(counter); // RESET TIMER
        clearInterval(counterLine); // RESET TIMELINE
        startTimer(timeValue); // RESTART TIMER
        startTimerLine(widthValue); // RESTART TIMELINE
        timeText.textContent = "Time Left"; // RESET TIMER TEXT
        next_btn.classList.remove("show"); // HIDE NEXT BUTTON
    } else {
        clearInterval(counter); // STOP TIMER
        clearInterval(counterLine); // STOP TIMELINE
        showResult(); // SHOW RESULT BOX
    }
};

// FUNCTION TO DISPLAY QUESTIONS AND OPTIONS
function showQuestions(index) {
    const que_text = document.querySelector(".que_text");

    let que_tag = '<span>' + questions[index].numb + ". " + questions[index].question + '</span>';
    let option_tag = '<div class="option"><span>' + questions[index].options[0] + '</span></div>'
        + '<div class="option"><span>' + questions[index].options[1] + '</span></div>'
        + '<div class="option"><span>' + questions[index].options[2] + '</span></div>'
        + '<div class="option"><span>' + questions[index].options[3] + '</span></div>';

    que_text.innerHTML = que_tag; // INSERT QUESTION
    option_list.innerHTML = option_tag; // INSERT OPTIONS

    const option = option_list.querySelectorAll(".option");

    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)"); // ADD CLICK EVENT TO OPTIONS
    }
}

// ICONS FOR CORRECT AND WRONG ANSWERS
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// FUNCTION TO HANDLE OPTION SELECTION
function optionSelected(answer) {
    clearInterval(counter); // STOP TIMER
    clearInterval(counterLine); // STOP TIMELINE
    let userAns = answer.textContent; // GET SELECTED OPTION
    let correcAns = questions[que_count].answer; // GET CORRECT ANSWER
    const allOptions = option_list.children.length;

    if (userAns == correcAns) { // IF CORRECT
        userScore++; // INCREMENT SCORE
        answer.classList.add("correct"); // ADD CORRECT STYLE
        answer.insertAdjacentHTML("beforeend", tickIconTag); // ADD TICK ICON
    } else { // IF WRONG
        answer.classList.add("incorrect"); // ADD INCORRECT STYLE
        answer.insertAdjacentHTML("beforeend", crossIconTag); // ADD CROSS ICON

        for (let i = 0; i < allOptions; i++) { // SHOW CORRECT ANSWER
            if (option_list.children[i].textContent == correcAns) {
                option_list.children[i].setAttribute("class", "option correct");
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
            }
        }
    }

    for (let i = 0; i < allOptions; i++) { // DISABLE ALL OPTIONS
        option_list.children[i].classList.add("disabled");
    }
    next_btn.classList.add("show"); // SHOW NEXT BUTTON
}

// FUNCTION TO DISPLAY RESULT BOX
function showResult() {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score_text");

    if (userScore > 15) {
        let scoreTag = '<span>Parabéns! És um cinéfilo! 🙌 <i>' + userScore + ' de ' + questions.length + '</i></span>';
        scoreText.innerHTML = scoreTag;
    } else if (userScore > 10) {
        let scoreTag = '<span>Muito bem! Quase um cinéfilo! 😎 <i>' + userScore + ' de ' + questions.length + '</i></span>';
        scoreText.innerHTML = scoreTag;
    } else {
        let scoreTag = '<span>Não és um cinéfilo ainda 😐... <i>' + userScore + ' de ' + questions.length + '</i></span>';
        scoreText.innerHTML = scoreTag;
    }
}

// FUNCTION TO START TIMER
function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if (time < 10) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero; // ADD ZERO BEFORE SINGLE DIGITS
        }
        if (time < 0) {
            clearInterval(counter);
            timeText.textContent = "Fim"; // TIMER FINISHED
            const allOptions = option_list.children.length;
            let correcAns = questions[que_count].answer;
            for (let i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent == correcAns) {
                    option_list.children[i].setAttribute("class", "option correct");
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                }
            }
            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled");
            }
            next_btn.classList.add("show"); // SHOW NEXT BUTTON
        }
    }
}

// FUNCTION TO START TIMELINE
function startTimerLine(time) {
    counterLine = setInterval(timer, 29);
    function timer() {
        time += 1;
        time_line.style.width = time + "px";
        if (time > 549) {
            clearInterval(counterLine);
        }
    }
}

// FUNCTION TO UPDATE QUESTION COUNTER
function queCounter(index) {
    let totalQueCounTag = '<span><p>' + index + '</p> de <p>' + questions.length + '</p> Perguntas</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;
}