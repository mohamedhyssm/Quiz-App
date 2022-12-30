// Select Elements 
let numberOfQuestions = document.querySelector(".quiz-app .quiz-info .count span"),

  quizArea = document.querySelector(".quiz-area"),

  answers = document.querySelector(".quiz-app .answers-area .answers"),

  submitButton = document.querySelector(".quiz-app .submit-button"),

  countdownELement = document.querySelector(".quiz-app .countdown"),

  countdownELementTimer = document.querySelector(".quiz-app .countdown .timer"),

  counterSpan = document.querySelector(".quiz-app .countdown .counter span"),
  // Set Options
  currentIndex = 0,
  rightAnswarLength = 0,
  timeExam = 20 * 60

let radioChange = document.querySelector(".radio-change input")

radioChange.onclick = function () {
  document.body.classList.toggle("bg-light")
  document.body.classList.toggle("bg-dark")
  document.body.classList.toggle("text-light")
  document.body.classList.toggle("text-dark")
}

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let question = JSON.parse(this.responseText),
        qCount = question.length,
        qNumbersArray = [...Array(qCount).keys()]
      // Shuffle array to fetch a random question
      shuffle(qNumbersArray);
      // Add Question Data
      questionData(question[qNumbersArray[currentIndex]]);
      numberOfQuestions.innerHTML = qCount;
      counterSpan.innerHTML = 1;
      // Add Timer
      countdown(timeExam, qCount)
      // Click On Submit
      submitButton.onclick = () => {
        // Get Right Answer 
        let rightAnswar = question[qNumbersArray[currentIndex]].right_answer;
        // Increase Index
        currentIndex++;
        counterSpan.innerHTML = currentIndex + 1;
        if (currentIndex === qCount) {
          // Check The Answer
          checkAnswer(rightAnswar);
          // Show Results
          showResults(qCount)
        } else {
          // Check The Answer
          checkAnswer(rightAnswar);
          // Add Question Data
          questionData(question[qNumbersArray[currentIndex]])
        }
      }
    }
  };

  myRequest.open("GET", "JSON/html_questions.json", true);
  myRequest.send()
}

getQuestions();

function questionData(question) {
  // Remove Previous Querstion
  quizArea.innerHTML = "";
  answers.innerHTML = "";
  // Create Question Title
  let questionTitle = document.createElement("h2");
  questionTitle.appendChild(document.createTextNode(question[`title`]));
  quizArea.append(questionTitle)
  // Shuffle array to fetch a random answers
  let shuffleArray = [...Array(3).keys()]
  shuffle(shuffleArray)
  // The question starts with 1, not 0, so we need to increment one to all the numbers in the array Look at the JSON answers for more understanding
  let currentShuffleArray = shuffleArray.map((num) => num + 1);
  currentShuffleArray.push(4)
  // Create Question Answars
  for (let i = 0; i < 4; i++) {
    // form Check 
    let containerRadio = document.createElement("div");
    containerRadio.classList.add("form-check", "col-12", "col-md-6")
    // radio button
    let radioInput = document.createElement("input");
    radioInput.name = "question";
    radioInput.type = "radio";
    radioInput.id = `answer_${i}`;
    radioInput.role = "button";
    radioInput.dataset.answer = question[`answer_${currentShuffleArray[i]}`];
    radioInput.className = "form-check-input";
    // label
    let label = document.createElement("label");
    label.htmlFor = `answer_${i}`;
    label.appendChild(document.createTextNode(question[`answer_${currentShuffleArray[i]}`]));
    label.classList.add("form-check-label", "fw-bold")
    label.role = "button";
    // Apped Input + Label To containerRadio
    containerRadio.append(radioInput)
    containerRadio.append(label)
    answers.append(containerRadio)
  }
}

function shuffle(array) {
  let current = array.length,
    random;
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    --current;
    [array[current], array[random]] = [array[random], array[current]];
  }
}

function countdown(duration, count) {
  let minutes, seconds;
  let countdownInterval = setInterval(function () {
    minutes = parseInt(duration / 60)
    seconds = parseInt(duration % 60)
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    countdownELementTimer.innerHTML = `${minutes}:${seconds}`
    if (--duration < 0) {
      clearInterval(countdownInterval)
      showResults(count)
    }
  }, 1000)
}

function checkAnswer(rAnswar) {
  let answers = document.getElementsByName("question"),
    theChooseAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChooseAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswar === theChooseAnswer) {
    rightAnswarLength++
  }
}

function showResults(count) {
  let result;
  quizArea.remove();
  answers.remove();
  submitButton.remove();
  countdownELement.remove()
  if (rightAnswarLength > (count / 2) && rightAnswarLength < count) {
    result = `<span class = text-success>Good</span>, ${rightAnswarLength} From ${count} `
  } else if (rightAnswarLength === count) {
    result = `<span class = text-info>Perfect</span>, ${rightAnswarLength} From ${count}`
  } else {
    result = `<span class = text-danger>you need more practice</span>, ${rightAnswarLength} From ${count}`
  }
  document.querySelector(".results").innerHTML = result;
}