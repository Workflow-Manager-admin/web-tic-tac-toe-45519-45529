import React, { useState, useEffect } from 'react';
import './App.css';

// Game settings
const PLAYER_1 = 'X';
const PLAYER_2 = 'O';

// PUBLIC_INTERFACE
function App() {
  // State setup
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [tie, setTie] = useState(false);

  // Detect winner or tie upon board changes
  useEffect(() => {
    const foundWinner = calculateWinner(board);
    if (foundWinner) {
      setWinner(foundWinner);
      setScores(prev =>
        foundWinner === PLAYER_1
          ? { ...prev, X: prev.X + 1 }
          : { ...prev, O: prev.O + 1 }
      );
      setTie(false);
    } else if (board.every(cell => cell !== null)) {
      setWinner(null);
      setTie(true);
    } else {
      setWinner(null);
      setTie(false);
    }
  }, [board]);

  // Restart the game
  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsXNext(true);
    setTie(false);
  }

  // Handle player move
  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    if (board[idx] || winner || tie) return;
    const newBoard = board.slice();
    newBoard[idx] = isXNext ? PLAYER_1 : PLAYER_2;
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }

  // Returns current player symbol
  // PUBLIC_INTERFACE
  function getCurrentPlayer() {
    return isXNext ? PLAYER_1 : PLAYER_2;
  }

  // Render routines
  return (
    <div className="app-bg">
      <div className="ttt-container">
        <ScoreBoard scores={scores} />
        <PlayerIndicator
          current={getCurrentPlayer()}
          winner={winner}
          tie={tie}
        />
        <Board
          board={board}
          onCellClick={handleCellClick}
          isDisabled={Boolean(winner) || tie}
        />
        <GameStatus
          winner={winner}
          tie={tie}
          currentPlayer={getCurrentPlayer()}
        />
        <button className="restart-btn" onClick={handleRestart} aria-label="Restart game">
          Restart Game
        </button>
      </div>
    </div>
  );
}

// Winning logic
// PUBLIC_INTERFACE
function calculateWinner(cells) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      cells[a] &&
      cells[a] === cells[b] &&
      cells[a] === cells[c]
    ) {
      return cells[a];
    }
  }
  return null;
}

// Scoreboard component
function ScoreBoard({ scores }) {
  return (
    <div className="scoreboard">
      <div className="score--x">
        <span className="score-label">X</span>
        <span className="score-value">{scores.X}</span>
      </div>
      <div className="score--o">
        <span className="score-label">O</span>
        <span className="score-value">{scores.O}</span>
      </div>
    </div>
  );
}

// Player indicator
function PlayerIndicator({ current, winner, tie }) {
  return (
    <div className="player-indicator">
      {winner ? (
        <span>
          <span className={winner === 'X' ? 'player-x' : 'player-o'}>
            {winner}
          </span>
          {' '}
          wins!
        </span>
      ) : tie ? (
        <span className="tie">It's a tie!</span>
      ) : (
        <span>
          Next:{" "}
          <span className={current === 'X' ? 'player-x' : 'player-o'}>{current}</span>
        </span>
      )}
    </div>
  );
}

// Board/table
function Board({ board, onCellClick, isDisabled }) {
  return (
    <div className="ttt-board">
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          onClick={() => onCellClick(idx)}
          disabled={isDisabled || cell}
        />
      ))}
    </div>
  );
}

// Public interface: Game status message
function GameStatus({ winner, tie, currentPlayer }) {
  if (winner) {
    return (
      <div className="game-status" aria-live="polite">
        Winner: <span className={winner === 'X' ? 'player-x' : 'player-o'}>{winner}</span>
      </div>
    );
  } else if (tie) {
    return (
      <div className="game-status tie" aria-live="polite">
        It's a tie!
      </div>
    );
  }
  return (
    <div className="game-status" aria-live="polite">
      Turn: <span className={currentPlayer === 'X' ? 'player-x' : 'player-o'}>{currentPlayer}</span>
    </div>
  );
}

// Cell/square
function Cell({ value, onClick, disabled }) {
  return (
    <button
      className={"ttt-cell" + (value === 'X' ? " x" : value === 'O' ? " o" : "")}
      onClick={onClick}
      aria-label={value ? `Cell ${value}` : 'Empty cell'}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

export default App;
