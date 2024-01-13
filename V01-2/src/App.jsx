import React from "./../core/React.js";
import Header from './Header.jsx'

const App = () => {
  return (
    <div id="my-app">
      <Header title="lalala" />
      <div className="grid grid-cols-4">
        {
          Array.from({ length: 12 }).map((item, index) => {
            return <div key={index}>{index}</div>
          })  
        }
      </div>
    </div>
  );
};

export default App;
