import React, { useState } from 'react';
import CardDeck from './components/CardDeck';
import './components/GameApp.css';

const games = ['Sing', 'Dance', 'Team Game'];
const names = ['Naved', 'Faiz', 'Afzal', 'Yaseen', 'Saif', 'Samadhan'];
const durations = ['1', '2', '3', '4', '5'];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function splitTeams(namesArr) {
  const shuffled = [...namesArr].sort(() => 0.5 - Math.random());
  return {
    team1: shuffled.slice(0, 3),
    team2: shuffled.slice(3, 6),
  };
}

export default function GameApp() {
  const [game, setGame] = useState('');
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [revealed, setRevealed] = useState({ game: false, name: false, duration: false });
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Filter state
  const [filterGame, setFilterGame] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterDuration, setFilterDuration] = useState('');

  const handleShuffle = () => {
    setRevealed({ game: false, name: false, duration: false });
    setStep(0);

    setTimeout(() => {
      const selectedGame = getRandom(games);
      setGame(selectedGame);

      if (selectedGame === 'Sing' || selectedGame === 'Dance') {
        setName(getRandom(names));
        setDuration(getRandom(['1', '2', '3']));
      } else {
        setName(splitTeams(names));
        setDuration(getRandom(['4', '5']));
      }

      setStep(1);
    }, 700);
  };

  const handleReveal = (deck) => {
    setRevealed((prev) => ({ ...prev, [deck]: true }));
    const next = step + 1;
    setStep(next);
    if (next === 4) {
      setHistory((prev) => [
        { game, name, duration, timestamp: Date.now() },
        ...prev,
      ]);
    }
  };

  const renderNameText = () => {
    if (!revealed.name) return '';
    if (typeof name === 'string') return name;
    return (
      <>
        <div><strong>Team 1:</strong> {name.team1.join(', ')}</div>
        <div><strong>Team 2:</strong> {name.team2.join(', ')}</div>
      </>
    );
  };

  const filterHistory = history.filter((entry) => {
    const matchGame = !filterGame || entry.game === filterGame;
    const matchDuration = !filterDuration || entry.duration === filterDuration;

    let matchName = true;
    if (filterName) {
      if (typeof entry.name === 'string') {
        matchName = entry.name.toLowerCase().includes(filterName.toLowerCase());
      } else {
        const combined = [...entry.name.team1, ...entry.name.team2].join(', ').toLowerCase();
        matchName = combined.includes(filterName.toLowerCase());
      }
    }

    return matchGame && matchName && matchDuration;
  });

  return (
    <div className="game-app-container">
      {/* History Panel */}
      <div className={`history-panel ${showHistory ? 'open' : ''}`}>
        <button className="history-toggle" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? 'Hide History' : 'Show History'}
        </button>

        {showHistory && (
          <>
            <div className="history-filters">
              <select value={filterGame} onChange={(e) => setFilterGame(e.target.value)}>
                <option value="">All Games</option>
                {games.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
              <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)}>
                <option value="">All Durations</option>
                {durations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="history-list">
              {filterHistory.length === 0 ? (
                <div>No matching combinations found.</div>
              ) : (
                filterHistory.map((entry, index) => (
                  <div key={index} className="history-item">
                    <div><strong>{entry.game}</strong></div>
                    <div>
                      {typeof entry.name === 'string' ? (
                        entry.name
                      ) : (
                        <>
                          <div><strong>Team 1:</strong> {entry.name.team1.join(', ')}</div>
                          <div><strong>Team 2:</strong> {entry.name.team2.join(', ')}</div>
                        </>
                      )}
                    </div>
                    <div><strong>Duration:</strong> {entry.duration}</div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <h1>Cards</h1>
      <button onClick={handleShuffle}>Shuffle Decks</button>

      <div className="decks-wrapper">
        <CardDeck
          title="Game"
          text={game}
          revealed={revealed.game}
          onClick={() => step === 1 && !revealed.game && handleReveal('game')}
          disabled={step !== 1}
        />
        <CardDeck
          title="Name"
          text={renderNameText()}
          revealed={revealed.name}
          onClick={() => step === 2 && !revealed.name && handleReveal('name')}
          disabled={step !== 2}
        />
        <CardDeck
          title="Duration"
          text={duration}
          revealed={revealed.duration}
          onClick={() => step === 3 && !revealed.duration && handleReveal('duration')}
          disabled={step !== 3}
        />
      </div>

      {step === 4 && (
        <div className="result">
          <h2>Selected Combination:</h2>
          <p>
            Game: <strong>{game}</strong><br />
            Player(s): <strong>
              {typeof name === 'string'
                ? name
                : <>
                    <div>Team 1: {name.team1.join(', ')}</div>
                    <div>Team 2: {name.team2.join(', ')}</div>
                  </>
              }
            </strong><br />
            Duration: <strong>{duration}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
