import React from "./../core/React.js";
import ReactDOM from "./../core/ReactDOM.js";

// import App from './App'

const root = document.querySelector("#app");

// <App />

ReactDOM.createRoot(root).render(
  <div>
    <span>1</span>
    <span>2</span>

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

    {/* <div>
      a
      <div>
        b

        <div>c</div>
      </div>
    </div>
    <div>
      d
      <div>e</div>
    </div> */}
  </div>
);
