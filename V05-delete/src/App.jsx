import React from "../core/React.js";
import ReactDOM from "../core/ReactDOM.js";
import Header from "./Header.jsx";

let count = 0;
let isShow = true;
const App = () => {
  const showView = (
    <div>
      <div>child1</div>
      <div>child2</div>
      <div>child3</div>
      Show
      <div>child4</div>
      <div>child5</div>
    </div>
  );
  const hideView = <div>Hide</div>;

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
            isShow = !isShow;
            ReactDOM.update();
          }}
        >
          Update
        </button>

        {isShow ? showView : hideView}
      </div>

    </div>
  );
};

export default App;
