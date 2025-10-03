import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { learningMaterialAPI, Flashcard } from '../services/api';

const FlashcardsPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (documentId) {
      fetchFlashcards();
    }
  }, [documentId]);

  const fetchFlashcards = async () => {
    try {
      const response = await learningMaterialAPI.getFlashcards(Number(documentId));
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateFlashcards = async () => {
    setGenerating(true);
    try {
      const response = await learningMaterialAPI.generateFlashcards(Number(documentId), 10);
      setFlashcards(response.data.flashcards);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('Failed to generate flashcards. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const flipCard = () => {
    setShowBack(!showBack);
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowBack(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowBack(false);
    }
  };

  const markDifficulty = async (difficulty: number) => {
    try {
      await learningMaterialAPI.reviewFlashcard(flashcards[currentCard].id, difficulty);
      nextCard();
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  if (loading) {
    return <div style={loadingStyle}>Loading flashcards...</div>;
  }

  if (flashcards.length === 0) {
    return (
      <div style={noFlashcardsStyle}>
        <h2>No Flashcards Available</h2>
        <p>Generate flashcards from your document to start studying!</p>
        <button
          onClick={generateFlashcards}
          disabled={generating}
          style={{
            ...generateButtonStyle,
            ...(generating ? disabledButtonStyle : {}),
          }}
        >
          {generating ? 'Generating Flashcards...' : '🃏 Generate Flashcards'}
        </button>
        <br />
        <Link to={`/document/${documentId}`} style={backLinkStyle}>
          ← Back to Document
        </Link>
      </div>
    );
  }

  const card = flashcards[currentCard];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Flashcards</h1>
        <div style={progressStyle}>
          Card {currentCard + 1} of {flashcards.length}
        </div>
      </div>

      <div style={flashcardContainerStyle}>
        <div
          style={{
            ...flashcardStyle,
            ...(showBack ? flashcardBackStyle : flashcardFrontStyle),
          }}
          onClick={flipCard}
        >
          <div style={cardContentStyle}>
            {showBack ? (
              <>
                <div style={cardLabelStyle}>Answer</div>
                <div style={cardTextStyle}>{card.back}</div>
              </>
            ) : (
              <>
                <div style={cardLabelStyle}>Question</div>
                <div style={cardTextStyle}>{card.front}</div>
              </>
            )}
          </div>

          <div style={flipHintStyle}>
            {showBack ? '💡 Click to see question' : '🔄 Click to reveal answer'}
          </div>
        </div>
      </div>

      {showBack && (
        <div style={difficultyStyle}>
          <p style={difficultyLabelStyle}>How well did you know this?</p>
          <div style={difficultyButtonsStyle}>
            <button
              onClick={() => markDifficulty(2)}
              style={{ ...difficultyButtonStyle, backgroundColor: '#e74c3c' }}
            >
              😰 Hard
            </button>
            <button
              onClick={() => markDifficulty(1)}
              style={{ ...difficultyButtonStyle, backgroundColor: '#f39c12' }}
            >
              🤔 Normal
            </button>
            <button
              onClick={() => markDifficulty(0)}
              style={{ ...difficultyButtonStyle, backgroundColor: '#27ae60' }}
            >
              😄 Easy
            </button>
          </div>
        </div>
      )}

      <div style={navigationStyle}>
        <button
          onClick={prevCard}
          disabled={currentCard === 0}
          style={{
            ...navButtonStyle,
            ...(currentCard === 0 ? disabledButtonStyle : {}),
          }}
        >
          ← Previous
        </button>

        <Link to={`/document/${documentId}`} style={backButtonStyle}>
          Back to Document
        </Link>

        <button
          onClick={nextCard}
          disabled={currentCard === flashcards.length - 1}
          style={{
            ...navButtonStyle,
            ...(currentCard === flashcards.length - 1 ? disabledButtonStyle : {}),
          }}
        >
          Next →
        </button>
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

const noFlashcardsStyle = {
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

const headerStyle = {
  textAlign: 'center' as const,
  marginBottom: '2rem',
};

const progressStyle = {
  color: '#666',
  fontSize: '1rem',
  marginTop: '0.5rem',
};

const flashcardContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem',
};

const flashcardStyle = {
  width: '400px',
  height: '300px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-between',
  padding: '2rem',
  transition: 'transform 0.2s, box-shadow 0.2s',
  userSelect: 'none' as const,
};

const flashcardFrontStyle = {
  borderLeft: '4px solid #3498db',
};

const flashcardBackStyle = {
  borderLeft: '4px solid #27ae60',
};

const cardContentStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
};

const cardLabelStyle = {
  fontSize: '0.9rem',
  fontWeight: 'bold',
  color: '#666',
  marginBottom: '1rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const cardTextStyle = {
  fontSize: '1.2rem',
  lineHeight: '1.5',
  color: '#2c3e50',
  textAlign: 'center' as const,
};

const flipHintStyle = {
  fontSize: '0.8rem',
  color: '#999',
  textAlign: 'center' as const,
  marginTop: '1rem',
};

const difficultyStyle = {
  textAlign: 'center' as const,
  marginBottom: '2rem',
};

const difficultyLabelStyle = {
  fontSize: '1.1rem',
  marginBottom: '1rem',
  color: '#2c3e50',
};

const difficultyButtonsStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  flexWrap: 'wrap' as const,
};

const difficultyButtonStyle = {
  color: 'white',
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  minWidth: '100px',
};

const navigationStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap' as const,
};

const navButtonStyle = {
  backgroundColor: '#95a5a6',
  color: 'white',
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
};

const backButtonStyle = {
  backgroundColor: '#3498db',
  color: 'white',
  padding: '0.75rem 1.5rem',
  textDecoration: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
};

export default FlashcardsPage;