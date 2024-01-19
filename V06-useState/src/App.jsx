import React from "../core/React.js";
import ReactDOM from "../core/ReactDOM.js";
import Header from "./Header.jsx";

const App = () => {
  const [count, setCount] = React.useState(0);
  const [str, setStr] = React.useState('bar')
  return (
    <div id="my-app">
      <Header title="lalala" />

      <div>
        <div>{count}</div>
        <div>{str}</div>
        <button
          id={`a-${count}`}
          onClick={() => {
            setCount((v) => v + 1);
            setStr(v => v + 'bar')
          }}
        >
          App:Update: {Date.now()}
        </button>
      </div>
    </div>
  );
};

export default App;
