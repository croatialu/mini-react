import React from "../core/React.js";
import ReactDOM from "../core/ReactDOM.js";
import Header from "./Header.jsx";

let count = 0;
let isShow = true;

const Foo = () => {
  console.log("foo");
  const update = React.update()

  return <div>
    Foo

    <button onClick={update}>
      Foo:update: {Date.now()}
    </button>

  </div>;
};

const Bar = () => {
  console.log("bar");
  const update = React.update()

  return <p>Bar

    <button onClick={update}>
      Bar:update: {Date.now()}
    </button>
  </p>;
};

const App = () => {
  const update = React.update()
  return (
    <div id="my-app">
      <Header title="lalala" />
 
      <div>
        <span>{count}</span>
        <button
          id={`a-${count}`}
          onClick={() => {
            console.log("2333");
            count++;
            isShow = !isShow;
            update();
          }}
        >
          App:Update: {Date.now()}
        </button>

        {/* {isShow ? <Foo /> : <Bar />} */}
        <Foo></Foo>
        <Bar />
        <Bar />
        <Bar />
      </div>
    </div>
  );
};

export default App;
