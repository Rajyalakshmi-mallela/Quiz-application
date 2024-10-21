document.addEventListener('DOMContentLoaded', function() {
  let questions = [];
  let currentQuestion = 0;
  let score = 0;
  let showScore = false;
  let loading = true;
  
  const app = document.getElementById('app');

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      questions = data.results;
      loading = false;
      renderQuiz();
    } catch (error) {
      console.error('Error fetching the questions:', error);
    }
  };

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      score++;
    }
    
    currentQuestion++;

    if (currentQuestion < questions.length) {
      renderQuiz();
    } else {
      showScore = true;
      renderScore();
    }
  };

  const renderQuiz = () => {
    if (loading) {
      app.innerHTML = '<h1>Loading...</h1>';
      return;
    }

    app.innerHTML = `
      <div class="app">
        <div class="question-section">
          <div class="question-count">
            <span>Question ${currentQuestion + 1}</span>/${questions.length}
          </div>
          <div class="question-text">
            ${questions[currentQuestion].question}
          </div>
        </div>
        <div class="answer-section"></div>
      </div>
    `;

    const answerSection = document.querySelector('.answer-section');
    const answers = [...questions[currentQuestion].incorrect_answers, questions[currentQuestion].correct_answer]
      .sort(() => Math.random() - 0.5);

    answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.textContent = answer;
      button.addEventListener('click', () => handleAnswerOptionClick(answer === questions[currentQuestion].correct_answer));
      answerSection.appendChild(button);
    });
  };

  const renderScore = () => {
    app.innerHTML = `<div class="app"><div class="score-section">You scored ${score} out of ${questions.length}</div></div>`;
  };

  fetchQuestions();
});
