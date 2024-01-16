import React from "../core/React.js";
import Header from "./Header.jsx";

const App = () => {
  return (
    <div id="my-app">
      <Header title="lalala" />
      <div className="grid grid-cols-4">
        {Array.from({ length: 10000 }).map((item, index) => {
          return <div key={index}>{index}</div>;
        })}
      </div>
      <div>{null}</div>
      <div>{undefined}</div>
      <div>{123}</div>
      <div>{() => "123"}</div>
      <div>{false}</div>
      <div>{true}</div>
      <div>{[1, 2, 3, 4]}</div>
      

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
    </div>
  );
};

export default App;
