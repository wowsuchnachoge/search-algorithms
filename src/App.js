import './App.css';
import AStar from './AStar';
import Graph from './Graph';

function App() {
  let searchAlgo = new AStar(null, null, 60, 150);
  searchAlgo.randomizeWalls();
  return (
    <div className="App">
      <header>
        <h1>Search Algorithms</h1>
      </header>
      <div className='action-menu'>
      </div>
      <div className='graph-container'>
        <Graph searchAlgo={searchAlgo} rows={searchAlgo.rows} cols={searchAlgo.cols} />
      </div>
    </div>
  );
}

export default App;
