// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'
import { useLocalStorageState } from '../utils.js';

function Board({squares, onClick}) {
  
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <>
      <div className="game-board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
    </>
  )
}

const newGameSquares = [Array(9).fill(null)];
function Game() {
  const [currentStep, setCurrentStep] = useLocalStorageState('step', 0);
  const [historySquares, setHistorySquares] = useLocalStorageState('history', newGameSquares);
  
  const currentSquares = historySquares[currentStep];
  let nextValue = calculateNextValue(currentSquares);
  let winner = calculateWinner(currentSquares);
  let status = calculateStatus(winner, currentSquares, nextValue);
  
  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (winner || currentSquares[square]) {
      return;
    }

    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    const squaresCopy = [...currentSquares];
    squaresCopy[square] = nextValue;
    
    let historySquaresCopy = [...historySquares];
    historySquaresCopy = historySquaresCopy.slice(0, currentStep + 1);
    historySquaresCopy.push(squaresCopy);
    setHistorySquares(historySquaresCopy);

    setCurrentStep(currentStep + 1);
  }
  
  function restart() {
    setHistorySquares(newGameSquares);
    setCurrentStep(0);
  }
  
  function selectHistory(pointInTimeMove) {
    setCurrentStep(pointInTimeMove);
  }
  
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} onClick={selectSquare}/>
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>{
          historySquares.map((history, step) => {
            const isCurrent = step === currentStep;
            let text = (step === 0) ? 'Go to game start' : 'Go to move #' + step;
            if (isCurrent) {
              text += ' (current)';
            }

            return <li key={step}>
              <button disabled={isCurrent} onClick={() => selectHistory(step)}>{text}</button>
            </li>;
          })
        }</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
