//set a null variable to store the data which is fetched from the api
let questionsData = [];
//hide the information and show the question when the game start
function Info() {
    const titleElement = document.querySelector('h1');
    const subtitleElement = document.querySelector('h2');
    const startButton = document.getElementById('gameStart');
    const countersDiv = document.getElementById('counters');
    startButton.addEventListener('click', function () {
        titleElement.style.display = 'none';
        subtitleElement.style.display = 'none';
        startButton.style.display = 'none';
        countersDiv.style.display = 'block';
    });
}
Info()
document.getElementById('gameStart').addEventListener('click', function () {
    document.getElementById('question-container').style.display = 'block';
    fetchData();
});
//get the token
let yourToken = '';
function getToken() {
    fetch('https://opentdb.com/api_token.php?command=request')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            yourToken = data.token;//store the token
            fetchData();
        })
        .catch(error => console.log(error));
}
//reset the token
function resetToken() {
    fetch(`https://opentdb.com/api_token.php?command=reset&token=${yourToken}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            yourToken = '';
            getToken();
        })
        .catch(error => console.log(error));
}
//fetch api get the multiple choice question
function fetchData() {
    fetch(`https://opentdb.com/api.php?amount=10&token=${yourToken}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            questionsData = data.results;
            showContent();
        })
        .catch(error => console.log(error));
}

//function to add the question number
let currentQuestionNumber = 0;
//print all the questions and options
function showContent() {
    var newQuestionData = questionsData[currentQuestionNumber];
    document.getElementById("question").innerHTML = newQuestionData.question;
    randomAnswer(newQuestionData);
}

//random the answer options with sort function which is from w3school https://www.w3schools.com/js/tryit.asp?filename=tryjs_array_sort_random
function randomAnswer(newQuestionData) {
    let answerArray = [newQuestionData.correct_answer, newQuestionData.incorrect_answers[0], newQuestionData.incorrect_answers[1], newQuestionData.incorrect_answers[2]];
    answerArray.sort(function (a, b) { return 0.5 - Math.random() });
    document.getElementById("answer1").nextSibling.textContent = answerArray[0];
    document.getElementById("answer2").nextSibling.textContent = answerArray[1];
    document.getElementById("answer3").nextSibling.textContent = answerArray[2];
    document.getElementById("answer4").nextSibling.textContent = answerArray[3];
    let radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.checked = false;
    });
}
//show the next question
function questionAdd() {
    let anyAnswerChecked = false;
    let radios = document.querySelectorAll('input[type="radio"]');
    // Check if the user has selected an answer
    radios.forEach(radio => {
        if (radio.checked) {
            anyAnswerChecked = true;
        }
    });
    // If the user has not answered the question, prevent further execution
    if (!anyAnswerChecked) {
        alert("please select an answer before moving on to the next question");
        return;
    }
    //check the answer before add the question number
    let correctAnswer = questionsData[currentQuestionNumber].correct_answer;
    //get the selected answer
    let selectedAnswer = '';
    //give the selected answer to the selectedAnswer
    radios.forEach(radio => {
        if (radio.checked) {
            selectedAnswer = radio.nextSibling.textContent;
        }
    });
    if (selectedAnswer === correctAnswer) {
        updateAnswerCount(true);
    } else {
        updateAnswerCount(false);
    }
    //if the wrong number is more than 3, the game will end
    if (checkAnswer.wrong > 2) {
        alert("You have failed the quiz!");
        endGame();
        //stop the timer when the game is over
        window.stopTimer();
        //reset the count when the game is over
        window.getCount();
        return;
    }
    currentQuestionNumber++;
    //reset the radio 
    console.log(radios);
    radios.forEach(radio => {
        radio.checked = false;
    });
    //if the question number is less than the length of the question, the game will continue
    if (currentQuestionNumber < questionsData.length) {
        showContent();
    } else {
        alert("You have finished the quiz!");
        //same logic as the wrong number is more than 3
        endGame();
        window.stopTimer();
        window.getCount();
    }
};
//creat a object to track the correct answer and wrong answer
var checkAnswer = {
    correct: 0,
    wrong: 0,
};
//update the correct and wrong count
function updateCountDisplay() {
    document.getElementById("correctCount").textContent = checkAnswer.correct;
    document.getElementById("wrongCount").textContent = checkAnswer.wrong;
};
//set total point to 0 when the game start
let totalPoint = 0;
//update the total point
function updateTotalPoint() {
    document.getElementById("point").textContent = totalPoint;
}
//according to the different difficulty to add the point
function updateAnswerCount(isCorrect) {
    if (isCorrect) {
        //add the correct number
        checkAnswer.correct++;
        let difficulty = questionsData[currentQuestionNumber].difficulty;
        let point = 0;
        if (difficulty === "easy") {
            point = 1;
        } else if (difficulty === "medium") {
            point = 2;
        } else if (difficulty === "hard") {
            point = 3;
        }
        //add the point to the total point
        totalPoint += point;

    } else {
        checkAnswer.wrong++;
    }
    updateCountDisplay();
    updateTotalPoint();
    updateBestScore();
}

//update the best score

//create a null array to store total point,it will reset when the game is over
let bestScore = [];
function updateBestScore() {
    bestScore.push(totalPoint);
    let max = Math.max(...bestScore);
    for (let i = 0; i < bestScore.length; i++) {
        if (bestScore[i] > max) {
            max = bestScore[i];
        }
    }
    document.getElementById('best').textContent = max;
    document.getElementById('best').style.display = 'block';
}
//end the game and show the initial state of the game
function endGame() {
    checkAnswer.correct = 0;
    checkAnswer.wrong = 0;
    currentQuestionNumber = 0;
    totalPoint = 0;
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('wrongCount').textContent = wrongCount;
    document.getElementById('point').textContent = totalPoint;
    const titleElement = document.querySelector('h1');
    const subtitleElement = document.querySelector('h2');
    const startButton = document.getElementById('gameStart');
    titleElement.style.display = 'block';
    subtitleElement.style.display = 'block';
    startButton.style.display = 'block';
    document.getElementById('question-container').style.display = 'none';
    updateBestScore();

}
//delete two incorrect answer with their  randomly and only can use once
let answersRemoved = false;
document.getElementById('help').addEventListener('click', function () {
    // Check if the player has already used this feature
    if (!answersRemoved) {
        // Remove two incorrect answers randomly
        let incorrectAnswers = questionsData[currentQuestionNumber].incorrect_answers;
        if (incorrectAnswers.length >= 2) {
            for (let i = 0; i < 2; i++) {
                let randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
                incorrectAnswers.splice(randomIndex, 1);
            }
            // Update the options on the interface
            let newQuestionData = questionsData[currentQuestionNumber];
            randomAnswer(newQuestionData);
            // Mark the feature as used
            answersRemoved = true;
            //hide the radio which is removed 
            let radios = document.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
                if (radio.nextElementSibling.textContent === incorrectAnswers[0] || radio.nextElementSibling.textContent === incorrectAnswers[1]) {
                    radio.style.display = 'none';
                    radio.nextElementSibling.style.display = 'none';//question:I can't hide the radio only hide the content.
                }
            });
        } else {
            alert("There are not enough incorrect answers to remove.");
        }
    } else {
        alert("You have already used this feature once in this game.");
    }
});
//event listener for the next question button
document.getElementById("nextButton").addEventListener("click", function () {
    questionAdd();
    updateCountDisplay();
});
//event listener for the finish button
document.getElementById('finishButton').addEventListener('click', function () {
    endGame()
});
(function () {
    let count = 120;
    let timerInterval;
    // function to get the current count
    let getCount = function () { return count; }

    let start = function () {
        // check if the timer is already running
        if (timerInterval) clearInterval(timerInterval);
        // start the timer
        timerInterval = setInterval(() => {
            count--;
            if (count <= 0) stop();
            document.getElementById('timerDisplay').textContent = count;
        }, 1000);
    }

    let stop = function () {
        clearInterval(timerInterval); // stop the timer
        getCount();
        count = 120; //reset the timer
        document.getElementById('timerDisplay').textContent = 120; // write the initial time to the screen
        //reset the game when the game is over or the time is to 0
        endGame();
        document.getElementById('correctCount').textContent = 0;
        document.getElementById('wrongCount').textContent = 0;
        //return initial state of the game
    }
    window.stopTimer = stop;
    window.getCount = getCount;
    // dom manipulation to write the initial time to the screen
    document.getElementById('gameStart').addEventListener('click', start);
    // same as above
    document.getElementById('finishButton').addEventListener('click', stop);
    window.onclick = function () {
        getCount();
    }
}
    ());
