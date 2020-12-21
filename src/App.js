import logo from './logo.svg';
import './App.css';

import Board from './components/board';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Board rows={40} cols={40} size="20px" interval={500}/>
      </header>
    </div>
  );
}

export default App;
