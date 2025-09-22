// QUIZ DATA (Questions)
const quizData = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "High Tech Markup Language",
      "Hyperlink and Text Making Language"
    ],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "Which language runs in the browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: "JavaScript"
  },
  {
    question: "Which tag is used to include an external CSS file?",
    options: ["<style>", "<link>", "<script>", "<meta>"],
    answer: "<link>"
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style Sheets",
      "Colorful Style Sheets"
    ],
    answer: "Cascading Style Sheets"
  },
  {
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<a>", "<p>", "<link>", "<h1>"],
    answer: "<a>"
  },
  {
    question: "Which property is used in CSS to change text color?",
    options: ["font-style", "text-color", "color", "background-color"],
    answer: "color"
  },
  {
    question: "Inside which HTML element do we put JavaScript code?",
    options: ["<script>", "<javascript>", "<code>", "<js>"],
    answer: "<script>"
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["//", "/* */", "<!-- -->", "#"],
    answer: "//"
  },
  {
    question: "Which HTML attribute is used to display an image?",
    options: ["src", "href", "alt", "title"],
    answer: "src"
  },
  {
    question: "Which method is used to select an element by ID in JavaScript?",
    options: [
      "getElementById()",
      "querySelectorAll()",
      "getElementsByClassName()",
      "getTagName()"
    ],
    answer: "getElementById()"
  },
  {
    question: "Which CSS property controls the size of text?",
    options: ["font-size", "text-size", "font-weight", "size"],
    answer: "font-size"
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Google", "Netscape", "Microsoft", "Apple"],
    answer: "Netscape"
  },
  {
    question: "Which HTML element is used for the largest heading?",
    options: ["<h1>", "<h6>", "<heading>", "<head>"],
    answer: "<h1>"
  },
  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    options: ["var", "let", "const", "All of the above"],
    answer: "All of the above"
  },
  {
    question: "Which CSS property is used to change the background color?",
    options: ["color", "background-color", "bgcolor", "background"],
    answer: "background-color"
  }
];


// HTML ELEMENTS
const formContainer = document.getElementById("form-container");
const form = document.getElementById("user-form");
const quizContainer = document.getElementById("quiz-container");

const correctBox = document.getElementById("correct");
const wrongBox = document.getElementById("wrong");
const timerBox = document.getElementById("timer");

const progressBar = document.getElementById("progressBar");

const questionBox = document.getElementById("questionBox");

const optionsBox = document.getElementById("optionsBox");

const totalBox = document.getElementById("total");
const qNumberBox = document.getElementById("qNumber");

const startBtn = document.querySelector("#startbtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

// VARIABLES (Game State)
let currentQuestion = 0;   // which question we are on
let timer;                 // timer interval
let timeLeft = 15;         // time per question
let correct = 0;
let wrong = 0;

// show one question on the screen
function showQuestion() {
  // reset things for new question
  clearInterval(timer);
  timeLeft = 15;
  timerBox.innerText = timeLeft;
  //get question from data
  const question = quizData[currentQuestion].question;
  qNumberBox.innerText = currentQuestion + 1;
  totalBox.innerText = quizData.length;
  questionBox.innerText = question;
  // updating progress bar before updating next question
  const progressBarPercent = Math.floor((currentQuestion / quizData.length) * 100);
  progressBar.style.width = progressBarPercent + "%";
  // adding options for the questions
  addOptions();
  // disabled next btn till the user not select the answer
  nextBtn.disabled = true;
  // start timer
  startTimer();
}

//add options one by one
function addOptions() {
  const answer = quizData[currentQuestion].answer;
  optionsBox.innerHTML = "";
  quizData[currentQuestion].options.forEach((opt) => {
    let btn = document.createElement("button");
    btn.className = "list-group-item list-group-item-action option-btn";
    btn.innerText = opt;
    optionsBox.appendChild(btn);
    btn.addEventListener("click", () => {
      checkAnswer(btn, opt, answer);
    });
  });
}

// check if selected answer is correct or wrong
function checkAnswer(selectedBtn, selectedBtnAnswer, correctAnswer) {
  stopTimer();
  let optionButtons = optionsBox.querySelectorAll("button");
  if (selectedBtnAnswer === correctAnswer) {
    selectedBtn.classList.add("list-group-item-success");
    correct++;
    correctBox.innerText = correct;
  } else {
    selectedBtn.classList.add("list-group-item-danger");
    wrong++;
    wrongBox.innerText = wrong;
    optionButtons.forEach(b => {
      if (b.innerText === correctAnswer) {
        b.classList.add("list-group-item-success");
      }
    });
  }
  // disable all options
  optionButtons.forEach(b => b.disabled = true);
  // enable Next button
  nextBtn.disabled = false;
}

// Start the countdown timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerBox.innerText = timeLeft;
    if (timeLeft <= 0) {
      stopTimer();
      // time ran out → show correct answer
      const correctAnswer = quizData[currentQuestion].answer;
      const optionButtons = optionsBox.querySelectorAll("button");
      optionButtons.forEach(b => {
        if (b.innerText === correctAnswer) {
          b.classList.add("list-group-item-success");
        }
        b.disabled = true;
      });
      nextBtn.disabled = false;
    }
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timer);
}

// move to next question
nextBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    endGame();
  }
});

// End of quiz
function endGame() {
  stopTimer();
  questionBox.innerText = `🎉 Game Over! You scored ${correct} / ${quizData.length}`;
  optionsBox.innerHTML = "";
  nextBtn.style.display = "none";
  restartBtn.classList.remove("d-none");
  progressBar.style.width = "100%";
}

// Restart Quiz
restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  correctBox.innerText = 0;
  wrongBox.innerText = 0;
  nextBtn.style.display = "inline-block";
  restartBtn.classList.add("d-none");
  formContainer.style.display = "block";
  quizContainer.style.display = "none";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.target['name'].value = "";
  e.target['email'].value = "";
  formContainer.style.display = "none";
  quizContainer.style.display = "block";
});

startBtn.addEventListener("click", () => {
  showQuestion();
})