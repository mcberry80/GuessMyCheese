import React, { useState } from 'react';
import './App.css';

interface Props { }

interface GameData {
  cheese: CheeseData;
  remainingTries: number;
  guessedCheeses: string[];
  easyMode: boolean;
  score: number;
  streak: number;
  lastCheeses: string[];
}
interface CheeseData {
  name: string;
  image: string;
  facts: string[];
}


const cheeseData: CheeseData[] = [
  {
    name: 'Cheddar',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Somerset-Cheddar.jpg/220px-Somerset-Cheddar.jpg',
    facts: [
      'Cheddar cheese was first made in England.',
      'Cheddar cheese can range in taste from mild to sharp, depending on its age.',
      'Cheddar cheese is one of the most popular types of cheese in the world.'
    ]
  },
  {
    name: 'Brie',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Brie_01.jpg/220px-Brie_01.jpg',
    facts: [
      'Brie cheese was named after the French region where it was first made.',
      'Brie cheese has a soft, creamy texture and a mild flavor.',
      'Brie cheese is often served with crackers and fruit.'
    ]
  },
  {
    name: 'Blue',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bleu_de_Gex.jpg/220px-Bleu_de_Gex.jpg',
    facts: [
      'Blue cheese is known for its blue or green veins, which are created by adding mold spores to the cheese.',
      'Blue cheese has a strong, pungent flavor.',
      'Blue cheese is often crumbled over salads or used as a dip for vegetables.'
    ]
  },
  {
    name: 'Gouda',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/WikiCheese_-_Gouda_36_mois_03.jpg/220px-WikiCheese_-_Gouda_36_mois_03.jpg',
    facts: [
      'Gouda cheese originated in the Netherlands.',
      'Gouda cheese has a nutty flavor and a firm, creamy texture.',
      'Gouda cheese is often used in sandwiches and melted on top of burgers.'
    ]
  },
  {
    name: 'Feta',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Feta_Cheese.jpg/250px-Feta_Cheese.jpg',
    facts: [
      'Feta cheese is a Greek cheese made from sheep or goat milk.',
      'Feta cheese has a tangy, salty flavor and a crumbly texture.',
      'Feta cheese is often used in Greek salads and on top of pizzas.'
    ]
  }
];

function getRandomCheeseData(): CheeseData {
  const randomIndex = Math.floor(Math.random() * cheeseData.length);
  return cheeseData[randomIndex];
}

function generateGameData(easyMode: boolean): GameData {
  const cheese = getRandomCheeseData();
  const guessedCheeses: string[] = [];
  const remainingTries = easyMode ? 0 : 5;
  const lastCheeses: string[] = [];

  return {
    cheese,
    guessedCheeses,
    remainingTries,
    easyMode,
    score: 0,
    streak: 0,
    lastCheeses
  };
}

const App: React.FC<Props> = () => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [guess, setGuess] = useState<string>('');
  const [easyMode, setEasyMode] = useState<boolean>(false);

  const handleNewGame = () => {
    setGameData(generateGameData(easyMode));
    setGuess('');
  };

  const handleGuessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(event.target.value);
  };

  const handleGuessSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!gameData) {
      return;
    }

    const { cheese, remainingTries, guessedCheeses, score, streak, lastCheeses } = gameData;

    if (guess.toLowerCase() === cheese.name.toLowerCase()) {
      const newScore = score + (remainingTries >= 4 ? 100 : 50);
      const newStreak = streak + 1;
      const newLastCheeses = [...lastCheeses, cheese.name];
      if (newLastCheeses.length > 10) {
        newLastCheeses.shift();
      }

      setGameData({
        cheese: generateGameData(easyMode).cheese,
        remainingTries: easyMode ? 0 : 5,
        guessedCheeses: [],
        easyMode,
        score: newScore,
        streak: newStreak,
        lastCheeses: newLastCheeses
      });
      setGuess('');
    } else {
      const newGuessedCheeses = [...guessedCheeses, guess];
      const newRemainingTries = remainingTries - 1;

      if (newRemainingTries === 0) {
        setGameData({
          cheese,
          remainingTries: easyMode ? 0 : 5,
          guessedCheeses: [],
          easyMode,
          score,
          streak: 0,
          lastCheeses
        });
        setGuess('');
      } else {
        setGameData({
          cheese,
          remainingTries: newRemainingTries,
          guessedCheeses: newGuessedCheeses,
          easyMode,
          score,
          streak,
          lastCheeses
        });
        setGuess('');
      }
    }
  };

  const handleEasyModeToggle = () => {
    setEasyMode(!easyMode);
  };

  const handleGuessButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLButtonElement;
    setGuess(button.innerText);
  };

  const renderCheeseInfo = () => {
    if (!gameData) {
      return null;
    }

    const { cheese, remainingTries, guessedCheeses, score, streak, lastCheeses } = gameData;

    return (
      <div className="cheese-info">
        <h2>{cheese.name}</h2>
        <img src={cheese.image} alt={cheese.name} />
        <ul>
          {cheese.facts.map((fact, index) => (
            <li key={index}>{fact}</li>
          ))}
        </ul>
        <p>Remaining Tries: {remainingTries}</p>
        <p>Guessed Cheeses: {guessedCheeses.join(', ') || 'None'}</p>
        <p>Score: {score}</p>
        <p>Streak: {streak}</p>
        <p>Last 10 Cheeses: {lastCheeses.join(', ') || 'None'}</p>
      </div>
    );
  };

  const renderGuessInput = () => {
    if (easyMode) {
      if (!gameData) {
        return null;
      }
      const { cheese } = gameData;

      return (
        <div className="guess-buttons">
          {cheeseData.map((cheese) => (
            <button key={cheese.name} onClick={handleGuessButtonClick}>
              {cheese.name}
            </button>
          ))}
        </div>
      );
    } else {
      return (
        <form onSubmit={handleGuessSubmit}>
          <label htmlFor="guess-input">Guess the Cheese:</label>
          <input id="guess-input" type="text" value={guess} onChange={handleGuessChange} />
          <button type="submit">Guess</button>
        </form>
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Guess My Cheese!</h1>
      </header>
      <main>
        {renderCheeseInfo()}
        {renderGuessInput()}
        <button onClick={handleNewGame}>New Game</button>
        <button onClick={handleEasyModeToggle}>{easyMode ? 'Hard Mode' : 'Easy Mode'}</button>
      </main>
    </div>
  );
};

export default App;