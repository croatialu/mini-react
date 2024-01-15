import React from "./../core/React.js";
import Header from "./Header.jsx";

const App = () => {
  return (
    <div id="my-app">
      <Header title="lalala" />
      <div className="grid grid-cols-4">
        {Array.from({ length: 12 }).map((item, index) => {
          return <div key={index}>{index}</div>;
        })}
      </div>
      <div>{null}</div>
      <div>{undefined}</div>
      <div>{123}</div>
      <div>{() => '123'}</div>
      <div>{false}</div>
      <div>{true}</div>
      <div>{[1,2,3,4]}</div>
    </div>
  );
};

export default App;
