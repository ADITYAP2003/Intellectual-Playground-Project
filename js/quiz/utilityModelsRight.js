function checkAnswers() {
  let correctAnswers = 0;

  const answers = {
    q1: "b",
    q2: "false",
    q3: "b",
    q4: "b",
    q5: "c",
  };

  for (let i = 1; i <= 5; i++) {
    const userAnswer = document.querySelector(`input[name="q${i}"]:checked`);

    if (userAnswer && userAnswer.value === answers[`q${i}`]) {
      correctAnswers++;
    }
  }

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `You scored ${correctAnswers}/5 correct answers!`;

  document.getElementById("quiz-form").reset();
}
