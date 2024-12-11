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

// Agregar el elemento de audio dinámicamente
const backgroundMusic = new Audio('music.MP3'); // Ruta de la música
backgroundMusic.loop = true; // Configurar para que la música se repita
backgroundMusic.volume = 0.2; // Ajustar volumen (opcional)

// Iniciar el quiz y reproducir la música
start_btn.onclick = () => {
    info_box.classList.add("activeInfo");
    backgroundMusic.play(); // Reproducir la música cuando se inicia el quiz
}

exit_btn.onclick = () => { 
    window.location.href = "index.html"; // Redirige a la página principal desde info_box
}

continue_btn.onclick = () => { 
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuestions(0);
    queCounter(1);
    startTimer(15);
    startTimerLine(0);
}

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

restart_quiz.onclick = () => { 
    quiz_box.classList.add("activeQuiz");
    result_box.classList.remove("activeResult");
    timeValue = 15;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuestions(que_count);
    queCounter(que_numb);
    clearInterval(counter);
    clearInterval(counterLine);
    startTimer(timeValue);
    startTimerLine(widthValue);
    timeText.textContent = "Tempo";
    next_btn.classList.remove("show");
}

quit_quiz.onclick = () => { 
    window.location.href = "index.html"; // Redirige a la página principal desde result_box
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

next_btn.onclick = () => {
    if(que_count < questions.length - 1){
        que_count++;
        que_numb++;
        showQuestions(que_count);
        queCounter(que_numb);
        clearInterval(counter);
        clearInterval(counterLine);
        startTimer(timeValue);
        startTimerLine(widthValue);
        timeText.textContent = "Tempo";
        next_btn.classList.remove("show");
    } else {
        clearInterval(counter);
        clearInterval(counterLine);
        showResult();
    }
}

function showQuestions(index) {
    const que_text = document.querySelector(".que_text");

    let que_tag = '<span>' + questions[index].numb + ". " + questions[index].question + '</span>';
    let option_tag = '<div class="option"><span>' + questions[index].options[0] + '</span></div>'
                     + '<div class="option"><span>' + questions[index].options[1] + '</span></div>'
                     + '<div class="option"><span>' + questions[index].options[2] + '</span></div>'
                     + '<div class="option"><span>' + questions[index].options[3] + '</span></div>';

    que_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;

    const option = option_list.querySelectorAll(".option");

    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function optionSelected(answer) {
    clearInterval(counter); // Limpiar el contador
    clearInterval(counterLine); // Limpiar el contador de la línea de tiempo
    let userAns = answer.textContent; // Obtener la opción seleccionada por el usuario
    let correcAns = questions[que_count].answer; // Obtener la respuesta correcta
    const allOptions = option_list.children.length; // Obtener todas las opciones
    
    if (userAns == correcAns) { // Si la opción seleccionada es correcta
        userScore += 1; // Aumentar el puntaje
        answer.classList.add("correct"); // Agregar color verde a la opción correcta
        answer.insertAdjacentHTML("beforeend", tickIconTag); // Agregar ícono de verificación
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);
    } else {
        answer.classList.add("incorrect"); // Agregar color rojo a la opción incorrecta
        answer.insertAdjacentHTML("beforeend", crossIconTag); // Agregar ícono de cruz
        console.log("Wrong Answer");

        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correcAns) {
                option_list.children[i].setAttribute("class", "option correct");
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                console.log("Auto selected correct answer.");
            }
        }
    }

    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
    }
    next_btn.classList.add("show");
}

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

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }
        if (time < 0) {
            clearInterval(counter);
            timeText.textContent = "Fim";
            const allOptions = option_list.children.length;
            let correcAns = questions[que_count].answer;
            for (let i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent == correcAns) {
                    option_list.children[i].setAttribute("class", "option correct");
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                    console.log("Fim: Auto selected correct answer.");
                }
            }
            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled");
            }
            next_btn.classList.add("show");
        }
    }
}

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

function queCounter(index) {
    let totalQueCounTag = '<span><p>' + index + '</p> de <p>' + questions.length + '</p>Perguntas</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;
}
