import React from 'react';
import './App.css';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      currentSquare: '22-17',
      direction: 'right',
      speed: 100,
      activeSquares: [[22, 17]],
      snakeLength: 0,
      foodSquare: [],
      score: 0,
      message: 'Press Start'
    }
  }

  componentDidMount() {
    this.setGrid();
  }

  setGrid() {
    const rows = [];
    for (let i = 0; i < 50; i++) {
      const row = []
      for (let j = 0; j < 35; j++) {
        this[`squareRef${i}-${j}`] = React.createRef();
        row.push(<span key={j} ref={this[`squareRef${i}-${j}`]} className={`grid-square`}></span>)
      }
      rows.push(<div id={i} className={`row`} key={i}>{row}</div>)
    }
    const that = this;
    this.setState({
      rows,
      currentRow: 22,
      currentSquare: 17
    }, function() {
      that[`squareRef${22}-${17}`].current.style.backgroundColor = 'red';
    })
  }

  startGame() {
    const { speed } = this.state;
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft') {
        this.nextSquare('left')
      }
      if (e.code === 'ArrowRight') {
        this.nextSquare('right')
      }
      if (e.code === 'ArrowUp') {
        this.nextSquare('up')
      }
      if (e.code === 'ArrowDown') {
        this.nextSquare('down')
      }
    })
    let that = this;
    this.movement = setInterval(function() {
      const { direction, snakeLength } = that.state;
      that.nextSquare(direction);
      that.setState({
        snakeLength: snakeLength +1
      })
    }, speed);
    this.addFood();
    this.setState({
      message: 'GO!!!!'
    })
  }

  nextSquare(direction) {
    const { currentRow, currentSquare, activeSquares, snakeLength, foodSquare, score, speed } = this.state;
    const losingSquares  = [0, 34];
    const losingRow = [0, 49];
    const active = [...activeSquares];
    if (!direction) direction = this.state.direction;
    let levelUp = false;
    if (foodSquare[0] === currentRow && foodSquare[1] === currentSquare) {
      levelUp = true;
      this.setState({
        score: score + 1
      })
      this.addFood();
    }

    if (losingRow.includes(currentRow) || losingSquares.includes(currentSquare)) {
      clearInterval(this.movement);
      this.setGrid();
      this.setState({
        message: 'Game Over'
      })
    } else {
      if (direction === 'left') {
        this[`squareRef${currentRow}-${currentSquare -1}`].current.style.backgroundColor = 'red';
        active.unshift([currentRow, currentSquare -1]);
        this.setState({
          currentRow: currentRow,
          currentSquare: currentSquare -1
        })
      }
      if (direction === 'right') {
        this[`squareRef${currentRow}-${currentSquare +1}`].current.style.backgroundColor = 'red';
        active.unshift([currentRow, currentSquare +1]);
        this.setState({
          currentRow: currentRow,
          currentSquare: currentSquare +1
        })
      }
      if (direction === 'up') {
        this[`squareRef${currentRow -1}-${currentSquare}`].current.style.backgroundColor = 'red';
        active.unshift([currentRow -1, currentSquare]);
        this.setState({
          currentRow: currentRow -1,
          currentSquare: currentSquare
        })
      }
      if (direction === 'down') {
        this[`squareRef${currentRow +1}-${currentSquare}`].current.style.backgroundColor = 'red';
        active.unshift([currentRow +1, currentSquare]);
        this.setState({
          currentRow: currentRow +1,
          currentSquare: currentSquare
        })
      }
      if (snakeLength > 4) {
        this[`squareRef${active[active.length -1][0]}-${active[active.length -1][1]}`].current.style.backgroundColor = 'white';
        if (!levelUp) {
          active.pop();
        }
        levelUp = false
      }
      this.setState({
        direction,
        activeSquares: active
      })
    }
  }

  addFood() {
    const row = Math.floor((Math.random() * 48) + 1);
    const square = Math.floor((Math.random() * 33) + 1);
    this[`squareRef${row}-${square}`].current.style.backgroundColor = 'green';
    this.setState({
      foodSquare: [row, square]
    })
  }

  render() {
    const { rows, score, message } = this.state;
    return (
      <div className="App">
        <div>{message}</div>
        <div>{score}</div>
        <div className="game-container">
          {rows}
        </div>
        <button onClick={() => this.startGame()}>start</button>
      </div>
    );
  }
}

export default App;
