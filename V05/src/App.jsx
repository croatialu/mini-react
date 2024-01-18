import React from "../core/React.js";
import ReactDOM from "../core/ReactDOM.js";
import Header from "./Header.jsx";

let count = 0;
const App = () => {
  return (
    <div id="my-app">
      <Header title="lalala" />

      <div>{null}</div>
      <div>{undefined}</div>
      <div>{123}</div>
      <div>{() => "123"}</div>
      <div>{false}</div>
      <div>{true}</div>
      <div>{[1, 2, 3, 4]}</div>
      <div>
        <span>{count}</span>
        <button
          id={`a-${count}`}
          onClick={() => {
            console.log("2333");
            count++;
            ReactDOM.update();
          }}
        >
          Update
        </button>
      </div>

      <div>
        <span>List 1</span>
        <div>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
          <div>Item 4</div>
        </div>
      </div>

      <div>
        <span>List 2</span>
        <div>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
          <div>Item 4</div>
        </div>
      </div>

      <div className="grid grid-cols-4">
        {Array.from({ length: 10 }).map((item, index) => {
          return <div key={index}>{index}</div>;
        })}
      </div>
    </div>
  );
};

export default App;
