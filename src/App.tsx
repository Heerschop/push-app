import { useState } from 'react';
import './App.css';
import { version } from '../package.json';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Push Test</h1>
      <h4>{version}</h4>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
