import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { learningMaterialAPI, QuizQuestion } from '../services/api';

const Quiz: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (documentId) {
      fetchQuiz();
    }
  }, [documentId]);

  const fetchQuiz = async () => {
    try {
      const response = await learningMaterialAPI.getQuizzes(Number(documentId));
      if (response.data.length > 0) {
        setQuiz(response.data[0]);
        setSelectedAnswers(new Array(response.data[0].questions.length).fill(''));
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    setGenerating(true);
    try {
      const response = await learningMaterialAPI.generateQuiz(Number(documentId), 5);
      setQuiz(response.data);
      setSelectedAnswers(new Array(response.data.questions.length).fill(''));
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q: QuizQuestion, index: number) => {
      if (selectedAnswers[index] === q.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(''));
    setShowResults(false);
  };

  if (loading) {
    return <div style={loadingStyle}>Loading quiz...</div>;
  }

  if (!quiz) {
    return (
      <div style={noQuizStyle}>
        <h2>No Quiz Available</h2>
        <p>Generate a quiz from your document to start learning!</p>
        <button
          onClick={generateQuiz}
          disabled={generating}
          style={{
            ...generateButtonStyle,
            ...(generating ? disabledButtonStyle : {}),
          }}
        >
          {generating ? 'Generating Quiz...' : '✨ Generate Quiz'}
        </button>
        <br />
        <Link to={`/document/${documentId}`} style={backLinkStyle}>
          ← Back to Document
        </Link>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div style={containerStyle}>
        <div style={resultsStyle}>
          <h1>Quiz Results</h1>
          <div style={scoreStyle}>
            <div style={scoreLargeStyle}>{percentage}%</div>
            <div style={scoreDetailStyle}>
              {score} out of {quiz.questions.length} correct
            </div>
          </div>

          <div style={questionsReviewStyle}>
            {quiz.questions.map((question: QuizQuestion, index: number) => {
              const isCorrect = selectedAnswers[index] === question.correct_answer;
              return (
                <div key={index} style={questionReviewStyle}>
                  <h3 style={questionTextStyle}>
                    {index + 1}. {question.question}
                  </h3>
                  <p style={answerStyle}>
                    Your answer: {selectedAnswers[index] || 'Not answered'}{' '}
                    {isCorrect ? '✅' : '❌'}
                  </p>
                  {!isCorrect && (
                    <p style={correctAnswerStyle}>
                      Correct answer: {question.correct_answer}
                    </p>
                  )}
                  <p style={explanationStyle}>{question.explanation}</p>
                </div>
              );
            })}
          </div>

          <div style={actionsStyle}>
            <button onClick={resetQuiz} style={retryButtonStyle}>
              🔄 Try Again
            </button>
            <Link to={`/document/${documentId}`} style={backButtonStyle}>
              ← Back to Document
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div style={containerStyle}>
      <div style={quizHeaderStyle}>
        <h1>{quiz.title}</h1>
        <div style={progressStyle}>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </div>

      <div style={questionCardStyle}>
        <h2 style={questionTextStyle}>{question.question}</h2>

        <div style={optionsStyle}>
          {question.options.map((option: string, index: number) => (
            <label key={index} style={optionStyle}>
              <input
                type="radio"
                name="answer"
                value={option.charAt(0)}
                checked={selectedAnswers[currentQuestion] === option.charAt(0)}
                onChange={(e) => handleAnswerSelect(e.target.value)}
                style={radioStyle}
              />
              <span style={optionTextStyle}>{option}</span>
            </label>
          ))}
        </div>

        <div style={navigationStyle}>
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            style={{
              ...navButtonStyle,
              ...(currentQuestion === 0 ? disabledButtonStyle : {}),
            }}
          >
            ← Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={!selectedAnswers[currentQuestion]}
            style={{
              ...navButtonStyle,
              ...(selectedAnswers[currentQuestion] ? primaryButtonStyle : disabledButtonStyle),
            }}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '1rem',
};

const loadingStyle = {
  textAlign: 'center' as const,
  padding: '2rem',
  fontSize: '1.2rem',
};

const noQuizStyle = {
  textAlign: 'center' as const,
  padding: '4rem 2rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const generateButtonStyle = {
  backgroundColor: '#27ae60',
  color: 'white',
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  marginBottom: '1rem',
};

const disabledButtonStyle = {
  backgroundColor: '#bdc3c7',
  cursor: 'not-allowed',
};

const backLinkStyle = {
  color: '#3498db',
  textDecoration: 'none',
  fontSize: '1rem',
};

const quizHeaderStyle = {
  textAlign: 'center' as const,
  marginBottom: '2rem',
};

const progressStyle = {
  color: '#666',
  fontSize: '1rem',
};

const questionCardStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const questionTextStyle = {
  marginBottom: '2rem',
  color: '#2c3e50',
  lineHeight: '1.5',
};

const optionsStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '1rem',
  marginBottom: '2rem',
};

const optionStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '1rem',
  border: '2px solid #e0e0e0',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
};

const radioStyle = {
  marginRight: '1rem',
  marginTop: '0.2rem',
};

const optionTextStyle = {
  fontSize: '1rem',
  lineHeight: '1.4',
};

const navigationStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
};

const navButtonStyle = {
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  backgroundColor: '#95a5a6',
  color: 'white',
};

const primaryButtonStyle = {
  backgroundColor: '#3498db',
};

const resultsStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center' as const,
};

const scoreStyle = {
  marginBottom: '2rem',
};

const scoreLargeStyle = {
  fontSize: '4rem',
  fontWeight: 'bold',
  color: '#27ae60',
  margin: '1rem 0',
};

const scoreDetailStyle = {
  fontSize: '1.2rem',
  color: '#666',
};

const questionsReviewStyle = {
  textAlign: 'left' as const,
  marginBottom: '2rem',
};

const questionReviewStyle = {
  marginBottom: '2rem',
  padding: '1rem',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
};

const answerStyle = {
  margin: '0.5rem 0',
  fontWeight: 'bold',
};

const correctAnswerStyle = {
  margin: '0.5rem 0',
  color: '#27ae60',
  fontWeight: 'bold',
};

const explanationStyle = {
  margin: '0.5rem 0',
  color: '#666',
  fontStyle: 'italic',
};

const actionsStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  flexWrap: 'wrap' as const,
};

const retryButtonStyle = {
  backgroundColor: '#3498db',
  color: 'white',
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
};

const backButtonStyle = {
  backgroundColor: '#95a5a6',
  color: 'white',
  padding: '0.75rem 1.5rem',
  textDecoration: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
};

export default Quiz;